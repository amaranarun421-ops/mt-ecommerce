"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { product, accessories, productColors, trendingSearches, popularCategories } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, TrendingUp, Clock, ArrowRight, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  name: string;
  nameAr: string;
  type: "product" | "accessory" | "color";
  price: number;
  image: string;
  href: string;
};

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const r = localStorage.getItem("auric-recent-searches");
    if (r) setRecent(JSON.parse(r));
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const all: SearchResult[] = [
      {
        id: product.sku,
        name: product.name,
        nameAr: product.nameAr,
        type: "product",
        price: product.price,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80",
        href: "/product",
      },
      ...accessories.map((a) => ({
        id: a.id,
        name: a.name,
        nameAr: a.nameAr,
        type: "accessory" as const,
        price: a.price,
        image: a.image,
        href: "/accessories",
      })),
      ...productColors.map((c) => ({
        id: c.id,
        name: `${product.name} — ${c.name}`,
        nameAr: `${product.nameAr} — ${c.nameAr}`,
        type: "color" as const,
        price: product.price,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80",
        href: `/product?color=${c.id}`,
      })),
    ];
    return all.filter((r) => {
      const name = (language === "ar" ? r.nameAr : r.name).toLowerCase();
      return name.includes(q) || r.id.toLowerCase().includes(q);
    });
  }, [query, language]);

  const saveRecent = (term: string) => {
    const updated = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("auric-recent-searches", JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecent(query.trim());
    onOpenChange(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const selectTerm = (term: string) => {
    setQuery(term);
    saveRecent(term);
    onOpenChange(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden top-[15%] translate-y-0">
        <DialogTitle className="sr-only">{t("search.title")}</DialogTitle>
        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground p-1 -m-1 rounded-md transition-colors"
            aria-label={t("nav.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto scroll-premium">
          {query.trim() && results.length > 0 ? (
            <div className="p-2">
              <p className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {t("search.results", { q: query })}
              </p>
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => {
                    saveRecent(query.trim());
                    onOpenChange(false);
                    navigate(r.href);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-start group"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                    <img src={r.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {language === "ar" ? r.nameAr : r.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {r.type === "product" ? product.collection : r.type}
                    </p>
                  </div>
                  <span className="font-semibold text-sm tabular-nums">${r.price}</span>
                  <ArrowRight className={cn("w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity", isRTL && "rotate-180")} />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {/* Trending */}
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {t("search.trending")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => selectTerm(term)}
                      className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent */}
              {recent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {t("search.recent")}
                    </p>
                    <button
                      onClick={() => {
                        setRecent([]);
                        localStorage.removeItem("auric-recent-searches");
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {t("search.clearAll")}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recent.map((term) => (
                      <button
                        key={term}
                        onClick={() => selectTerm(term)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-start"
                      >
                        <span className="text-muted-foreground">{term}</span>
                        <ArrowRight className={cn("w-3.5 h-3.5 text-muted-foreground", isRTL && "rotate-180")} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular categories */}
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  <Headphones className="w-3.5 h-3.5" />
                  {t("search.popular")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {popularCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => selectTerm(cat)}
                      className="px-3 py-2 text-sm text-start rounded-md hover:bg-muted transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>↵ to search · esc to close</span>
          <span>Powered by AURIC</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
