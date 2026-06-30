import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Sustainability',
  description: 'FSC-certified woods, OEKO-TEX textiles, vegetable-tanned leather, lead-free ceramics, and a full annual materials report.',
}

export default function SustainabilityPage() {
  return (
    <PolicyPage
      title="Sustainability"
      description="We don't use the word 'sustainable' lightly. Here's what we actually do — and what we publish — to back it up."
      lastUpdated="June 2026"
      cta={{ href: '/about', label: 'Read our full story' }}
      sections={[
        {
          heading: 'Our materials',
          body: [
            'Every material we use is chosen for longevity first, then for environmental impact. We do not use veneer over MDF in load-bearing furniture, formaldehyde-glued plywoods in casework, or chrome-tanned leathers. Here is what we use instead:',
          ],
          bullets: [
            'Wood: FSC-certified solid hardwoods (oak, walnut, ash, teak) from forests in North America and Europe. No rainforest woods. No MDF in load-bearing applications.',
            'Textiles: OEKO-TEX Standard 100 certified cottons, linens, and Tencel. Solution-dyed acrylic (Sunbrella) for outdoor use. No PFAS, no flame-retardant chemicals.',
            'Leather: 100% vegetable-tanned, sourced from a tannery in León, Spain that is Gold-rated by the Leather Working Group. No chrome tanning, no formaldehyde.',
            'Ceramics: Lead-free glazes, made from regional clays. High-fired (1240°C+) for vitreous, watertight pieces that don\'t absorb stains.',
            'Metals: Powder-coated steel and aluminum (low-VOC powders, no PFAS). Solid brass. 316 stainless steel for outdoor hardware.',
            'Cookware: Sand-cast iron from a Tennessee foundry that runs on hydroelectric power.',
            'Packaging: 100% recyclable — recycled pulp inserts, recycled paper wrap, water-based inks, no styrofoam, no plastic windows.',
          ],
        },
        {
          heading: 'Our workshops',
          body: [
            'We work with 32 family-run workshops in Portugal, Japan, Spain, India, and the United States. Every workshop is visited at least once a year by a member of our team. We pay our workshops a living wage — in Portugal, for example, our weavers earn 35% above the local average. We do not work with workshops that use child labor, forced labor, or subcontract to undocumented facilities.',
            'We publish a full workshop list (with addresses and craft specialization) in our annual materials report. No anonymized supply chain — we tell you exactly who makes your stuff.',
          ],
        },
        {
          heading: 'Product longevity',
          body: [
            'The most sustainable product is the one you don\'t have to replace. Our furniture frames carry a 10-year warranty; our cast iron cookware carries a lifetime warranty. We stock replacement cushions, shades, hardware, and legs for every product we currently sell — and for many we no longer make. If something breaks, we fix it.',
            'Our designs are intentionally unfashionable — quiet silhouettes, neutral palettes, no trend-driven details. The goal is for a piece you buy today to look as good in 2036 as it does now.',
          ],
        },
        {
          heading: 'Carbon footprint',
          body: [
            'We measure the carbon footprint of every product we sell, from raw material extraction through delivery to your door. The average Aurelia product has a footprint of 28 kg CO2e — well below the industry average for furniture (60 kg CO2e). We offset 100% of our carbon footprint through verified reforestation projects in the Brazilian Atlantic Forest.',
            'For international orders, sea freight is the default (4–6 weeks). Air freight is available on request but discouraged — it adds approximately 8x the carbon footprint.',
          ],
        },
        {
          heading: 'Packaging',
          body: [
            'All our packaging is 100% recyclable. We use recycled pulp inserts (molded to fit each product), recycled paper wrap, water-based inks, and paper tape. We do not use styrofoam, plastic windows, or plastic bubble wrap. Our cartons are made from 80% post-consumer recycled content.',
            'Furniture ships in modular cartons designed to be repurposed — many customers use them for moving, storage, or kids\' playhouses.',
          ],
        },
        {
          heading: 'End of life',
          body: [
            'We design for repair, not replacement. But when a product does reach the end of its life, we want it to be recyclable. Our furniture is held together with screws and bolts, not glue — so it can be disassembled and the materials separated. Wood, metal, and most textiles can be recycled through your local municipality.',
            'We will take back any Aurelia product at end of life, free of charge, in the contiguous US. We will either refurbish it (and donate it to a local housing nonprofit) or break it down for recycling. Contact us to arrange a pickup.',
          ],
        },
        {
          heading: 'Our annual report',
          body: [
            'Every January we publish a full materials and sourcing report. It includes: a list of every workshop we work with (with addresses), the average wage at each workshop, the total carbon footprint of our operations, the volume of materials we used by category, and our goals for the coming year. It is available as a free PDF — we don\'t gate it behind an email signup.',
          ],
        },
      ]}
    />
  )
}
