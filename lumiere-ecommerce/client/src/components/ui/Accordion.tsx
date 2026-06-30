import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemProps {
  value: string;
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ items, className }: { items: ItemProps[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(items.find((i) => i.defaultOpen)?.value || null);
  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => {
        const isOpen = open === item.value;
        return (
          <div key={item.value} data-value={item.value}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.value)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary transition-colors"
            >
              <span>{item.trigger}</span>
              <ChevronDown size={16} className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>
            <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden text-sm text-muted-foreground">{item.children}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Convenience wrappers for the older API used by some pages.
export function AccordionItem({ value, children }: { value: string; children: ReactNode }) {
  return <div data-value={value}>{children}</div>;
}
export function AccordionTrigger({ children, className }: { children: ReactNode; className?: string }) {
  // Used by Category page — finds the closest item and toggles via custom event
  return (
    <button
      type="button"
      onClick={(e) => {
        const item = (e.currentTarget.closest("[data-value]") as HTMLElement | null);
        if (!item) return;
        const event = new CustomEvent("accordion-toggle", { detail: item.getAttribute("data-value") });
        item.dispatchEvent(event);
      }}
      className={cn("flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary transition-colors", className)}
    >
      <span>{children}</span>
      <ChevronDown size={16} className="text-muted-foreground transition-transform" />
    </button>
  );
}
export function AccordionContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("pb-4 text-sm text-muted-foreground", className)}>{children}</div>;
}
