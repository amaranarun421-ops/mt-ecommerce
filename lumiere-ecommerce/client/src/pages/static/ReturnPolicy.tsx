import { StaticPage } from "./ShippingPolicy";

export default function ReturnPolicyPage() {
  return (
    <StaticPage
      title="Return Policy"
      description="Lumière's 30-day return policy — how to start a return, what's eligible, and refund timelines."
      canonical="/returns"
      sections={[
        { heading: "30-day returns", body: [
          "We want you to love everything you buy from Lumière. If you're not satisfied with your purchase, you can return it within 30 days of delivery for a full refund.",
          "Items must be unused, in their original packaging, and in the same condition you received them. Made-to-order furniture is final sale unless damaged in transit.",
        ]},
        { heading: "How to start a return", body: [
          "Sign in to your account, go to Orders, find the order you'd like to return, and click 'Request Return'. Tell us why you're returning the item — this helps us improve.",
          "We'll email you a prepaid return label within 24 hours (Monday–Friday). Drop the package off at any UPS or USPS location. Return shipping is free for orders over $75; for smaller orders, a $6.95 return fee will be deducted from your refund.",
        ]},
        { heading: "Refund timeline", body: [
          "Once we receive your return at our warehouse, we'll inspect it and issue a refund within 3–5 business days. Refunds go back to your original payment method.",
          "You'll receive an email confirmation when your refund has been processed. Your bank may take an additional 3–7 business days to post the refund to your account.",
        ]},
        { heading: "Exchanges", body: [
          "We don't process direct exchanges. To exchange an item, start a return for the original item and place a new order for what you'd like instead. This is faster than waiting for an exchange to process.",
        ]},
        { heading: "Damaged or defective items", body: [
          "If your item arrives damaged or defective, please contact us within 7 days of delivery with photos of the damage. We'll send a replacement at no cost to you, or issue a full refund — your choice.",
          "For furniture, inspect the piece carefully upon delivery. If you notice any damage, note it on the delivery receipt before the driver leaves, then contact us within 24 hours.",
        ]},
        { heading: "Non-returnable items", body: [
          "Made-to-order furniture, custom-cut rugs, clearance items, and gift cards are final sale and cannot be returned.",
          "Bedding that has been removed from its original packaging cannot be returned for hygiene reasons, unless defective.",
        ]},
      ]}
    />
  );
}
