import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "./auth";

interface WishlistState {
  items: { productId: string; name: string; slug: string; price: number; compareAtPrice?: number; image?: string }[];
  isOpen: boolean;
  hydrated: boolean;
  toggle: (product: Product) => Promise<void>;
  add: (product: Product) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  clear: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  syncFromServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hydrated: false,

      has: (productId) => get().items.some((i) => i.productId === productId),

      toggle: async (product) => {
        const exists = get().has(product._id);
        if (exists) {
          await get().remove(product._id);
        } else {
          await get().add(product);
        }
      },

      add: async (product) => {
        const item = {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images?.[0]?.url,
        };
        set({ items: [...get().items.filter((i) => i.productId !== product._id), item] });
        toast.success(`${product.name} added to wishlist`);
        const isAuth = useAuthStore.getState().isAuthenticated();
        if (isAuth) {
          try { await api.post(`/wishlist/${product._id}`); } catch {}
        }
      },

      remove: async (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
        const isAuth = useAuthStore.getState().isAuthenticated();
        if (isAuth) {
          try { await api.delete(`/wishlist/${productId}`); } catch {}
        }
      },

      clear: () => set({ items: [] }),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),

      syncFromServer: async () => {
        const isAuth = useAuthStore.getState().isAuthenticated();
        if (!isAuth) {
          set({ hydrated: true });
          return;
        }
        try {
          const { data } = await api.get("/wishlist");
          set({
            items: data.products.map((p: Product) => ({
              productId: p._id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              image: p.images?.[0]?.url,
            })),
            hydrated: true,
          });
        } catch {
          set({ hydrated: true });
        }
      },
    }),
    {
      name: "lumiere-wishlist",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
