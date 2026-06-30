'use client'

import { useEffect } from 'react'

/**
 * Prevents hydration mismatch for persisted Zustand state
 * (cart, wishlist, recently-viewed) by only rendering
 * interactive UI after the store has been rehydrated from localStorage.
 */
export function StoreHydration({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    // Signal that the store has been rehydrated from localStorage.
    // We don't gate the whole tree — only persisted counters (cart/wishlist)
    // listen to this. This avoids a blank screen during initial paint.
    window.dispatchEvent(new CustomEvent('aurelia:store-hydrated'))
  }, [])

  return <>{children}</>
}
