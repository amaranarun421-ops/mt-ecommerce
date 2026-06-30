import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface StaticPageProps {
  title: string;
  description: string;
  canonical: string;
  sections: { heading: string; body: string[] }[];
}

export function StaticPage({ title, description, canonical, sections }: StaticPageProps) {
  return (
    <>
      <Seo title={title} description={description} canonical={canonical} />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} className="mb-6" />
        <article className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="space-y-8">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display text-xl font-semibold mb-3">{section.heading}</h2>
                {section.body.map((p, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed mb-3">{p}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}

export default function ShippingPolicyPage() {
  return (
    <StaticPage
      title="Shipping Policy"
      description="Learn about Lumière's shipping options, delivery times, and white-glove delivery for furniture."
      canonical="/shipping"
      sections={[
        { heading: "Standard shipping", body: [
          "Standard shipping is free on all orders over $75 within the contiguous United States. Orders below $75 ship for a flat rate of $6.95.",
          "Standard orders are processed within 1–3 business days and arrive within 3–5 business days after shipping. You'll receive a tracking number by email as soon as your order ships.",
        ]},
        { heading: "Express shipping", body: [
          "Express shipping is available for an additional $15. Orders placed by 2pm Pacific Time ship the same business day and arrive within 2 business days.",
          "Express shipping is not available for furniture or other oversized items that require white-glove delivery.",
        ]},
        { heading: "Furniture & white-glove delivery", body: [
          "Furniture pieces are made-to-order and ship in 2–3 weeks. We include complimentary white-glove delivery within the contiguous US — our delivery team will bring the piece into your home, place it where you'd like, and remove all packaging.",
          "You'll receive a call from our delivery partner to schedule a 4-hour window that works for you. Someone 18 or older must be present to accept delivery.",
        ]},
        { heading: "International shipping", body: [
          "We currently ship to the United States and Canada. Canadian orders may be subject to duties and taxes at the border, which are the recipient's responsibility.",
          "We're working on expanding to additional countries. Sign up for our newsletter to be notified when we ship to your region.",
        ]},
        { heading: "Order tracking", body: [
          "Once your order ships, you'll receive an email with a tracking number. You can also view all your orders and their current status by signing in to your account and visiting the Orders page.",
          "For furniture deliveries, our team will reach out directly to schedule a delivery window.",
        ]},
        { heading: "Shipping delays", body: [
          "We do our best to meet the estimated delivery windows, but occasionally carriers experience delays outside our control. If your order is significantly delayed, please contact us and we'll help track it down.",
          "During peak holiday seasons (November–December), standard shipping may take an additional 1–2 business days.",
        ]},
      ]}
    />
  );
}
