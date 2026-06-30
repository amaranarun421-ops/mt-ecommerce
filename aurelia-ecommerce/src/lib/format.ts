export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso))
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}
