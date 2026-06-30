// Mock API layer — replaces the real backend for standalone showcase mode.
// Persists user-created data (orders, reviews, addresses, newsletter subs, contact messages)
// to localStorage so the experience survives page refreshes.

import {
  MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_REVIEWS, MOCK_COUPONS,
  MOCK_SETTINGS, MOCK_USERS, MOCK_PASSWORDS, MOCK_ORDERS,
  MOCK_CONTACT_MESSAGES, MOCK_SUBSCRIBERS,
} from "@/data/catalog";
import type { Product, Category, Review, Coupon, Order, StoreSettings, User, Address, NewsletterSubscriber, ContactMessage } from "@/types";

const LS_KEY = "lumiere_mock_db_v1";

interface MockUser {
  _id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
  image?: string;
  banned: boolean;
  addresses: Address[];
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
}

interface MockDB {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  coupons: (Coupon & { createdAt?: string })[];
  orders: Order[];
  contactMessages: (ContactMessage & { updatedAt?: string })[];
  subscribers: NewsletterSubscriber[];
  settings: StoreSettings;
  users: MockUser[];
  wishlistByUser: Record<string, string[]>; // userId -> productIds
}

function loadDB(): MockDB {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    products: [...MOCK_PRODUCTS],
    categories: [...MOCK_CATEGORIES],
    reviews: [...MOCK_REVIEWS],
    coupons: [...MOCK_COUPONS],
    orders: [...MOCK_ORDERS],
    contactMessages: [...MOCK_CONTACT_MESSAGES],
    subscribers: [...MOCK_SUBSCRIBERS],
    settings: { ...MOCK_SETTINGS },
    users: [...MOCK_USERS],
    wishlistByUser: {},
  };
}

function saveDB(db: MockDB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

let db = loadDB();

export function resetMockDB() {
  localStorage.removeItem(LS_KEY);
  db = loadDB();
}

function delay(ms = 200) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: { page, limit, total, pages, hasMore: page * limit < total },
  };
}

function generateOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LUM-${y}${m}${day}-${rand}`;
}

// --- Auth ---
const TOKEN_PREFIX = "mock-jwt-";

export const mockApi = {
  // ===== AUTH =====
  async post_auth_login(body: { email: string; password: string }) {
    await delay(300);
    const email = body.email.toLowerCase().trim();
    const user = db.users.find((u) => u.email === email);
    if (!user) throw new Error("No account found with this email.");
    if (MOCK_PASSWORDS[email] !== body.password) throw new Error("Incorrect password. Please try again.");
    if (user.banned) throw new Error("Your account has been suspended. Please contact support.");
    const token = `${TOKEN_PREFIX}${user._id}`;
    return {
      user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses },
      token,
    };
  },

  async post_auth_register(body: { name: string; email: string; password: string }) {
    await delay(300);
    const email = body.email.toLowerCase().trim();
    if (db.users.find((u) => u.email === email)) throw new Error("An account with this email already exists.");
    const user = {
      _id: `user-${Date.now()}`,
      email,
      name: body.name,
      role: "CUSTOMER" as const,
      phone: "",
      image: "",
      banned: false,
      addresses: [] as Address[],
      passwordHash: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(user);
    MOCK_PASSWORDS[email] = body.password;
    saveDB(db);
    const token = `${TOKEN_PREFIX}${user._id}`;
    return {
      user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses },
      token,
    };
  },

  async post_auth_logout() {
    await delay(50);
    return { ok: true };
  },

  async get_auth_me(token: string) {
    await delay(100);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("Session expired. Please sign in again.");
    return {
      user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses },
    };
  },

  async patch_auth_profile(token: string, body: Partial<User>) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");
    if (typeof body.name === "string") user.name = body.name;
    if (typeof body.phone === "string") user.phone = body.phone;
    if (typeof body.image === "string") user.image = body.image;
    user.updatedAt = new Date().toISOString();
    saveDB(db);
    return { user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses } };
  },

  async patch_auth_password(token: string, body: { currentPassword: string; newPassword: string }) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");
    if (MOCK_PASSWORDS[user.email] !== body.currentPassword) throw new Error("Current password is incorrect.");
    if (body.newPassword.length < 6) throw new Error("New password must be at least 6 characters.");
    MOCK_PASSWORDS[user.email] = body.newPassword;
    return { ok: true };
  },

  async post_auth_addresses(token: string, body: Omit<Address, "_id">) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");
    const addr = { ...body, _id: `addr-${Date.now()}` };
    if (addr.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push(addr);
    saveDB(db);
    return { user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses } };
  },

  async patch_auth_addresses(token: string, id: string, body: Partial<Address>) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");
    const addr = user.addresses.find((a) => a._id === id);
    if (!addr) throw new Error("Address not found");
    Object.assign(addr, body);
    if (addr.isDefault) user.addresses.forEach((a) => { if (a._id !== id) a.isDefault = false; });
    saveDB(db);
    return { user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses } };
  },

  async delete_auth_addresses(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");
    user.addresses = user.addresses.filter((a) => a._id !== id);
    saveDB(db);
    return { user: { id: user._id, email: user.email, name: user.name, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses } };
  },

  // ===== PRODUCTS =====
  async get_products(params: any) {
    await delay(250);
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(params.limit) || 12));
    let items = db.products.filter((p) => p.status === "ACTIVE");

    const q = params.q;
    if (q && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      items = items.filter((p) => re.test(p.name) || re.test(p.description) || re.test(p.brand || "") || p.tags.some((t) => re.test(t)));
    }
    if (params.category) {
      const cat = db.categories.find((c) => c.slug === params.category);
      if (cat) items = items.filter((p) => (p.categoryId as any)._id === cat._id);
    }
    if (params.featured === "true") items = items.filter((p) => p.featured);
    if (params.trending === "true") items = items.filter((p) => p.trending);
    if (params.newArrival === "true") items = items.filter((p) => p.newArrival);
    if (params.bestSeller === "true") items = items.filter((p) => p.bestSeller);
    const minPrice = parseFloat(params.minPrice);
    const maxPrice = parseFloat(params.maxPrice);
    if (!isNaN(minPrice)) items = items.filter((p) => p.price >= minPrice);
    if (!isNaN(maxPrice)) items = items.filter((p) => p.price <= maxPrice);
    if (params.inStock === "true") items = items.filter((p) => p.stock > 0);
    const minRating = parseFloat(params.minRating);
    if (!isNaN(minRating)) items = items.filter((p) => p.rating >= minRating);
    if (params.brand) {
      const brands = params.brand.split(",").filter(Boolean);
      if (brands.length) items = items.filter((p) => p.brand && brands.includes(p.brand));
    }

    const sort = params.sort || "relevance";
    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "newest": items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "popular": items.sort((a, b) => b.sold - a.sold); break;
      default: items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.sold - a.sold); break;
    }

    const { items: pageItems, pagination } = paginate(items, page, limit);
    return { products: pageItems, pagination };
  },

  async get_products_meta_facets() {
    await delay(150);
    const active = db.products.filter((p) => p.status === "ACTIVE");
    const prices = active.map((p) => p.price);
    const brandMap = new Map<string, number>();
    active.forEach((p) => { if (p.brand) brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1); });
    return {
      price: { min: Math.min(...prices), max: Math.max(...prices) },
      brands: Array.from(brandMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      categories: db.categories.map((c) => ({ _id: c._id, name: c.name, slug: c.slug })),
    };
  },

  async get_products_slug(slug: string) {
    await delay(250);
    const product = db.products.find((p) => p.slug === slug);
    if (!product) throw new Error("Product not found");
    const reviews = db.reviews.filter((r) => r.productId === product._id && r.status === "APPROVED").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
    const related = db.products.filter((p) => p._id !== product._id && (p.categoryId as any)._id === (product.categoryId as any)._id && p.status === "ACTIVE").sort((a, b) => b.sold - a.sold).slice(0, 6);
    return { product, reviews, related };
  },

  // ===== CATEGORIES =====
  async get_categories() {
    await delay(150);
    return { categories: db.categories.sort((a, b) => a.sortOrder - b.sortOrder) };
  },

  async get_categories_featured() {
    await delay(150);
    return { categories: db.categories.filter((c) => c.featured).sort((a, b) => a.sortOrder - b.sortOrder) };
  },

  async get_categories_slug(slug: string) {
    await delay(250);
    const category = db.categories.find((c) => c.slug === slug);
    if (!category) throw new Error("Category not found");
    const products = db.products.filter((p) => (p.categoryId as any)._id === category._id && p.status === "ACTIVE").sort((a, b) => b.sold - a.sold).slice(0, 24);
    const relatedCategories = db.categories.filter((c) => c._id !== category._id && c.featured).slice(0, 5);
    return { category, products, relatedCategories };
  },

  // ===== CART =====
  async post_cart_validate(token: string, body: { items: { productId: string; quantity: number }[] }) {
    await delay(150);
    const items = (body.items || []).map((item) => {
      const p = db.products.find((pr) => pr._id === item.productId);
      if (!p) return { ...item, error: "Product unavailable", available: false };
      const qty = Math.max(1, Math.min(item.quantity, p.stock));
      return {
        productId: item.productId,
        name: p.name, slug: p.slug, sku: p.sku,
        price: p.price, compareAtPrice: p.compareAtPrice,
        image: p.images[0]?.url,
        requestedQuantity: item.quantity, quantity: qty,
        stock: p.stock, inStock: p.stock > 0,
        lineTotal: Math.round(p.price * qty * 100) / 100,
      };
    });
    const subtotal = items.reduce((s, i) => s + (i.lineTotal || 0), 0);
    return { items, subtotal };
  },

  // ===== WISHLIST =====
  async get_wishlist(token: string) {
    await delay(150);
    const userId = token.replace(TOKEN_PREFIX, "");
    const ids = db.wishlistByUser[userId] || [];
    const products = db.products.filter((p) => ids.includes(p._id));
    return { products };
  },

  async post_wishlist_productId(token: string, productId: string) {
    await delay(100);
    const userId = token.replace(TOKEN_PREFIX, "");
    if (!db.wishlistByUser[userId]) db.wishlistByUser[userId] = [];
    if (!db.wishlistByUser[userId].includes(productId)) db.wishlistByUser[userId].push(productId);
    saveDB(db);
    return { ok: true };
  },

  async delete_wishlist_productId(token: string, productId: string) {
    await delay(100);
    const userId = token.replace(TOKEN_PREFIX, "");
    if (db.wishlistByUser[userId]) {
      db.wishlistByUser[userId] = db.wishlistByUser[userId].filter((id) => id !== productId);
      saveDB(db);
    }
    return { ok: true };
  },

  // ===== CHECKOUT =====
  async post_checkout(token: string, body: any) {
    await delay(800); // simulate payment processing
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("Authentication required. Please sign in.");

    const items = (body.items || []).map((item: any) => {
      const p = db.products.find((pr) => pr._id === item.productId);
      if (!p) throw new Error("Some products in your cart are no longer available.");
      if (p.stock < item.quantity) throw new Error(`Insufficient stock for ${p.name}. Only ${p.stock} left.`);
      return {
        productId: p._id, name: p.name, sku: p.sku, price: p.price,
        quantity: item.quantity, image: p.images[0]?.url,
        variant: item.variantId, total: Math.round(p.price * item.quantity * 100) / 100,
      };
    });
    if (items.length === 0) throw new Error("Your cart is empty.");

    const subtotal = Math.round(items.reduce((s: number, i: any) => s + i.total, 0) * 100) / 100;
    let discount = 0;
    let couponCode: string | undefined;
    if (body.couponCode) {
      const coupon = db.coupons.find((c) => c.code === body.couponCode.toUpperCase().trim() && c.active);
      if (!coupon) throw new Error("Invalid or expired coupon code.");
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new Error("This coupon has expired.");
      if (subtotal < coupon.minCartAmount) throw new Error(`This coupon requires a minimum order of $${coupon.minCartAmount.toFixed(2)}.`);
      if (coupon.discountType === "PERCENTAGE") {
        discount = Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }
      couponCode = coupon.code;
    }
    const taxable = subtotal - discount;
    const tax = Math.round(taxable * 0.08 * 100) / 100;
    const shipping = taxable === 0 ? 0 : taxable >= MOCK_SETTINGS.freeShippingThreshold ? 0 : MOCK_SETTINGS.flatShippingRate;
    const total = Math.round((taxable + tax + shipping) * 100) / 100;

    const orderNumber = generateOrderNumber();
    const order: Order = {
      _id: `order-${Date.now()}`,
      orderNumber,
      userId,
      guestEmail: undefined,
      status: "PROCESSING",
      paymentStatus: "PAID",
      fulfillmentStatus: "UNFULFILLED",
      subtotal, discount, tax, shipping, total,
      currency: "USD",
      couponCode,
      notes: body.notes,
      trackingNumber: undefined,
      shippingAddress: body.shippingAddress,
      billingAddress: body.sameAsBilling ? body.shippingAddress : body.billingAddress,
      shippingMethod: body.shippingMethod || "Standard",
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Order;
    db.orders.unshift(order);

    // Decrement stock
    items.forEach((item: any) => {
      const p = db.products.find((pr) => pr._id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
        p.sold += item.quantity;
      }
    });
    if (couponCode) {
      const c = db.coupons.find((cp) => cp.code === couponCode);
      if (c) c.usedCount += 1;
    }
    saveDB(db);

    return {
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        shipping: order.shipping,
        items: order.items,
        shippingAddress: order.shippingAddress,
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
      },
    };
  },

  async get_checkout_orders(token: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    return { orders: db.orders.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
  },

  async get_checkout_orders_orderNumber(token: string, orderNumber: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const order = db.orders.find((o) => o.orderNumber === orderNumber && o.userId === userId);
    if (!order) throw new Error("Order not found");
    return { order, payment: { _id: `pay-${order._id}`, orderId: order._id, provider: "MOCK", providerPaymentId: `mock_${order._id}`, amount: order.total, currency: "USD", status: "SUCCESS", method: "card" } };
  },

  async post_checkout_orders_orderNumber_cancel(token: string, orderNumber: string) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const order = db.orders.find((o) => o.orderNumber === orderNumber && o.userId === userId);
    if (!order) throw new Error("Order not found");
    if (!["PENDING", "PROCESSING"].includes(order.status)) throw new Error("This order can no longer be cancelled.");
    order.status = "CANCELLED";
    order.paymentStatus = "REFUNDED";
    order.updatedAt = new Date().toISOString();
    // Restore stock
    order.items.forEach((item) => {
      const p = db.products.find((pr) => pr._id === item.productId);
      if (p) { p.stock += item.quantity; p.sold = Math.max(0, p.sold - item.quantity); }
    });
    saveDB(db);
    return { ok: true, status: order.status };
  },

  // ===== COUPONS =====
  async post_coupons_validate(body: { code: string; subtotal: number }) {
    await delay(200);
    const coupon = db.coupons.find((c) => c.code === body.code.toUpperCase().trim() && c.active);
    if (!coupon) throw new Error("Invalid coupon code.");
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new Error("This coupon has expired.");
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) throw new Error("This coupon has reached its usage limit.");
    if (body.subtotal < coupon.minCartAmount) throw new Error(`Minimum order of $${coupon.minCartAmount.toFixed(2)} required for this coupon.`);
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round(body.subtotal * (coupon.discountValue / 100) * 100) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = Math.min(coupon.discountValue, body.subtotal);
    }
    return { valid: true, code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount, description: coupon.description };
  },

  async get_coupons() {
    await delay(150);
    return { coupons: db.coupons.filter((c) => c.active) };
  },

  // ===== REVIEWS =====
  async get_reviews_product_productId(productId: string) {
    await delay(150);
    return { reviews: db.reviews.filter((r) => r.productId === productId && r.status === "APPROVED").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
  },

  async post_reviews(token: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user) throw new Error("Please sign in to leave a review.");
    const product = db.products.find((p) => p._id === body.productId);
    if (!product) throw new Error("Product not found.");
    const existing = db.reviews.find((r) => r.productId === body.productId && r.userId === userId);
    if (existing) throw new Error("You have already reviewed this product.");
    const review: Review = {
      _id: `rev-${Date.now()}`,
      productId: body.productId,
      userId,
      authorName: user.name,
      authorEmail: user.email,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      verified: true,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Review;
    db.reviews.push(review);
    // Recompute rating
    const productReviews = db.reviews.filter((r) => r.productId === body.productId && r.status === "APPROVED");
    product.rating = Math.round((productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length) * 10) / 10;
    product.reviewCount = productReviews.length;
    saveDB(db);
    return { review };
  },

  async delete_reviews_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const idx = db.reviews.findIndex((r) => r._id === id && r.userId === userId);
    if (idx < 0) throw new Error("Review not found.");
    const review = db.reviews[idx];
    db.reviews.splice(idx, 1);
    const product = db.products.find((p) => p._id === review.productId);
    if (product) {
      const productReviews = db.reviews.filter((r) => r.productId === product._id && r.status === "APPROVED");
      product.rating = productReviews.length ? Math.round((productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length) * 10) / 10 : 0;
      product.reviewCount = productReviews.length;
    }
    saveDB(db);
    return { ok: true };
  },

  // ===== NEWSLETTER =====
  async post_newsletter(body: { email: string; source?: string }) {
    await delay(200);
    const email = body.email.toLowerCase().trim();
    const existing = db.subscribers.find((s) => s.email === email);
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        saveDB(db);
        return { ok: true, message: "You're subscribed again. Welcome back!" };
      }
      return { ok: true, message: "You're already subscribed." };
    }
    db.subscribers.push({ _id: `sub-${Date.now()}`, email, active: true, source: body.source || "FOOTER", createdAt: new Date().toISOString() });
    saveDB(db);
    return { ok: true, message: "Thanks for subscribing!" };
  },

  async post_newsletter_unsubscribe(body: { email: string }) {
    await delay(150);
    const sub = db.subscribers.find((s) => s.email === body.email.toLowerCase().trim());
    if (sub) { sub.active = false; saveDB(db); }
    return { ok: true, message: "You have been unsubscribed." };
  },

  // ===== CONTACT =====
  async post_contact(body: any) {
    await delay(300);
    db.contactMessages.unshift({
      _id: `msg-${Date.now()}`,
      name: body.name, email: body.email.toLowerCase().trim(),
      subject: body.subject, message: body.message, phone: body.phone,
      read: false, replied: false, reply: undefined, userId: undefined,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    } as ContactMessage);
    saveDB(db);
    return { ok: true, message: "Thanks for reaching out. We'll reply within 24 hours." };
  },

  // ===== SETTINGS =====
  async get_settings() {
    await delay(100);
    return { settings: db.settings };
  },

  // ===== ADMIN: DASHBOARD =====
  async get_admin_dashboard_stats(token: string) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const paidOrders = db.orders.filter((o) => o.paymentStatus === "PAID");
    const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
    const avgOrder = paidOrders.length ? revenue / paidOrders.length : 0;
    const customers = db.users.filter((u) => u.role === "CUSTOMER");
    const salesLast7 = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      const dayOrders = paidOrders.filter((o) => o.createdAt.slice(0, 10) === dayStr);
      return { _id: dayStr, revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length };
    });
    return {
      revenue: Math.round(revenue * 100) / 100,
      avgOrderValue: Math.round(avgOrder * 100) / 100,
      conversionRate: customers.length ? Math.round((paidOrders.length / customers.length) * 10000) / 100 : 0,
      totalOrders: db.orders.length,
      totalCustomers: customers.length,
      totalProducts: db.products.filter((p) => p.status === "ACTIVE").length,
      pendingOrders: db.orders.filter((o) => ["PENDING", "PROCESSING"].includes(o.status)).length,
      lowStockProducts: db.products.filter((p) => p.stock <= p.lowStockThreshold && p.status === "ACTIVE").length,
      contactUnread: db.contactMessages.filter((m) => !m.read).length,
      newsletterCount: db.subscribers.filter((s) => s.active).length,
      recentOrders: db.orders.slice(0, 8),
      bestSellers: db.products.filter((p) => p.status === "ACTIVE").sort((a, b) => b.sold - a.sold).slice(0, 6),
      salesLast7,
    };
  },

  // ===== ADMIN: PRODUCTS =====
  async get_admin_products(token: string, params: any) {
    await delay(250);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));
    let items = [...db.products];
    if (params.q) {
      const re = new RegExp(params.q, "i");
      items = items.filter((p) => re.test(p.name) || re.test(p.sku) || re.test(p.brand || ""));
    }
    if (params.status) items = items.filter((p) => p.status === params.status);
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const { items: pageItems, pagination } = paginate(items, page, limit);
    return { products: pageItems, pagination };
  },

  async post_admin_products(token: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const sku = body.sku || `LUM-${Date.now().toString(36).toUpperCase()}`;
    const category = db.categories.find((c) => c._id === body.categoryId) || db.categories[0];
    const product: Product = {
      _id: `prod-${Date.now()}`,
      name: body.name, slug, description: body.description, shortDescription: body.shortDescription,
      sku, price: Number(body.price), compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      currency: "USD", stock: Number(body.stock || 0), lowStockThreshold: Number(body.lowStockThreshold || 5),
      rating: 0, reviewCount: 0, sold: 0,
      trending: !!body.trending, newArrival: !!body.newArrival, bestSeller: !!body.bestSeller, featured: !!body.featured,
      status: body.status || "ACTIVE", brand: body.brand, material: body.material,
      careInstructions: body.careInstructions, shippingInfo: body.shippingInfo, returnPolicy: body.returnPolicy,
      weight: body.weight, dimensions: body.dimensions,
      seoTitle: body.seoTitle, seoDescription: body.seoDescription,
      tags: Array.isArray(body.tags) ? body.tags : [],
      categoryId: category,
      images: (body.images || []).map((img: any, i: number) => ({ url: img.url, altText: body.name || "Product image", position: i })),
      variants: body.variants || [],
      specifications: body.specifications || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Product;
    db.products.unshift(product);
    saveDB(db);
    return { product };
  },

  async patch_admin_products_id(token: string, id: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const product = db.products.find((p) => p._id === id);
    if (!product) throw new Error("Product not found");
    Object.assign(product, body);
    if (body.categoryId) {
      const cat = db.categories.find((c) => c._id === body.categoryId);
      if (cat) product.categoryId = cat;
    }
    product.updatedAt = new Date().toISOString();
    saveDB(db);
    return { product };
  },

  async delete_admin_products_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    db.products = db.products.filter((p) => p._id !== id);
    saveDB(db);
    return { ok: true };
  },

  // ===== ADMIN: CATEGORIES =====
  async get_admin_categories(token: string) {
    await delay(150);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    return { categories: db.categories.sort((a, b) => a.sortOrder - b.sortOrder) };
  },

  async post_admin_categories(token: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const category: Category = {
      _id: `cat-${Date.now()}`,
      name: body.name, slug,
      description: body.description, longDescription: body.longDescription,
      image: body.image, icon: body.icon,
      featured: !!body.featured, sortOrder: Number(body.sortOrder || 0),
      seoTitle: body.seoTitle, seoDescription: body.seoDescription,
    } as Category;
    db.categories.push(category);
    saveDB(db);
    return { category };
  },

  async patch_admin_categories_id(token: string, id: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const cat = db.categories.find((c) => c._id === id);
    if (!cat) throw new Error("Category not found");
    Object.assign(cat, body);
    saveDB(db);
    return { category: cat };
  },

  async delete_admin_categories_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    db.categories = db.categories.filter((c) => c._id !== id);
    saveDB(db);
    return { ok: true };
  },

  // ===== ADMIN: ORDERS =====
  async get_admin_orders(token: string, params: any) {
    await delay(250);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));
    let items = [...db.orders];
    if (params.status) items = items.filter((o) => o.status === params.status);
    if (params.paymentStatus) items = items.filter((o) => o.paymentStatus === params.paymentStatus);
    if (params.q) {
      const re = new RegExp(params.q, "i");
      items = items.filter((o) => re.test(o.orderNumber) || re.test(o.shippingAddress.firstName) || re.test(o.shippingAddress.lastName) || (o.guestEmail && re.test(o.guestEmail)));
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const { items: pageItems, pagination } = paginate(items, page, limit);
    // Attach user info
    const enriched = pageItems.map((o) => {
      const u = db.users.find((usr) => usr._id === o.userId);
      return { ...o, userId: u ? { name: u.name, email: u.email } : undefined };
    });
    return { orders: enriched, pagination };
  },

  async get_admin_orders_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const order = db.orders.find((o) => o._id === id);
    if (!order) throw new Error("Order not found");
    const u = db.users.find((usr) => usr._id === order.userId);
    return { order: { ...order, userId: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : undefined }, payment: { _id: `pay-${order._id}`, orderId: order._id, provider: "MOCK", amount: order.total, currency: "USD", status: "SUCCESS", method: "card" } };
  },

  async patch_admin_orders_id_status(token: string, id: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const order = db.orders.find((o) => o._id === id);
    if (!order) throw new Error("Order not found");
    if (body.status) order.status = body.status;
    if (body.fulfillmentStatus) order.fulfillmentStatus = body.fulfillmentStatus;
    if (body.trackingNumber !== undefined) order.trackingNumber = body.trackingNumber;
    if (body.status === "DELIVERED") order.fulfillmentStatus = "DELIVERED";
    if (body.status === "SHIPPED") order.fulfillmentStatus = "SHIPPED";
    order.updatedAt = new Date().toISOString();
    saveDB(db);
    return { order };
  },

  // ===== ADMIN: COUPONS =====
  async get_admin_coupons(token: string) {
    await delay(150);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    return { coupons: db.coupons.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()) };
  },

  async post_admin_coupons(token: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const coupon: Coupon = {
      _id: `coup-${Date.now()}`,
      code: String(body.code).toUpperCase().trim(),
      description: body.description,
      discountType: body.discountType,
      discountValue: Number(body.discountValue),
      minCartAmount: Number(body.minCartAmount || 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      usageLimit: Number(body.usageLimit || 0),
      usedCount: 0,
      perUserLimit: Number(body.perUserLimit || 1),
      expiresAt: body.expiresAt ? new Date(body.expiresAt).toISOString() : undefined,
      active: body.active !== false,
    } as Coupon;
    db.coupons.push(coupon);
    saveDB(db);
    return { coupon };
  },

  async patch_admin_coupons_id(token: string, id: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const c = db.coupons.find((cp) => cp._id === id);
    if (!c) throw new Error("Coupon not found");
    Object.assign(c, body);
    saveDB(db);
    return { coupon: c };
  },

  async delete_admin_coupons_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    db.coupons = db.coupons.filter((c) => c._id !== id);
    saveDB(db);
    return { ok: true };
  },

  // ===== ADMIN: REVIEWS =====
  async get_admin_reviews(token: string, params: any) {
    await delay(250);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));
    let items = db.reviews.map((r) => ({ ...r, productId: db.products.find((p) => p._id === r.productId) || { _id: r.productId, name: "Unknown", slug: "", images: [] } }));
    if (params.status) items = items.filter((r) => r.status === params.status);
    if (params.rating) items = items.filter((r) => r.rating === Number(params.rating));
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const { items: pageItems, pagination } = paginate(items, page, limit);
    return { reviews: pageItems, pagination };
  },

  async patch_admin_reviews_id_status(token: string, id: string, body: { status: string }) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const r = db.reviews.find((rv) => rv._id === id);
    if (!r) throw new Error("Review not found");
    r.status = body.status as any;
    saveDB(db);
    return { review: r };
  },

  async delete_admin_reviews_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    db.reviews = db.reviews.filter((r) => r._id !== id);
    saveDB(db);
    return { ok: true };
  },

  // ===== ADMIN: CUSTOMERS =====
  async get_admin_customers(token: string, params: any) {
    await delay(250);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));
    let customers = db.users.filter((u) => u.role === "CUSTOMER");
    if (params.q) {
      const re = new RegExp(params.q, "i");
      customers = customers.filter((c) => re.test(c.name) || re.test(c.email));
    }
    const enriched = customers.map((c) => {
      const userOrders = db.orders.filter((o) => o.userId === c._id && o.paymentStatus === "PAID");
      return { ...c, totalSpent: userOrders.reduce((s, o) => s + o.total, 0), orderCount: userOrders.length };
    });
    const { items: pageItems, pagination } = paginate(enriched, page, limit);
    return { customers: pageItems, pagination };
  },

  async get_admin_customers_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const customer = db.users.find((c) => c._id === id);
    if (!customer) throw new Error("Customer not found");
    const orders = db.orders.filter((o) => o.userId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
    return { customer, orders, summary: { totalSpent: paidOrders.reduce((s, o) => s + o.total, 0), orderCount: paidOrders.length } };
  },

  async patch_admin_customers_id_ban(token: string, id: string, body: { banned: boolean }) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const c = db.users.find((cu) => cu._id === id);
    if (!c) throw new Error("Customer not found");
    c.banned = !!body.banned;
    saveDB(db);
    return { user: c };
  },

  // ===== ADMIN: STORE (messages, subscribers, inventory, settings) =====
  async get_admin_store_messages(token: string, params: any) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));
    const items = [...db.contactMessages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const { items: pageItems, pagination } = paginate(items, page, limit);
    return { messages: pageItems, pagination };
  },

  async patch_admin_store_messages_id(token: string, id: string, body: any) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const m = db.contactMessages.find((msg) => msg._id === id);
    if (!m) throw new Error("Message not found");
    if (typeof body.read === "boolean") m.read = body.read;
    if (typeof body.replied === "boolean") m.replied = body.replied;
    if (typeof body.reply === "string") m.reply = body.reply;
    m.updatedAt = new Date().toISOString();
    saveDB(db);
    return { message: m };
  },

  async delete_admin_store_messages_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    db.contactMessages = db.contactMessages.filter((m) => m._id !== id);
    saveDB(db);
    return { ok: true };
  },

  async get_admin_store_subscribers(token: string, params: any) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(params.limit) || 50));
    const items = [...db.subscribers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const { items: pageItems, pagination } = paginate(items, page, limit);
    return { subscribers: pageItems, pagination };
  },

  async delete_admin_store_subscribers_id(token: string, id: string) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    db.subscribers = db.subscribers.filter((s) => s._id !== id);
    saveDB(db);
    return { ok: true };
  },

  async get_admin_store_inventory(token: string, params: any) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    let items = db.products.filter((p) => p.status === "ACTIVE");
    if (params.status === "low") items = items.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0);
    if (params.status === "out") items = items.filter((p) => p.stock <= 0);
    items.sort((a, b) => a.stock - b.stock);
    return { products: items };
  },

  async patch_admin_store_inventory_id(token: string, id: string, body: any) {
    await delay(200);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    const p = db.products.find((pr) => pr._id === id);
    if (!p) throw new Error("Product not found");
    if (typeof body.stock === "number") p.stock = Math.max(0, body.stock);
    if (typeof body.lowStockThreshold === "number") p.lowStockThreshold = body.lowStockThreshold;
    p.updatedAt = new Date().toISOString();
    saveDB(db);
    return { product: p };
  },

  async get_admin_store_settings(token: string) {
    await delay(150);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    return { settings: db.settings };
  },

  async patch_admin_store_settings(token: string, body: any) {
    await delay(300);
    const userId = token.replace(TOKEN_PREFIX, "");
    const user = db.users.find((u) => u._id === userId);
    if (!user || user.role !== "ADMIN") throw new Error("Admin access required.");
    Object.assign(db.settings, body);
    saveDB(db);
    return { settings: db.settings };
  },
};
