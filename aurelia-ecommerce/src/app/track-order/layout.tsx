import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track-Order',
  description: 'Aurelia track-order page — premium home, decor & lifestyle.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
