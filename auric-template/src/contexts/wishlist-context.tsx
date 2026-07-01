"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type WishlistItem = {
  productId: string;
  name: string;
  variant: string;
  price: number;
  image: string;
};

export type CompareItem = WishlistItem & { addedAt: number };

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  compare: CompareItem[];
  toggleCompare: (item: WishlistItem) => void;
  isComparing: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  canAddToCompare: boolean;

  recentlyViewed: WishlistItem[];
  addRecentlyViewed: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const MAX_COMPARE = 4;

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [compare, setCompare] = useState<CompareItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const w = localStorage.getItem("auric-wishlist");
      const c = localStorage.getItem("auric-compare");
      const r = localStorage.getItem("auric-recently-viewed");
      if (w) setWishlist(JSON.parse(w));
      if (c) setCompare(JSON.parse(c));
      if (r) setRecentlyViewed(JSON.parse(r));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem("auric-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem("auric-compare", JSON.stringify(compare));
  }, [compare, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem("auric-recently-viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed, hydrated]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.productId === item.productId);
      if (exists) return prev.filter((i) => i.productId !== item.productId);
      return [...prev, item];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.some((i) => i.productId === productId),
    [wishlist],
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toggleCompare = useCallback((item: WishlistItem) => {
    setCompare((prev) => {
      const exists = prev.find((i) => i.productId === item.productId);
      if (exists) return prev.filter((i) => i.productId !== item.productId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const isComparing = useCallback(
    (productId: string) => compare.some((i) => i.productId === productId),
    [compare],
  );

  const removeFromCompare = useCallback((productId: string) => {
    setCompare((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const addRecentlyViewed = useCallback((item: WishlistItem) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i.productId !== item.productId);
      return [item, ...filtered].slice(0, 8);
    });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        compare,
        toggleCompare,
        isComparing,
        removeFromCompare,
        canAddToCompare: compare.length < MAX_COMPARE,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
