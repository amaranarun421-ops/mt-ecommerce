import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Return Policy',
  description: '30-day returns, no questions asked. Free return shipping in the contiguous US. Made-to-order and personalized items are final sale.',
}

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Return Policy"
      description="We want you to love what you buy. If you don't, send it back within 30 days for a full refund."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Start a return or ask a question' }}
      sections={[
        {
          heading: '30-day return window',
          body: [
            'You have 30 days from the delivery date to return most items for a full refund. The 30-day clock starts the day the package is delivered, not the day you ordered. If your order arrives in multiple shipments, each shipment has its own 30-day window.',
            'Items must be in their original condition — unused, unwashed, with all tags attached and in the original packaging where applicable. Items that show signs of use beyond what would be expected from a careful in-home trial may be subject to a restocking fee of up to 25%.',
          ],
        },
        {
          heading: 'How to start a return',
          body: [
            'Returns are simple. Here\'s the process:',
          ],
          bullets: [
            'Sign in to your account and go to Orders.',
            'Find the order you want to return and tap "Start a return".',
            'Select the items and the reason for return. We use this to improve our products, not to deny returns.',
            'We will email you a prepaid return label within one business day. Drop the package at any UPS location.',
            'Once we receive and inspect your return at our warehouse (typically 3–5 business days after you ship), we will issue the refund within 48 hours to your original payment method.',
          ],
        },
        {
          heading: 'Free return shipping',
          body: [
            'Return shipping is free in the contiguous United States for all stock items. We include a prepaid UPS label with every return authorization. For international orders, return shipping is the customer\'s responsibility.',
            'For furniture and oversized items, we arrange freight pickup at no charge. The carrier will call you to schedule a 4-hour pickup window.',
          ],
        },
        {
          heading: 'Final sale items',
          body: [
            'The following items are final sale and cannot be returned:',
          ],
          bullets: [
            'Made-to-order furniture (the Mason dining table in any size, the Tundra marble coffee table in any size, and any custom-fabric Aalto sofa configuration)',
            'Personalized items (monogrammed leather goods, custom-cut rugs, custom-finish lighting)',
            'Clearance items (marked "Final Sale" on the product page)',
            'Gift cards (digital and physical)',
            'Items returned outside the 30-day window',
          ],
        },
        {
          heading: 'Refund timing',
          body: [
            'Once we receive your return at our warehouse, we inspect it and issue the refund within 48 hours. The refund goes back to your original payment method and usually appears on your statement within 3–5 business days for credit cards, or 1–2 business days for PayPal and Affirm.',
            'Shipping charges are non-refundable unless the return is the result of our error (we shipped the wrong item, the item arrived damaged, etc.).',
          ],
        },
        {
          heading: 'Exchanges',
          body: [
            'We do not offer direct exchanges. If you want a different size, color, or product, please return the original item for a refund and place a new order for the replacement. This is faster than waiting for us to process an exchange.',
          ],
        },
        {
          heading: 'Damaged or defective items',
          body: [
            'If your item arrives damaged or develops a defect within the warranty period, contact us immediately. We will send a replacement at no charge and arrange for the defective item to be picked up — no return shipping cost to you. See our warranty page for full coverage details.',
          ],
        },
      ]}
    />
  )
}
