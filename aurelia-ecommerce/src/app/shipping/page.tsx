import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Shipping Policy',
  description: 'Free express shipping on orders over $99 in the contiguous US. International shipping available to Canada, UK, EU, AU, and JP.',
}

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      description="Everything you need to know about how we ship, where we ship, and how long it takes."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Contact us about shipping' }}
      sections={[
        {
          heading: 'Free shipping threshold',
          body: [
            'We offer free standard shipping on all orders over $99 within the contiguous United States. Orders under $99 ship for a flat $9. There is no minimum order value — if you want a single $12 candle, we will ship it.',
            'Free shipping applies to the shipping cost only. It does not apply to white-glove delivery, express shipping, or international orders. The free-shipping threshold is calculated after any coupon codes are applied.',
          ],
        },
        {
          heading: 'Processing time',
          body: [
            'In-stock items ship within 1–2 business days from our New Jersey warehouse. Orders placed before 11am ET on a business day typically ship the same day. Orders placed on weekends or holidays ship the next business day.',
            'Made-to-order furniture (the Mason dining table, the Cantilever floor lamp, and any custom-fabric upholstery) ships in 4–6 weeks. The product page will show the lead time clearly. We will email you a tracking number the moment any item leaves the workshop.',
          ],
        },
        {
          heading: 'Domestic delivery times',
          body: [
            'Once your order ships, delivery times depend on your location and the items in your order.',
          ],
          bullets: [
            'Standard shipping: 3–5 business days to most US addresses.',
            'Express shipping: 1–2 business days. $24 flat rate, regardless of order size.',
            'White-glove delivery: 7–14 business days from shipment. Included free on furniture orders over $1,500 in the contiguous US; $149 otherwise. Includes a 2-person team, room of choice, full assembly, and packaging removal.',
            'Furniture and oversized items ship via freight carrier. The carrier will call you 24 hours in advance to schedule a 4-hour delivery window.',
          ],
        },
        {
          heading: 'International shipping',
          body: [
            'We ship to Canada, the United Kingdom, the European Union, Australia, and Japan. International orders are duties-paid — the price you see at checkout includes all import duties, taxes, and brokerage fees. There are no surprises on delivery.',
            'Most international orders arrive in 7–14 business days. Furniture ships via freight and takes 3–5 weeks. We currently do not ship to PO boxes, APO/FPO addresses, or freight forwarders.',
          ],
        },
        {
          heading: 'Order tracking',
          body: [
            'As soon as your order ships you will receive an email with a tracking link. For white-glove deliveries, the carrier will call you 24 hours in advance to schedule a 4-hour window. You can also track every order from the Orders page in your account.',
          ],
        },
        {
          heading: 'Damaged or lost shipments',
          body: [
            'If your order arrives damaged, please contact us within 48 hours of delivery with photos of the damage and the original packaging. We will send a replacement at no charge and arrange for the damaged item to be picked up.',
            'If your order is marked as delivered but you cannot find it, please check with neighbors and building management first, then contact us within 5 business days. We will work with the carrier to file a trace and either locate the package or send a replacement.',
          ],
        },
        {
          heading: 'Address changes',
          body: [
            'You can change the shipping address on your order within 2 hours of placing it — go to your account, find the order, and tap "Request change". After 2 hours the order enters our fulfillment queue and address changes are no longer possible. You can always return the items for a full refund once they arrive.',
          ],
        },
      ]}
    />
  )
}
