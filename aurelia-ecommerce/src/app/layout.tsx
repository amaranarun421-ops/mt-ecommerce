import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StoreHydration } from "@/components/providers/store-hydration";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { WishlistDrawer } from "@/components/layout/wishlist-drawer";
import { QuickViewModal } from "@/components/layout/quick-view-modal";
import { NewsletterModal } from "@/components/layout/newsletter-modal";
import { MobileStickyBar } from "@/components/layout/mobile-sticky-bar";
import { MobileMenuSheet } from "@/components/layout/mobile-menu-sheet";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://aurelia-store.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aurelia — Premium Home, Decor & Lifestyle",
    template: "%s · Aurelia",
  },
  description:
    "Aurelia is a premium lifestyle destination for thoughtfully designed furniture, home decor, kitchenware and personal accessories. Free shipping over $99, 30-day returns, and lifetime support.",
  keywords: [
    "premium home decor",
    "modern furniture",
    "lifestyle store",
    "kitchenware",
    "Aurelia",
    "design-led homeware",
    "sustainable furniture",
  ],
  authors: [{ name: "Aurelia Studio" }],
  creator: "Aurelia Studio",
  publisher: "Aurelia Studio",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aurelia — Premium Home, Decor & Lifestyle",
    description:
      "Thoughtfully designed furniture, decor, kitchenware and accessories. Free shipping over $99, 30-day returns.",
    url: siteUrl,
    siteName: "Aurelia",
    images: [
      {
        url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Aurelia — premium home & lifestyle",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurelia — Premium Home, Decor & Lifestyle",
    description:
      "Thoughtfully designed furniture, decor, kitchenware and accessories.",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "Aurelia",
              url: siteUrl,
              logo: `${siteUrl}/logo.svg`,
              description:
                "Premium lifestyle destination for furniture, decor, kitchenware and accessories.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "221 Mason Street",
                addressLocality: "Brooklyn",
                addressRegion: "NY",
                postalCode: "11201",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-800-555-0142",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: ["English"],
              },
              sameAs: [
                "https://www.instagram.com/aurelia",
                "https://www.pinterest.com/aurelia",
                "https://www.facebook.com/aurelia",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreHydration />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <WishlistDrawer />
          <SearchOverlay />
          <QuickViewModal />
          <NewsletterModal />
          <MobileStickyBar />
          <MobileMenuSheet />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
