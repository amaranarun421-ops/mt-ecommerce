import { cn } from "@/lib/utils";

const STATUS_VARIANTS: Record<string, string> = {
  // Order status
  PENDING: "bg-secondary text-secondary-foreground",
  PROCESSING: "bg-info/15 text-info",
  SHIPPED: "bg-accent text-accent-foreground",
  DELIVERED: "bg-success/15 text-success",
  CANCELLED: "bg-destructive/15 text-destructive",
  REFUNDED: "bg-warning/15 text-warning-foreground",
  // Payment
  PAID: "bg-success/15 text-success",
  FAILED: "bg-destructive/15 text-destructive",
  // Review
  APPROVED: "bg-success/15 text-success",
  REJECTED: "bg-destructive/15 text-destructive",
  // Product status
  ACTIVE: "bg-success/15 text-success",
  DRAFT: "bg-secondary text-secondary-foreground",
  ARCHIVED: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_VARIANTS[status] || "bg-secondary text-secondary-foreground", className)}>
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  accent = "default",
}: {
  label: string;
  value: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "default" | "primary" | "success" | "warning" | "destructive";
}) {
  const accentClass = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  }[accent];
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
        </div>
        <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg", accentClass)}>
          <Icon size={18} />
        </div>
      </div>
      {trend && trendValue && (
        <p className={cn("mt-3 text-xs font-medium flex items-center gap-1", trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground")}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </p>
      )}
    </div>
  );
}

export function AdminTable({ columns, children }: { columns: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {columns.map((c, i) => (
              <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] scrim flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-premium" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-outline btn-md">Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={cn("btn btn-md", destructive ? "btn-destructive" : "btn-primary")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
