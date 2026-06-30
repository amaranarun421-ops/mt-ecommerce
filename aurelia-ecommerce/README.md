# Aurelia — Premium Ecommerce Frontend

A complete, production-ready, premium ecommerce frontend built with Next.js 16, TypeScript, Tailwind CSS 4, and shadcn/ui. Designed as a high-end home & lifestyle store with 24 products across 8 categories, full shopping flow, account management, and 47 routes.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Animations**: Framer Motion
- **State**: Zustand (with persist middleware for cart/wishlist)
- **Icons**: Lucide React
- **Fonts**: Inter (body) + Playfair Display (headings)

## Quick Start

```bash
# Install dependencies
bun install   # or npm install

# Copy environment file
cp .env.example .env.local

# Run the dev server
bun run dev   # or npm run dev

# Open http://localhost:3000
```

## Deploy to Vercel

1. Push this project to a GitHub/GitLab repository
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — no config needed
4. Add environment variables from `.env.example` in the Vercel dashboard
5. Deploy

The `next.config.ts` includes `output: "standalone"` for optimized production builds.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (home)/page.tsx       # Home page
│   ├── shop/                 # Product listing with filters
│   ├── products/[slug]/      # Product detail with SEO schema
│   ├── cart/                 # Cart page
│   ├── checkout/             # 4-step checkout
│   ├── order-success/        # Order confirmation
│   ├── wishlist/             # Wishlist page
│   ├── account/              # Account: profile, orders, addresses, settings
│   ├── login/ register/      # Auth pages
│   ├── about/ contact/ faq/  # Static content pages
│   ├── shipping/ returns/    # Policy pages
│   ├── ...                   # 47 routes total
│   ├── layout.tsx            # Root layout with header/footer/drawers
│   ├── page.tsx              # Home page
│   ├── not-found.tsx         # 404 page
│   └── error.tsx             # 500 error boundary
├── components/
│   ├── home/                 # Home page sections (hero, categories, etc.)
│   ├── layout/               # Header, footer, cart drawer, search overlay
│   ├── shop/                 # Product card, account layout
│   ├── common/               # Reusable: price, rating, badges, policy page
│   ├── providers/            # Theme + store hydration providers
│   └── ui/                   # shadcn/ui components
├── data/
│   └── catalog.ts            # All mock data: 24 products, 8 categories, reviews
├── store/
│   └── index.ts              # Zustand store (cart, wishlist, UI state)
└── lib/
    ├── format.ts             # Price & date formatting
    └── utils.ts              # cn() class merge utility
```

## Features

### Pages (47 routes)
- **Home**: hero, trust badges, categories, trending, seasonal offer with countdown, new arrivals, room showcase, best sellers, brand story, testimonials, press bar, newsletter, SEO content
- **Shop**: filters sidebar (categories, price slider, availability, rating), sort dropdown, search, active filter chips, loading skeletons, empty state, category SEO content
- **Product detail**: image gallery, breadcrumbs, color/size variants, quantity selector, add to cart + buy now + wishlist + share, trust signals, delivery estimate, tabs (description/specs/reviews/FAQ), rating breakdown, related products, recently viewed, SEO content, Product + Breadcrumb JSON-LD schema
- **Cart**: line items, quantity update, coupon input (5 working codes), free-shipping progress, recommended products, empty state
- **Checkout**: 4-step (contact → shipping → payment → review), form validation, delivery method, payment method, card formatting, loading state, sticky order summary
- **Order success**: order ID, timeline, customer + shipping summary, ordered items, payment summary
- **Wishlist**: cards, move to cart, remove, empty state
- **Account**: profile, orders (with filter tabs + search), order detail (tracking timeline), addresses (CRUD), settings (notifications, currency, security)
- **Auth**: login, register (password strength), forgot password
- **Static**: about, contact (form), FAQ (search + categories + schema), shipping, returns, privacy, terms, size guide, warranty, sustainability, trade program, press, careers, gift cards, accessibility
- **Errors**: 404, 500, payment-failed, access-denied, offline, empty search

### Components
- Premium navbar with mega menu, sticky header, mobile menu sheet
- Cart drawer, wishlist drawer, search overlay, quick view modal
- Newsletter exit-intent modal, mobile sticky bar
- Premium product card with hover image swap + action reveal
- Rating stars, price formatter, quantity selector, badges
- Policy page template, account layout

### Design
- Warm bronze/copper accent on cream paper background
- Playfair Display headings + Inter body
- Scroll-reveal animations, hover lift effects, shimmer skeletons
- Fully responsive (mobile, tablet, desktop)

### SEO
- Unique title + meta description per route
- Open Graph + Twitter cards
- JSON-LD schema: Organization, Product, BreadcrumbList, FAQPage
- Clean URLs, internal links, sitemap-friendly robots config
- Image optimization with Next.js Image + Unsplash remote patterns

### State Management
- Zustand with persist middleware (cart, wishlist, recently viewed, coupon)
- Hydration-safe via `useSyncExternalStore`
- UI state for drawers/modals/search

### Accessibility
- Semantic HTML, ARIA labels on icon buttons
- Keyboard-friendly modals (Escape to close)
- Visible focus states, proper alt text
- Form labels with error messages

## Mock Data

All data is in `src/data/catalog.ts`:
- **24 products** across 8 categories (furniture, decor, kitchen, lighting, bedding, fragrance, accessories, outdoor)
- Each product has: description, highlights, specifications, materials, care, shipping note, variants (colors/sizes), FAQs, 2-3 reviews
- **6 testimonials**, **15 FAQs**, **5 coupon codes** (WELCOME10, FREESHIP, AURELIA25, SAVE50, HOLIDAY15)

## Coupon Codes (for testing)

| Code | Type | Value | Min Order |
|------|------|-------|-----------|
| WELCOME10 | Percentage | 10% | $0 |
| FREESHIP | Free shipping | — | $0 |
| AURELIA25 | Percentage | 25% | $500 |
| SAVE50 | Fixed | $50 | $250 |
| HOLIDAY15 | Percentage | 15% | $100 |

## Scripts

```bash
bun run dev        # Dev server on port 3000
bun run lint       # ESLint
bun run build      # Production build
bun run db:push    # Push Prisma schema to database
bun run db:seed    # Seed database
```

## License

This is a demo project. Use it as a template for your own ecommerce store.
