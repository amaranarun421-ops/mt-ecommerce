import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Aurelia about page — premium home, decor & lifestyle.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
