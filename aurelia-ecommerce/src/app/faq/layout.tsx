import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Faq',
  description: 'Aurelia faq page — premium home, decor & lifestyle.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
