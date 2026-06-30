import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { formatPrice, truncate } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

const SUGGESTIONS = ["Linen sofa", "Brass lamp", "Wool rug", "Stoneware mugs", "Cutting board", "Duvet cover"];

export default function SearchOverlay() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", { params: { q: query, limit: 6 } });
        setResults(data.products);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  if (!open) return null;

  const goToProduct = (slug: string) => {
    setOpen(false);
    navigate(`/product/${slug}`);
  };

  const goToShop = () => {
    setOpen(false);
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-[110] scrim animate-fade-in" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto mt-20 max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-2xl bg-card border border-border shadow-premium overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-5 h-16">
            <Search size={20} className="text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToShop()}
              placeholder="Search for furniture, lighting, decor…"
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
              aria-label="Search query"
            />
            {loading && <Spinner size={16} />}
            <button onClick={() => setOpen(false)} aria-label="Close search" className="rounded-full p-1 hover:bg-secondary">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  <TrendingUp size={14} /> Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-full bg-secondary hover:bg-accent text-sm px-3 py-1.5 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 && !loading ? (
              <div className="p-10 text-center">
                <p className="text-sm text-muted-foreground">No results for "{query}"</p>
                <button onClick={goToShop} className="mt-4 text-sm font-medium text-primary hover:underline">
                  Browse all products →
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {results.map((p) => (
                  <li key={p._id}>
                    <button
                      onClick={() => goToProduct(p.slug)}
                      className="flex w-full items-center gap-4 rounded-xl p-3 hover:bg-secondary text-left transition-colors"
                    >
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.images?.[0]?.altText || p.name}
                        loading="lazy"
                        className="h-14 w-14 rounded-lg object-cover bg-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{truncate(p.shortDescription || p.description, 60)}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{formatPrice(p.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {query.trim() && (
            <div className="border-t border-border px-5 py-3 text-sm">
              <button onClick={goToShop} className="font-medium text-primary hover:underline">
                See all results for "{query}" →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
