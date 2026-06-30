import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import { api } from "@/lib/api";
import type { Product, Category, Pagination as PaginationType } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Seo } from "@/components/shared/Seo";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice, cn } from "@/lib/utils";

const SORTS = [
  { value: "relevance", label: "Most relevant" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "popular", label: "Most popular" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [facets, setFacets] = useState<{ price: { min: number; max: number }; brands: { name: string; count: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Pull filter state from URL
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");
  const inStock = searchParams.get("inStock") === "true";
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const featured = searchParams.get("featured") === "true";
  const trending = searchParams.get("trending") === "true";
  const newArrival = searchParams.get("newArrival") === "true";
  const bestSeller = searchParams.get("bestSeller") === "true";

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories)).catch(() => {});
    api.get("/products/meta/facets").then(({ data }) => setFacets(data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 12, sort };
      if (q) params.q = q;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (inStock) params.inStock = "true";
      if (minRating) params.minRating = minRating;
      if (featured) params.featured = "true";
      if (trending) params.trending = "true";
      if (newArrival) params.newArrival = "true";
      if (bestSeller) params.bestSeller = "true";
      const { data } = await api.get("/products", { params });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [q, category, minPrice, maxPrice, sort, page, inStock, minRating, featured, trending, newArrival, bestSeller]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());

  const activeFiltersCount = [
    category, minPrice, maxPrice, inStock ? "true" : "", minRating ? String(minRating) : "",
    featured ? "true" : "", trending ? "true" : "", newArrival ? "true" : "", bestSeller ? "true" : "",
  ].filter(Boolean).length;

  const selectedCategory = categories.find((c) => c.slug === category);

  return (
    <>
      <Seo
        title={selectedCategory ? `${selectedCategory.name} — Shop Online` : "Shop All Products"}
        description={selectedCategory?.seoDescription || "Browse our full collection of premium furniture, lighting, decor, kitchen, bedding, and stationery."}
        canonical={selectedCategory ? `/category/${selectedCategory.slug}` : "/shop"}
      />
      <div className="container-premium section-py">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, ...(selectedCategory ? [{ label: selectedCategory.name }] : [])]}
          className="mb-4"
        />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold">
              {selectedCategory ? selectedCategory.name : q ? `Results for "${q}"` : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {pagination ? `${pagination.total} ${pagination.total === 1 ? "product" : "products"}` : "Loading…"}
              {selectedCategory?.description ? ` · ${selectedCategory.description}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={14} /> Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <Select value={sort} onChange={(e) => update("sort", e.target.value)} className="w-44">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block">
            <FilterPanel
              categories={categories}
              facets={facets}
              current={{ category, minPrice, maxPrice, inStock, minRating, featured, trending, newArrival, bestSeller }}
              update={update}
              clearAll={clearAll}
              activeCount={activeFiltersCount}
            />
          </aside>

          {/* Product grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={<PackageSearch size={28} />}
                title="No products match your filters"
                description="Try widening your search or clearing some filters to see more results."
                action={<Button onClick={clearAll}>Clear All Filters</Button>}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
                  ))}
                </div>
                {pagination && (
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    onChange={(p) => update("page", String(p))}
                    className="mt-10"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} side="left" title="Filters" className="max-w-sm">
        <div className="flex-1 overflow-y-auto p-5">
          <FilterPanel
            categories={categories}
            facets={facets}
            current={{ category, minPrice, maxPrice, inStock, minRating, featured, trending, newArrival, bestSeller }}
            update={update}
            clearAll={clearAll}
            activeCount={activeFiltersCount}
            embedded
          />
        </div>
        <div className="border-t border-border p-4">
          <Button className="w-full" onClick={() => setFiltersOpen(false)}>Show {pagination?.total || 0} results</Button>
        </div>
      </Drawer>

      <QuickView product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

function FilterPanel({
  categories,
  facets,
  current,
  update,
  clearAll,
  activeCount,
  embedded,
}: {
  categories: Category[];
  facets: any;
  current: any;
  update: (k: string, v: string | null) => void;
  clearAll: () => void;
  activeCount: number;
  embedded?: boolean;
}) {
  return (
    <div className={cn("space-y-6", !embedded && "sticky top-28")}>
      {activeCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{activeCount} active</span>
          <button onClick={clearAll} className="text-xs text-primary hover:underline">Clear all</button>
        </div>
      )}

      {/* Category */}
      <FilterGroup title="Category">
        <div className="space-y-1">
          <button
            onClick={() => update("category", null)}
            className={cn("block w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-secondary", !current.category && "text-primary font-medium")}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => update("category", c.slug)}
              className={cn("block w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-secondary", current.category === c.slug && "text-primary font-medium")}
            >
              {c.name}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={current.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
              className="input-premium h-9 text-sm"
              min="0"
            />
            <input
              type="number"
              placeholder="Max"
              value={current.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
              className="input-premium h-9 text-sm"
              min="0"
            />
          </div>
          {facets && (
            <p className="text-xs text-muted-foreground">
              Range: {formatPrice(facets.price.min)} – {formatPrice(facets.price.max)}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {([[0, 50], [50, 100], [100, 250], [250, null]] as [number, number | null][]).map(([min, max]) => (
              <button
                key={String(min) + String(max)}
                onClick={() => { update("minPrice", String(min)); update("maxPrice", max ? String(max) : null); }}
                className="rounded-full bg-secondary hover:bg-accent text-xs px-2.5 py-1"
              >
                {max ? `${formatPrice(min)}–${formatPrice(max)}` : `${formatPrice(min)}+`}
              </button>
            ))}
          </div>
        </div>
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={current.inStock}
            onChange={(e) => update("inStock", e.target.checked ? "true" : null)}
            className="rounded"
          />
          In stock only
        </label>
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Minimum Rating">
        <div className="space-y-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => update("minRating", r ? String(r) : null)}
              className={cn("block w-full text-left text-sm rounded-md px-2 py-1.5 hover:bg-secondary", current.minRating === r && "text-primary font-medium")}
            >
              {r === 0 ? "All ratings" : `${r}★ & up`}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Highlights */}
      <FilterGroup title="Highlights">
        <div className="space-y-2">
          {[
            { key: "featured", label: "Featured" },
            { key: "trending", label: "Trending" },
            { key: "newArrival", label: "New Arrivals" },
            { key: "bestSeller", label: "Best Sellers" },
          ].map((h) => (
            <label key={h.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!current[h.key]}
                onChange={(e) => update(h.key, e.target.checked ? "true" : null)}
                className="rounded"
              />
              {h.label}
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}
