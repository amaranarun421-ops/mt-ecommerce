import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review the items in your Aurelia cart and proceed to checkout.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
