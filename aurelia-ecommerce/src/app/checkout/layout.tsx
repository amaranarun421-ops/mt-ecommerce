import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Securely complete your Aurelia order.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
