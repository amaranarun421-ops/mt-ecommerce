import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/data/catalog'

// ============================================================================
// Types
// ============================================================================

export interface CartLine {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  quantity: number
  variantColor?: string
  variantSize?: string
  maxQuantity: number
}

export interface WishlistLine {
  productId: string
  addedAt: string
}

export interface RecentlyViewedLine {
  productId: string
  viewedAt: string
}

export interface AppliedCoupon {
  code: string
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
  value: number
  description: string
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant: 'success' | 'error' | 'info'
}

interface UIState {
  // Drawers & overlays
  isCartOpen: boolean
  isWishlistOpen: boolean
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  isQuickViewOpen: boolean
  quickViewProductId: string | null
  isNewsletterOpen: boolean

  // Actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openWishlist: () => void
  closeWishlist: () => void
  toggleWishlist: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  openQuickView: (productId: string) => void
  closeQuickView: () => void
  openNewsletter: () => void
  closeNewsletter: () => void
  closeAll: () => void
}

interface CommerceState {
  cart: CartLine[]
  wishlist: WishlistLine[]
  recentlyViewed: RecentlyViewedLine[]
  coupon: AppliedCoupon | null
  toast: ToastMessage | null

  // Cart
  addToCart: (product: Product, opts?: { quantity?: number; color?: string; size?: string }) => void
  updateCartQuantity: (productId: string, color: string | undefined, size: string | undefined, quantity: number) => void
  removeFromCart: (productId: string, color?: string, size?: string) => void
  clearCart: () => void

  // Wishlist
  toggleWishlistItem: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  moveWishlistToCart: (productId: string, product: Product) => void
  clearWishlist: () => void

  // Recently viewed
  pushRecentlyViewed: (productId: string) => void

  // Coupon
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void

  // Toast
  setToast: (toast: ToastMessage | null) => void
}

// ============================================================================
// Helpers
// ============================================================================

function lineKey(productId: string, color?: string, size?: string) {
  return `${productId}__${color || ''}__${size || ''}`
}

export function getCartKey(line: { productId: string; variantColor?: string; variantSize?: string }) {
  return lineKey(line.productId, line.variantColor, line.variantSize)
}

// ============================================================================
// Store
// ============================================================================

export const useUIStore = create<UIState>()(
  (set, get) => ({
    isCartOpen: false,
    isWishlistOpen: false,
    isSearchOpen: false,
    isMobileMenuOpen: false,
    isQuickViewOpen: false,
    quickViewProductId: null,
    isNewsletterOpen: false,

    openCart: () => set({ isCartOpen: true, isWishlistOpen: false, isSearchOpen: false, isMobileMenuOpen: false }),
    closeCart: () => set({ isCartOpen: false }),
    toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
    openWishlist: () => set({ isWishlistOpen: true, isCartOpen: false, isSearchOpen: false, isMobileMenuOpen: false }),
    closeWishlist: () => set({ isWishlistOpen: false }),
    toggleWishlist: () => set((s) => ({ isWishlistOpen: !s.isWishlistOpen })),
    openSearch: () => set({ isSearchOpen: true, isCartOpen: false, isWishlistOpen: false, isMobileMenuOpen: false }),
    closeSearch: () => set({ isSearchOpen: false }),
    toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
    openMobileMenu: () => set({ isMobileMenuOpen: true }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    openQuickView: (productId) => set({ isQuickViewOpen: true, quickViewProductId: productId }),
    closeQuickView: () => set({ isQuickViewOpen: false, quickViewProductId: null }),
    openNewsletter: () => set({ isNewsletterOpen: true }),
    closeNewsletter: () => set({ isNewsletterOpen: false }),
    closeAll: () => set({
      isCartOpen: false,
      isWishlistOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isQuickViewOpen: false,
      isNewsletterOpen: false,
    }),
  })
)

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      coupon: null,
      toast: null,

      addToCart: (product, opts) => {
        const quantity = opts?.quantity ?? 1
        const color = opts?.color
        const size = opts?.size

        set((state) => {
          const existing = state.cart.find(
            (l) => l.productId === product.id && l.variantColor === color && l.variantSize === size
          )
          if (existing) {
            return {
              cart: state.cart.map((l) =>
                l.productId === product.id && l.variantColor === color && l.variantSize === size
                  ? { ...l, quantity: Math.min(l.quantity + quantity, product.quantity) }
                  : l
              ),
            }
          }
          const newLine: CartLine = {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.featuredImage,
            price: product.price,
            quantity,
            variantColor: color,
            variantSize: size,
            maxQuantity: product.quantity,
          }
          return { cart: [...state.cart, newLine] }
        })

        // Open cart drawer as feedback
        useUIStore.getState().openCart()
        get().setToast({
          id: `added-${Date.now()}`,
          title: 'Added to cart',
          description: `${product.name}${color ? ` · ${color}` : ''}${size ? ` · ${size}` : ''}`,
          variant: 'success',
        })
      },

      updateCartQuantity: (productId, color, size, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((l) =>
              l.productId === productId && l.variantColor === color && l.variantSize === size
                ? { ...l, quantity: Math.max(0, Math.min(quantity, l.maxQuantity)) }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),

      removeFromCart: (productId, color, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (l) => !(l.productId === productId && l.variantColor === color && l.variantSize === size)
          ),
        })),

      clearCart: () => set({ cart: [], coupon: null }),

      toggleWishlistItem: (product) =>
        set((state) => {
          const exists = state.wishlist.some((w) => w.productId === product.id)
          if (exists) {
            return { wishlist: state.wishlist.filter((w) => w.productId !== product.id) }
          }
          return {
            wishlist: [
              ...state.wishlist,
              { productId: product.id, addedAt: new Date().toISOString() },
            ],
          }
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({ wishlist: state.wishlist.filter((w) => w.productId !== productId) })),

      moveWishlistToCart: (productId, product) => {
        get().addToCart(product, { quantity: 1 })
        set((state) => ({ wishlist: state.wishlist.filter((w) => w.productId !== productId) }))
      },

      clearWishlist: () => set({ wishlist: [] }),

      pushRecentlyViewed: (productId) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((r) => r.productId !== productId)
          return {
            recentlyViewed: [
              { productId, viewedAt: new Date().toISOString() },
              ...filtered,
            ].slice(0, 8),
          }
        }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      setToast: (toast) => {
        if (toast) {
          // Auto-clear after 4 seconds
          setTimeout(() => {
            const current = get().toast
            if (current && current.id === toast.id) {
              set({ toast: null })
            }
          }, 4000)
        }
        set({ toast })
      },
    }),
    {
      name: 'aurelia-store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as unknown as Storage))),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        coupon: state.coupon,
      }),
    }
  )
)

// ============================================================================
// Selectors
// ============================================================================

export const selectCartCount = (s: CommerceState) =>
  s.cart.reduce((acc, l) => acc + l.quantity, 0)

export const selectCartSubtotal = (s: CommerceState) =>
  s.cart.reduce((acc, l) => acc + l.price * l.quantity, 0)

export const selectWishlistCount = (s: CommerceState) => s.wishlist.length

export const selectIsInWishlist = (productId: string) => (s: CommerceState) =>
  s.wishlist.some((w) => w.productId === productId)
