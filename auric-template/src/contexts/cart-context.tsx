"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { product } from "@/lib/data";

export type CartItem = {
  key: string;          // unique per product + variant
  productId: string;
  name: string;
  variant: string;      // color name
  price: number;
  image: string;
  qty: number;
  savedForLater?: boolean;
};

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addToCart: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  lastAdded: string | null;
  subtotal: number;
  count: number;
  giftWrap: boolean;
  setGiftWrap: (v: boolean) => void;
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  orderNotes: string;
  setOrderNotes: (v: string) => void;
  shippingMethod: "standard" | "express";
  setShippingMethod: (m: "standard" | "express") => void;
  shippingCost: number;
  tax: number;
  total: number;
}

const VALID_COUPONS: Record<string, number> = {
  AURIC10: 0.1,
  WELCOME15: 0.15,
  LAUNCH: 0.2,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "auric-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setItems(data.items || []);
          setSavedItems(data.savedItems || []);
          setGiftWrap(data.giftWrap || false);
          setCoupon(data.coupon || null);
          setShippingMethod(data.shippingMethod || "standard");
        }
      } catch {
        // ignore
      }
      setHydrated(true);
    }
  }, []);

  // Persist on changes
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, savedItems, giftWrap, coupon, shippingMethod }),
    );
  }, [items, savedItems, giftWrap, coupon, shippingMethod, hydrated]);

  const addToCart = useCallback((item: Omit<CartItem, "key" | "qty">, qty = 1) => {
    const key = `${item.productId}-${item.variant}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, key, qty }];
    });
    setLastAdded(key);
    setOpen(true);
    setTimeout(() => setLastAdded(null), 3000);
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }, []);

  const saveForLater = useCallback((key: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) {
        setSavedItems((s) => [...s, { ...item, savedForLater: true }]);
      }
      return prev.filter((i) => i.key !== key);
    });
  }, []);

  const moveToCart = useCallback((key: string) => {
    setSavedItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) {
        setItems((cart) => {
          const existing = cart.find((i) => i.key === key);
          if (existing) {
            return cart.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i));
          }
          return [...cart, { ...item, savedForLater: false }];
        });
      }
      return prev.filter((i) => i.key !== key);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setGiftWrap(false);
    setCoupon(null);
    setOrderNotes("");
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const upper = code.toUpperCase().trim();
    if (VALID_COUPONS[upper] !== undefined) {
      setCoupon({ code: upper, discount: VALID_COUPONS[upper] });
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const giftWrapCost = giftWrap ? 9 : 0;
  const couponDiscount = coupon ? Math.round(subtotal * coupon.discount) : 0;
  const shippingCost = shippingMethod === "express" ? 24 : subtotal >= 200 || subtotal === 0 ? 0 : 15;
  const taxable = Math.max(0, subtotal - couponDiscount + giftWrapCost);
  const tax = Math.round(taxable * 0.08);
  const total = Math.max(0, taxable + shippingCost + tax);

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        addToCart,
        removeFromCart,
        updateQty,
        saveForLater,
        moveToCart,
        clearCart,
        isOpen,
        setOpen,
        lastAdded,
        subtotal,
        count,
        giftWrap,
        setGiftWrap,
        coupon,
        applyCoupon,
        removeCoupon,
        orderNotes,
        setOrderNotes,
        shippingMethod,
        setShippingMethod,
        shippingCost,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
