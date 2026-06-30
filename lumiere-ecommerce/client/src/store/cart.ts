import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  couponDescription: string | null;
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variantId?: string, variantLabel?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string, discount: number, description?: string) => void;
  removeCoupon: () => void;
  subtotal: () => number;
  count: () => number;
}

function lineMatch(item: CartItem, productId: string, variantId?: string) {
  return item.productId === productId && item.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      couponDescription: null,
      isOpen: false,

      addItem: (product, quantity = 1, variantId, variantLabel) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => lineMatch(i, product._id, variantId));
        const variant = variantId ? product.variants.find((v) => (v._id || v.value) === variantId) : undefined;
        const unitPrice = variant?.price ?? product.price;
        const stock = variant?.stock ?? product.stock;
        const maxQuantity = stock;

        if (idx >= 0) {
          const next = Math.min(items[idx].quantity + quantity, maxQuantity);
          if (next === items[idx].quantity) {
            toast.info(`Maximum stock reached for ${product.name}`);
            return;
          }
          items[idx] = {
            ...items[idx],
            quantity: next,
            price: unitPrice,
            variantLabel: variantLabel ?? items[idx].variantLabel,
            stock,
            maxQuantity,
          };
        } else {
          if (stock <= 0) {
            toast.error(`${product.name} is out of stock`);
            return;
          }
          items.push({
            productId: product._id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            price: unitPrice,
            compareAtPrice: product.compareAtPrice,
            image: product.images?.[0]?.url,
            quantity: Math.min(quantity, maxQuantity),
            variantId,
            variantLabel,
            stock,
            maxQuantity,
          });
        }
        set({ items });
        toast.success(`${product.name} added to cart`);
        get().openCart();
      },

      removeItem: (productId, variantId) => {
        set({ items: get().items.filter((i) => !lineMatch(i, productId, variantId)) });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const items = get().items.map((i) => {
          if (lineMatch(i, productId, variantId)) {
            return { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) };
          }
          return i;
        });
        set({ items });
      },

      clear: () => set({ items: [], couponCode: null, couponDiscount: 0, couponDescription: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      applyCoupon: (code, discount, description) =>
        set({ couponCode: code, couponDiscount: discount, couponDescription: description || null }),
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0, couponDescription: null }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "lumiere-cart" }
  )
);
