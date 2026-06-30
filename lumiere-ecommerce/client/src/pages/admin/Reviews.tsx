import { useEffect, useState } from "react";
import { Check, X, Trash2, Star } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Spinner } from "@/components/ui/Spinner";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { AdminPageHeader, StatusBadge, ConfirmModal } from "@/components/admin/shared";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Review, Pagination as PaginationType } from "@/types";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (ratingFilter) params.rating = ratingFilter;
      const { data } = await api.get("/admin/reviews", { params });
      setReviews(data.reviews);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, statusFilter, ratingFilter]);

  const setStatus = async (r: Review, status: "APPROVED" | "REJECTED") => {
    try {
      await api.patch(`/admin/reviews/${r._id}/status`, { status });
      toast.success(`Review ${status.toLowerCase()}`);
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/reviews/${deleteTarget._id}`);
      toast.success("Review deleted");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <Seo title="Reviews — Admin" />
      <AdminPageHeader title="Reviews" subtitle="Moderate customer reviews and ratings" />

      <div className="flex gap-2 mb-4 flex-wrap">
        <Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }} className="w-40">
          <option value="">All status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>
        <Select value={ratingFilter} onChange={(e) => { setPage(1); setRatingFilter(e.target.value); }} className="w-40">
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No reviews found.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  {(r as any).productId?.images?.[0]?.url && (
                    <img src={(r as any).productId.images[0].url} alt="" className="h-10 w-10 rounded-md object-cover bg-muted shrink-0" loading="lazy" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{r.authorName}</span>
                        {r.verified && <span className="inline-flex items-center gap-0.5 text-xs text-success"><Check size={10} /> Verified</span>}
                        <StatusBadge status={r.status} />
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={cn(i < r.rating ? "fill-warning text-warning" : "text-muted-foreground/40")} />
                        ))}
                      </span>
                      {(r as any).productId?.name && (
                        <span className="text-xs text-muted-foreground">on <span className="text-foreground font-medium">{(r as any).productId.name}</span></span>
                      )}
                    </div>
                    {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
                    <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                    <div className="mt-3 flex gap-2">
                      {r.status !== "APPROVED" && (
                        <button onClick={() => setStatus(r, "APPROVED")} className="inline-flex items-center gap-1 rounded-md bg-success/10 text-success px-2.5 py-1 text-xs font-medium hover:bg-success/20">
                          <Check size={12} /> Approve
                        </button>
                      )}
                      {r.status !== "REJECTED" && (
                        <button onClick={() => setStatus(r, "REJECTED")} className="inline-flex items-center gap-1 rounded-md bg-warning/10 text-warning-foreground px-2.5 py-1 text-xs font-medium hover:bg-warning/20">
                          <X size={12} /> Reject
                        </button>
                      )}
                      <button onClick={() => setDeleteTarget(r)} className="inline-flex items-center gap-1 rounded-md bg-destructive/10 text-destructive px-2.5 py-1 text-xs font-medium hover:bg-destructive/20">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-6" />}
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete review?"
        message="This review will be permanently removed and the product rating recalculated."
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}
