import { PolicyPage } from '@/components/common/policy-page'

export const metadata = {
  title: 'Size Guide',
  description: 'Furniture dimensions, sheet sizing, towel GSM, and clothing measurements — everything you need to choose the right size the first time.',
}

export default function SizeGuidePage() {
  return (
    <PolicyPage
      title="Size Guide"
      description="Choose the right size the first time. If you're between sizes or unsure, contact our studio team — we'll help you decide."
      lastUpdated="June 2026"
      cta={{ href: '/contact', label: 'Ask us about sizing' }}
      sections={[
        {
          heading: 'Bedding sizes',
          body: [
            'Our bedding is sized to standard US mattress dimensions. The fitted sheets have 38 cm (15") deep pockets to fit pillow-top and hybrid mattresses.',
          ],
          bullets: [
            'Twin: 99 × 191 cm (39 × 75") — fits a standard twin mattress.',
            'Twin XL: 99 × 203 cm (39 × 80") — common in dorm rooms.',
            'Full / Double: 137 × 191 cm (54 × 75").',
            'Queen: 152 × 203 cm (60 × 80") — the most common US size.',
            'King: 198 × 203 cm (76 × 80").',
            'California King: 183 × 213 cm (72 × 84") — 4" narrower and 4" longer than a standard King.',
            'Pillowcases: Standard 51 × 76 cm (20 × 30"), King 51 × 91 cm (20 × 36").',
          ],
        },
        {
          heading: 'Towel GSM and sizing',
          body: [
            'GSM (grams per square meter) measures towel density. Higher GSM means a thicker, plusher towel; lower GSM means a lighter, faster-drying towel. Our bath towels are 650 GSM — the sweet spot for everyday use.',
          ],
          bullets: [
            'Washcloth: 33 × 33 cm (13 × 13") — for face and hands.',
            'Hand towel: 40 × 70 cm (16 × 28") — for the bathroom.',
            'Bath towel: 70 × 140 cm (28 × 56") — the standard bath size.',
            'Bath sheet: 90 × 150 cm (36 × 60") — for full-body coverage.',
          ],
        },
        {
          heading: 'Cookware sizing',
          body: [
            'For skillets and pans, the diameter is measured at the top rim. The base (cooking surface) is typically 4 cm smaller than the top diameter. Choose a size based on how many people you typically cook for:',
          ],
          bullets: [
            '20 cm (8") skillet: 1–2 servings. Best for eggs, single steaks, sauces.',
            '24 cm (9.5") skillet: 2–3 servings. The most versatile size for a small household.',
            '28 cm (11") skillet: 3–4 servings. Our recommended size for most households.',
            '32 cm (12.5") skillet: 4–6 servings. For families and entertaining.',
            'Stockpot: 8 L for 4 servings, 12 L for 6–8 servings.',
          ],
        },
        {
          heading: 'Tableware sizing',
          body: [
            'Our Lune tableware is sized to be generous without being oversized. All pieces are dishwasher, microwave, and oven safe to 220°C.',
          ],
          bullets: [
            'Dinner plate: 27 cm (10.5") diameter.',
            'Salad / side plate: 21 cm (8.25") diameter.',
            'Bowl: 18 cm (7") diameter, 600 ml capacity — for pasta, soup, ramen, or grain bowls.',
            'Mug: 300 ml capacity.',
          ],
        },
        {
          heading: 'Furniture measurements',
          body: [
            'Furniture dimensions are listed on every product page under "Specifications". Always measure your space (and your doorways and stairwells) before ordering furniture — a 90 cm clearance is the safe minimum for most pieces.',
            'For seating, the key measurements are overall width (will it fit in your space), seat height (will your feet touch the floor), and arm height (will it fit under a desk or table). For tables, measure both the top and the base — the base dimensions determine how many chairs fit comfortably.',
          ],
        },
        {
          heading: 'Lighting measurements',
          body: [
            'For pendant lights, the bottom of the fixture should sit 75–90 cm above a dining table, and at least 2.1 m (7\') above the floor in walkways. The fixture diameter should be about half the width of the table.',
            'For floor lamps, the bottom of the shade should sit at eye level when you\'re seated — typically 140–150 cm from the floor for a reading chair.',
          ],
        },
        {
          heading: 'Rug sizing',
          body: [
            'For living rooms, choose a rug large enough that at least the front legs of all seating pieces sit on it. A 240 × 300 cm rug is the right size for most living rooms; a 300 × 400 cm rug is better for large sectionals.',
            'For dining rooms, the rug should extend at least 60 cm beyond the table on all sides so chairs stay on the rug when pulled out. A 240 × 300 cm rug fits a 6-seat table; a 300 × 400 cm rug fits an 8-seat table.',
            'For bedrooms, a 240 × 300 cm rug under a queen bed (positioned to extend 60 cm beyond the foot of the bed) is the most common choice.',
          ],
        },
        {
          heading: 'Leather goods',
          body: [
            'For bags, consider what you carry daily. The Atelier tote fits a 15" laptop, a water bottle, a paperback, and a small notebook — but it will not fit a yoga mat or a change of clothes.',
            'For wallets, count your cards. The bifold holds 8 cards plus cash; if you carry more than 10 cards, consider a cardholder instead.',
          ],
        },
      ]}
    />
  )
}
