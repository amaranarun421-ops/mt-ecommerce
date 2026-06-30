import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Trade Program',
  description: 'Designers, architects, and trade professionals get 20% off every order, dedicated account management, and exclusive trade-only products.',
}

export default function TradeProgramPage() {
  return (
    <PolicyPage
      title="Trade Program"
      description="For interior designers, architects, stylists, and hospitality specifiers. Get 20% off every order, dedicated account management, and exclusive trade-only products."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Apply for the trade program' }}
      sections={[
        {
          heading: 'Who qualifies',
          body: [
            'Our trade program is open to professionals who specify furniture, decor, or kitchenware as part of their work. This includes:',
          ],
          bullets: [
            'Interior designers and decorators with a valid resale certificate or business license.',
            'Architects and architectural designers specifying for residential or hospitality projects.',
            'Set designers, prop stylists, and production designers working in film, TV, or advertising.',
            'Hospitality specifiers — hotel groups, restaurant groups, and boutique hospitality groups.',
            'Real estate stagers working with brokerage firms or as independent contractors.',
            'Retail buyers for design-led boutiques and concept stores.',
          ],
        },
        {
          heading: 'Trade program benefits',
          body: [
            'Trade members receive:',
          ],
          bullets: [
            '20% off every order, with no minimum. Applies to all stock items and most made-to-order pieces.',
            'Dedicated account manager — your direct line to a real person in our Brooklyn studio.',
            'Free fabric and finish swatches, shipped within 2 business days.',
            'Net-30 payment terms on approved credit (US trade accounts only).',
            'Trade-only products and finishes not available on our consumer site.',
            'Exclusive trade pricing on samples and floor models.',
            'Priority white-glove delivery in select metros.',
            'Early access to new collections, before they launch to consumers.',
            'Custom CAD files (DWG, SketchUp) for every furniture piece we sell.',
            'Co-marketing opportunities — we feature trade projects in our journal and social channels.',
          ],
        },
        {
          heading: 'How to apply',
          body: [
            'Apply online in about 5 minutes. You\'ll need:',
          ],
          bullets: [
            'Your business name and address.',
            'Your resale certificate or business license (PDF upload).',
            'Your professional website or portfolio (Instagram counts if it\'s a design account).',
            'Two recent projects you\'ve specified furniture for (description only, no photos required).',
            'Your estimated annual purchase volume (we use this for forecasting, not to gate access).',
          ],
        },
        {
          heading: 'Application timeline',
          body: [
            'We review trade applications within 2 business days. We may reach out to verify your business — typically just a phone call to confirm you\'re a real person with a real practice. Once approved, you\'ll receive a welcome email with your trade login (separate from your consumer account, if you have one) and your account manager\'s direct contact info.',
            'If your application is declined, we\'ll tell you why. Common reasons: incomplete documentation, business outside our service categories, or applications from non-trade accounts.',
          ],
        },
        {
          heading: 'Using your trade discount',
          body: [
            'Once approved, sign in to your trade account and shop as normal — the 20% discount is automatically applied at checkout. The discount applies to the product price only; it does not apply to shipping, white-glove delivery, or sales tax. The discount may not be combined with other coupon codes or sale pricing.',
            'For made-to-order pieces (the Mason dining table, custom-fabric Aalto configurations, custom Halten outdoor), the trade discount is 15% — slightly lower because these pieces already have tight margins.',
          ],
        },
        {
          heading: 'Net-30 terms',
          body: [
            'US trade accounts in good standing for at least 6 months can apply for Net-30 payment terms. Approved accounts can place orders without paying at the time of purchase — we invoice you, and you pay within 30 days. Net-30 terms require a credit application and a personal guarantee. Contact your account manager to apply.',
          ],
        },
        {
          heading: 'Trade-only products',
          body: [
            'We offer a small selection of trade-only products not available on our consumer site. These include commercial-grade upholstery fabrics (Martindale 100,000+ rubs), contract-grade case goods (FSC-certified, CARB Phase 2 compliant), and hospitality-grade tableware (thicker rims, restaurant-grade glazes). Your account manager can share the full catalog.',
          ],
        },
      ]}
    />
  )
}
