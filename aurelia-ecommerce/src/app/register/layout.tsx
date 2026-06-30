import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Join 84,000+ design-led shoppers. Get 10% off your first Aurelia order.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
