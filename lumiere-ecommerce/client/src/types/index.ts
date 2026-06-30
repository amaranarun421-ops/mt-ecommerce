// Shared types — mirror server models

export interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
  image?: string;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  label: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  longDescription?: string;
  image?: string;
  icon?: string;
  featured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductImage {
  url: string;
  altText: string;
  position: number;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock: number;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  sold: number;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  featured: boolean;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  brand?: string;
  material?: string;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  weight?: number;
  dimensions?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  categoryId: Category | string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: Specification[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId?: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minCartAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  expiresAt?: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
  stock: number;
  maxQuantity: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  fulfillmentStatus: "UNFULFILLED" | "FULFILLED" | "SHIPPED" | "DELIVERED";
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  shippingMethod?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  provider: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  method?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number;
  flatShippingRate: number;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  pinterestUrl?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  read: boolean;
  replied: boolean;
  reply?: string;
  userId?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  active: boolean;
  source: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore?: boolean;
}
