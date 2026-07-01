import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/providers/app-providers";
import { AppShell } from "@/components/providers/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AURIC ONE — Premium Wireless Headphones | AURIC Audio",
    template: "%s | AURIC Audio",
  },
  description:
    "The AURIC ONE — handcrafted wireless headphones engineered for studio-grade fidelity, 60-hour battery, adaptive noise cancellation, and lossless Hi-Res audio. Free worldwide shipping, 2-year warranty.",
  keywords: [
    "AURIC ONE",
    "premium headphones",
    "wireless headphones",
    "audiophile",
    "noise cancelling",
    "Hi-Res audio",
    "over-ear headphones",
  ],
  authors: [{ name: "AURIC Audio" }],
  creator: "AURIC Audio",
  publisher: "AURIC Audio",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "AURIC ONE — Premium Wireless Headphones",
    description:
      "Studio-grade fidelity. 60-hour battery. Adaptive ANC. Lossless Hi-Res audio. The headphones that defined a category.",
    url: "https://auric.audio",
    siteName: "AURIC Audio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURIC ONE — Premium Wireless Headphones",
    description:
      "Studio-grade fidelity. 60-hour battery. Adaptive ANC. Lossless Hi-Res audio.",
    creator: "@auricaudio",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0F0E0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
