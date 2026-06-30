import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long will my order take to arrive?", a: "Standard orders ship within 1–3 business days and arrive in 3–5 business days. Express orders (placed by 2pm PT) arrive in 2 business days. Furniture made-to-order ships in 2–3 weeks via white-glove delivery." },
      { q: "Do you ship internationally?", a: "We currently ship within the United States and Canada. We're working on expanding to additional countries — sign up for our newsletter to be notified." },
      { q: "How much does shipping cost?", a: "Standard shipping is free on orders over $75. Below that, shipping is a flat $6.95. Express shipping is $15 extra. White-glove furniture delivery is included in the price." },
      { q: "Can I track my order?", a: "Yes! Once your order ships, you'll receive an email with tracking. You can also view all orders and tracking numbers from your account page." },
      { q: "Can I change or cancel my order?", a: "If your order hasn't shipped yet, we can usually cancel or modify it. Sign in to your account and click 'Cancel Order' on the order detail page, or contact us immediately." },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What's your return policy?", a: "We accept returns on unused items in their original packaging within 30 days of delivery. Made-to-order furniture is final sale unless damaged in transit." },
      { q: "How do I start a return?", a: "Sign in to your account, find the order, and click 'Request Return'. We'll send a prepaid return label within 24 hours. Refunds process in 3–5 business days after we receive the item." },
      { q: "Can I exchange an item?", a: "Yes — start a return as above and place a new order for the item you want. This is faster than waiting for an exchange to process." },
      { q: "What if my item arrives damaged?", a: "We're so sorry. Contact us within 7 days of delivery with photos and we'll send a replacement at no cost, or issue a full refund." },
    ],
  },
  {
    category: "Products & Materials",
    items: [
      { q: "Are your materials sustainable?", a: "We source FSC-certified woods, vegetable-tanned leather, and natural fibers whenever possible. Our packaging is plastic-free and recyclable. Each product page lists its specific materials." },
      { q: "Do you offer a warranty?", a: "All furniture comes with a 10-year structural warranty on frames. Lighting and electronics carry a 2-year warranty. Smaller items have a 1-year warranty against manufacturing defects." },
      { q: "Can I see products in person?", a: "We're online-only for now, but our product pages include detailed photos, dimensions, and material specs. We also offer free fabric and finish swatches — contact us to request them." },
      { q: "Do you make custom pieces?", a: "We don't offer full custom work, but many of our furniture pieces can be ordered in different fabrics or finishes. Contact us with what you have in mind." },
    ],
  },
  {
    category: "Account & Payment",
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and PayPal. We also offer buy-now-pay-later through Affirm on orders over $200." },
      { q: "Is my payment information secure?", a: "Yes — all payments are processed through PCI-compliant payment processors. We never see or store your credit card details." },
      { q: "Do you offer gift cards?", a: "Yes! Gift cards are available in amounts from $50 to $1,000 and are delivered via email within 24 hours of purchase. They never expire." },
      { q: "How do I update my account info?", a: "Sign in and go to Account → Profile to update your name, phone, and password. To change your email, contact support." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common questions about orders, shipping, returns, products, and accounts at Lumière."
        canonical="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.flatMap((c) =>
            c.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            }))
          ),
        }}
      />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} className="mb-6" />
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Frequently asked questions</h1>
            <p className="mt-2 text-muted-foreground">Can't find what you're looking for? <a href="/contact" className="text-primary hover:underline">Contact us</a>.</p>
          </div>

          {FAQS.map((section, idx) => (
            <div key={idx} className="mb-10">
              <h2 className="font-display text-xl font-semibold mb-4">{section.category}</h2>
              <Accordion items={section.items.map((item, i) => ({
                value: `${idx}-${i}`,
                trigger: item.q,
                children: <p className="leading-relaxed">{item.a}</p>,
              }))} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
