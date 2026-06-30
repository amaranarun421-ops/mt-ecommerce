import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

export function useCartCount() {
  const count = useCartStore((s) => s.count());
  const items = useCartStore((s) => s.items);
  // re-derive whenever items change
  const [n, setN] = useState(count);
  useEffect(() => {
    setN(useCartStore.getState().count());
  }, [items]);
  return n;
}

export function useWishlistCount() {
  const items = useWishlistStoreItems();
  return items.length;
}

function useWishlistStoreItems() {
  const items = useWishlistStoreItemsState();
  return items;
}

import { useWishlistStore } from "@/store/wishlist";
function useWishlistStoreItemsState() {
  return useWishlistStore((s) => s.items);
}
