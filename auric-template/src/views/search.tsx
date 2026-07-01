"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { product, accessories, productColors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { RatingStars } from "@/components/common/rating-stars";
import { Search, ShoppingBag, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  name: string;
  nameAr: string;
  type: "product" | "accessory" | "color";
  price: number;
  image: string;
  href: string;
  rating: number;
  description: string;
};

export function SearchPage() {
  const { t, language, isRTL } = useLanguage();
  const { route, navigate } = useRouter();
  const { addToCart } = useCart();
  const query = route.query.get("q") || "";
  const [sort, setSort] = useState<"relevance" | "priceAsc" | "priceDesc" | "rating">("relevance");
  const [filter, setFilter] = useState<"all" | "product" | "accessory">("all");

  const allResults = useMemo<SearchResult[]>(() => {
    return [
      {
        id: product.sku,
        name: product.name,
        nameAr: product.nameAr,
        type: "product",
        price: product.price,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        href: "/product",
        rating: product.rating,
        description: product.shortDescription,
      },
      ...accessories.map((a) => ({
        id: a.id,
        name: a.name,
        nameAr: a.nameAr,
        type: "accessory" as const,
        price: a.price,
        image: a.image,
        href: "/accessories",
        rating: 4.7,
        description: a.description,
      })),
      ...productColors.map((c) => ({
        id: `${product.sku}-${c.id}`,
        name: `${product.name} — ${c.name}`,
        nameAr: `${product.nameAr} — ${c.nameAr}`,
        type: "color" as const,
        price: product.price,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        href: `/product?color=${c.id}`,
        rating: product.rating,
        description: c.name,
      })),
    ];
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allResults;
    const q = query.toLowerCase();
    let filtered = allResults.filter((r) => {
      const name = (language === "ar" ? r.nameAr : r.name).toLowerCase();
      const desc = r.description.toLowerCase();
      return name.includes(q) || desc.includes(q) || r.type.includes(q);
    });
    if (filter !== "all") {
      filtered = filtered.filter((r) => (filter === "product" ? r.type === "product" : r.type === "accessory"));
    }
    if (sort === "priceAsc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [query, allResults, language, filter, sort]);

  const isEmpty = query.trim() && results.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("search.title") },
        ]}
      />

      <div className="mt-4 mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-2">
          {query ? t("search.results", { q: query }) : t("search.title")}
        </h1>
        {query && (
          <p className="text-sm text-muted-foreground">
            {t("search.count", { n: results.length })}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          {(["all", "product", "accessory"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className={cn(filter === f && "bg-foreground text-background")}
            >
              {f === "all" ? "All" : f === "product" ? product.name : "Accessories"}
            </Button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="text-sm border border-border rounded-md px-3 py-2 bg-background"
        >
          <option value="relevance">{t("search.sort.relevance")}</option>
          <option value="priceAsc">{t("search.sort.priceAsc")}</option>
          <option value="priceDesc">{t("search.sort.priceDesc")}</option>
          <option value="rating">{t("search.sort.rating")}</option>
        </select>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 lg:py-24">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-3">
            {t("search.noResults", { q: query })}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("search.noResultsSubtitle")}
          </p>
          <Button onClick={() => navigate("/product")} className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
            {t("hero.cta.shop")}
            <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((r) => (
            <Card
              key={r.id}
              className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow group cursor-pointer"
              onClick={() => navigate(r.href)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={r.image}
                    alt={language === "ar" ? r.nameAr : r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        productId: r.id,
                        name: r.name,
                        variant: "",
                        price: r.price,
                        image: r.image,
                      });
                      toast.success(t("cartDrawer.added"));
                    }}
                    className="absolute bottom-3 end-3 w-9 h-9 rounded-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={t("common.addToCart")}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {r.type === "product" ? product.collection : r.type}
                  </p>
                  <p className="font-semibold text-sm">{language === "ar" ? r.nameAr : r.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <RatingStars rating={r.rating} size="xs" />
                    <p className="font-display font-semibold tabular-nums">${r.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
