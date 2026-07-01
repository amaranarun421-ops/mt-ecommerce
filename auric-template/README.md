# AURIC — Premium Wireless Headphones Ecommerce Template

A flagship commercial single-product ecommerce template built with **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/Radix UI**.

The entire experience is built around **AURIC ONE** — audiophile-grade wireless headphones with beryllium drivers, adaptive ANC, 60-hour battery, and lossless Hi-Res audio.

## Features

### Brand & Design
- Custom **AURIC** brand identity (logo, favicon, color tokens, typography)
- Warm charcoal + amber gold + cream palette
- Playfair Display (display) + Geist Sans/Mono (body)
- Premium UI: glass morphism, soft/elevated shadows, gradient gold text, shimmer skeletons, marquee animations, premium scrollbars, button shine effects, image zoom transitions

### Architecture
- **Next.js 16 App Router** + TypeScript (strict)
- **Tailwind CSS v4** with custom design tokens via CSS variables
- **shadcn/Radix UI** component library
- **Hash-based client-side router** (sandbox-friendly)
- **6 React contexts** persisted to localStorage: Cart, Wishlist, Auth, Language, Router, Theme
- **Lazy-loaded view components** for code splitting

### Pages (35+ views)
Home, Product (with gallery/tabs/bundle/related), Cart drawer + Cart page, Multi-step Checkout (shipping/billing/payment/review), Order success/failed/cancelled/details, Track order, Printable Invoice, Wishlist, Compare, Search, Recently viewed, Account dashboard (8 sections), Auth (signin/signup/forgot/reset), Policy pages (shipping/returns/warranty/privacy/terms/refund), About + Brand Story, Contact, Support center with ticket form, FAQ, Accessories, Error pages (404/500/offline/maintenance/coming-soon)

### Premium UX
- **EN/AR full i18n** with native RTL layout mirroring
- **Light/Dark mode**
- **Floating Go-To-Top button** (lifts above sticky bar on product page)
- **Cart drawer** with free-shipping progress, coupon input
- **Search overlay** (Cmd+K) with trending/recent/popular + live results
- **Sticky purchase bar** on product page
- **Verified-buyer system** unlocking review submission
- **Cursor pointer** globally on all interactive elements
- Hero section fits within viewport on all breakpoints

### Responsive
- Mobile-first (375×812 verified)
- Tablet (768×1024)
- Desktop (1440×900 verified)

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI primitives |
| Icons | lucide-react |
| Toasts | sonner |
| Theme | next-themes |
| Fonts | next/font (Playfair Display, Geist Sans, Geist Mono) |

## Getting Started

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build
bun run start    # run production server
```

## Demo Coupons
- `AURIC10` — 10% off
- `WELCOME15` — 15% off
- `LAUNCH` — 20% off

## Demo Credentials
Sign in is simulated — any email/password works. After placing an order you become a "verified buyer" and can submit reviews.

## Project Structure

```
src/
├── app/                  # Next.js App Router (globals.css, layout.tsx, page.tsx)
├── views/                # All page views (lazy-loaded, 18 files)
├── components/
│   ├── providers/        # AppProviders + AppShell
│   ├── layout/           # Navbar, Footer, AnnouncementBar, StickyPurchaseBar, GoToTopButton
│   ├── cart/             # CartDrawer
│   ├── common/           # Breadcrumbs, RatingStars, SectionHeading, SearchOverlay
│   └── ui/               # shadcn/ui components
├── contexts/             # Router, Language, Cart, Wishlist, Auth contexts
├── hooks/
└── lib/                  # data.ts (all content) + utils.ts
```

## Customization

- **Product / Reviews / FAQs / Policies**: edit `src/lib/data.ts`
- **Brand colors**: edit `src/app/globals.css` (`:root` and `.dark` blocks)
- **Translations**: edit `src/contexts/language-context.tsx`
- **Images**: replace Unsplash URLs in `src/lib/data.ts`

## Production Ready

- TypeScript: 0 errors (strict mode)
- Next.js production build: passes
- ESLint: passing (only known React 19 setState-in-effect warnings for localStorage hydration)
- Hydration-safe (no SSR/CSR mismatches)
- Mobile responsive (375×812 verified)
- Desktop responsive (1440×900 verified)
- RTL Arabic layout verified
- Dark mode verified
- All 35+ routes verified working

## License
Commercial template. Use freely in your projects.

Built with care in Copenhagen.
