import { useEffect, useState } from "react";
import { Mailbox, Trash2, Download, Search } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination } from "@/components/ui/Pagination";
import { AdminPageHeader, ConfirmModal } from "@/components/admin/shared";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { NewsletterSubscriber, Pagination as PaginationType } from "@/types";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/store/subscribers", { params: { page, limit: 50 } });
      setSubscribers(data.subscribers);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => {
    const rows = [["Email", "Status", "Source", "Subscribed date"], ...filtered.map((s) => [s.email, s.active ? "Active" : "Inactive", s.source, formatDate(s.createdAt)])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumiere-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/store/subscribers/${deleteTarget._id}`);
      toast.success("Subscriber removed");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <Seo title="Newsletter Subscribers — Admin" />
      <AdminPageHeader
        title="Newsletter Subscribers"
        subtitle={`${pagination?.total || 0} subscribers`}
        action={<button onClick={exportCSV} className="btn btn-outline btn-md"><Download size={14} /> Export CSV</button>}
      />

      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by email…"
          className="input-premium pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Mailbox size={28} className="mx-auto mb-3 opacity-40" />
          No subscribers found.
        </div>
      ) : (
        <>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subscribed</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.source}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      {s.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-success">● Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">○ Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDeleteTarget(s)} aria-label="Remove subscriber" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary text-destructive ml-auto">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-6" />}
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove subscriber?"
        message={`Remove ${deleteTarget?.email} from the newsletter list?`}
        confirmLabel="Remove"
        destructive
      />
    </>
  );
}
