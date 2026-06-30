import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pages,
  onChange,
  className,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (pages <= 1) return null;
  const window = 1; // pages on each side of current
  const nums: (number | "...")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - window && i <= page + window)) {
      nums.push(i);
    } else if (nums[nums.length - 1] !== "...") {
      nums.push("...");
    }
  }
  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {nums.map((n, i) =>
        n === "..." ? (
          <span key={i} className="px-2 text-sm text-muted-foreground">…</span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(n)}
            className={cn(
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium border transition-colors",
              n === page
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-secondary"
            )}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
