import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Warranty',
  description: 'Every Aurelia product carries a minimum 2-year warranty. Furniture frames carry 10 years; cast iron cookware carries a lifetime warranty.',
}

export default function WarrantyPage() {
  return (
    <PolicyPage
      title="Warranty"
      description="We stand behind everything we make. Here's exactly what's covered, for how long, and how to make a claim."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Make a warranty claim' }}
      sections={[
        {
          heading: 'Warranty periods by product',
          body: [
            'Every Aurelia product carries a warranty against manufacturing defects. The length of the warranty depends on the product category:',
          ],
          bullets: [
            'Furniture frames (sofas, chairs, tables, beds): 10 years',
            'Furniture cushions and upholstery: 5 years',
            'Cast iron cookware: lifetime',
            'Lighting fixtures (LED integrated): 5 years',
            'Lighting fixtures (bulb replaceable): 2 years',
            'Ceramics and tableware: 2 years',
            'Bedding and bath textiles: 2 years',
            'Leather goods: 5 years',
            'Candles and fragrance: 1 year',
            'Outdoor furniture: 5 years',
          ],
        },
        {
          heading: 'What is covered',
          body: [
            'Our warranty covers manufacturing defects — issues that arise from how the product was made, not how it was used. This includes:',
          ],
          bullets: [
            'Frame failures: cracked, split, or broken wood joints; failed welds on metal frames; broken legs.',
            'Upholstery defects: seam failures, zipper failures, fabric tears not caused by abrasion or puncture.',
            'Cushion failure: foam that loses more than 25% of its original height within the warranty period, or down cushions that no longer loft.',
            'Hardware failures: hinges, drawer slides, casters, levelers that break under normal use.',
            'Finish failures: paint or powder coat that chips or peels without impact; plating that wears through to base metal.',
            'LED failures: integrated LED drivers that fail within the warranty period.',
            'Cast iron: cracking, warping, or pitting under normal use — for the lifetime of the original purchaser.',
          ],
        },
        {
          heading: 'What is NOT covered',
          body: [
            'Our warranty does not cover:',
          ],
          bullets: [
            'Normal wear and tear, including natural patina on leather and brass, fading of fabrics in direct sunlight, and seasoning wear on cast iron.',
            'Damage from misuse, abuse, neglect, accidents, or natural disasters (fire, flood, earthquake).',
            'Damage from improper cleaning, including the use of harsh chemicals, abrasive cleaners, or pressure washers.',
            'Damage from modifications or repairs not performed by us or an authorized partner.',
            'Damage from commercial use (our products are designed for residential use unless stated otherwise).',
            'Cosmetic variations that are part of the handmade nature of the product — slight color variation in ceramics, figure variation in wood, etc.',
            'Products purchased from unauthorized resellers or third-party marketplaces.',
          ],
        },
        {
          heading: 'How to make a warranty claim',
          body: [
            'To make a warranty claim, contact our studio team with the following information:',
          ],
          bullets: [
            'Your order number (found in your order confirmation email or your account page).',
            'A description of the issue, including when it started and how the product has been used.',
            'Photos of the defect, including close-ups and a wider shot showing the product in context.',
            'Your preferred resolution: repair, replacement, or refund.',
          ],
        },
        {
          heading: 'How we resolve claims',
          body: [
            'We will review your claim within 2 business days and respond with one of the following:',
          ],
          bullets: [
            'Repair: we send replacement parts and instructions, or arrange for the item to be returned for repair at our workshop. Free of charge.',
            'Replacement: we send a new item at no charge, and arrange for the defective item to be picked up.',
            'Refund: if repair and replacement are not possible (e.g., the product is discontinued), we will issue a pro-rated refund based on the age of the product.',
            'Denial: if the damage is not covered under warranty, we will explain why and offer to repair the item at a fair price.',
          ],
        },
        {
          heading: 'Lifetime cast iron warranty',
          body: [
            'Our Forge cast iron cookware carries a lifetime warranty against cracking, warping, and pitting under normal household use. This warranty is for the lifetime of the original purchaser and is non-transferable. The seasoning is not covered — it is a wear item that you maintain yourself, like oil in a car.',
            'If your Forge skillet cracks, warps, or pits under normal use, we will replace it free of charge. We may ask for the original skillet back so we can examine the failure mode — prepaid shipping label included.',
          ],
        },
        {
          heading: 'Extended warranty',
          body: [
            'We do not sell extended warranties. We believe the warranty that ships with the product should be enough — if a piece of furniture doesn\'t last 10 years, we don\'t want to charge you extra to fix it. If you have a problem outside the warranty period, contact us anyway — we stock replacement parts for every product we sell, and we will repair your item for the cost of parts and labor.',
          ],
        },
      ]}
    />
  )
}
