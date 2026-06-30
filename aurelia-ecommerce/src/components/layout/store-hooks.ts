'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useUIStore, useCommerceStore, selectCartCount, selectWishlistCount } from '@/store'
import { cn } from '@/lib/utils'

/**
 * Listen to scroll position and report whether the page is scrolled past the
 * announcement bar threshold.
 */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/**
 * Hydration-safe wrapper around persisted store values. Returns false on the
 * server (and during the first client render) and true after hydration.
 * Uses useSyncExternalStore for the official React-recommended pattern.
 */
const emptySubscribe = () => () => {}
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // client snapshot
    () => false  // server snapshot
  )
}

export { cn, useUIStore, useCommerceStore, selectCartCount, selectWishlistCount }
