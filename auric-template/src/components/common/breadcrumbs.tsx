"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { isRTL } = useLanguage();
  const { navigate } = useRouter();

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center flex-wrap gap-1 text-sm", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !last ? (
              <button
                onClick={() => navigate(item.href!)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={cn(last ? "text-foreground font-medium" : "text-muted-foreground")}>
                {item.label}
              </span>
            )}
            {!last && (
              <ChevronRight
                className={cn("w-3.5 h-3.5 text-muted-foreground/50", isRTL && "rotate-180")}
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}
