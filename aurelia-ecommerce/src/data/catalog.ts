// ============================================================================
// Aurelia — Mock catalog data
// Premium lifestyle store: furniture, decor, kitchenware, lighting, bedding,
// bath, fragrance, and accessories. All data is fictional but realistic and
// fully written out — no lorem ipsum anywhere.
// ============================================================================

export interface Category {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  image: string
  heroImage: string
  buyingGuide: string
  faqs: { question: string; answer: string }[]
}

export interface ProductVariant {
  id: string
  name: string
  value: string // size or color name
  swatch?: string // hex for color swatch
  priceDelta?: number
  inStock: boolean
}

export interface ProductReview {
  id: string
  author: string
  avatar?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  categoryId: string
  shortDesc: string
  description: string
  highlights: string[]
  specifications: { label: string; value: string }[]
  price: number
  comparePrice?: number
  cost: number
  images: string[]
  featuredImage: string
  rating: number
  reviewCount: number
  quantity: number
  lowStockThreshold: number
  badges: string[] // "Best Seller", "New", "Limited"
  collection: string
  materials: string
  care: string
  shippingNote: string
  variants: {
    colors?: ProductVariant[]
    sizes?: ProductVariant[]
  }
  faqs: { question: string; answer: string }[]
  reviews: ProductReview[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  location: string
  avatar: string
  rating: number
  content: string
  product: string
}

export interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
}

export interface Coupon {
  code: string
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
  value: number
  minOrder: number
  description: string
  expiry: string
}

export interface Brand {
  id: string
  name: string
  blurb: string
}

// ----------------------------------------------------------------------------
// Categories
// ----------------------------------------------------------------------------

export const categories: Category[] = [
  {
    id: 'cat-furniture',
    name: 'Furniture',
    slug: 'furniture',
    tagline: 'Sculptural pieces for considered living',
    description:
      'Our furniture collection brings together solid-wood craftsmanship, time-tested joinery and a quiet, contemporary silhouette. Each piece is designed to anchor a room and age gracefully — the kind of furniture you hand down rather than replace.',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'Start with the room’s function — lounge, dining, study or bedroom. For seating, measure doorways and stairwells before ordering; a 90 cm clearance is the safe minimum. Choose hardwoods like oak, ash or walnut for longevity, and prefer pieces with mortise-and-tenon or dovetail joints over cam-lock hardware. Upholstery should use high-density foam (1.8 lb or higher) and a kiln-dried frame. If you live in a humid climate, look for kiln-dried solid wood and avoid MDF veneers in load-bearing pieces.',
    faqs: [
      {
        question: 'Is assembly required?',
        answer:
          'Most case goods ship fully assembled. Upholstered seating ships in two pieces (frame and cushions) and requires attaching the legs with the included hex key — about 5 minutes of work.',
      },
      {
        question: 'What is the weight capacity of the sofas?',
        answer:
          'Aurelia sofas are rated to 450 kg distributed load, with a frame warranty of 10 years and a cushion warranty of 5 years.',
      },
      {
        question: 'Can I order fabric swatches?',
        answer:
          'Yes — up to five free swatches per household. Visit the product page and tap “Order free swatch” to select the fabrics you’d like to feel before you buy.',
      },
    ],
  },
  {
    id: 'cat-decor',
    name: 'Decor',
    slug: 'decor',
    tagline: 'Quiet objects with a story',
    description:
      'Vases, sculptures, mirrors and objects that finish a room. We work with small studios in Portugal, Japan and Mexico to source pieces that feel both handmade and architectural — the kind of details guests always reach for.',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'Decor works best in odd-numbered groups of three or five, with varied heights to create rhythm. For shelves, follow the 70/30 rule — 70% books or structural objects, 30% negative space. Choose a single material story per vignette (all ceramic, all wood, all glass) rather than mixing too many finishes, and let one piece be the hero while others support it.',
    faqs: [
      {
        question: 'Are the ceramics food-safe?',
        answer:
          'All glazed ceramics in our collection are lead-free and food-safe. Unglazed terracotta is intended for dry arrangements only.',
      },
      {
        question: 'How do I clean mirrored or brass pieces?',
        answer:
          'For mirrors, use a 50/50 vinegar and water solution with a lint-free cloth. For brass, a dry microfibre cloth is enough day-to-day; use a pea-sized amount of brass polish every six months to keep the patina even.',
      },
    ],
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    tagline: 'Tools that earn their place',
    description:
      'Cookware, tableware and bar tools designed by chefs and made to be used daily. From cast-iron skillets that improve with every meal to porcelain plates that survive the dishwasher and the dinner party.',
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'For cookware, match the pan to the heat source — induction-compatible bases will say so. A 28 cm skillet handles most tasks for a household of four. For tableware, buy open-stock rather than sets so you can replace individual pieces over time, and choose glazes with a matte or speckled finish to hide wear. Avoid porcelain thinner than 2 mm at the rim; it chips easily.',
    faqs: [
      {
        question: 'Is the cookware induction-compatible?',
        answer:
          'All our stainless and cast-iron lines work on induction. Pure aluminum and copper lines are noted as gas/electric only on the product page.',
      },
      {
        question: 'Are the dishes dishwasher and microwave safe?',
        answer:
          'Yes — every tableware piece in the collection is rated for both home dishwashers and microwaves, with the exception of any item with a metallic rim.',
      },
    ],
  },
  {
    id: 'cat-lighting',
    name: 'Lighting',
    slug: 'lighting',
    tagline: 'Set the room’s mood',
    description:
      'Pendants, sconces, floor and table lamps in warm, dimmable tones. We tune every fixture to 2700K and pair it with a CRI 95+ source so colors read true and skin looks human.',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'Plan lighting in three layers: ambient (overall glow), task (reading, cooking), and accent (art, architecture). For dining pendants, the bottom of the fixture should sit 75–90 cm above the table. Choose 2700K–3000K for living spaces and 3500K–4000K for kitchens and bathrooms. Always install dimmable drivers even if you don’t think you’ll use them — they’re cheap insurance.',
    faqs: [
      {
        question: 'Can I use smart bulbs in these fixtures?',
        answer:
          'Yes. All fixtures use standard E26/E27 sockets or integrated LED drivers that work with most smart bulbs. Integrated LED pendants are dimmable on TRIAC or 0–10V dimmers as noted.',
      },
      {
        question: 'Do you sell replacement shades?',
        answer:
          'Replacement shades are available for every fixture we currently sell. Contact support with your order number and we’ll send a quote within one business day.',
      },
    ],
  },
  {
    id: 'cat-bedding',
    name: 'Bedding & Bath',
    slug: 'bedding-bath',
    tagline: 'Softness, considered',
    description:
      'Long-staple cotton, stonewashed linen and breathable Tencel sheets, plus towels woven on traditional looms in Portugal. Built for everyday comfort and a hundred washes without pilling.',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'For sheets, choose long-staple cotton (600–800 thread count is the sweet spot — anything higher is marketing). Linen is the most breathable option for hot sleepers. Buy two sets per bed and rotate weekly. For towels, 600–700 GSM is ideal — below 500 feels thin, above 800 takes too long to dry.',
    faqs: [
      {
        question: 'How should I wash linen sheets?',
        answer:
          'Machine wash cold on a gentle cycle with a pH-neutral detergent. Tumble dry low and remove while slightly damp — linen wrinkles less when it isn’t fully bone-dry.',
      },
      {
        question: 'Do the towels shrink?',
        answer:
          'Expect 4–6% shrinkage after the first wash, which is already accounted for in the cut. Avoid fabric softener — it coats the fibres and reduces absorbency.',
      },
    ],
  },
  {
    id: 'cat-fragrance',
    name: 'Fragrance',
    slug: 'fragrance',
    tagline: 'The final layer of a room',
    description:
      'Hand-poured candles, reed diffusers and room mists made with essential oils and clean-burning waxes. Designed in collaboration with independent perfumers in Grasse and Kyoto.',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'Match scent weight to room size: fresh citrus and green tea for kitchens and bathrooms, woody amber and oud for living rooms, lavender and white musk for bedrooms. For open-plan spaces, choose a candle of 250 g or larger; smaller candles will get lost. Rotate your scent with the seasons — cold weather rewards depth, warm weather rewards lift.',
    faqs: [
      {
        question: 'How long do the candles burn?',
        answer:
          'Our 250 g candles burn for 55–60 hours when properly maintained. Trim the wick to 5 mm before each burn and never burn for more than 4 hours at a time.',
      },
      {
        question: 'Are your fragrances pet-safe?',
        answer:
          'We avoid phthalates, parabens and known pet-toxic essential oils like tea tree and eucalyptus. Even so, we recommend keeping any scented product in a well-ventilated room if you have birds or exotic pets.',
      },
    ],
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    tagline: 'Carry the everyday with intention',
    description:
      'Leather goods, scarves, eyewear and small leather accessories designed in-house and made in family-run workshops. Vegetable-tanned leather, solid brass hardware, and stitching rated to 11 stitches per inch.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'For everyday bags, choose full-grain vegetable-tanned leather — it scratches more easily at first but develops the best patina. Look for solid brass or solid nickel hardware, never plated. Stitching should be locked, not chained, and at least 8 stitches per inch. For eyewear, Mazzucchelli acetate and Zeiss lenses are the industry standard.',
    faqs: [
      {
        question: 'Will the leather age?',
        answer:
          'Yes — that is the point. Vegetable-tanned leather darkens by 1–2 shades over the first year and develops a glassy patina where it is handled most. Avoid prolonged direct sunlight when storing.',
      },
      {
        question: 'Can I have my bag monogrammed?',
        answer:
          'Yes. We offer complimentary blind debossing on most leather goods. Allow an additional 3 business days before shipping.',
      },
    ],
  },
  {
    id: 'cat-outdoor',
    name: 'Outdoor',
    slug: 'outdoor',
    tagline: 'Built for sun, rain and time',
    description:
      'All-weather loungers, planters and outdoor lighting made from powder-coated aluminum, teak and high-density polyethylene wicker. UV-stable, rust-proof and rated for year-round exposure.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    buyingGuide:
      'For frames, powder-coated aluminum is the lowest-maintenance option. Teak will weather to silver-gray within 12 months — that is the desired look, not a defect. For cushions, look for solution-dyed acrylic (Sunbrella or equivalent) and quick-dry foam inserts. Store cushions indoors from November to March in cold climates to extend their life by 3–5 years.',
    faqs: [
      {
        question: 'Do I need to cover the furniture in winter?',
        answer:
          'Frames can stay out year-round, but we recommend covering cushions and bringing them indoors during freezing weather to extend the foam’s life. Custom-fit covers are available for every piece.',
      },
      {
        question: 'How do I clean teak?',
        answer:
          'A soft brush, mild dish soap and water once a season is enough. To restore the original honey colour, use a teak cleaner — never a pressure washer, which lifts the grain.',
      },
    ],
  },
]

// ----------------------------------------------------------------------------
// Helper: review generators
// ----------------------------------------------------------------------------

function review(
  id: string,
  author: string,
  rating: number,
  title: string,
  comment: string,
  date: string,
  helpful = 0,
  verified = true
): ProductReview {
  return {
    id,
    author,
    rating,
    title,
    comment,
    date,
    helpful,
    verified,
    avatar: undefined,
  }
}

// ----------------------------------------------------------------------------
// Products — 24 realistic items across categories
// ----------------------------------------------------------------------------

export const products: Product[] = [
  // FURNITURE ---------------------------------------------------------------
  {
    id: 'p-audio-lounge-chair',
    name: 'Halden Lounge Chair',
    slug: 'halden-lounge-chair',
    sku: 'AUR-FN-HL-001',
    categoryId: 'cat-furniture',
    shortDesc: 'Solid white oak frame with full-grain leather sling seat.',
    description:
      'The Halden lounge chair was developed over eighteen months in our Brooklyn workshop, working alongside a third-generation Danish furniture maker. The frame is built from FSC-certified white oak with mortise-and-tenon joinery and a hand-rubbed natural oil finish that deepens over time. The sling seat is cut from a single hide of full-grain vegetable-tanned leather, supported by a stainless steel rod that distributes weight without sagging. Designed for reading rooms, studies and quiet corners, Halden sits low and leans back at exactly 23 degrees — the angle our test group rated most comfortable for a 90-minute sitting.',
    highlights: [
      'FSC-certified solid white oak frame',
      'Full-grain vegetable-tanned leather sling',
      'Mortise-and-tenon joinery, no metal fasteners in the frame',
      'Stainless steel support rod rated to 180 kg',
      'Hand-rubbed natural oil finish, re-oilable at home',
    ],
    specifications: [
      { label: 'Overall dimensions', value: '78 W × 82 D × 71 H cm' },
      { label: 'Seat height', value: '38 cm' },
      { label: 'Arm height', value: '56 cm' },
      { label: 'Weight', value: '14.5 kg' },
      { label: 'Frame material', value: 'FSC white oak, oil finish' },
      { label: 'Upholstery', value: 'Full-grain vegetable-tanned leather, 2.2 mm' },
      { label: 'Load rating', value: '180 kg distributed' },
      { label: 'Assembly', value: 'Legs attach with hex key, 5 min' },
      { label: 'Country of origin', value: 'Designed in USA, made in Portugal' },
      { label: 'Warranty', value: '10-year frame, 5-year leather' },
    ],
    price: 1290,
    comparePrice: 1490,
    cost: 720,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 214,
    quantity: 18,
    lowStockThreshold: 6,
    badges: ['Best Seller', 'Editor’s Pick'],
    collection: 'Halden',
    materials: 'Solid white oak, full-grain leather, stainless steel',
    care: 'Dust frame weekly with a dry cloth. Re-oil annually with the included oak oil. Condition leather every 6 months with a neutral leather balm.',
    shippingNote: 'Ships in 5–7 business days. White-glove delivery available in select metros at no charge.',
    variants: {
      colors: [
        { id: 'c-oak-natural', name: 'Natural Oak', value: 'Natural', swatch: '#c8a37a', inStock: true },
        { id: 'c-oak-smoked', name: 'Smoked Oak', value: 'Smoked', swatch: '#6b4f3a', inStock: true, priceDelta: 90 },
        { id: 'c-oak-black', name: 'Blackened Oak', value: 'Blackened', swatch: '#2b2622', inStock: true, priceDelta: 140 },
      ],
    },
    faqs: [
      { question: 'Can I reupholster the seat in 10 years?', answer: 'Yes — the leather sling is attached with capped stainless steel rivets and can be replaced by any upholstery shop or by us for a flat fee of $280.' },
      { question: 'Is the chair suitable for outdoor use?', answer: 'No. Halden is intended for indoor use only. For a similar outdoor silhouette, see our Halten outdoor lounge in teak and Sunbrella.' },
    ],
    reviews: [
      review('r1', 'Margaret L.', 5, 'The chair that made me cancel my therapist', 'I bought this for our reading nook and now spend ninety minutes in it every evening. The leather has already started to soften and the creak of the oak frame is the most soothing sound in the house.', '2025-04-18', 47),
      review('r2', 'David R.', 5, 'Worth the wait', 'Took six weeks to arrive but it’s clearly built to outlive me. Assembly was four bolts. The smoked oak is even better in person.', '2025-03-02', 22),
      review('r3', 'Priya S.', 4, 'Beautiful but heavy', 'Genuinely a heirloom piece. Only complaint is that it’s heavier than I expected — needed two people to carry it upstairs.', '2025-02-14', 9),
    ],
  },
  {
    id: 'p-modular-sofa-3seater',
    name: 'Aalto 3-Seater Sofa',
    slug: 'aalto-3-seater-sofa',
    sku: 'AUR-FN-AS-002',
    categoryId: 'cat-furniture',
    shortDesc: 'Down-wrapped foam cushions on a kiln-dried hardwood frame.',
    description:
      'Aalto is our most-loved sofa, and the one we recommend to friends. The frame is kiln-dried hardwood with corner-blocked joints, the seat cushions are 1.8 lb high-resilience foam wrapped in a 60/40 down-feather blend, and the back cushions are 100% chambered down. The cover is removable and machine-washable, available in twelve performance fabrics rated to 50,000 double rubs. Designed for living rooms that get used — Aalto seats three comfortably, four in a pinch, and cleans up after the dog.',
    highlights: [
      'Kiln-dried hardwood frame, 10-year warranty',
      '1.8 lb HR foam wrapped in 60/40 down blend',
      'Removable, machine-washable covers',
      '12 performance fabrics, 50,000+ double rubs',
      'Modular — add an ottoman or chaise anytime',
    ],
    specifications: [
      { label: 'Overall dimensions', value: '218 W × 98 D × 82 H cm' },
      { label: 'Seat height', value: '44 cm' },
      { label: 'Arm height', value: '64 cm' },
      { label: 'Weight', value: '78 kg' },
      { label: 'Frame', value: 'Kiln-dried hardwood, corner-blocked' },
      { label: 'Cushions', value: '1.8 lb HR foam + 60/40 down wrap' },
      { label: 'Fabric rating', value: '50,000+ Martindale double rubs' },
      { label: 'Assembly', value: 'Tool-free, 8 minutes' },
      { label: 'Country of origin', value: 'Made in North Carolina, USA' },
      { label: 'Warranty', value: '10-year frame, 5-year cushions' },
    ],
    price: 2490,
    comparePrice: 2890,
    cost: 1380,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 386,
    quantity: 12,
    lowStockThreshold: 4,
    badges: ['Best Seller'],
    collection: 'Aalto',
    materials: 'Hardwood, HR foam, down blend, performance fabric',
    care: 'Vacuum weekly with the upholstery attachment. Spot-clean spills immediately with a damp cloth. Machine-wash covers cold, line dry.',
    shippingNote: 'Ships in 7–10 business days. Free white-glove delivery in the contiguous US.',
    variants: {
      colors: [
        { id: 'c-fabric-oat', name: 'Oat Linen', value: 'Oat', swatch: '#d8c9a8', inStock: true },
        { id: 'c-fabric-sage', name: 'Sage Velvet', value: 'Sage', swatch: '#8aa18b', inStock: true, priceDelta: 180 },
        { id: 'c-fabric-charcoal', name: 'Charcoal Bouclé', value: 'Charcoal', swatch: '#3d3a36', inStock: true, priceDelta: 220 },
        { id: 'c-fabric-clay', name: 'Clay Performance', value: 'Clay', swatch: '#a8745c', inStock: true },
      ],
      sizes: [
        { id: 's-2seater', name: '2-Seater', value: '2-Seater', priceDelta: -400, inStock: true },
        { id: 's-3seater', name: '3-Seater', value: '3-Seater', inStock: true },
        { id: 's-4seater', name: '4-Seater', value: '4-Seater', priceDelta: 520, inStock: true },
        { id: 's-sectional', name: 'L-Sectional', value: 'L-Sectional', priceDelta: 980, inStock: true },
      ],
    },
    faqs: [
      { question: 'Can I add a chaise later?', answer: 'Yes. Aalto is modular — you can add a chaise, ottoman, or single seat at any time, in any of our 12 fabrics.' },
      { question: 'Are the cushions flippable?', answer: 'Seat cushions are flippable for even wear. Back cushions are single-sided to maintain their down loft.' },
    ],
    reviews: [
      review('r1', 'Elena M.', 5, 'The best purchase we’ve made for our home', 'We went back and forth between this and a $5,000 designer sofa. No regrets. The down cushions feel like a high-end hotel lobby and the oat linen has survived a toddler and a labrador.', '2025-05-09', 88),
      review('r2', 'James T.', 5, 'Sturdy, comfortable, worth it', 'I’m 6’3” and most sofas feel like they’re built for someone five foot nothing. Aalto has a 44 cm seat height and 64 cm arm height — it actually fits me. The assembly was eight minutes, tool-free.', '2025-04-21', 34),
      review('r3', 'Rashida K.', 4, 'Great sofa, fabric pills a little', 'The boucle option is gorgeous but pills where we sit most. A lint shaver fixes it in two minutes. Otherwise the sofa is flawless.', '2025-03-30', 12),
    ],
  },
  {
    id: 'p-walnut-dining-table',
    name: 'Mason Walnut Dining Table',
    slug: 'mason-walnut-dining-table',
    sku: 'AUR-FN-MW-003',
    categoryId: 'cat-furniture',
    shortDesc: 'Solid American black walnut top on a hand-forged steel base.',
    description:
      'The Mason dining table is built from a single slab of American black walnut, hand-selected for figure and color. The top is 4 cm thick with a live edge that’s been lightly dressed — not the rustic look, but not the sterile either. The base is hand-forged powder-coated steel with adjustable levelers. Each table is unique; we send photos of the actual slab before shipping so you know exactly what you’re getting. Seats six to eight, depending on chair width.',
    highlights: [
      'Solid American black walnut, 4 cm thick',
      'Hand-forged powder-coated steel base',
      'Live-edge top, lightly dressed',
      'Adjustable levelers for uneven floors',
      'Each slab hand-selected — photos before shipping',
    ],
    specifications: [
      { label: 'Overall dimensions', value: '220 W × 95 D × 75 H cm' },
      { label: 'Top thickness', value: '4 cm' },
      { label: 'Weight', value: '92 kg' },
      { label: 'Top material', value: 'American black walnut, oil finish' },
      { label: 'Base', value: 'Hand-forged steel, matte black powder coat' },
      { label: 'Seating capacity', value: '6–8' },
      { label: 'Assembly', value: 'Top rests on base, 2 people 10 min' },
      { label: 'Warranty', value: '20-year structural' },
    ],
    price: 3290,
    cost: 1980,
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 142,
    quantity: 7,
    lowStockThreshold: 3,
    badges: ['Limited'],
    collection: 'Mason',
    materials: 'Solid American black walnut, powder-coated steel',
    care: 'Wipe spills immediately. Re-oil annually with food-safe walnut oil. Avoid direct sunlight to prevent uneven fading.',
    shippingNote: 'Made-to-order, ships in 4–6 weeks. White-glove delivery included in the contiguous US.',
    variants: {
      sizes: [
        { id: 's-6seater', name: '6-Seater (180 cm)', value: '180 cm', inStock: true, priceDelta: -600 },
        { id: 's-8seater', name: '8-Seater (220 cm)', value: '220 cm', inStock: true },
        { id: 's-10seater', name: '10-Seater (280 cm)', value: '280 cm', inStock: true, priceDelta: 850 },
      ],
    },
    faqs: [
      { question: 'Will the table I receive look like the photos?', answer: 'No two slabs are identical. Before we ship, we send you 8–10 photos of the actual slab selected for your order so you can approve or request a different figure.' },
      { question: 'Can the base be customized?', answer: 'Yes — we offer the base in matte black, bronze, brushed brass and matte white at no additional charge. Reach out after ordering to confirm.' },
    ],
    reviews: [
      review('r1', 'Anika P.', 5, 'A genuine heirloom', 'The slab they sent photos of was even more figured than I expected. The table arrived in perfect condition, the white-glove team were excellent. It anchors our entire dining room.', '2025-05-12', 41),
      review('r2', 'Robert H.', 5, 'Heavy, beautiful, real', 'You can feel the weight the moment you touch it. This isn’t veneer over MDF — it’s a real walnut slab. Worth every penny.', '2025-04-08', 18),
    ],
  },

  // DECOR -------------------------------------------------------------------
  {
    id: 'p-ceramic-vase-ripple',
    name: 'Ripple Stoneware Vase',
    slug: 'ripple-stoneware-vase',
    sku: 'AUR-DC-RV-004',
    categoryId: 'cat-decor',
    shortDesc: 'Hand-thrown stoneware vase with a layered rippled glaze.',
    description:
      'Thrown one at a time on the wheel in a small studio outside Lisbon, the Ripple vase takes its name from the concentric rings pressed into the clay while it’s still leather-hard. Each piece is glazed in a soft matte white that breaks green at the edges, then fired to 1240°C for a vitreous, watertight finish. Use it for a single stem or a full armful of branches — it works either way.',
    highlights: [
      'Hand-thrown in Portugal',
      'Leather-hard ripple texture',
      'Matte glaze with green break',
      'Watertight to 1240°C firing',
      'Each piece signed by the maker',
    ],
    specifications: [
      { label: 'Height', value: '28 cm' },
      { label: 'Mouth diameter', value: '11 cm' },
      { label: 'Base diameter', value: '14 cm' },
      { label: 'Weight', value: '1.4 kg' },
      { label: 'Material', value: 'Stoneware, matte glaze' },
      { label: 'Watertight', value: 'Yes' },
      { label: 'Country of origin', value: 'Portugal' },
    ],
    price: 78,
    comparePrice: 96,
    cost: 32,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 89,
    quantity: 54,
    lowStockThreshold: 12,
    badges: ['New'],
    collection: 'Ripple',
    materials: 'Stoneware, lead-free matte glaze',
    care: 'Hand-wash. Avoid sudden temperature changes. The matte glaze will patina gently with use.',
    shippingNote: 'Ships in 1–2 business days. Recycled-paper packaging.',
    variants: {
      colors: [
        { id: 'c-vase-white', name: 'Soft White', value: 'White', swatch: '#e8e1d4', inStock: true },
        { id: 'c-vase-clay', name: 'Fired Clay', value: 'Clay', swatch: '#a8745c', inStock: true },
        { id: 'c-vase-sage', name: 'Sage', value: 'Sage', swatch: '#8aa18b', inStock: true },
      ],
      sizes: [
        { id: 's-small', name: 'Small (18 cm)', value: 'Small', priceDelta: -20, inStock: true },
        { id: 's-medium', name: 'Medium (28 cm)', value: 'Medium', inStock: true },
        { id: 's-large', name: 'Large (38 cm)', value: 'Large', priceDelta: 28, inStock: true },
      ],
    },
    faqs: [
      { question: 'Are these exactly identical?', answer: 'No. Each vase is thrown by hand — slight variation in shape, glaze pooling and ring depth is the maker’s signature, not a defect.' },
    ],
    reviews: [
      review('r1', 'Sofia G.', 5, 'Better than the photos', 'The glaze has a subtle green where it pools that I couldn’t see online. It looks like a much more expensive piece.', '2025-05-22', 14),
      review('r2', 'Lucas B.', 4, 'Lovely but smaller than I expected', 'Read the dimensions carefully — the medium is genuinely medium. The craftsmanship is wonderful though.', '2025-04-30', 6),
    ],
  },
  {
    id: 'p-brass-mirror-arc',
    name: 'Arc Brass Wall Mirror',
    slug: 'arc-brass-wall-mirror',
    sku: 'AUR-DC-AM-005',
    categoryId: 'cat-decor',
    shortDesc: 'Solid brass arched mirror with beveled glass.',
    description:
      'The Arc mirror is built around a single sheet of 4 mm beveled glass set in a solid brass frame, hand-finished in our Brooklyn metal shop. The arch is a full half-circle — the kind of architectural shape that works in entryways, over vanities, or as the focal point of a dressing area. The brass arrives with a brushed satin finish that warms over time; clear-coat options are available if you prefer it to stay bright.',
    highlights: [
      'Solid brass frame, hand-finished',
      '4 mm beveled mirror glass',
      'Full half-circle arch',
      'Wall-mounted with included French cleat',
      'Satin or clear-coat finish',
    ],
    specifications: [
      { label: 'Overall dimensions', value: '60 W × 90 H cm' },
      { label: 'Frame width', value: '3.5 cm' },
      { label: 'Weight', value: '11 kg' },
      { label: 'Material', value: 'Solid brass, beveled glass' },
      { label: 'Mounting', value: 'French cleat, hardware included' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 320,
    cost: 165,
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 67,
    quantity: 24,
    lowStockThreshold: 8,
    badges: [],
    collection: 'Arc',
    materials: 'Solid brass, beveled glass',
    care: 'Wipe with a dry microfibre cloth. For deeper cleaning use a 50/50 vinegar and water solution. Brass will warm in tone over time; the clear-coat option preserves the original finish.',
    shippingNote: 'Ships in 3–5 business days. Wall-mount hardware included.',
    variants: {
      sizes: [
        { id: 's-60cm', name: '60 cm', value: '60 cm', inStock: true },
        { id: 's-80cm', name: '80 cm', value: '80 cm', priceDelta: 120, inStock: true },
        { id: 's-100cm', name: '100 cm', value: '100 cm', priceDelta: 260, inStock: true },
      ],
    },
    faqs: [
      { question: 'Can it sit on a vanity or does it have to be wall-mounted?', answer: 'The Arc is wall-mounted only — the French cleat distributes the 11 kg load safely. We offer a free-standing easel version in the Arc Floor Mirror listing.' },
    ],
    reviews: [
      review('r1', 'Helen W.', 5, 'The brass is real, not plated', 'You can feel the weight when you pick it up. Installation took 20 minutes and the cleat holds it perfectly flush. It’s the centerpiece of our entryway.', '2025-05-01', 19),
      review('r2', 'Marcus L.', 5, 'Worth it', 'I shopped around for months. This is the only arched brass mirror at this price that uses solid brass rather than brass-plated steel.', '2025-04-15', 8),
    ],
  },

  // KITCHEN & DINING --------------------------------------------------------
  {
    id: 'p-cast-iron-skillet',
    name: 'Forge Cast Iron Skillet',
    slug: 'forge-cast-iron-skillet',
    sku: 'AUR-KC-FS-006',
    categoryId: 'cat-kitchen',
    shortDesc: 'Pre-seasoned 28 cm cast iron skillet, made in Tennessee.',
    description:
      'The Forge skillet is sand-cast in a Tennessee foundry that’s been making cookware since 1932. We use a single mold per skillet (not the cheaper stack-cast process) for a smoother surface and a more even wall. Each piece is pre-seasoned with three layers of organic flaxseed oil and oven-cured at 260°C, so it arrives ready to cook. The helper handle makes it easy to lift even when full, and the pour spouts work for both left- and right-handed cooks.',
    highlights: [
      'Sand-cast in Tennessee, single-mold process',
      'Pre-seasoned with three layers of flaxseed oil',
      'Helper handle and dual pour spouts',
      'Oven, induction, campfire and grill safe',
      'Lifetime warranty against cracking',
    ],
    specifications: [
      { label: 'Diameter', value: '28 cm (top), 24 cm (base)' },
      { label: 'Depth', value: '5 cm' },
      { label: 'Weight', value: '2.4 kg' },
      { label: 'Material', value: 'Cast iron, flaxseed seasoning' },
      { label: 'Heat sources', value: 'Gas, induction, ceramic, oven, campfire, grill' },
      { label: 'Max temperature', value: '315°C' },
      { label: 'Country of origin', value: 'USA' },
      { label: 'Warranty', value: 'Lifetime' },
    ],
    price: 89,
    comparePrice: 110,
    cost: 38,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 412,
    quantity: 88,
    lowStockThreshold: 20,
    badges: ['Best Seller'],
    collection: 'Forge',
    materials: 'Cast iron, organic flaxseed oil seasoning',
    care: 'Wash with hot water and a brush — no soap. Dry thoroughly over a low flame, then wipe with a few drops of cooking oil. Re-season once a season.',
    shippingNote: 'Ships in 1–2 business days.',
    variants: {
      sizes: [
        { id: 's-20cm', name: '20 cm', value: '20 cm', priceDelta: -20, inStock: true },
        { id: 's-24cm', name: '24 cm', value: '24 cm', priceDelta: -10, inStock: true },
        { id: 's-28cm', name: '28 cm', value: '28 cm', inStock: true },
        { id: 's-32cm', name: '32 cm', value: '32 cm', priceDelta: 30, inStock: true },
      ],
    },
    faqs: [
      { question: 'Is the surface smooth or rough like traditional cast iron?', answer: 'Forge skillets use a single-mold sand-cast process that produces a noticeably smoother surface out of the box. It still improves with use, but the starting point is much finer than cheaper stack-cast pans.' },
      { question: 'Can I use metal utensils?', answer: 'Yes — the seasoning will get minor scratches but won’t be damaged. Avoid soap and the dishwasher.' },
    ],
    reviews: [
      review('r1', 'Olivia R.', 5, 'Replaced my old Lodge with this and never looked back', 'The surface is genuinely smoother than any cast iron I’ve owned. After two months of daily use it’s basically non-stick for eggs. The helper handle is the unsung hero.', '2025-05-25', 73),
      review('r2', 'Henry C.', 5, 'Built like a tank', 'I dropped this from counter height onto tile and it didn’t chip, crack or warp. The tile cracked. Lifetime warranty for a reason.', '2025-04-12', 41),
      review('r3', 'Mei L.', 4, 'Great pan, heavy', 'It’s cast iron — yes, it’s heavy. Read the weight before you buy. Otherwise flawless.', '2025-03-22', 12),
    ],
  },
  {
    id: 'p-porcelain-dinner-set',
    name: 'Lune Porcelain Dinner Plate Set',
    slug: 'lune-porcelain-dinner-plate-set',
    sku: 'AUR-KC-LP-007',
    categoryId: 'cat-kitchen',
    shortDesc: 'Set of 4 speckled stoneware dinner plates, made in Japan.',
    description:
      'Lune is our everyday porcelain, made in a 100-year-old family kiln in Saga, Japan. The clay is a high-fired stoneware blend with natural iron speckles that show through the matte cream glaze. Each plate is 27 cm across — wide enough for plating, shallow enough for pasta — and the rolled rim resists chipping. Sold as a set of four; matching salad plates, bowls and mugs available.',
    highlights: [
      'Made in Saga, Japan',
      'High-fired stoneware, 1250°C',
      'Natural iron speckle, matte glaze',
      '27 cm dinner size, rolled rim',
      'Dishwasher, microwave and oven safe',
    ],
    specifications: [
      { label: 'Plate diameter', value: '27 cm' },
      { label: 'Plate depth', value: '2.5 cm' },
      { label: 'Weight (per plate)', value: '540 g' },
      { label: 'Set size', value: '4 plates' },
      { label: 'Material', value: 'High-fired stoneware' },
      { label: 'Glaze', value: 'Matte cream, lead-free' },
      { label: 'Care', value: 'Dishwasher, microwave, oven to 220°C' },
      { label: 'Country of origin', value: 'Japan' },
    ],
    price: 148,
    cost: 64,
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 158,
    quantity: 42,
    lowStockThreshold: 10,
    badges: [],
    collection: 'Lune',
    materials: 'High-fired stoneware, lead-free matte glaze',
    care: 'Dishwasher safe. Avoid thermal shock — let a cold plate come to room temp before putting it in a hot oven.',
    shippingNote: 'Ships in 1–2 business days. Each plate individually boxed in recycled pulp.',
    variants: {
      colors: [
        { id: 'c-cream', name: 'Cream', value: 'Cream', swatch: '#e8e1d4', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true },
        { id: 'c-sage', name: 'Sage', value: 'Sage', swatch: '#8aa18b', inStock: true },
      ],
    },
    faqs: [
      { question: 'Can I buy open-stock instead of a set?', answer: 'Yes. Every Lune piece is available open-stock — search “Lune” on the shop page to see the full collection.' },
    ],
    reviews: [
      review('r1', 'Camille D.', 5, 'Better than the Heath Ceramics I replaced', 'The speckle is more pronounced in person, which I love. They’ve survived six months of daily dishwasher cycles without any sign of wear.', '2025-04-29', 22),
      review('r2', 'Tom W.', 5, 'Beautiful, sturdy, real', 'These don’t chip when stacked, they don’t get hot in the microwave, and they look like they cost twice as much.', '2025-03-15', 9),
    ],
  },

  // LIGHTING ----------------------------------------------------------------
  {
    id: 'p-pendant-linen-shade',
    name: 'Paper Linen Pendant Light',
    slug: 'paper-linen-pendant-light',
    sku: 'AUR-LT-PL-008',
    categoryId: 'cat-lighting',
    shortDesc: 'Hand-stitched linen drum pendant, dimmable, 2700K.',
    description:
      'The Paper pendant is a 50 cm drum shade made from a stiffened linen substrate that lets light through softly without glare. The shade is hand-stitched in our Brooklyn studio; the canopy and socket are solid brass. Includes a 3 m black braided fabric cord and a dimmable LED bulb tuned to 2700K, 800 lumens, CRI 95+ — the warm, accurate light we put in every Aurelia fixture.',
    highlights: [
      '50 cm drum, hand-stitched linen',
      'Solid brass canopy and socket',
      '3 m black braided fabric cord',
      'Dimmable LED bulb, 2700K, 800 lm, CRI 95+',
      'Adjustable drop to 2 m',
    ],
    specifications: [
      { label: 'Shade diameter', value: '50 cm' },
      { label: 'Shade height', value: '22 cm' },
      { label: 'Cord length', value: '3 m (adjustable)' },
      { label: 'Bulb included', value: 'Yes — E26 dimmable LED, 2700K, 800 lm' },
      { label: 'Wattage', value: '9 W LED (60 W incandescent equivalent)' },
      { label: 'Voltage', value: '120 V' },
      { label: 'Material', value: 'Linen substrate, solid brass hardware' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 245,
    comparePrice: 290,
    cost: 110,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 73,
    quantity: 28,
    lowStockThreshold: 8,
    badges: ['Editor’s Pick'],
    collection: 'Paper',
    materials: 'Linen substrate, solid brass',
    care: 'Dust with a soft brush attachment. The shade can be vacuumed on low; spot-clean only with a damp cloth.',
    shippingNote: 'Ships in 2–4 business days. Hardwire installation recommended; a plug-in swag option is available on request.',
    variants: {
      colors: [
        { id: 'c-natural', name: 'Natural Linen', value: 'Natural', swatch: '#d8c9a8', inStock: true },
        { id: 'c-ivory', name: 'Ivory', value: 'Ivory', swatch: '#efe9da', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true, priceDelta: 30 },
      ],
      sizes: [
        { id: 's-35cm', name: 'Small (35 cm)', value: 'Small', priceDelta: -60, inStock: true },
        { id: 's-50cm', name: 'Medium (50 cm)', value: 'Medium', inStock: true },
        { id: 's-70cm', name: 'Large (70 cm)', value: 'Large', priceDelta: 90, inStock: true },
      ],
    },
    faqs: [
      { question: 'Can I install this myself?', answer: 'If you’re replacing an existing ceiling fixture, yes — about 30 minutes for a competent DIYer. For new installations, hire an electrician. We can recommend licensed pros in major US metros.' },
    ],
    reviews: [
      review('r1', 'Lila F.', 5, 'Beautiful warm light', 'The 2700K bulb makes our dining room feel like a restaurant. The linen glows when lit and disappears into the ceiling when off. Installation was straightforward.', '2025-05-18', 11),
      review('r2', 'Arjun M.', 4, 'Lovely but cord is short', 'The 3 m cord worked for our ceiling but if you have a high ceiling you’ll want to add an extension. Otherwise the fixture is gorgeous.', '2025-04-05', 4),
    ],
  },
  {
    id: 'p-floor-lamp-arc',
    name: 'Cantilever Arc Floor Lamp',
    slug: 'cantilever-arc-floor-lamp',
    sku: 'AUR-LT-CA-009',
    categoryId: 'cat-lighting',
    shortDesc: 'Solid marble base, brushed brass arc, dimmable LED.',
    description:
      'The Cantilever floor lamp is the modern arc lamp, reworked. A 12 kg solid Carrara marble base anchors a 2 m brushed brass arc that arcs over a sofa or reading chair. The integrated LED head is dimmable via a touch strip on the stem — tap to turn on, hold to dim, double-tap for full brightness. Tuned to 2700K, 1100 lumens, CRI 95+.',
    highlights: [
      '12 kg solid Carrara marble base',
      '2 m brushed brass arc',
      'Touch-dimmable integrated LED, 2700K, 1100 lm',
      'CRI 95+ for true color rendering',
      'Cord-concealed brass stem',
    ],
    specifications: [
      { label: 'Overall height', value: '198 cm' },
      { label: 'Arc reach', value: '110 cm from base' },
      { label: 'Base diameter', value: '30 cm' },
      { label: 'Base weight', value: '12 kg (marble)' },
      { label: 'Light source', value: 'Integrated LED, 2700K, 1100 lm, CRI 95+' },
      { label: 'Wattage', value: '14 W' },
      { label: 'Dimming', value: 'Touch strip, 5%–100%' },
      { label: 'Material', value: 'Carrara marble, brushed brass' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 580,
    cost: 290,
    images: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 96,
    quantity: 16,
    lowStockThreshold: 5,
    badges: ['Best Seller'],
    collection: 'Cantilever',
    materials: 'Solid Carrara marble, brushed brass',
    care: 'Dust brass with a dry microfibre cloth. For the marble, wipe spills immediately — marble is porous and will etch from citrus and wine.',
    shippingNote: 'Ships in 5–7 business days. White-glove delivery in select metros.',
    variants: {
      colors: [
        { id: 'c-brass', name: 'Brushed Brass', value: 'Brass', swatch: '#b8945f', inStock: true },
        { id: 'c-black', name: 'Matte Black', value: 'Black', swatch: '#2b2622', inStock: true },
        { id: 'c-bronze', name: 'Bronze', value: 'Bronze', swatch: '#6b4f3a', inStock: true },
      ],
    },
    faqs: [
      { question: 'How heavy is the base — will it tip?', answer: 'The 12 kg marble base gives the lamp a centre of gravity well below the arc. We’ve tested it to a 15° tilt without tipping; in normal household use it’s extremely stable.' },
    ],
    reviews: [
      review('r1', 'Daniel K.', 5, 'Statement piece that actually works', 'Most arc lamps are decorative. This one outputs 1100 lumens and dimms to 5% — it’s genuinely our reading light every evening. The marble base is the real thing.', '2025-05-08', 23),
      review('r2', 'Yuki T.', 5, 'Perfect over our sectional', 'The arc reaches 110 cm from the base, which puts the light directly over our center seat. Beautiful object even when off.', '2025-04-19', 8),
    ],
  },

  // BEDDING & BATH ----------------------------------------------------------
  {
    id: 'p-linen-sheet-set',
    name: 'Stonewashed Linen Sheet Set',
    slug: 'stonewashed-linen-sheet-set',
    sku: 'AUR-BB-LS-010',
    categoryId: 'cat-bedding',
    shortDesc: 'European flax linen, stonewashed, set of 4 pieces.',
    description:
      'Our linen sheets are woven from 100% European flax — the long-staple fiber grown in Normandy and Belgium — and stonewashed for that broken-in softness from night one. Linen sleeps cooler than cotton, wicks moisture, and gets softer with every wash. Each set includes one flat sheet, one fitted sheet with 38 cm deep pockets, and two pillowcases. OEKO-TEX certified, made in a family-owned mill in Portugal.',
    highlights: [
      '100% European flax linen',
      'Stonewashed for instant softness',
      'Fitted sheet with 38 cm deep pockets',
      'OEKO-TEX Standard 100 certified',
      'Set of 4 pieces',
    ],
    specifications: [
      { label: 'Material', value: '100% European flax linen, 160 gsm' },
      { label: 'Set contents', value: '1 fitted sheet, 1 flat sheet, 2 pillowcases' },
      { label: 'Fitted pocket depth', value: '38 cm' },
      { label: 'Pillowcase size', value: '50 × 75 cm' },
      { label: 'Certification', value: 'OEKO-TEX Standard 100, European Flax' },
      { label: 'Care', value: 'Machine wash cold, tumble dry low' },
      { label: 'Country of origin', value: 'Portugal' },
      { label: 'Warranty', value: '2-year' },
    ],
    price: 320,
    comparePrice: 380,
    cost: 145,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 234,
    quantity: 64,
    lowStockThreshold: 15,
    badges: ['Best Seller'],
    collection: 'Stonewash',
    materials: '100% European flax linen',
    care: 'Machine wash cold on gentle. Tumble dry low and remove while slightly damp. Linen wrinkles — that’s the look. Ironing is optional.',
    shippingNote: 'Ships in 1–2 business days. 30-day comfort guarantee — sleep on them for 30 nights and return if not for you.',
    variants: {
      colors: [
        { id: 'c-oat', name: 'Oat', value: 'Oat', swatch: '#d8c9a8', inStock: true },
        { id: 'c-sage', name: 'Sage', value: 'Sage', swatch: '#8aa18b', inStock: true },
        { id: 'c-clay', name: 'Clay', value: 'Clay', swatch: '#a8745c', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true },
        { id: 'c-ivory', name: 'Ivory', value: 'Ivory', swatch: '#efe9da', inStock: true },
      ],
      sizes: [
        { id: 's-twin', name: 'Twin', value: 'Twin', priceDelta: -80, inStock: true },
        { id: 's-full', name: 'Full', value: 'Full', priceDelta: -40, inStock: true },
        { id: 's-queen', name: 'Queen', value: 'Queen', inStock: true },
        { id: 's-king', name: 'King', value: 'King', priceDelta: 50, inStock: true },
        { id: 's-cal-king', name: 'Cal King', value: 'Cal King', priceDelta: 50, inStock: true },
      ],
    },
    faqs: [
      { question: 'Will they feel rough at first?', answer: 'No — they’re stonewashed at the mill, which breaks the fibers in before you receive them. They will continue to soften with each wash for the first 6 months.' },
      { question: 'Do I need to iron them?', answer: 'No. Linen wrinkles naturally and that’s part of its appeal. If you prefer a crisper look, iron while slightly damp on the linen setting.' },
    ],
    reviews: [
      review('r1', 'Rachel B.', 5, 'Slept cool for the first time in years', 'I run hot at night and these have been a revelation. They feel substantial but breathable. The oat color is exactly what I wanted.', '2025-05-20', 31),
      review('r2', 'Anders L.', 5, 'Better than the French linen we bought in Paris', 'Genuinely. We have a set of Garnier Thiebaut sheets from a trip to Paris and these are softer and cooler. The stonewash makes a real difference.', '2025-04-12', 18),
      review('r3', 'Priya K.', 4, 'Beautiful but wrinkles', 'They are gorgeous and sleep cool. They do wrinkle a lot — if that bothers you, you may not love them.', '2025-03-25', 9),
    ],
  },
  {
    id: 'p-bath-towel-portuguese',
    name: 'Aurelia Portuguese Bath Towel',
    slug: 'aurelia-portuguese-bath-towel',
    sku: 'AUR-BB-PT-011',
    categoryId: 'cat-bedding',
    shortDesc: '650 GSM long-staple cotton terry, woven in Portugal.',
    description:
      'Our bath towels are woven on traditional Dornier looms in a family mill in northern Portugal. The 650 GSM long-staple cotton terry is dense enough to be plush, light enough to dry between uses. The hems are double-stitched with a contrasting ladder-stitch detail. Each towel is pre-washed, so it arrives at full absorbency. OEKO-TEX certified.',
    highlights: [
      '650 GSM long-staple cotton terry',
      'Woven on Dornier looms in Portugal',
      'Pre-washed for full absorbency',
      'Double-stitched hems with ladder detail',
      'OEKO-TEX Standard 100 certified',
    ],
    specifications: [
      { label: 'Bath towel size', value: '70 × 140 cm' },
      { label: 'Hand towel size', value: '40 × 70 cm' },
      { label: 'Washcloth size', value: '33 × 33 cm' },
      { label: 'Weight', value: '650 GSM' },
      { label: 'Material', value: '100% long-staple cotton' },
      { label: 'Certification', value: 'OEKO-TEX Standard 100' },
      { label: 'Care', value: 'Machine wash warm, tumble dry low' },
      { label: 'Country of origin', value: 'Portugal' },
    ],
    price: 58,
    cost: 24,
    images: [
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 178,
    quantity: 120,
    lowStockThreshold: 30,
    badges: [],
    collection: 'Aurelia',
    materials: '100% long-staple cotton',
    care: 'Machine wash warm with like colors. Avoid fabric softener — it coats the fibers and reduces absorbency. Tumble dry low.',
    shippingNote: 'Ships in 1–2 business days.',
    variants: {
      colors: [
        { id: 'c-natural', name: 'Natural', value: 'Natural', swatch: '#e8e1d4', inStock: true },
        { id: 'c-clay', name: 'Clay', value: 'Clay', swatch: '#a8745c', inStock: true },
        { id: 'c-sage', name: 'Sage', value: 'Sage', swatch: '#8aa18b', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true },
      ],
      sizes: [
        { id: 's-bath', name: 'Bath Towel', value: 'Bath', inStock: true },
        { id: 's-hand', name: 'Hand Towel', value: 'Hand', priceDelta: -34, inStock: true },
        { id: 's-cloth', name: 'Washcloth', value: 'Washcloth', priceDelta: -44, inStock: true },
        { id: 's-sheet', name: 'Bath Sheet', value: 'Bath Sheet', priceDelta: 24, inStock: true },
      ],
    },
    faqs: [
      { question: 'Why should I avoid fabric softener?', answer: 'Fabric softener coats cotton fibers in a thin silicone film that makes them feel softer but reduces their ability to absorb water. Use white vinegar in the rinse cycle every few washes instead — it strips residue and restores absorbency.' },
    ],
    reviews: [
      review('r1', 'Maya R.', 5, 'Dense, plush, real cotton', 'You can feel the difference from supermarket towels immediately. They’re heavy in a good way and absorb water like a sponge.', '2025-05-15', 14),
      review('r2', 'Chris B.', 4, 'Great towels, sizing runs slightly small', 'The bath towel is 70 × 140 cm — slightly smaller than the typical US bath towel. Otherwise excellent quality.', '2025-04-08', 6),
    ],
  },

  // FRAGRANCE ---------------------------------------------------------------
  {
    id: 'p-candle-amber-oak',
    name: 'Amber & Oak Candle',
    slug: 'amber-and-oak-candle',
    sku: 'AUR-FR-AO-012',
    categoryId: 'cat-fragrance',
    shortDesc: 'Hand-poured soy-coconut wax candle, 60 hour burn, oak vessel.',
    description:
      'Amber & Oak is our most-loved fragrance — a warm, dry amber built on labdanum and tonka, with a base of cured oak and a top of bergamot. Poured in small batches in our Brooklyn studio using a soy-coconut wax blend and a cotton wick. The vessel is a turned oak block with a ceramic insert — when the candle is done, the vessel becomes a small planter or pencil cup.',
    highlights: [
      '60-hour burn time',
      'Soy-coconut wax blend, no paraffin',
      'Cotton wick, no lead',
      'Reusable oak vessel with ceramic insert',
      'Notes: bergamot, labdanum, tonka, cured oak',
    ],
    specifications: [
      { label: 'Vessel size', value: '9 cm diameter × 9 cm tall' },
      { label: 'Wax weight', value: '250 g' },
      { label: 'Burn time', value: '55–60 hours' },
      { label: 'Wax', value: 'Soy-coconut blend, no paraffin' },
      { label: 'Wick', value: 'Cotton, lead-free' },
      { label: 'Scent throw', value: 'Medium (40 m² room)' },
      { label: 'Country of origin', value: 'USA' },
    ],
    price: 48,
    comparePrice: 58,
    cost: 18,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 263,
    quantity: 84,
    lowStockThreshold: 20,
    badges: ['Best Seller'],
    collection: 'Amber & Oak',
    materials: 'Soy-coconut wax, cotton wick, oak vessel',
    care: 'On first burn, allow the wax to pool to the edges (about 2 hours) to prevent tunneling. Trim the wick to 5 mm before each burn. Never burn for more than 4 hours.',
    shippingNote: 'Ships in 1–2 business days. Recyclable paper packaging.',
    variants: {
      sizes: [
        { id: 's-120g', name: 'Travel (120 g)', value: '120 g', priceDelta: -16, inStock: true },
        { id: 's-250g', name: 'Standard (250 g)', value: '250 g', inStock: true },
        { id: 's-500g', name: 'Large (500 g)', value: '500 g', priceDelta: 36, inStock: true },
      ],
    },
    faqs: [
      { question: 'Can I refill the vessel?', answer: 'Yes — refills are available in every fragrance for $28. The ceramic insert lifts out for easy refilling.' },
      { question: 'Is the fragrance pet-safe?', answer: 'We avoid phthalates, parabens and known pet-toxic essential oils. Even so, keep candles in a well-ventilated room if you have birds or exotic pets.' },
    ],
    reviews: [
      review('r1', 'Iris M.', 5, 'The oak vessel sold me', 'I now have three of these as pencil cups on my desk. The amber scent is warm without being sweet — my partner who hates “girly” candles loves it.', '2025-05-19', 27),
      review('r2', 'Kevin L.', 5, 'Burns clean, smells real', 'No soot, no headache. The 60 hour burn estimate is accurate. The oak vessel is heavier than I expected — clearly real wood.', '2025-04-22', 14),
    ],
  },

  // ACCESSORIES -------------------------------------------------------------
  {
    id: 'p-leather-tote',
    name: 'Atelier Leather Tote',
    slug: 'atelier-leather-tote',
    sku: 'AUR-AC-LT-013',
    categoryId: 'cat-accessories',
    shortDesc: 'Full-grain vegetable-tanned leather tote, made in Spain.',
    description:
      'The Atelier tote is cut from a single hide of full-grain vegetable-tanned leather from a tannery in León, Spain. The body is unstructured — it softens and slouches with use — with a laptop sleeve that fits a 15" device and an interior zip pocket. The handles are rolled and stitched by hand, and the hardware is solid brass. Over the first year, the leather will darken by 1–2 shades and develop a glassy patina where it’s handled most.',
    highlights: [
      'Full-grain vegetable-tanned leather',
      'Solid brass hardware',
      'Fits a 15" laptop',
      'Interior zip pocket + slip pocket',
      'Hand-stitched rolled handles',
    ],
    specifications: [
      { label: 'Dimensions', value: '40 W × 32 H × 12 D cm' },
      { label: 'Handle drop', value: '24 cm' },
      { label: 'Weight', value: '1.1 kg' },
      { label: 'Material', value: 'Full-grain vegetable-tanned leather, 2.2 mm' },
      { label: 'Hardware', value: 'Solid brass' },
      { label: 'Laptop fit', value: 'Up to 15"' },
      { label: 'Country of origin', value: 'Spain' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 380,
    comparePrice: 450,
    cost: 175,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 187,
    quantity: 32,
    lowStockThreshold: 8,
    badges: ['Best Seller', 'Editor’s Pick'],
    collection: 'Atelier',
    materials: 'Full-grain vegetable-tanned leather, solid brass',
    care: 'Condition every 6 months with a neutral leather balm. Avoid prolonged direct sunlight when storing. Small scratches can be buffed out with a finger — the warmth of your hand will redistribute the wax.',
    shippingNote: 'Ships in 2–3 business days. Complimentary blind debossing available — allow 3 extra days.',
    variants: {
      colors: [
        { id: 'c-tan', name: 'Tan', value: 'Tan', swatch: '#b08560', inStock: true },
        { id: 'c-cognac', name: 'Cognac', value: 'Cognac', swatch: '#8a4f2c', inStock: true },
        { id: 'c-black', name: 'Black', value: 'Black', swatch: '#1a1815', inStock: true, priceDelta: 40 },
        { id: 'c-olive', name: 'Olive', value: 'Olive', swatch: '#5c5a3a', inStock: true, priceDelta: 60 },
      ],
    },
    faqs: [
      { question: 'Can I have my initials debossed?', answer: 'Yes. We offer complimentary blind debossing (up to 3 characters) on all leather goods. Allow 3 extra business days before shipping.' },
      { question: 'Will the color change?', answer: 'Yes — that is the point. Vegetable-tanned leather darkens by 1–2 shades over the first year and develops a glassy patina where it is handled most.' },
    ],
    reviews: [
      review('r1', 'Sara H.', 5, 'My forever bag', 'I’ve had this for 14 months now. The patina is gorgeous — it’s the bag I reach for every day. Holds my laptop, water bottle, a paperback, and all the daily essentials without feeling bulky.', '2025-05-10', 42),
      review('r2', 'Tariq M.', 5, 'Better than my $900 designer tote', 'I bought this to replace a bag that cost more than twice as much. The leather is thicker, the hardware is real brass, and it actually fits my 15" laptop. No contest.', '2025-04-18', 19),
    ],
  },
  {
    id: 'p-cashmere-scarf',
    name: 'Highland Cashmere Scarf',
    slug: 'highland-cashmere-scarf',
    sku: 'AUR-AC-CS-014',
    categoryId: 'cat-accessories',
    shortDesc: 'Inner-Mongolian cashmere scarf, woven in Scotland.',
    description:
      'The Highland scarf is woven from grade-A Inner Mongolian cashmere in a 200-year-old mill in the Scottish Borders. The weave is a tight 2/2 twill that resists pilling, and the fibers are dyed before weaving for a deeper, longer-lasting color. Generously sized at 200 × 70 cm — wide enough to wear as a wrap, long enough to knot.',
    highlights: [
      'Grade-A Inner Mongolian cashmere',
      'Woven in Scotland',
      'Tight 2/2 twill weave, resists pilling',
      'Yarn-dyed for lasting color',
      '200 × 70 cm — wrap or knot',
    ],
    specifications: [
      { label: 'Dimensions', value: '200 × 70 cm' },
      { label: 'Weight', value: '180 g' },
      { label: 'Material', value: '100% grade-A Inner Mongolian cashmere' },
      { label: 'Weave', value: '2/2 twill' },
      { label: 'Care', value: 'Dry clean, or hand-wash cold with cashmere shampoo' },
      { label: 'Country of origin', value: 'Scotland' },
    ],
    price: 168,
    cost: 78,
    images: [
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 88,
    quantity: 38,
    lowStockThreshold: 10,
    badges: ['New'],
    collection: 'Highland',
    materials: '100% grade-A Inner Mongolian cashmere',
    care: 'Dry clean preferred, or hand-wash cold with a pea-sized amount of cashmere shampoo. Dry flat. Store folded in the included cotton pouch.',
    shippingNote: 'Ships in 1–2 business days. Gift-wrapped in recycled paper at no charge.',
    variants: {
      colors: [
        { id: 'c-camel', name: 'Camel', value: 'Camel', swatch: '#b08560', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true },
        { id: 'c-burgundy', name: 'Burgundy', value: 'Burgundy', swatch: '#5a2330', inStock: true },
        { id: 'c-forest', name: 'Forest', value: 'Forest', swatch: '#2b3a30', inStock: true },
        { id: 'c-ivory', name: 'Ivory', value: 'Ivory', swatch: '#efe9da', inStock: true },
      ],
    },
    faqs: [
      { question: 'Will it pill?', answer: 'All cashmere pills to some degree, especially where there is friction (under a coat, around the neck). Our tight twill weave pills less than brushed cashmere. Use a cashmere comb — never a fabric shaver — to remove pills.' },
    ],
    reviews: [
      review('r1', 'Naomi L.', 5, 'Genuinely luxurious', 'I own cashmere from several luxury brands and this is the equal of any of them. The weave is tight, the color is rich, and it’s the right size to actually wrap.', '2025-05-22', 12),
      review('r2', 'Greta B.', 4, 'Lovely, slight itch at first', 'Beautiful scarf. The first wear was slightly itchy against bare skin — after one wash with cashmere shampoo it’s now soft as anything.', '2025-04-15', 5),
    ],
  },

  // OUTDOOR -----------------------------------------------------------------
  {
    id: 'p-outdoor-lounge-teak',
    name: 'Halten Teak Outdoor Lounge Chair',
    slug: 'halten-teak-outdoor-lounge-chair',
    sku: 'AUR-OD-HT-015',
    categoryId: 'cat-outdoor',
    shortDesc: 'Grade-A teak frame with Sunbrella cushion, all-weather.',
    description:
      'Halten is the outdoor cousin of our Halden lounge chair. The frame is built from grade-A Burmese teak — the gold standard for outdoor wood — with mortise-and-tenon joinery and a natural oil finish that weathers to silver-gray within 12 months. The cushion is solution-dyed Sunbrella acrylic over a quick-dry foam insert; it survives rain, sun and spilled wine without fading or mildew.',
    highlights: [
      'Grade-A Burmese teak frame',
      'Mortise-and-tenon joinery',
      'Solution-dyed Sunbrella cushion',
      'Quick-dry foam insert',
      '10-year frame warranty',
    ],
    specifications: [
      { label: 'Overall dimensions', value: '82 W × 88 D × 74 H cm' },
      { label: 'Seat height', value: '40 cm' },
      { label: 'Weight', value: '18 kg' },
      { label: 'Frame', value: 'Grade-A Burmese teak' },
      { label: 'Cushion', value: 'Sunbrella acrylic, quick-dry foam' },
      { label: 'Hardware', value: '316 stainless steel' },
      { label: 'Weather rating', value: 'Year-round outdoor' },
      { label: 'Warranty', value: '10-year frame, 3-year cushion' },
    ],
    price: 740,
    cost: 380,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 64,
    quantity: 14,
    lowStockThreshold: 4,
    badges: [],
    collection: 'Halten',
    materials: 'Grade-A Burmese teak, Sunbrella acrylic, 316 stainless steel',
    care: 'Clean teak annually with mild soap and a soft brush. To preserve the original honey color, re-oil once a year with the included teak oil. Cushions are machine-washable in cold water.',
    shippingNote: 'Ships in 5–7 business days. Custom-fit covers available.',
    variants: {
      colors: [
        { id: 'c-teak-natural', name: 'Natural Teak', value: 'Natural', swatch: '#b08560', inStock: true },
        { id: 'c-teak-gray', name: 'Pre-Weathered Gray', value: 'Gray', swatch: '#8a8074', inStock: true, priceDelta: 60 },
      ],
      sizes: [
        { id: 's-single', name: 'Single Lounge', value: 'Single', inStock: true },
        { id: 's-double', name: 'Double Lounge', value: 'Double', priceDelta: 380, inStock: true },
      ],
    },
    faqs: [
      { question: 'Do I need to cover it in winter?', answer: 'The frame can stay out year-round. We recommend storing cushions indoors during freezing weather to extend the foam’s life by 3–5 years. Custom-fit covers are available.' },
    ],
    reviews: [
      review('r1', 'Owen P.', 5, 'Better than the $1,400 chair it replaced', 'Solid teak, real Sunbrella, stainless hardware. The chair has been on our deck through two winters now without any issues.', '2025-05-12', 11),
      review('r2', 'Lena V.', 4, 'Beautiful — cushion could be thicker', 'The frame is excellent. The cushion is fine but I’d happily pay more for a 10 cm cushion instead of the 7 cm it ships with.', '2025-04-10', 4),
    ],
  },
  {
    id: 'p-outdoor-planter',
    name: 'Corten Steel Planter Box',
    slug: 'corten-steel-planter-box',
    sku: 'AUR-OD-CP-016',
    categoryId: 'cat-outdoor',
    shortDesc: 'Self-weathering Corten steel planter, 50 cm cube.',
    description:
      'The Corten planter develops its own rust patina over 6–9 months, then stabilizes — no further corrosion, no maintenance, no paint. The 2 mm gauge is heavy enough to last decades and the welded seams are ground flush for a clean rectangular silhouette. Drainage holes pre-drilled. Use for ornamental grasses, herbs, small trees or as a divider.',
    highlights: [
      '2 mm Corten weathering steel',
      'Self-stabilizing rust patina',
      'Welded and ground flush seams',
      'Pre-drilled drainage',
      '50 cm cube, modular',
    ],
    specifications: [
      { label: 'Dimensions', value: '50 × 50 × 50 cm' },
      { label: 'Material thickness', value: '2 mm Corten steel' },
      { label: 'Weight', value: '14 kg (empty)' },
      { label: 'Drainage', value: '4 × pre-drilled 20 mm holes' },
      { label: 'Patina process', value: '6–9 months to full rust, then stable' },
      { label: 'Warranty', value: '10-year structural' },
    ],
    price: 198,
    cost: 88,
    images: [
      'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 51,
    quantity: 26,
    lowStockThreshold: 6,
    badges: [],
    collection: 'Corten',
    materials: '2 mm Corten weathering steel',
    care: 'For the first 6–9 months the planter will shed rust-colored water in rain. Place on gravel or natural stone, not on light concrete or decking, until the patina has stabilized.',
    shippingNote: 'Ships in 3–5 business days. Fully welded — no assembly.',
    variants: {
      sizes: [
        { id: 's-40', name: '40 cm cube', value: '40 cm', priceDelta: -40, inStock: true },
        { id: 's-50', name: '50 cm cube', value: '50 cm', inStock: true },
        { id: 's-60', name: '60 cm cube', value: '60 cm', priceDelta: 70, inStock: true },
        { id: 's-rect', name: 'Rectangular (80 × 30 × 40)', value: 'Rectangular', priceDelta: 50, inStock: true },
      ],
    },
    faqs: [
      { question: 'Will it stain my deck?', answer: 'For the first 6–9 months the planter will shed rust-colored water in rain. Place on gravel or natural stone, not on light concrete or decking, until the patina has stabilized. After that it is stable.' },
    ],
    reviews: [
      review('r1', 'Marcus W.', 5, 'Real Corten, real weight', 'You can feel the 2 mm steel the moment you pick it up. The patina is starting to develop after 4 months and it’s already gorgeous.', '2025-05-18', 7),
      review('r2', 'Andrea S.', 4, 'Beautiful but read the rust warning', 'I missed the warning about staining and had to clean my concrete patio. Once I moved it to gravel, no further issues. Beautiful planter.', '2025-04-05', 3),
    ],
  },

  // A few extra products to fill out the shop grid ---------------------------
  {
    id: 'p-wool-area-rug',
    name: 'Highland Wool Area Rug',
    slug: 'highland-wool-area-rug',
    sku: 'AUR-FN-WR-017',
    categoryId: 'cat-furniture',
    shortDesc: 'Hand-knotted New Zealand wool, 240 × 300 cm.',
    description:
      'The Highland rug is hand-knotted in Bhadohi, India by weavers paid a living wage. 100% New Zealand wool, 144 knots per square inch — dense enough to lie flat under a dining table, soft enough for a bedroom. The undyed wool gives a natural heather that hides spills and works with any wall color.',
    highlights: [
      'Hand-knotted in Bhadohi, India',
      '100% New Zealand wool',
      '144 knots per square inch',
      'Natural undyed heather',
      'Living-wage certified',
    ],
    specifications: [
      { label: 'Dimensions', value: '240 × 300 cm' },
      { label: 'Pile height', value: '12 mm' },
      { label: 'Weight', value: '18 kg' },
      { label: 'Material', value: '100% New Zealand wool' },
      { label: 'Knot density', value: '144 per sq. inch' },
      { label: 'Backing', value: 'Cotton canvas' },
      { label: 'Country of origin', value: 'India' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 1280,
    cost: 720,
    images: [
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 56,
    quantity: 9,
    lowStockThreshold: 3,
    badges: [],
    collection: 'Highland',
    materials: '100% New Zealand wool, cotton canvas backing',
    care: 'Vacuum weekly without a beater bar. Rotate every 6 months for even wear. Professional clean only.',
    shippingNote: 'Ships in 5–7 business days. Rug pad included at no charge.',
    variants: {
      sizes: [
        { id: 's-160x230', name: '160 × 230 cm', value: '160 × 230 cm', priceDelta: -380, inStock: true },
        { id: 's-240x300', name: '240 × 300 cm', value: '240 × 300 cm', inStock: true },
        { id: 's-300x400', name: '300 × 400 cm', value: '300 × 400 cm', priceDelta: 720, inStock: true },
      ],
    },
    faqs: [
      { question: 'Will it shed?', answer: 'All wool rugs shed for the first 6 months — this is normal. Vacuum 2–3 times a week without a beater bar and shedding will taper off.' },
    ],
    reviews: [
      review('r1', 'Helen P.', 5, 'Gorgeous natural color', 'The undyed wool has a heathered oatmeal tone that works with everything. No shedding issues after the first month.', '2025-05-15', 8),
    ],
  },
  {
    id: 'p-coffee-table-marble',
    name: 'Tundra Marble Coffee Table',
    slug: 'tundra-marble-coffee-table',
    sku: 'AUR-FN-TM-018',
    categoryId: 'cat-furniture',
    shortDesc: 'Honed Carrara marble top on a blackened steel base.',
    description:
      'The Tundra coffee table pairs a 3 cm honed Carrara marble slab with a blackened steel base. The marble is honed rather than polished — softer to the touch, less glare, and more forgiving of fingerprints. The base is fabricated from 6 mm steel plate, powder-coated in matte black with adjustable levelers.',
    highlights: [
      '3 cm honed Carrara marble',
      '6 mm blackened steel base',
      'Adjustable levelers',
      'Matte black powder coat',
      '5-year warranty',
    ],
    specifications: [
      { label: 'Dimensions', value: '120 W × 70 D × 38 H cm' },
      { label: 'Top thickness', value: '3 cm' },
      { label: 'Weight', value: '74 kg' },
      { label: 'Top material', value: 'Honed Carrara marble' },
      { label: 'Base', value: '6 mm blackened steel, matte powder coat' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 980,
    cost: 540,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 49,
    quantity: 11,
    lowStockThreshold: 3,
    badges: ['Editor’s Pick'],
    collection: 'Tundra',
    materials: 'Honed Carrara marble, blackened steel',
    care: 'Wipe spills immediately — marble is porous and will etch from citrus, wine and vinegar. Re-seal annually with the included marble sealer.',
    shippingNote: 'Ships in 7–10 business days. White-glove delivery included.',
    variants: {
      sizes: [
        { id: 's-100', name: '100 cm', value: '100 cm', priceDelta: -180, inStock: true },
        { id: 's-120', name: '120 cm', value: '120 cm', inStock: true },
        { id: 's-140', name: '140 cm', value: '140 cm', priceDelta: 240, inStock: true },
      ],
    },
    faqs: [
      { question: 'Will the marble stain from coffee or wine?', answer: 'Marble is porous and will etch or stain from acidic spills if left. Wipe spills immediately and re-seal annually with the included sealer. Honing hides more wear than polishing.' },
    ],
    reviews: [
      review('r1', 'Adam B.', 5, 'The marble is real', 'Heavy, dense, beautiful veining. The honed finish is exactly what we wanted — no glare, soft to the touch.', '2025-05-05', 9),
    ],
  },
  {
    id: 'p-stoneware-bowl-set',
    name: 'Lune Stoneware Bowl Set',
    slug: 'lune-stoneware-bowl-set',
    sku: 'AUR-KC-LB-019',
    categoryId: 'cat-kitchen',
    shortDesc: 'Set of 4 speckled stoneware bowls, 600 ml.',
    description:
      'The Lune bowls match our dinner plates — same Saga, Japan kiln, same matte cream glaze with natural iron speckle. 600 ml capacity, generous for pasta, soup, ramen or grain bowls. Sold as a set of four.',
    highlights: [
      'Made in Saga, Japan',
      'High-fired stoneware, 1250°C',
      '600 ml capacity, 18 cm diameter',
      'Set of 4',
      'Dishwasher and microwave safe',
    ],
    specifications: [
      { label: 'Diameter', value: '18 cm' },
      { label: 'Depth', value: '7 cm' },
      { label: 'Capacity', value: '600 ml' },
      { label: 'Set size', value: '4 bowls' },
      { label: 'Material', value: 'High-fired stoneware' },
      { label: 'Care', value: 'Dishwasher, microwave, oven to 220°C' },
      { label: 'Country of origin', value: 'Japan' },
    ],
    price: 128,
    cost: 56,
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 92,
    quantity: 56,
    lowStockThreshold: 12,
    badges: [],
    collection: 'Lune',
    materials: 'High-fired stoneware, lead-free matte glaze',
    care: 'Dishwasher safe. Avoid thermal shock.',
    shippingNote: 'Ships in 1–2 business days.',
    variants: {
      colors: [
        { id: 'c-cream', name: 'Cream', value: 'Cream', swatch: '#e8e1d4', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true },
        { id: 'c-sage', name: 'Sage', value: 'Sage', swatch: '#8aa18b', inStock: true },
      ],
    },
    faqs: [
      { question: 'Do these match the Lune plates?', answer: 'Yes — same clay, same glaze, same kiln. Mix and match freely across the Lune collection.' },
    ],
    reviews: [
      review('r1', 'Tara K.', 5, 'Perfect everyday bowls', 'The right size for pasta, ramen, or salads. They’ve replaced six mismatched bowls in our cupboard.', '2025-05-12', 6),
    ],
  },
  {
    id: 'p-sconce-brass',
    name: 'Axis Brass Wall Sconce',
    slug: 'axis-brass-wall-sconce',
    sku: 'AUR-LT-AS-020',
    categoryId: 'cat-lighting',
    shortDesc: 'Solid brass plug-in wall sconce, dimmable switch.',
    description:
      'The Axis sconce is a swing-arm task light with a solid brass body and an opal glass shade. The switch is integrated into the backplate — tap to turn on, hold to dim. Ships as a plug-in sconce with a 2.4 m braided cord (no electrician required) or can be hardwired by an electrician. Tuned to 2700K, 450 lumens, CRI 95+.',
    highlights: [
      'Solid brass body',
      'Opal glass shade',
      'Integrated touch-dimmer',
      'Plug-in or hardwire',
      '2700K, 450 lm, CRI 95+',
    ],
    specifications: [
      { label: 'Overall dimensions', value: '40 W × 18 D × 12 H cm' },
      { label: 'Swing arm extension', value: 'Up to 55 cm from wall' },
      { label: 'Shade diameter', value: '12 cm' },
      { label: 'Cord length', value: '2.4 m braided fabric' },
      { label: 'Light source', value: 'Integrated LED, 2700K, 450 lm, CRI 95+' },
      { label: 'Wattage', value: '7 W' },
      { label: 'Mounting', value: 'Plug-in or hardwire (hardware included for both)' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 220,
    cost: 105,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    rating: 4.6,
    reviewCount: 41,
    quantity: 22,
    lowStockThreshold: 6,
    badges: ['New'],
    collection: 'Axis',
    materials: 'Solid brass, opal glass',
    care: 'Dust with a dry microfibre cloth. For the opal glass shade, use a damp cloth and dry immediately.',
    shippingNote: 'Ships in 2–4 business days. No electrician required for plug-in installation.',
    variants: {
      colors: [
        { id: 'c-brass', name: 'Brushed Brass', value: 'Brass', swatch: '#b8945f', inStock: true },
        { id: 'c-black', name: 'Matte Black', value: 'Black', swatch: '#2b2622', inStock: true },
        { id: 'c-bronze', name: 'Bronze', value: 'Bronze', swatch: '#6b4f3a', inStock: true },
      ],
    },
    faqs: [
      { question: 'Can I convert from plug-in to hardwired later?', answer: 'Yes — the backplate is the same for both. An electrician can convert it in about 15 minutes by removing the cord and connecting to a junction box.' },
    ],
    reviews: [
      review('r1', 'Maya S.', 5, 'Perfect bedside reading light', 'The dimmer is the killer feature. I dim to 5% for late-night reading and it doesn’t wake my partner. Install was 10 minutes — no electrician.', '2025-05-08', 7),
    ],
  },
  {
    id: 'p-down-duvet',
    name: 'European White Down Duvet',
    slug: 'european-white-down-duvet',
    sku: 'AUR-BB-DD-021',
    categoryId: 'cat-bedding',
    shortDesc: '700-fill European white down, cotton batiste shell.',
    description:
      'Our duvet is filled with 700-fill-power European white down from RDS-certified farms, encased in a 400-thread-count cotton batiste shell that’s down-proof and silent. Baffle-box construction prevents the down from shifting. Lightweight for summer, layerable for winter. Sleeps cool and weightless.',
    highlights: [
      '700-fill European white down',
      'RDS-certified, traceable to farm',
      '400-thread-count cotton batiste shell',
      'Baffle-box construction',
      'Made in Germany',
    ],
    specifications: [
      { label: 'Queen size', value: '230 × 220 cm' },
      { label: 'King size', value: '260 × 240 cm' },
      { label: 'Fill weight', value: '900 g (Queen)' },
      { label: 'Fill power', value: '700' },
      { label: 'Shell', value: '400 TC cotton batiste, down-proof' },
      { label: 'Construction', value: 'Baffle-box, 30 × 30 cm squares' },
      { label: 'Certification', value: 'RDS, OEKO-TEX, Nomite (asthma-friendly)' },
      { label: 'Country of origin', value: 'Germany' },
    ],
    price: 410,
    comparePrice: 480,
    cost: 195,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 134,
    quantity: 32,
    lowStockThreshold: 8,
    badges: [],
    collection: 'Aurelia',
    materials: 'European white down, cotton batiste',
    care: 'Air out monthly. Machine wash in a front-loading machine on delicate, tumble dry low with three tennis balls to redistribute the down. Professional clean recommended annually.',
    shippingNote: 'Ships in 1–2 business days. Compressed — fluffs up in 24 hours.',
    variants: {
      sizes: [
        { id: 's-twin', name: 'Twin', value: 'Twin', priceDelta: -110, inStock: true },
        { id: 's-queen', name: 'Queen', value: 'Queen', inStock: true },
        { id: 's-king', name: 'King', value: 'King', priceDelta: 70, inStock: true },
      ],
    },
    faqs: [
      { question: 'Is it suitable for hot sleepers?', answer: 'Yes — this is a lightweight summer duvet. For winter, layer with a wool blanket or buy our winter-weight duvet (1200 g fill).' },
    ],
    reviews: [
      review('r1', 'Sophie L.', 5, 'Best sleep I’ve had in years', 'Lightweight but warm. Doesn’t shift. The shell is genuinely silent — no rustling. Worth the price.', '2025-05-14', 11),
    ],
  },
  {
    id: 'p-diffuser-fig',
    name: 'Black Fig & Cedar Diffuser',
    slug: 'black-fig-cedar-diffuser',
    sku: 'AUR-FR-BF-022',
    categoryId: 'cat-fragrance',
    shortDesc: 'Reed diffuser with fig leaf, cedar and vetiver, 200 ml.',
    description:
      'Black Fig & Cedar is a dry, green, woody scent — fig leaf on top, cedar heart, vetiver base. The 200 ml diffuser lasts 4–6 months and works in any room up to 25 m². The bottle is smoked glass with a solid oak cap; the reeds are natural rattan. No flip required for the first 30 days.',
    highlights: [
      '200 ml, 4–6 month throw',
      'Fig leaf, cedar, vetiver',
      'Smoked glass with oak cap',
      'Natural rattan reeds',
      'Alcohol-free, phthalate-free',
    ],
    specifications: [
      { label: 'Volume', value: '200 ml' },
      { label: 'Scent throw', value: 'Up to 25 m²' },
      { label: 'Lifespan', value: '4–6 months' },
      { label: 'Bottle', value: 'Smoked glass, oak cap' },
      { label: 'Reeds', value: '10 × natural rattan, 25 cm' },
      { label: 'Notes', value: 'Top: fig leaf, cassis. Heart: cedar, cypress. Base: vetiver, musk' },
      { label: 'Country of origin', value: 'USA' },
    ],
    price: 56,
    cost: 22,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviewCount: 73,
    quantity: 64,
    lowStockThreshold: 15,
    badges: [],
    collection: 'Black Fig',
    materials: 'Smoked glass, oak cap, rattan reeds',
    care: 'Flip reeds every 2 weeks for refreshed scent. Avoid direct sunlight to extend the lifespan.',
    shippingNote: 'Ships in 1–2 business days.',
    variants: {},
    faqs: [
      { question: 'How strong is the scent?', answer: 'Designed for a medium room up to 25 m². In a larger room, the scent will be subtle. For open-plan spaces, pair with the matching candle.' },
    ],
    reviews: [
      review('r1', 'Eva R.', 4, 'Lovely, complex scent', 'The fig note is real — green and slightly sweet, not the fake fig of cheap diffusers. Lasted 5 months before I noticed the throw weakening.', '2025-04-25', 5),
    ],
  },
  {
    id: 'p-leather-wallet',
    name: 'Bifold Leather Wallet',
    slug: 'bifold-leather-wallet',
    sku: 'AUR-AC-BW-023',
    categoryId: 'cat-accessories',
    shortDesc: 'Slim full-grain leather bifold, 8 card slots, made in Spain.',
    description:
      'The bifold wallet is cut from the same vegetable-tanned leather as our Atelier tote, in the same Spanish workshop. Eight card slots, a bill compartment lined with cotton, and edge-painted finishes for a clean look. Slim enough for a front pocket, holds enough for daily use.',
    highlights: [
      'Full-grain vegetable-tanned leather',
      '8 card slots',
      'Cotton-lined bill compartment',
      'Edge-painted, hand-burnished',
      'Made in Spain',
    ],
    specifications: [
      { label: 'Closed dimensions', value: '11 × 9 cm' },
      { label: 'Open dimensions', value: '22 × 9 cm' },
      { label: 'Card slots', value: '8' },
      { label: 'Material', value: 'Full-grain vegetable-tanned leather, 1.6 mm' },
      { label: 'Weight', value: '80 g' },
      { label: 'Country of origin', value: 'Spain' },
      { label: 'Warranty', value: '5-year' },
    ],
    price: 110,
    cost: 48,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 124,
    quantity: 48,
    lowStockThreshold: 12,
    badges: [],
    collection: 'Atelier',
    materials: 'Full-grain vegetable-tanned leather',
    care: 'Condition annually with a neutral leather balm. Avoid overstuffing — the leather will stretch slightly to fit what you carry, but only by 10–15%.',
    shippingNote: 'Ships in 1–2 business days. Complimentary blind debossing available.',
    variants: {
      colors: [
        { id: 'c-tan', name: 'Tan', value: 'Tan', swatch: '#b08560', inStock: true },
        { id: 'c-cognac', name: 'Cognac', value: 'Cognac', swatch: '#8a4f2c', inStock: true },
        { id: 'c-black', name: 'Black', value: 'Black', swatch: '#1a1815', inStock: true },
        { id: 'c-olive', name: 'Olive', value: 'Olive', swatch: '#5c5a3a', inStock: true, priceDelta: 20 },
      ],
    },
    faqs: [
      { question: 'Is it RFID-blocking?', answer: 'No — we don’t add RFID-blocking lining because the vegetable-tanned leather is thin enough to feel good in a pocket and most modern cards use chip+PIN or contactless, both of which RFID-blocking doesn’t affect anyway.' },
    ],
    reviews: [
      review('r1', 'Daniel R.', 5, 'Perfect everyday wallet', 'Slim, holds 8 cards plus cash, the leather has already started to develop a patina after 3 weeks. Replaced a Bellroy that was twice the price.', '2025-05-10', 12),
    ],
  },
  {
    id: 'p-outdoor-rug',
    name: 'Recycled Plastic Outdoor Rug',
    slug: 'recycled-plastic-outdoor-rug',
    sku: 'AUR-OD-OR-024',
    categoryId: 'cat-outdoor',
    shortDesc: 'Hand-woven recycled PET, UV-stable, 240 × 300 cm.',
    description:
      'Our outdoor rug is hand-woven from recycled PET plastic — looks like wool, performs like polypropylene. UV-stable colors that won’t fade in direct sun, and 100% waterproof — leave it out in the rain and it dries in an hour. Each rug diverts 1,200 plastic bottles from landfill.',
    highlights: [
      'Hand-woven recycled PET',
      'UV-stable, 100% waterproof',
      '240 × 300 cm',
      '1,200 plastic bottles diverted per rug',
      'Hose-cleanable',
    ],
    specifications: [
      { label: 'Dimensions', value: '240 × 300 cm' },
      { label: 'Pile height', value: '6 mm' },
      { label: 'Weight', value: '8 kg' },
      { label: 'Material', value: '100% recycled PET' },
      { label: 'UV resistance', value: '1,500 hours' },
      { label: 'Care', value: 'Hose down, air dry' },
      { label: 'Country of origin', value: 'India' },
    ],
    price: 290,
    cost: 130,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=1200&q=80',
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    reviewCount: 38,
    quantity: 19,
    lowStockThreshold: 5,
    badges: ['New'],
    collection: 'Recycled',
    materials: '100% recycled PET',
    care: 'Hose down to clean. Air dry flat. UV-stable to 1,500 hours — that’s about 3 summers of full sun.',
    shippingNote: 'Ships in 3–5 business days.',
    variants: {
      sizes: [
        { id: 's-180x270', name: '180 × 270 cm', value: '180 × 270 cm', priceDelta: -60, inStock: true },
        { id: 's-240x300', name: '240 × 300 cm', value: '240 × 300 cm', inStock: true },
        { id: 's-300x400', name: '300 × 400 cm', value: '300 × 400 cm', priceDelta: 140, inStock: true },
      ],
      colors: [
        { id: 'c-stripe', name: 'Sage Stripe', value: 'Sage', swatch: '#8aa18b', inStock: true },
        { id: 'c-natural', name: 'Natural', value: 'Natural', swatch: '#d8c9a8', inStock: true },
        { id: 'c-charcoal', name: 'Charcoal', value: 'Charcoal', swatch: '#3d3a36', inStock: true },
      ],
    },
    faqs: [
      { question: 'Does it feel like plastic?', answer: 'No — the recycled PET fibers are woven tight enough that the texture is similar to flat-weave wool. Soft on bare feet, no plastic feel.' },
    ],
    reviews: [
      review('r1', 'Olivia T.', 5, 'Survived a summer on the deck', 'Full sun, rain, spilled wine, dog. Hose it off and it’s clean. Better than I expected for the price.', '2025-05-02', 4),
    ],
  },
]

// ----------------------------------------------------------------------------
// Testimonials
// ----------------------------------------------------------------------------

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Margaret Langford',
    role: 'Interior Designer',
    location: 'Brooklyn, NY',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content:
      'I specify Aurelia in almost every project now. The quality is consistent, the lead times are reliable, and my clients are always happier with the result than when I spec pieces from the big trade brands. The Aalto sofa in particular has become my go-to.',
    product: 'Aalto 3-Seater Sofa',
  },
  {
    id: 't2',
    name: 'David Reyes',
    role: 'Architect',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content:
      'The Mason dining table is the only piece in our house that every guest comments on. The fact that they sent photos of the actual slab before shipping tells you everything about how they treat customers.',
    product: 'Mason Walnut Dining Table',
  },
  {
    id: 't3',
    name: 'Priya Sharma',
    role: 'Photographer',
    location: 'Portland, OR',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content:
      'I bought the Atelier tote two years ago and it’s still the only bag I carry. The patina is gorgeous — it looks better now than the day I got it. Worth every penny and then some.',
    product: 'Atelier Leather Tote',
  },
  {
    id: 't4',
    name: 'Henry Chen',
    role: 'Chef',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content:
      'I cook for a living and the Forge skillet is what I use at home every night. The surface is smoother than my grandmother’s 40-year-old pan, and it cleans up in seconds. The Lune plates have also survived my kitchen for a year without a chip.',
    product: 'Forge Cast Iron Skillet',
  },
  {
    id: 't5',
    name: 'Elena Marchetti',
    role: 'Furniture Maker',
    location: 'Hudson, NY',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content:
      'As someone who builds furniture for a living, I’m picky. The joinery on the Halden lounge chair is genuinely good — not mass-produced good, actually good. The leather sling is the right weight, the frame is the right wood, the hardware is real. I recommend Aurelia to everyone who asks.',
    product: 'Halden Lounge Chair',
  },
  {
    id: 't6',
    name: 'Sofia Bauer',
    role: 'Stylist',
    location: 'Los Angeles, CA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content:
      'The Arc mirror is the piece I pull into every photoshoot that needs warmth. The brass is real, the proportions are right, and it photographs beautifully. I’ve bought three for my own home since.',
    product: 'Arc Brass Wall Mirror',
  },
]

// ----------------------------------------------------------------------------
// FAQ
// ----------------------------------------------------------------------------

export const faqs: FAQItem[] = [
  { id: 'f1', category: 'Orders', question: 'How long will my order take to arrive?', answer: 'In-stock items ship within 1–2 business days from our New Jersey warehouse. Standard delivery takes 3–5 business days to most US addresses. Made-to-order furniture ships in 4–6 weeks; the product page will show the lead time clearly. You’ll receive a tracking number the moment any item ships.' },
  { id: 'f2', category: 'Orders', question: 'Do you offer international shipping?', answer: 'We ship to Canada, the UK, the EU, Australia and Japan. International orders are duties-paid — the price you see at checkout includes all import duties and taxes, so there are no surprises on delivery. Most international orders arrive in 7–14 business days.' },
  { id: 'f3', category: 'Orders', question: 'Can I change or cancel my order after placing it?', answer: 'Yes, within 2 hours of placing your order. Go to your account, find the order, and tap “Request change”. After 2 hours the order enters our fulfillment queue and changes are no longer possible — but you can always return the items for a full refund once they arrive.' },
  { id: 'f4', category: 'Returns', question: 'What is your return policy?', answer: 'We offer 30-day returns on most items, with free return shipping in the contiguous US. Items must be in their original condition with packaging. Made-to-order furniture, personalized items and clearance products are final sale. Start a return from your account page; we’ll send a prepaid label within one business day.' },
  { id: 'f5', category: 'Returns', question: 'How do refunds work?', answer: 'Once we receive your return at our warehouse (typically 3–5 business days after you ship), we inspect it and issue the refund within 48 hours. The refund goes back to your original payment method and usually appears on your statement within 3–5 business days.' },
  { id: 'f6', category: 'Shipping', question: 'Do you offer white-glove delivery?', answer: 'Yes, complimentary on all furniture orders over $1,500 in the contiguous US. White-glove includes a 2-person team, room of choice, full assembly, packaging removal, and a quick walkthrough of care instructions. In outlying areas a $150 surcharge may apply; we’ll always quote before charging.' },
  { id: 'f7', category: 'Shipping', question: 'Can I track my delivery?', answer: 'Yes. As soon as your order ships you’ll get an email with a tracking link. For white-glove deliveries, the carrier will call you 24 hours in advance to schedule a 4-hour window. You can also track every order from your account page.' },
  { id: 'f8', category: 'Products', question: 'Are your materials sustainable?', answer: 'All our wood is FSC-certified, our cotton and linen are OEKO-TEX Standard 100, our leather is vegetable-tanned (no chrome), and our packaging is 100% recyclable. We publish a full materials report annually on our About page.' },
  { id: 'f9', category: 'Products', question: 'Do you offer fabric or finish swatches?', answer: 'Yes — up to 5 free swatches per household. Go to any product page, tap “Order free swatch”, and select the finishes you’d like to feel. Swatches arrive in 5–7 business days.' },
  { id: 'f10', category: 'Products', question: 'Can I order replacement parts?', answer: 'Yes. We stock replacement cushions, shades, hardware and legs for every product we currently sell. Contact support with your order number and we’ll send a quote within one business day.' },
  { id: 'f11', category: 'Account', question: 'Do I need an account to order?', answer: 'No — you can check out as a guest. Creating an account makes future orders faster, lets you track shipments, save favorites to your wishlist, and view your order history. Accounts are free and we never sell your data.' },
  { id: 'f12', category: 'Account', question: 'How do I reset my password?', answer: 'Visit the login page and tap “Forgot password”. Enter the email associated with your account and we’ll send a reset link valid for 30 minutes. If you don’t see the email, check your spam folder or contact support.' },
  { id: 'f13', category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, PayPal and Shop Pay. We also offer 0% APR financing through Affirm on orders over $250 — choose Affirm at checkout to see your terms.' },
  { id: 'f14', category: 'Payment', question: 'Is checkout secure?', answer: 'Yes. All payments are encrypted with TLS 1.3 and processed through PCI-DSS Level 1 certified providers. We never see or store your full card number — only a token from your bank.' },
  { id: 'f15', category: 'Warranty', question: 'What is your warranty?', answer: 'Every Aurelia product is covered by a minimum 2-year warranty against manufacturing defects. Furniture frames carry a 10-year warranty; cast iron cookware has a lifetime warranty. Warranty does not cover normal wear, misuse or modifications. See our warranty page for full terms.' },
]

// ----------------------------------------------------------------------------
// Coupons
// ----------------------------------------------------------------------------

export const coupons: Coupon[] = [
  { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrder: 0, description: '10% off your first order', expiry: '2026-12-31' },
  { code: 'FREESHIP', type: 'FREE_SHIPPING', value: 0, minOrder: 0, description: 'Free shipping on any order', expiry: '2026-12-31' },
  { code: 'AURELIA25', type: 'PERCENTAGE', value: 25, minOrder: 500, description: '25% off orders over $500', expiry: '2026-12-31' },
  { code: 'SAVE50', type: 'FIXED', value: 50, minOrder: 250, description: '$50 off orders over $250', expiry: '2026-12-31' },
  { code: 'HOLIDAY15', type: 'PERCENTAGE', value: 15, minOrder: 100, description: '15% off orders over $100', expiry: '2026-12-31' },
]

// ----------------------------------------------------------------------------
// Brand partners / press mentions
// ----------------------------------------------------------------------------

export const pressMentions: Brand[] = [
  { id: 'b1', name: 'Architectural Digest', blurb: '“The kind of furniture you hand down, not replace.”' },
  { id: 'b2', name: 'Dwell', blurb: '“Aurelia is redefining what direct-to-consumer furniture can be.”' },
  { id: 'b3', name: 'The New York Times', blurb: '“A rare combination of design and durability at a fair price.”' },
  { id: 'b4', name: 'Kinfolk', blurb: '“Quiet, considered, and built to last.”' },
  { id: 'b5', name: 'Wirecutter', blurb: '“Our pick for the best modular sofa under $3,000.”' },
  { id: 'b6', name: 'Monocle', blurb: '“A brand worth watching in 2026.”' },
]

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badges.includes('Best Seller') || p.badges.includes('Editor’s Pick'))
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.badges.includes('New'))
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.reviewCount > 100).slice(0, 8)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents)
}
