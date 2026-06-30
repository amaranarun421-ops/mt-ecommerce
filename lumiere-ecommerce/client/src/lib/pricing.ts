// Pricing constants — kept in sync with server config (single source of truth)
export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_SHIPPING_RATE = 6.95;

export function calculatePricing(opts: {
  subtotal: number;
  discount?: number;
}) {
  const subtotal = Math.max(0, opts.subtotal);
  const discount = Math.min(opts.discount ?? 0, subtotal);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * TAX_RATE * 100) / 100;
  const shipping = taxable === 0 ? 0 : taxable >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = Math.round((taxable + tax + shipping) * 100) / 100;
  return { subtotal, discount, tax, shipping, total };
}
