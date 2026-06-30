'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Heart, ShoppingBag, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useUIStore, useCommerceStore, selectIsInWishlist } from '@/store'
import { products, getProductById, getRelatedProducts } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { Badge2, discountPercent } from '@/components/common/badge2'
import { Price } from '@/components/common/price'
import { RatingStars } from '@/components/common/rating-stars'
import { QuantitySelector } from '@/components/common/quantity-selector'
import { cn } from '@/lib/utils'

export function QuickViewModal() {
  const isOpen = useUIStore((s) => s.isQuickViewOpen)
  const productId = useUIStore((s) => s.quickViewProductId)
  const close = useUIStore((s) => s.closeQuickView)
  const addToCart = useCommerceStore((s) => s.addToCart)
  const toggleWishlist = useCommerceStore((s) => s.toggleWishlistItem)
  const wishlist = useCommerceStore((s) => s.wishlist)

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>()
  const [selectedSize, setSelectedSize] = useState<string | undefined>()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Reset local UI state when a new product is opened. The setState calls
      // here are intentional — they sync local UI with the active product.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(0)
      setQuantity(1)
      const product = productId ? getProductById(productId) : undefined
      setSelectedColor(product?.variants.colors?.[0]?.value)
      setSelectedSize(product?.variants.sizes?.find((s) => s.inStock)?.value)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, productId])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const product = productId ? getProductById(productId) : undefined

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 sm:p-6"
          onClick={close}
          role="dialog"
          aria-label={`Quick view: ${product.name}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-background shadow-elevated md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur hover:bg-muted"
              aria-label="Close quick view"
            >
              <X size={18} />
            </button>

            {/* Image side */}
            <div className="relative flex flex-col gap-3 border-b border-border bg-muted p-3 md:border-b-0 md:border-r">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
                <Image
                  src={product.images[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                  {product.badges.includes('Best Seller') && <Badge2 variant="bestseller">Best Seller</Badge2>}
                  {product.badges.includes('New') && <Badge2 variant="new">New</Badge2>}
                  {discountPercent(product.price, product.comparePrice) > 0 && (
                    <Badge2 variant="sale">-{discountPercent(product.price, product.comparePrice)}%</Badge2>
                  )}
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition',
                        activeImage === i ? 'border-foreground' : 'border-transparent opacity-70 hover:opacity-100'
                      )}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info side */}
            <div className="flex flex-col overflow-y-auto p-5 sm:p-6 scroll-premium">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {product.collection} Collection
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight">{product.name}</h2>
              <div className="mt-2 flex items-center gap-2">
                <RatingStars rating={product.rating} size={14} />
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} · {product.reviewCount} reviews
                </span>
              </div>
              <Price
                value={product.price}
                compareValue={product.comparePrice}
                size="xl"
                showDiscount
                className="mt-4"
              />
              <p className="mt-3 text-sm text-foreground/80">{product.shortDesc}</p>

              {/* Colors */}
              {product.variants.colors && product.variants.colors.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Color: <span className="text-foreground">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.value)}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs transition',
                          selectedColor === c.value ? 'border-foreground' : 'border-border hover:border-foreground/40'
                        )}
                        aria-label={c.name}
                        disabled={!c.inStock}
                      >
                        {c.swatch && (
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: c.swatch }}
                          />
                        )}
                        {c.name}
                        {c.priceDelta ? <span className="text-muted-foreground">+${c.priceDelta}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.variants.sizes && product.variants.sizes.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Size: <span className="text-foreground">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => s.inStock && setSelectedSize(s.value)}
                        disabled={!s.inStock}
                        className={cn(
                          'rounded-full border-2 px-3 py-1.5 text-xs transition disabled:cursor-not-allowed disabled:opacity-40',
                          selectedSize === s.value ? 'border-foreground' : 'border-border hover:border-foreground/40'
                        )}
                      >
                        {s.name}
                        {s.priceDelta ? (
                          <span className="ml-1 text-muted-foreground">
                            {s.priceDelta > 0 ? '+' : ''}${s.priceDelta}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quantity</p>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.quantity}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <Button
                  className="h-12"
                  onClick={() => {
                    addToCart(product, { quantity, color: selectedColor, size: selectedSize })
                    close()
                  }}
                  disabled={product.quantity === 0}
                >
                  <ShoppingBag size={16} className="mr-2" />
                  {product.quantity === 0 ? 'Sold out' : 'Add to cart'}
                </Button>
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={16} className="mr-2" />
                  {wishlist.some((w) => w.productId === product.id)
                    ? 'Saved'
                    : 'Save'}
                </Button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={close}
                className="mt-4 inline-flex items-center justify-center gap-1 text-sm font-medium text-foreground underline hover:text-foreground/80"
              >
                View full details <ChevronRight size={14} />
              </Link>

              <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                {product.shippingNote}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
