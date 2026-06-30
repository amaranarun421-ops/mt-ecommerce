import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Your Aurelia order has been placed.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
