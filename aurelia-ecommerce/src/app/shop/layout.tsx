import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop all products',
  description:
    'Browse the full Aurelia collection — furniture, decor, kitchenware, lighting, bedding, fragrance, accessories and outdoor pieces. Free shipping over $99, 30-day returns.',
  alternates: { canonical: '/shop' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
