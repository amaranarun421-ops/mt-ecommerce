import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift-Cards',
  description: 'Aurelia gift-cards page — premium home, decor & lifestyle.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
