import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your Aurelia account — profile, orders, addresses, and settings.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
