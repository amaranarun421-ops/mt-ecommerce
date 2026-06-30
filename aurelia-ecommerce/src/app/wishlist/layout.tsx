import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'The Aurelia pieces you\'ve saved for later.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
