import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Aurelia contact page — premium home, decor & lifestyle.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
