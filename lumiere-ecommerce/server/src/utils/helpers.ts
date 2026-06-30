export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LUM-${y}${m}${d}-${rand}`;
}

export function formatCurrency(amount: number, currency = "USD", symbol = "$"): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export function calculatePricing(opts: {
  subtotal: number;
  discount?: number;
  taxRate?: number;
  shipping?: number;
  freeShippingThreshold?: number;
  flatShippingRate?: number;
}) {
  const subtotal = Math.max(0, opts.subtotal);
  const discount = Math.min(opts.discount ?? 0, subtotal);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * (opts.taxRate ?? 0.08) * 100) / 100;
  let shipping = opts.shipping ?? 0;
  if (opts.freeShippingThreshold !== undefined && opts.flatShippingRate !== undefined) {
    shipping = taxable >= opts.freeShippingThreshold || taxable === 0 ? 0 : opts.flatShippingRate;
  }
  const total = Math.round((taxable + tax + shipping) * 100) / 100;
  return { subtotal, discount, tax, shipping, total };
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
