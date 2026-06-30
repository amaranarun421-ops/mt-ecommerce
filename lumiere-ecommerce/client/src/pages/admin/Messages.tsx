import { useEffect, useState } from "react";
import { Mail, Trash2, Reply, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/shared/Seo";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { AdminPageHeader, ConfirmModal } from "@/components/admin/shared";
import { formatDateTime, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ContactMessage, Pagination as PaginationType } from "@/types";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/store/messages", { params: { page, limit: 20 } });
      setMessages(data.messages);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const markRead = async (m: ContactMessage) => {
    if (m.read) return;
    try {
      await api.patch(`/admin/store/messages/${m._id}`, { read: true });
      fetch();
    } catch {}
  };

  const sendReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setReplying(true);
    try {
      await api.patch(`/admin/store/messages/${replyTarget._id}`, {
        replied: true,
        reply: replyText,
      });
      toast.success("Reply sent (demo mode — no email actually sent)");
      setReplyTarget(null);
      setReplyText("");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reply failed");
    } finally {
      setReplying(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/store/messages/${deleteTarget._id}`);
      toast.success("Message deleted");
      fetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <Seo title="Messages — Admin" />
      <AdminPageHeader title="Contact Messages" subtitle="Read and reply to customer inquiries" />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={24} className="text-primary" /></div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Mail size={28} className="mx-auto mb-3 opacity-40" />
          No messages yet.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m._id}
                onClick={() => markRead(m)}
                className={cn(
                  "bg-card rounded-xl border p-4 cursor-pointer transition-colors",
                  m.read ? "border-border" : "border-primary/40 bg-accent/20"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!m.read && <span className="inline-flex h-2 w-2 rounded-full bg-primary" />}
                      <span className="font-medium text-sm">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.email}</span>
                      {m.replied && <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={10} /> Replied</span>}
                    </div>
                    <p className="mt-1 text-sm font-medium">{m.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setReplyTarget(m); setReplyText(m.reply || ""); }}
                      aria-label="Reply"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
                    >
                      <Reply size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(m); }}
                      aria-label="Delete"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} className="mt-6" />}
        </>
      )}

      <Modal open={!!replyTarget} onClose={() => setReplyTarget(null)} className="max-w-lg p-6">
        {replyTarget && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Reply to {replyTarget.name}</h2>
              <p className="text-xs text-muted-foreground">Original: {replyTarget.subject}</p>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3 text-sm">
              <p className="text-muted-foreground">{replyTarget.message}</p>
            </div>
            <Textarea
              label="Your reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
              placeholder="Type your reply…"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setReplyTarget(null)}>Cancel</Button>
              <Button onClick={sendReply} disabled={replying || !replyText.trim()}>{replying ? "Sending…" : "Send Reply"}</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete message?"
        message="This message will be permanently removed."
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}
