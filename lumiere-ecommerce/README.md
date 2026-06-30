# Lumière — Premium Fullstack Ecommerce Platform

A complete, production-ready ecommerce platform built with **React + Vite** (client) and **Express + MongoDB** (server). Premium customer storefront, secure admin dashboard, realistic seed data, and full commerce features: cart, wishlist, checkout, orders, mock payments, coupons, reviews, newsletter, contact, and SEO.

> **🎯 Standalone Showcase Mode**: The client now runs **fully standalone** — no backend required. A built-in mock API layer (`client/src/lib/api.ts` + `client/src/lib/mockApi.ts`) serves all 21 products, 6 categories, reviews, coupons, orders, and admin data from localStorage. Perfect for live previews and static hosting. To run: `cd client && bun install && bun run dev` — that's it. Demo logins: `admin@example.com` / `Admin@12345` (admin) and `emma@example.com` / `Password123` (customer). All customer and admin flows work: browse, filter, add to cart, checkout (creates real orders in localStorage), wishlist, reviews, admin dashboard with charts, product/order/customer/coupon/inventory management.

---

## ✨ Features

### Customer Storefront
- **Premium home page** — hero, featured categories, trending/new arrivals/best sellers sections, seasonal promo banner, brand trust badges, testimonials marquee, newsletter, SEO content
- **Shop page** — product grid with category/price/rating/availability filters, sort dropdown, search, pagination, mobile filter drawer, empty state, skeleton loading
- **Category pages** — hero, SEO content, buying guide, FAQ accordion (with FAQ schema), related categories
- **Product detail** — image gallery with thumbnails, variant selectors, quantity, add to cart, buy now, wishlist, quick delivery estimate, return policy, tabs (description / specifications / reviews), review form with rating breakdown, related products, recently viewed, breadcrumbs, product schema
- **Cart** — quantity update, remove, coupon validation, free-shipping progress bar, recommended products, empty state, persistent (localStorage)
- **Checkout** — contact + shipping + billing form, delivery method (standard/express), mock payment UI, sticky order summary, form validation, saved addresses for logged-in users
- **Order success** — confirmation, order ID, timeline, items, payment summary, invoice print, track order CTA
- **Wishlist** — move to cart, remove, empty state, recommended products, persistent + synced with server when logged in
- **Auth** — login, register, forgot password (mock email), JWT + httpOnly cookie sessions
- **Account** — profile, orders, order detail (with cancel + timeline), addresses (CRUD), settings (password change, theme, notifications)
- **Static pages** — About, Contact, FAQ, Shipping Policy, Returns, Privacy, Terms, Size Guide, Track Order
- **Error pages** — 404, 500

### Admin Dashboard
- **Dashboard** — revenue, orders, customers, products, conversion rate, AOV, recent orders, best sellers, 7-day revenue + orders charts, low-stock alerts, pending orders, unread messages
- **Products** — list with search/filter, create/edit modal (all fields incl. variants, specifications, SEO, status, flags), delete with confirm
- **Categories** — card grid, create/edit, delete, SEO fields, featured toggle
- **Orders** — table with search/filter by status & payment, detail modal with items/address/totals, status update, tracking number, print invoice
- **Customers** — list with search, detail modal (orders, spending summary), suspend/reinstate
- **Coupons** — list, create/edit, delete, percentage/fixed, min cart, max discount, usage limits, expiry
- **Reviews** — list, approve/reject, delete, filter by status & rating
- **Inventory** — overview cards, low/out stock filters, inline stock editing
- **Messages** — contact inbox, mark read, reply (mock), delete
- **Subscribers** — newsletter list, CSV export, delete
- **Settings** — store identity, contact, commerce (tax/shipping), social links, SEO defaults

### Backend
- **Auth** — JWT + bcrypt, httpOnly cookie + Bearer header, role-based access (CUSTOMER/ADMIN), rate-limited auth endpoints
- **Products** — full CRUD (admin), public list with text search + filters + sort + pagination, facets endpoint, single by slug, related products
- **Categories** — CRUD (admin), public list, single by slug with products + related
- **Cart** — client-side persisted, server validation endpoint
- **Wishlist** — server-side for logged-in users, localStorage fallback for guests
- **Checkout** — backend price recompute (never trusts client totals), stock validation, coupon validation, order + payment creation, stock decrement, coupon usage increment
- **Orders** — user can view/cancel own orders, admin can list/update status/fulfillment/tracking
- **Coupons** — validate (public), CRUD (admin), percentage/fixed, expiry, usage limits, min cart, max discount
- **Reviews** — create (logged-in, verified-buyer flag), delete own, admin moderation, auto-recompute product rating
- **Newsletter** — subscribe/unsubscribe, prevent duplicates
- **Contact** — store messages, rate-limited, admin reply
- **Settings** — singleton store config
- **Security** — Helmet, CORS, compression, rate limiting, input validation (Zod), centralized error handler, no stack traces in prod, role checks on every admin route, users can't read other users' orders

### Design System
- Warm, premium palette (cognac / cream / sand)
- Typography: **Fraunces** (display, serif) + **Plus Jakarta Sans** (body) + **JetBrains Mono** (code)
- Consistent spacing, radius, shadows, buttons, cards, inputs, badges, modals, drawers, toasts, skeletons
- Light + dark mode with system preference
- Framer Motion-style transitions, hover effects, scroll reveals, shimmer skeletons
- Fully responsive (mobile / tablet / desktop)
- `prefers-reduced-motion` support

### SEO
- Unique title + meta description per page
- Open Graph + Twitter card metadata
- JSON-LD schemas: Organization, Product, BreadcrumbList, FAQPage, CollectionPage
- Semantic HTML, proper heading hierarchy, alt text on all images
- Clean URLs (`/product/:slug`, `/category/:slug`)

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, TypeScript 5, Tailwind CSS 3, React Router 6, Zustand, React Hook Form + Zod, Recharts, Framer Motion, Lucide icons, Sonner toasts, React Helmet Async |
| Backend | Node.js, Express 4, TypeScript 5, Mongoose 8, JSON Web Tokens, bcryptjs, Zod, Helmet, CORS, express-rate-limit, Morgan |
| Database | MongoDB (via Mongoose). In dev, automatically runs an in-memory MongoDB (`mongodb-memory-server`) so no install is required. |
| Images | Curated Unsplash CDN URLs (royalty-free, no API key needed) |
| Dev tooling | tsx (server hot reload), Vite HMR (client), concurrently (run both) |

---

## 📁 Folder Structure

```
my-project/
├── client/                    # Vite + React frontend (port 3000)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/         # AdminLayout, shared (StatCard, AdminTable, ConfirmModal…)
│   │   │   ├── layout/        # Navbar, Footer, CartDrawer, WishlistDrawer, SearchOverlay, MobileMenu
│   │   │   ├── product/       # ProductCard, QuickView
│   │   │   ├── shared/        # Reveal, Seo
│   │   │   └── ui/            # Button, Input, Modal, Drawer, Badge, Skeleton, Pagination, etc.
│   │   ├── hooks/
│   │   ├── lib/               # api (axios), utils, pricing
│   │   ├── pages/
│   │   │   ├── account/       # AccountLayout, Profile, Orders, OrderDetail, Addresses, Settings
│   │   │   ├── admin/         # Dashboard, Products, Categories, Orders, Customers, Coupons, Reviews, Inventory, Messages, Subscribers, Settings
│   │   │   ├── auth/          # Login, Register, ForgotPassword
│   │   │   └── static/        # About, Contact, Faq, Shipping, Returns, Privacy, Terms, SizeGuide, TrackOrder
│   │   ├── store/             # Zustand stores: auth, cart, wishlist, ui
│   │   ├── types/
│   │   ├── App.tsx            # Routes
│   │   ├── main.tsx           # Entry
│   │   └── index.css          # Design system (Tailwind + custom components)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts         # proxies /api → :4000
│
├── server/                    # Express + MongoDB backend (port 4000)
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts       # env config
│   │   │   └── db.ts          # MongoDB connection (auto in-memory in dev)
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT, requireAuth, requireAdmin, optionalAuth
│   │   │   └── index.ts       # rate limiters, errorHandler, notFound
│   │   ├── models/            # Mongoose schemas: User, Category, Product, Review, Coupon, Order, Payment, NewsletterSubscriber, ContactMessage, StoreSetting
│   │   ├── routes/
│   │   │   ├── admin/         # dashboard, products, categories, orders, coupons, reviews, customers, store
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── cart.ts
│   │   │   ├── wishlist.ts
│   │   │   ├── checkout.ts
│   │   │   ├── coupons.ts
│   │   │   ├── reviews.ts
│   │   │   ├── newsletter.ts
│   │   │   ├── contact.ts
│   │   │   └── settings.ts
│   │   ├── seed/
│   │   │   ├── auto-seed.ts   # Called on server boot if DB is empty (dev)
│   │   │   ├── index.ts       # Standalone seed script (`bun run seed`)
│   │   │   └── unsplash.ts    # Curated image URLs
│   │   ├── utils/
│   │   └── index.ts           # Express app entry
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .zscripts/dev.sh           # Bootstraps deps + runs both servers
├── package.json               # root: concurrently runs client + server
└── README.md
```

---

## 🚀 Setup

### Prerequisites
- Node.js 18+ (tested on Node 24)
- [Bun](https://bun.sh) (used as the package manager / runner)
- No MongoDB install needed in dev — `mongodb-memory-server` downloads a real `mongod` binary automatically on first boot.

### Quick start (dev)

```bash
# 1. Install deps for root, client, and server
cd my-project
bun install
cd client && bun install && cd ..
cd server && bun install && cd ..

# 2. Configure env
cp server/.env.example server/.env   # defaults work out of the box

# 3. Run both client (port 3000) and server (port 4000) together
bun run dev
```

The server auto-seeds the database on first boot if it's empty (dev mode only). You'll see `[server] ✅ Auto-seed complete` in the server log.

Open the **Preview Panel** on the right to view the app at `http://localhost:3000` — do not navigate to `localhost` directly.

### Re-seeding manually

If you ever want to wipe and reseed:

```bash
cd server
bun run seed
```

Note: the standalone `seed` script connects to its own in-memory MongoDB instance and disconnects on completion, so it does NOT affect a running server. To reseed a running dev server, simply restart it — the auto-seed runs again if the DB is empty.

---

## 🔐 Demo Credentials

> ⚠️ These credentials are for **local/demo use only**. Never deploy with them.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `Admin@12345` |
| Customer | `emma@example.com` | `Password123` |

Additional demo customers: `james@example.com`, `sofia@example.com` (same password).

---

## 💳 Mock Payment Mode

By default `PAYMENT_PROVIDER=MOCK` in `server/.env`. In mock mode:

- Every checkout automatically succeeds (no real payment is processed)
- A `Payment` document with `status: "SUCCESS"` is created
- The order's `paymentStatus` is set to `PAID` and `status` to `PROCESSING`
- Stock is decremented and coupon usage is incremented

### Switching to a real provider

Set these env vars in `server/.env`:

```bash
PAYMENT_PROVIDER=STRIPE   # or RAZORPAY, PAYPAL
PAYMENT_SECRET_KEY=sk_test_xxx
PAYMENT_PUBLIC_KEY=pk_test_xxx
```

Then update `server/src/routes/checkout.ts` to integrate the provider's SDK (look for the `MOCK PAYMENT` comment block). The current mock logic is clearly isolated and easy to replace.

---

## 📧 Mock Email Mode

Contact form messages and newsletter subscriptions are stored in the database and logged to the server console. No real email is sent. To enable real email, set `EMAIL_SERVER` in `server/.env` (any SMTP connection string works) and wire it into `server/src/routes/contact.ts` and `server/src/routes/newsletter.ts`.

---

## 🌱 Environment Variables

### `server/.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | `development` enables auto-seed and verbose logging |
| `CLIENT_URL` | `http://localhost:3000` | CORS origin for the Vite client |
| `MONGODB_URI` | _(empty)_ | Leave blank to auto-start in-memory MongoDB. Set to a real connection string in production. |
| `JWT_SECRET` | dev default | Secret for signing JWTs — **change in production** |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `ADMIN_EMAIL` | `admin@example.com` | Seed admin email |
| `ADMIN_PASSWORD` | `Admin@12345` | Seed admin password |
| `PAYMENT_PROVIDER` | `MOCK` | `MOCK` / `STRIPE` / `RAZORPAY` / `PAYPAL` |
| `PAYMENT_SECRET_KEY` | _(empty)_ | Provider secret key |
| `PAYMENT_PUBLIC_KEY` | _(empty)_ | Provider publishable key |
| `EMAIL_SERVER` | _(empty)_ | SMTP connection string |
| `EMAIL_FROM` | `no-reply@lumiere.store` | From address |
| `APP_URL` | `http://localhost:3000` | Public app URL (for emails, canonical URLs) |

The client (`client/`) needs no env vars — it proxies `/api` to `http://localhost:4000` via Vite.

---

## 📜 NPM Scripts

### Root (`my-project/package.json`)

```bash
bun run dev          # Run client + server concurrently
bun run dev:client   # Just the client
bun run dev:server   # Just the server
bun run seed         # Run the standalone seed script
bun run build        # Build the client for production
bun run lint         # Lint the client
```

### Server (`server/package.json`)

```bash
bun run dev          # tsx watch (hot reload)
bun run build        # TypeScript compile to dist/
bun run start        # Run compiled server
bun run seed         # Standalone seed script
```

### Client (`client/package.json`)

```bash
bun run dev          # Vite dev server
bun run build        # tsc + vite build → dist/
bun run preview      # Preview the production build
bun run lint         # ESLint
```

---

## 🗄 Database

The platform uses **MongoDB** via **Mongoose**. In dev, the server automatically starts an in-memory MongoDB (`mongodb-memory-server`) — no local MongoDB install required.

### Models

- **User** — email, passwordHash, name, role (CUSTOMER/ADMIN), phone, banned, embedded addresses[]
- **Address** — embedded subdoc on User (label, name, address, city/state/zip/country, phone, isDefault)
- **Category** — name, slug, descriptions (short + long SEO), image, icon, featured, sortOrder, SEO fields
- **Product** — name, slug, description, shortDescription, sku, price, compareAtPrice, stock, lowStockThreshold, rating, reviewCount, sold, flags (trending/newArrival/bestSeller/featured), status, brand, material, care/ship/return info, weight, dimensions, SEO fields, tags[], images[], variants[], specifications[], categoryId
- **Review** — productId, userId, authorName, authorEmail, rating (1-5), title, comment, verified, status
- **Coupon** — code, discountType (PERCENTAGE/FIXED), discountValue, minCartAmount, maxDiscount, usageLimit, usedCount, perUserLimit, expiresAt, active
- **Order** — orderNumber, userId/guestEmail, status, paymentStatus, fulfillmentStatus, subtotal/discount/tax/shipping/total, couponCode, notes, trackingNumber, shippingAddress, billingAddress, shippingMethod, items[]
- **OrderItem** — embedded subdoc (productId, name, sku, price, quantity, image, variant, total)
- **Payment** — orderId, provider, providerPaymentId, amount, currency, status, method
- **NewsletterSubscriber** — email, userId, active, source
- **ContactMessage** — name, email, subject, message, phone, read, replied, reply, userId
- **StoreSetting** — singleton with store identity, contact, commerce, social, SEO defaults

### Switching to a real MongoDB

1. Set `MONGODB_URI=mongodb://user:pass@host:port/dbname` in `server/.env`
2. Restart the server — it will skip the in-memory bootstrap and connect to your URI
3. The auto-seed will still run if the DB is empty (dev mode), or run `bun run seed` manually

---

## 🔒 Security Notes

- **Passwords** hashed with bcrypt (12 rounds)
- **JWT** stored in both an httpOnly cookie AND localStorage (cookie is preferred by the server; localStorage copy is for the axios interceptor)
- **CORS** restricted to the client URL
- **Helmet** sets security headers (CSP, X-Frame-Options, etc.)
- **Rate limiting** on auth (20/15min), contact (5/hr), newsletter (10/hr), and global API (500/15min)
- **Input validation** with Zod on every auth/checkout/contact/newsletter/review endpoint
- **Role-based access** — every admin route goes through `requireAdmin` middleware
- **User isolation** — users can only view/cancel their own orders
- **Backend price recompute** — checkout never trusts client-sent totals; subtotal, discount, tax, shipping, and total are all recalculated server-side from DB product prices and validated coupons
- **Stock validation** — checkout checks stock before creating the order and decrements it atomically
- **No stack traces** in production error responses

---

## ✅ Production Checklist

Before deploying:

- [ ] Set a strong `JWT_SECRET` (32+ random chars)
- [ ] Set `NODE_ENV=production`
- [ ] Set `MONGODB_URI` to a real MongoDB Atlas / self-hosted instance
- [ ] Set `CLIENT_URL` and `APP_URL` to your production domain
- [ ] Set `PAYMENT_PROVIDER` and real provider keys (or keep MOCK for staging)
- [ ] Set `EMAIL_SERVER` SMTP connection for real email
- [ ] Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` — the seed admin is for demo only
- [ ] Remove or guard the auto-seed (`if (config.isDev)` already prevents it in prod)
- [ ] Build the client: `cd client && bun run build` → serve `dist/` via nginx/CDN
- [ ] Build the server: `cd server && bun run build` → run `node dist/index.js`
- [ ] Set up HTTPS (Let's Encrypt / Cloudflare)
- [ ] Set up MongoDB backups
- [ ] Configure monitoring (Sentry, LogRocket, etc.)
- [ ] Run a load test
- [ ] Set up a CDN for product images (or keep Unsplash CDN)

---

## 🚢 Deployment

### Frontend (Vercel / Netlify / any static host)

```bash
cd client
bun run build
# Deploy the dist/ folder
```

Set the build command to `bun run build` and the output directory to `dist`. Make sure to set the `VITE_API_URL` env var (or update `client/src/lib/api.ts` baseURL) to point to your production API.

### Backend (Render / Railway / Fly.io / any Node host)

```bash
cd server
bun run build
bun run start   # or: node dist/index.js
```

Set all the env vars from `server/.env.example` in your host's dashboard.

### Full-stack on one machine

Use the included `Caddyfile` as a starting point — it proxies `/api/*` to the Express server (port 4000) and everything else to the Vite dev server / built static files (port 3000).

---

## 🧪 Testing the Flows

### Customer flow

1. Register at `/auth/register` (or use `emma@example.com` / `Password123`)
2. Browse `/shop`, filter by category, sort by price
3. Open a product, select a variant, add to cart
4. Open the cart drawer, apply coupon `WELCOME10`
5. Go to checkout, fill the form, place order
6. View the order success page, then visit `/account/orders` to see it in your order history
7. Add a review on the product page (verified-buyer badge appears automatically)
8. Add items to wishlist, view `/wishlist`

### Admin flow

1. Sign in at `/auth/login` with `admin@example.com` / `Admin@12345`
2. You'll be redirected to `/admin` (dashboard with charts + stats)
3. Visit Products → click "Add Product" → fill the form → save
4. Visit Orders → click any order → update status to "Shipped" → add tracking number
5. Visit Coupons → create a new coupon
6. Visit Reviews → approve/reject pending reviews
7. Visit Inventory → filter "Low stock" → update stock levels
8. Visit Settings → update store name → save

---

## 📝 Notes

- **In-memory MongoDB** resets on every server restart. If you want persistent data in dev, set `MONGODB_URI` to a local MongoDB instance (`mongodb://localhost:27017/lumiere`).
- **Unsplash images** are loaded from `images.unsplash.com` — you need internet access for product images to display. Replace with your own CDN URLs in production via the admin product editor.
- **Mock payment** always succeeds in dev. To test the payment-failed page, set `PAYMENT_PROVIDER=STRIPE` (or any non-MOCK value) without providing real keys — the server will mark payments as FAILED.
- **The seed data** includes 21 products across 6 categories, ~70 reviews, 4 active coupons, 3 demo customers, and 1 admin. All product names, descriptions, prices, and materials are realistic.

---

## 📄 License

This is a demo project. The brand "Lumière" and all product names are fictional. Product images are from [Unsplash](https://unsplash.com) (royalty-free under the Unsplash License).

---

Built with care. If you ship it, ship it well. ✨
