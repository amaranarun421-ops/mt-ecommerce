/**
 * AURIC — central data layer
 * All product, review, FAQ, policy, and testimonial content lives here.
 */

export type ColorOption = {
  id: string;
  name: string;
  nameAr: string;
  hex: string;
  ringHex: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  altAr: string;
  kind: "hero" | "side" | "detail" | "lifestyle" | "feature" | "packaging" | "accessory";
};

export type Spec = {
  label: string;
  labelAr: string;
  value: string;
  valueAr: string;
};

export type Feature = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string; // lucide icon name
  image: string;
};

export type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  date: string;
  verified: boolean;
  helpful: number;
  variant: string;
};

export type FAQItem = {
  q: string;
  qAr: string;
  a: string;
  aAr: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  roleAr: string;
  quote: string;
  quoteAr: string;
  avatar: string;
  rating: number;
};

export type Order = {
  id: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled" | "returned";
  total: number;
  items: { name: string; variant: string; qty: number; price: number }[];
  tracking?: {
    steps: { label: string; date: string; done: boolean }[];
    estimatedDelivery: string;
  };
};

export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type SupportArticle = {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  excerpt: string;
  excerptAr: string;
  body: string;
  bodyAr: string;
};

/* ------------------------------------------------------------------ */
/* PRODUCT                                                             */
/* ------------------------------------------------------------------ */

export const product = {
  brand: "AURIC",
  name: "AURIC ONE",
  nameAr: "أوريك ون",
  tagline: "Sound, Refined.",
  taglineAr: "الصوت، بكل تفاصيله.",
  collection: "Reference Series",
  collectionAr: "سلسلة المرجع",
  sku: "AUR-ONE-MK2",
  rating: 4.9,
  reviewCount: 2847,
  price: 549,
  compareAtPrice: 699,
  currency: "USD",
  currencySymbol: "$",
  stock: 124,
  lowStockThreshold: 20,
  shortDescription:
    "Reference-grade wireless headphones with 40mm beryllium drivers, adaptive ANC, 60-hour battery, and lossless Hi-Res audio.",
  shortDescriptionAr:
    "سماعات لاسلكية بمعايير مرجعية مع محركات بيريليوم 40 مم، إلغاء ضوضاء تكيّفي، بطارية 60 ساعة، وصوت Hi-Res فائق.",
  longDescription:
    "The AURIC ONE is the product of three years of acoustic engineering. At its heart sit 40mm beryllium drivers — machined to within 0.5 microns — paired with a custom Class-A discrete amplifier that delivers studio-grade transients without the fatigue of typical high-frequency boost. The adaptive noise cancellation reads your environment 50,000 times per second, while the suspension headband and protein-leather earcups distribute weight so evenly that 8-hour sessions feel like minutes. This is not a headphone. It is an instrument.",
  longDescriptionAr:
    "سماعة أوريك ون هي نتاج ثلاث سنوات من الهندسة الصوتية. في قلبها محركات بيريليوم 40 مم — مشغولة بدقة 0.5 ميكرون — مقترنة بمضخم Class-A مخصص يقدم تحولات استوديو دون إرهاق. يقرأ إلغاء الضوضاء التكيّفي بيئتك 50,000 مرة في الثانية، بينما توزّع عصابة الرأس المعلّقة وكؤوس الأذن الجلدية البروتينية الوزن بالتساوي. هذه ليست سماعة، بل آلة موسيقية.",
  highlights: [
    "40mm beryllium drivers",
    "Adaptive ANC (50k samples/sec)",
    "60-hour battery, USB-C fast charge",
    "Lossless Hi-Res certified",
  ],
  highlightsAr: [
    "محركات بيريليوم 40 مم",
    "إلغاء ضوضاء تكيّفي 50 ألف/ث",
    "بطارية 60 ساعة، شحن سريع USB-C",
    "معتمدة Hi-Res فائق",
  ],
};

export const productColors: ColorOption[] = [
  {
    id: "obsidian",
    name: "Obsidian Black",
    nameAr: "أسود الأوبسيديان",
    hex: "#1A1816",
    ringHex: "#2D2A26",
  },
  {
    id: "champagne",
    name: "Champagne Gold",
    nameAr: "ذهب شامبين",
    hex: "#C8954B",
    ringHex: "#E1B876",
  },
  {
    id: "silver",
    name: "Brushed Silver",
    nameAr: "فضي مصقول",
    hex: "#C7C9CC",
    ringHex: "#E0E2E5",
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    nameAr: "أزرق منتصف الليل",
    hex: "#1E2A44",
    ringHex: "#34466B",
  },
];

export const productImages: ProductImage[] = [
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    alt: "AURIC ONE headphones front three-quarter view",
    altAr: "سماعة أوريك ون - منظر أمامي ثلاثي الأبعاد",
    kind: "hero",
  },
  {
    src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1600&q=80",
    alt: "AURIC ONE side profile showing ear cup detail",
    altAr: "سماعة أوريك ون - منظر جانبي",
    kind: "side",
  },
  {
    src: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&q=80",
    alt: "AURIC ONE detail of headband stitching",
    altAr: "تفاصيل خياطة عصابة الرأس",
    kind: "detail",
  },
  {
    src: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=1600&q=80",
    alt: "AURIC ONE on a marble desk lifestyle",
    altAr: "سماعة أوريك ون على طاولة رخام",
    kind: "lifestyle",
  },
  {
    src: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1600&q=80",
    alt: "AURIC ONE ear cup driver close-up",
    altAr: "لقطة قريبة لمحرك كوب الأذن",
    kind: "feature",
  },
  {
    src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1600&q=80",
    alt: "AURIC ONE packaging and unboxing",
    altAr: "علبة سماعة أوريك ون أثناء فتحها",
    kind: "packaging",
  },
];

export const productSpecs: Spec[] = [
  { label: "Driver", labelAr: "المحرك", value: "40mm beryllium", valueAr: "بيريليوم 40 مم" },
  { label: "Frequency Response", labelAr: "الاستجابة الترددية", value: "5 Hz – 40 kHz", valueAr: "5 هرتز – 40 كيلوهرتز" },
  { label: "Impedance", labelAr: "المقاومة", value: "32 Ω", valueAr: "32 أوم" },
  { label: "Battery Life", labelAr: "عمر البطارية", value: "60 hours (ANC on)", valueAr: "60 ساعة (مع إلغاء الضوضاء)" },
  { label: "Fast Charge", labelAr: "الشحن السريع", value: "5 min = 5 hours", valueAr: "5 دقائق = 5 ساعات" },
  { label: "Connectivity", labelAr: "الاتصال", value: "Bluetooth 5.4 / USB-C", valueAr: "بلوتوث 5.4 / USB-C" },
  { label: "Codecs", labelAr: "برامج الترميز", value: "LDAC / aptX HD / AAC / SBC", valueAr: "LDAC / aptX HD / AAC / SBC" },
  { label: "Weight", labelAr: "الوزن", value: "284 g", valueAr: "284 جرام" },
  { label: "Microphone", labelAr: "الميكروفون", value: "8-mic beamforming array", valueAr: "مصفوفة 8 ميكروفونات" },
  { label: "Water Resistance", labelAr: "مقاومة الماء", value: "IPX4", valueAr: "IPX4" },
  { label: "Materials", labelAr: "المواد", value: "Aircraft aluminum, protein leather", valueAr: "ألمنيوم طيران، جلد بروتيني" },
  { label: "Warranty", labelAr: "الضمان", value: "2 years", valueAr: "سنتان" },
];

export const productFeatures: Feature[] = [
  {
    id: "drivers",
    title: "40mm Beryllium Drivers",
    titleAr: "محركات بيريليوم 40 مم",
    description:
      "Machined to within 0.5 microns, our beryllium drivers deliver transients so fast and a soundstage so wide that mastering engineers ask to borrow them.",
    descriptionAr:
      "مشغولة بدقة 0.5 ميكرون، محركاتنا البيريليوم تقدم تحولات سريعة ومسرحاً صوتياً واسعاً يجعل مهندسي الماسترينغ يطلبون استعارتها.",
    icon: "AudioWaveform",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "anc",
    title: "Adaptive Noise Cancellation",
    titleAr: "إلغاء الضوضاء التكيّفي",
    description:
      "Eight microphones read your environment 50,000 times per second and shape the cancellation curve in real time. From a quiet office to a jet cabin, the world drops away.",
    descriptionAr:
      "ثمانية ميكروفونات تقرأ بيئتك 50,000 مرة في الثانية وتشكّل منحنى الإلغاء لحظياً. من المكتب الهادئ إلى مقصورة الطائرة، يختفي العالم.",
    icon: "Waves",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "battery",
    title: "60-Hour Battery",
    titleAr: "بطارية 60 ساعة",
    description:
      "Three days of continuous playback on a single charge. A five-minute top-up via USB-C gives you five more hours. The charger lives in your bag, not your daily routine.",
    descriptionAr:
      "ثلاثة أيام من التشغيل المستمر بشحنة واحدة. خمس دقائق عبر USB-C تمنحك خمس ساعات إضافية. الشاحن يعيش في حقيبتك، ليس في روتينك اليومي.",
    icon: "BatteryFull",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "comfort",
    title: "Suspension Headband",
    titleAr: "عصابة رأس معلّقة",
    description:
      "A floating suspension headband and protein-leather earcups distribute weight so evenly that eight-hour sessions feel weightless. No hot spots. No fatigue. Just sound.",
    descriptionAr:
      "عصابة رأس عائمة وكؤوس أذن جلدية بروتينية توزّع الوزن بالتساوي فتشعر بأن جلسات الثماني ساعات بلا وزن. لا ضغط، لا إرهاق. صوت فقط.",
    icon: "Feather",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const accessories = [
  {
    id: "case",
    name: "AURIC Travel Case",
    nameAr: "علبة سفر أوريك",
    price: 79,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1000&q=80",
    description: "Hand-stitched leather travel case with magnetic clasp.",
    descriptionAr: "علبة سفر جلدية مخيطة يدوياً بمشبك مغناطيسي.",
  },
  {
    id: "cable",
    name: "Braided USB-C Cable (2m)",
    nameAr: "كابل USB-C مجدول (2 متر)",
    price: 29,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80",
    description: "OFC copper, USB-C to USB-C, supports 100W PD.",
    descriptionAr: "نحاس OFC، USB-C إلى USB-C، يدعم 100 واط.",
  },
  {
    id: "pads",
    name: "Replacement Ear Pads",
    nameAr: "وسائد أذن بديلة",
    price: 49,
    image: "https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&fit=crop&w=1000&q=80",
    description: "Protein leather pair. Tool-free installation.",
    descriptionAr: "زوج جلد بروتيني. تركيب دون أدوات.",
  },
  {
    id: "stand",
    name: "AURIC Desktop Stand",
    nameAr: "حامل سطح المكتب أوريك",
    price: 99,
    image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=1000&q=80",
    description: "Solid aluminum stand, weighted base.",
    descriptionAr: "حامل ألمنيوم صلب بقاعدة مثقلة.",
  },
];

export const comparisonRows: {
  feature: string;
  featureAr: string;
  auric: string;
  auricAr: string;
  competitor: { name: string; nameAr: string; value: string; valueAr: string };
}[] = [
  {
    feature: "Driver Material",
    featureAr: "مادة المحرك",
    auric: "Beryllium",
    auricAr: "بيريليوم",
    competitor: { name: "Brand A", nameAr: "العلامة أ", value: "Titanium", valueAr: "تيتانيوم" },
  },
  {
    feature: "Battery (ANC on)",
    featureAr: "البطارية (مع الإلغاء)",
    auric: "60 hrs",
    auricAr: "60 ساعة",
    competitor: { name: "Brand A", nameAr: "العلامة أ", value: "30 hrs", valueAr: "30 ساعة" },
  },
  {
    feature: "Codec",
    featureAr: "الترميز",
    auric: "LDAC + aptX HD",
    auricAr: "LDAC + aptX HD",
    competitor: { name: "Brand A", nameAr: "العلامة أ", value: "AAC only", valueAr: "AAC فقط" },
  },
  {
    feature: "Fast Charge",
    featureAr: "الشحن السريع",
    auric: "5 min = 5 hrs",
    auricAr: "5 دقائق = 5 ساعات",
    competitor: { name: "Brand A", nameAr: "العلامة أ", value: "10 min = 2 hrs", valueAr: "10 دقائق = 2 ساعة" },
  },
  {
    feature: "Microphones",
    featureAr: "الميكروفونات",
    auric: "8-mic array",
    auricAr: "مصفوفة 8 ميكروفونات",
    competitor: { name: "Brand A", nameAr: "العلامة أ", value: "4 mics", valueAr: "4 ميكروفونات" },
  },
  {
    feature: "Warranty",
    featureAr: "الضمان",
    auric: "2 years",
    auricAr: "سنتان",
    competitor: { name: "Brand A", nameAr: "العلامة أ", value: "1 year", valueAr: "سنة واحدة" },
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Marcus Reed",
    location: "Brooklyn, NY",
    rating: 5,
    title: "The first headphone that made me stop buying headphones",
    titleAr: "أول سماعة جعلتني أتوقف عن شراء السماعات",
    body: "I've owned everything from the Sony XM5 to the Sennheiser HD 800S. The AURIC ONE sits in a strange middle ground — it has the warmth of an open-back planar with the isolation of a closed-back ANC. The beryllium drivers resolve cymbal decays I genuinely hadn't heard on records I've listened to for fifteen years. The 60-hour battery isn't a marketing number; I charged it once on a Tuesday and the next charge was the following Wednesday. This is the first headphone in a decade that made me stop wanting to buy other headphones.",
    bodyAr: "امتلكت كل شيء من سوني XM5 إلى سينهايزر HD 800S. سماعة أوريك ون تقف في منطقة وسطى غريبة — لديها دفء البلانار المفتوح مع عزل الإلغاء المغلق. محركات البيريليوم تظهر تفاصيل أصوات السيبال التي لم أسمعها فعلاً في تسجيلات استمعت إليها لخمسة عشر عاماً. رقم 60 ساعة ليس تسويقاً؛ شحنتها يوم ثلاثاء والمرة التالية كانت الأربعاء التالي.",
    date: "2025-06-12",
    verified: true,
    helpful: 248,
    variant: "Obsidian Black",
  },
  {
    id: "r2",
    name: "Aisha Khoury",
    location: "Dubai, UAE",
    rating: 5,
    title: "Worth every dirham — finally an endgame headphone",
    titleAr: "تستحق كل درهم — أخيراً سماعة المرحلة النهائية",
    body: "I do studio work and was skeptical that a wireless pair could replace my wired reference monitors. After two weeks of mixing on the AURIC ONE, I shipped a record. The midrange is honest — vocals sit where they should, no scooping, no hype. The adaptive ANC is so good I forgot I was on a flight until the captain spoke. Build quality is the best I've seen at this price, and the case feels like a luxury watch box.",
    bodyAr: "أعمل في الاستوديو وكنت متشككة أن سماعة لاسلكية تستبدل شاشاتي المرجعية السلكية. بعد أسبوعين من المكسينج على أوريك ون، شحنّت ألبوماً. المدى المتوسط صادق — الأصوات تجلس حيث يجب، لا تضخيم ولا غياب. إلغاء الضوضاء ممتاز لدرجة أنني نسيت أنني على رحلة حتى تكلم القائد. الجودة الأفضل في هذا السعر.",
    date: "2025-05-28",
    verified: true,
    helpful: 192,
    variant: "Champagne Gold",
  },
  {
    id: "r3",
    name: "Daniel Okafor",
    location: "London, UK",
    rating: 4,
    title: "Outstanding sound, slight clamping force out of the box",
    titleAr: "صوت مذهل، ضغط بسيط عند البداية",
    body: "Sonically, the AURIC ONE is in another league — the soundstage extends well beyond the earcups and the imaging is precise enough to mix on. My only nitpick is the clamping force during the first week; it loosened up after about ten hours of wear and is now perfectly comfortable. Battery is genuinely multi-day. The LDAC support over Bluetooth is the killer feature for me — Tidal Masters sounds indistinguishable from my wired setup.",
    bodyAr: "صوتياً، أوريك ون في دوري آخر — المسرح الصوتي يمتد خارج الكؤوس وتحديد المواقع دقيق بما يكفي للمكسينج. ملاحظتي الوحيدة هي الضغط في الأسبوع الأول؛ خفّ بعد عشر ساعات وأصبح مريحاً. البطارية حقاً متعددة الأيام. دعم LDAC عبر البلوتوث هو الميزة القاتلة لي.",
    date: "2025-05-10",
    verified: true,
    helpful: 156,
    variant: "Brushed Silver",
  },
  {
    id: "r4",
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
    title: "A genuine Hi-Res wireless experience",
    titleAr: "تجربة Hi-Res لاسلكية حقيقية",
    body: "I've been waiting for a wireless headphone that doesn't compromise on codec support. LDAC at 990 kbps through the AURIC ONE is the closest I've heard wireless come to my wired HD 600. The build is impeccable — the champagne gold version photographs beautifully and the aluminum has a satisfying cold weight. The companion app's EQ is the most flexible I've used, with proper Q controls rather than the toy sliders most brands ship.",
    bodyAr: "كنت أنتظر سماعة لاسلكية لا تتنازل عن دعم الترميز. LDAC بسرعة 990 كيلوبت/ث عبر أوريك ون هو الأقرب لسماعاتي السلكية HD 600. البناء ممتاز — نسخة الذهب الشامبين تُصور بشكل جميل والألمنيوم له وزن بارد مرضي. تطبيق المُعادل الأكثر مرونة الذي استخدمته.",
    date: "2025-04-22",
    verified: true,
    helpful: 134,
    variant: "Champagne Gold",
  },
  {
    id: "r5",
    name: "Sophia Lindqvist",
    location: "Stockholm, Sweden",
    rating: 5,
    title: "Replaced three pairs with one",
    titleAr: "استبدلت ثلاث سماعات بواحدة",
    body: "I had separate headphones for commuting, working from home, and travel. The AURIC ONE does all three jobs better than the dedicated pair I had for each. ANC for the train, transparency mode that actually sounds natural for the office, and a battery that survives a transatlantic round trip with hours to spare. The fast charge saved me on a trip when I forgot to plug in overnight — five minutes gave me the entire flight.",
    bodyAr: "كان لدي سماعات منفصلة للتنقل والعمل والسفر. أوريك ون تقوم بالوظائف الثلاث أفضل من كل زوج متخصص. إلغاء للقطار، وضع شفاف طبيعي للمكتب، وبطارية تعاني رحلة عبر الأطلسي بساعات تتبقى. الشحن السريع أنقذني في رحلة.",
    date: "2025-04-08",
    verified: true,
    helpful: 118,
    variant: "Obsidian Black",
  },
  {
    id: "r6",
    name: "Hassan Al-Farsi",
    location: "Riyadh, Saudi Arabia",
    rating: 5,
    title: "Premium feel that matches the price",
    titleAr: "إحساس فاخر يطابق السعر",
    body: "From the unboxing to the first listen, every touchpoint feels considered. The case, the manual, the cable — nothing feels like an afterthought. Sound is rich and detailed without being fatiguing. The ANC handles the call to prayer from a nearby mosque perfectly — I can still hear it softly if I want, or block it entirely. After six months of daily use, no creaks, no wear on the pads, no battery degradation. This is a product built to last.",
    bodyAr: "من فتح العلبة إلى أول استماع، كل تفصيلة مدروسة. العلبة، الدليل، الكابل — لا شيء يبدو ثانوياً. الصوت غني ومفصّل دون إرهاق. إلغاء الضوضاء يتعامل مع أذان مسجد قريب تماماً. بعد ستة أشهر، لا صرير، لا تآكل في الوسائد، لا تدهور في البطارية.",
    date: "2025-03-19",
    verified: true,
    helpful: 97,
    variant: "Midnight Blue",
  },
];

export const reviewDistribution = [
  { stars: 5, count: 2418, percent: 85 },
  { stars: 4, count: 312, percent: 11 },
  { stars: 3, count: 78, percent: 3 },
  { stars: 2, count: 22, percent: 1 },
  { stars: 1, count: 17, percent: 1 },
];

export const faqs: FAQItem[] = [
  {
    q: "What makes the beryllium drivers special?",
    qAr: "ما الذي يميز محركات البيريليوم؟",
    a: "Beryllium is exceptionally light and rigid — about one-third the density of titanium with higher stiffness. This lets the diaphragm start and stop instantly, reducing distortion and revealing transients (cymbal decays, string attacks, breath details) that conventional drivers smear. We machine each driver to within 0.5 microns and individually measure every pair before they ship.",
    aAr: "البيريليوم خفيف وصلب بشكل استثنائي — حوالي ثلث كثافة التيتانيوم مع صلابة أعلى. هذا يتيح للغشاء البدء والتوقف فوراً، مما يقلل التشويه ويظهر التفاصيل التي تُمحى في المحركات التقليدية. نشغّل كل محرك بدقة 0.5 ميكرون ونقيس كل زوج قبل الشحن.",
  },
  {
    q: "How does the adaptive ANC work?",
    qAr: "كيف يعمل إلغاء الضوضاء التكيّفي؟",
    a: "Eight microphones (four outward-facing, four inward-facing) sample your environment 50,000 times per second. A dedicated DSP shapes the cancellation curve in real time — lower frequencies for engine rumble, mid-frequencies for voices, high frequencies for HVAC hiss. The result is a flat, comfortable silence rather than the ear-pressure sensation cheaper ANC causes.",
    aAr: "ثمانية ميكروفونات تأخذ عينات من بيئتك 50,000 مرة في الثانية. معالج DSP مخصص يشكّل منحنى الإلغاء لحظياً — ترددات منخفضة لدوي المحركات، متوسطة للأصوات، عالية لفحياح التكييف. النتيجة صمت مريح بدلاً من ضغط الأذن الذي تسببه أنظمة أرخص.",
  },
  {
    q: "Is the battery replaceable?",
    qAr: "هل البطارية قابلة للاستبدال؟",
    a: "The battery is not user-replaceable, but our service program offers a $79 battery replacement at any time, with a 48-hour turnaround. We expect the battery to retain 80% capacity after 1,000 charge cycles — roughly five years of daily use. The cells are sourced from a Tier-1 supplier and individually load-tested.",
    aAr: "البطارية غير قابلة للاستبدال من المستخدم، لكن برنامج الخدمة لدينا يقدم استبدال بـ 79 دولار في أي وقت خلال 48 ساعة. نتوقع أن تحتفظ البطارية بـ 80% من سعتها بعد 1,000 دورة شحن — حوالي خمس سنوات من الاستخدام اليومي.",
  },
  {
    q: "What devices are compatible?",
    qAr: "ما الأجهزة المتوافقة؟",
    a: "Any Bluetooth device supporting A2DP — iOS, Android, macOS, Windows, Linux. For Hi-Res audio, you'll need a source supporting LDAC (most modern Android devices) or aptX HD (Windows 11, supported Android). A USB-C to USB-C cable is included for wired lossless playback at up to 32-bit / 384 kHz.",
    aAr: "أي جهاز بلوتوث يدعم A2DP — iOS، أندرويد، macOS، ويندوز، لينكس. لصوت Hi-Res ستحتاج مصدراً يدعم LDAC (معظم أجهزة أندرويد الحديثة) أو aptX HD. كابل USB-C مرفق للتشغيل السلكي حتى 32-بت / 384 كيلوهرتز.",
  },
  {
    q: "What's the warranty and return policy?",
    qAr: "ما هي سياسة الضمان والإرجاع؟",
    a: "Every AURIC ONE includes a 2-year limited warranty covering manufacturing defects. We offer a 30-day return window — if you're not satisfied for any reason, return it for a full refund, no questions asked. Return shipping is on us within the US, EU, UK, AU, and GCC.",
    aAr: "كل سماعة أوريك ون تشمل ضمان سنتين ضد عيوب التصنيع. نقدم فترة إرجاع 30 يوماً — إذا لم تكن راضياً لأي سبب، أرجعها لمبلغ كامل. الشحن علينا في أمريكا وأوروبا والخليج.",
  },
  {
    q: "How long does shipping take?",
    qAr: "كم تستغرق مدة الشحن؟",
    a: "Orders ship within 24 hours from our warehouses in LA, Amsterdam, and Dubai. Standard delivery is 2–5 business days; express is 1–2 business days. All orders include tracking and ship free over $200. Duties and taxes are included for US, EU, UK, AU, JP, SG, AE, and SA.",
    aAr: "تُشحن الطلبات خلال 24 ساعة من مستودعاتنا في لوس أنجلوس وأمستردام ودبي. التوصيل القياسي 2-5 أيام عمل؛ السريع 1-2 يوم. جميع الطلبات تشمل تتبعاً وشحناً مجانياً فوق 200 دولار. الرسوم والضرائب مشمولة للدول الرئيسية.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Marcus Reed",
    role: "Mastering Engineer, Sterling Sound",
    roleAr: "مهندس ماسترينغ، ستيرلينغ ساوند",
    quote:
      "I've mixed three records on the AURIC ONE. The translation to my studio monitors is the best I've heard from any wireless pair — and better than most wired ones under $1,500.",
    quoteAr: "مزجت ثلاثة ألبومات على أوريك ون. الترجمة إلى شاشات الاستوديو هي الأفضل التي سمعتها من أي سماعة لاسلكية — وأفضل من معظم السلكية تحت 1,500 دولار.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    id: "t2",
    name: "Aisha Khoury",
    role: "Producer, Atlantic Records",
    roleAr: "منتجة، أتلانتيك ريكوردز",
    quote:
      "The kind of headphone that disappears. You stop hearing the equipment and start hearing the music. That's the highest compliment I can give any audio product.",
    quoteAr: "النوع من السماعات الذي يختفي. تتوقف عن سماع المعدات وتبدأ بسماع الموسيقى. هذه أعلى مجاملة يمكنني تقديمها لأي منتج صوتي.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    id: "t3",
    name: "Daniel Okafor",
    role: "Composer, BBC Philharmonic",
    roleAr: "ملحن، بي بي سي الفيلهارمونية",
    quote:
      "I A/B tested the AURIC ONE against my $4,000 reference chain. For orchestral work, the imaging in the upper strings was actually more honest on the AURIC. That shouldn't be possible at this price.",
    quoteAr: "قارنت أوريك ون بسلسلة مرجعية بـ 4,000 دولار. للأعمال الأوركسترالية، كان تحديد المواقع في الوتر العلوي أكثر صدقاً على أوريك. هذا لا ينبغي أن يكون ممكناً عند هذا السعر.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
];

export const brandStory = {
  founded: "2021",
  foundedAr: "2021",
  headquarters: "Copenhagen, Denmark",
  headquartersAr: "كوبنهاغن، الدنمارك",
  teamSize: "47 engineers, designers, and craftspeople",
  teamSizeAr: "47 مهندساً ومصمماً وحرفياً",
  story:
    "AURIC was founded by three former Bang & Olufsen engineers who believed wireless audio had stopped short of its potential. We started in a Copenhagen workshop in 2021 with a single question: what would a wireless headphone sound like if cost were no object, but the engineering were ruthless? The AURIC ONE is the answer that took us three years to ship. Every driver is hand-measured. Every earcup is hand-stitched. Every unit is auditioned by a human ear before it goes in the box.",
  storyAr:
    "تأسست أوريك على يد ثلاثة مهندسين سابقين من بانغ آند أولوفسن الذين آمنوا أن الصوت اللاسلكي لم يصل لذاته. بدأنا في ورشة كوبنهاغن عام 2021 بسؤال واحد: كيف ستكون سماعة لاسلكية لو لم تكن التكلفة عائقاً، لكن الهندسة صارمة؟ أوريك ون هي الإجابة التي استغرقت ثلاث سنوات. كل محرك يُقاس يدوياً. كل كوب أذن يُخاط يدوياً. كل وحدة يُختبرها أذن بشرية قبل العلبة.",
  mission:
    "To build the last headphone you'll ever need to buy — and to make it sound the way the artist intended, with no compromises, no hype, and no apologies.",
  missionAr:
    "أن نبني آخر سماعة ستحتاج لشرائها — وأن نجعلها تبدو كما أراد الفنان، بلا تنازلات أو تضخيم أو اعتذار.",
  vision:
    "A world where wireless audio is the reference standard — not the compromise.",
  visionAr:
    "عالم يكون فيه الصوت اللاسلكي هو المعيار المرجعي — لا التسوية.",
};

export const policies = {
  shipping: {
    title: "Shipping Policy",
    titleAr: "سياسة الشحن",
    sections: [
      {
        heading: "Free Worldwide Shipping",
        headingAr: "شحن عالمي مجاني",
        body: "All orders over $200 ship free, worldwide. Orders below $200 incur a flat $15 shipping fee. We ship from warehouses in Los Angeles, Amsterdam, and Dubai to minimize transit times globally.",
        bodyAr: "جميع الطلبات فوق 200 دولار تُشحن مجاناً عالمياً. الطلبات أقل من 200 دولار تتكلف 15 دولار. نشحن من مستودعات في لوس أنجلوس وأمستردام ودبي لتقليل أوقات الشحن عالمياً.",
      },
      {
        heading: "Processing Time",
        headingAr: "وقت المعالجة",
        body: "Orders are processed and shipped within 24 hours of payment confirmation (Mon–Fri, excluding holidays). You'll receive a tracking number via email the moment your order leaves our warehouse.",
        bodyAr: "تُعالج الطلبات وتُشحن خلال 24 ساعة من تأكيد الدفع (الإثنين-الجمعة). ستتلقى رقم تتبع عبر البريد فور مغادرة الطلب المستودع.",
      },
      {
        heading: "Delivery Estimates",
        headingAr: "تقديرات التوصيل",
        body: "Standard delivery: 2–5 business days. Express delivery: 1–2 business days. Remote destinations may take up to 10 business days. Delivery times are estimates and not guaranteed.",
        bodyAr: "التوصيل القياسي: 2-5 أيام عمل. السريع: 1-2 يوم. الوجهات النائية قد تستغرق حتى 10 أيام. الأوقات تقديرية وغير مضمونة.",
      },
      {
        heading: "Duties & Taxes",
        headingAr: "الرسوم والضرائب",
        body: "All duties and taxes are included for shipments to the US, EU, UK, AU, JP, SG, AE, and SA. For other destinations, duties may apply at customs. We provide full commercial invoices to expedite clearance.",
        bodyAr: "جميع الرسوم والضرائب مشمولة للشحنات إلى أمريكا وأوروبا والخليج واليابان. للوجهات الأخرى قد تطبق رسوم جمركية.",
      },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    titleAr: "الإرجاع والاستبدال",
    sections: [
      {
        heading: "30-Day Return Window",
        headingAr: "فترة إرجاع 30 يوماً",
        body: "If you're not satisfied for any reason within 30 days of delivery, return the AURIC ONE for a full refund. No questions asked. Return shipping is free within the US, EU, UK, AU, and GCC.",
        bodyAr: "إذا لم تكن راضياً لأي سبب خلال 30 يوماً من التسليم، أرجع السماعة لمبلغ كامل. الشحن مجاني في الدول الرئيسية.",
      },
      {
        heading: "How to Initiate a Return",
        headingAr: "كيف تبدأ الإرجاع",
        body: "Visit your account dashboard, select the order, and click 'Return Item'. You'll receive a prepaid return label via email within 1 hour. Drop the package at any authorized carrier location.",
        bodyAr: "زر لوحة حسابك، اختر الطلب، واضغط 'إرجاع'. ستتلقى ملصق إرجاع مدفوع مسبقاً خلال ساعة.",
      },
      {
        heading: "Refund Processing",
        headingAr: "معالجة المبلغ المسترد",
        body: "Refunds are issued to the original payment method within 3 business days of receiving the returned item at our warehouse. You'll get a confirmation email when the refund is processed.",
        bodyAr: "تُصدر المبالغ المستردة لطريقة الدفع الأصلية خلال 3 أيام عمل من استلام المرتجع.",
      },
      {
        heading: "Exchanges",
        headingAr: "الاستبدال",
        body: "To exchange for a different color, initiate a return and place a new order. We do not hold inventory for exchanges; this ensures fastest turnaround.",
        bodyAr: "للاستبدال بلون آخر، ابدأ إرجاعاً وضع طلباً جديداً. لا نحتفظ بمخزون للاستبدال؛ هذا يضمن أسرع دوران.",
      },
    ],
  },
  warranty: {
    title: "Warranty",
    titleAr: "الضمان",
    sections: [
      {
        heading: "2-Year Limited Warranty",
        headingAr: "ضمان سنتين محدود",
        body: "Every AURIC ONE includes a 2-year limited warranty covering manufacturing defects in materials and workmanship from the date of purchase. This warranty is non-transferable and requires proof of purchase.",
        bodyAr: "كل سماعة أوريك ون تشمل ضمان سنتين محدود يغطي عيوب التصنيع من تاريخ الشراء. الضمان غير قابل للتحويل ويتطلب إثبات الشراء.",
      },
      {
        heading: "What's Covered",
        headingAr: "ما هو مشمول",
        body: "Driver failure, battery capacity degradation below 80% within the warranty period, electronic faults, headband structural failure, and stitching defects. We will repair or replace at our discretion.",
        bodyAr: "فشل المحرك، تدهور البطارية تحت 80% خلال فترة الضمان، الأعطال الإلكترونية، فشل بنية العصابة، وعيوب الخياطة.",
      },
      {
        heading: "What's Not Covered",
        headingAr: "ما هو غير مشمول",
        body: "Cosmetic wear, damage from drops or liquid exposure beyond IPX4 spec, unauthorized modifications, and damage from third-party accessories. Ear pad wear is a consumable and not covered.",
        bodyAr: "التآكل التجميلي، الضرر من السقوط أو السوائل، التعديلات غير المصرح بها، وضرر من ملحقات الطرف الثالث.",
      },
      {
        heading: "How to Claim",
        headingAr: "كيف تطالب",
        body: "Open a warranty claim from your account dashboard. Ship the unit to the nearest service center (prepaid label provided). Typical turnaround is 5–7 business days.",
        bodyAr: "افتح مطالبة ضمان من لوحة حسابك. الشحن لمركز الخدمة الأقرب (ملصق مدفوع مرفق). الدوران النموذجي 5-7 أيام عمل.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    titleAr: "سياسة الخصوصية",
    sections: [
      {
        heading: "What We Collect",
        headingAr: "ما نجمعه",
        body: "We collect the information necessary to fulfill your orders: name, email, shipping address, payment method (tokenized), and order history. We do not store full credit card numbers — payments are processed by PCI-DSS compliant processors.",
        bodyAr: "نجمع المعلومات الضرورية لتنفيذ طلباتك: الاسم، البريد، العنوان، طريقة الدفع (مرمزة)، وسجل الطلبات. لا نخزّن أرقام بطاقات كاملة.",
      },
      {
        heading: "How We Use It",
        headingAr: "كيف نستخدمه",
        body: "Order fulfillment, customer support, fraud prevention, and — only with your explicit opt-in — product announcements. We never sell your data. We share data with processors (Stripe, Shopify, shipping carriers) strictly for fulfillment.",
        bodyAr: "تنفيذ الطلبات، الدعم، منع الاحتيال، و- فقط بموافقتك الصريحة - إعلانات المنتج. لا نبيع بياناتك أبداً.",
      },
      {
        heading: "Your Rights",
        headingAr: "حقوقك",
        body: "You have the right to access, correct, export, or delete your personal data at any time from your account dashboard or by emailing privacy@auric.audio. We comply with GDPR and CCPA.",
        bodyAr: "لديك حق الوصول، التصحيح، التصدير، أو حذف بياناتك في أي وقت من لوحة حسابك أو بالبريد إلى privacy@auric.audio.",
      },
      {
        heading: "Data Retention",
        headingAr: "الاحتفاظ بالبيانات",
        body: "Order data is retained for 7 years for tax and warranty purposes. Marketing preferences can be revoked at any time. Deleted account data is purged within 30 days except where retention is legally required.",
        bodyAr: "نحتفظ ببيانات الطلب لـ 7 سنوات لأغراض الضمان والضرائب. تفضيلات التسويق يمكن إلغاؤها في أي وقت.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    titleAr: "شروط الخدمة",
    sections: [
      {
        heading: "Acceptance",
        headingAr: "القبول",
        body: "By accessing or using the AURIC website, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the site.",
        bodyAr: "باستخدامك موقع أوريك، فإنك توافق على الالتزام بشروط الخدمة هذه.",
      },
      {
        heading: "Pricing & Availability",
        headingAr: "التسعير والتوفر",
        body: "All prices are in USD unless otherwise stated. We reserve the right to correct pricing errors and to modify prices without notice. Inventory is not guaranteed until an order is confirmed.",
        bodyAr: "جميع الأسعار بالدولار الأمريكي ما لم يُذكر خلاف ذلك. نحتفظ بحق تصحيح أخطاء التسعير.",
      },
      {
        heading: "Intellectual Property",
        headingAr: "الملكية الفكرية",
        body: "All content on this site — including the AURIC name, logo, product designs, photography, and copy — is the property of AURIC Audio ApS and protected by international copyright and trademark law.",
        bodyAr: "جميع المحتويات على هذا الموقع — بما في ذلك اسم أوريك، الشعار، تصاميم المنتج، التصوير، والنصوص — ملك لشركة أوريك أوديو.",
      },
      {
        heading: "Limitation of Liability",
        headingAr: "حدود المسؤولية",
        body: "AURIC Audio is not liable for indirect, incidental, or consequential damages arising from the use of our products. Our total liability is limited to the purchase price of the product.",
        bodyAr: "شركة أوريك أوديو غير مسؤولة عن الأضرار غير المباشرة أو العرضية أو التبعية الناشئة عن استخدام منتجاتنا.",
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    titleAr: "سياسة الاسترداد",
    sections: [
      {
        heading: "Eligibility",
        headingAr: "الأهلية",
        body: "Refunds are available for returned items within the 30-day window, warranty claims we cannot repair, and duplicate or erroneous charges. Items must be returned in original packaging with all accessories.",
        bodyAr: "المبالغ المستردة متاحة للعناصر المرتجعة خلال فترة 30 يوماً، مطالبات الضمان التي لا يمكن إصلاحها، والرسوم المكررة أو الخاطئة.",
      },
      {
        heading: "Refund Methods",
        headingAr: "طرق الاسترداد",
        body: "Refunds are issued to the original payment method. For gift orders, refunds are issued as store credit. Bank-grade processing times apply (3–5 business days for credit cards, 1–2 for PayPal).",
        bodyAr: "تُصدر المبالغ لطريقة الدفع الأصلية. لطلبات الهدايا، تُصدر كرصيد متجر.",
      },
      {
        heading: "Partial Refunds",
        headingAr: "المبالغ الجزئية",
        body: "Items returned with missing accessories or visible damage beyond normal inspection may incur a 15% restocking fee. We will photograph and document any deductions.",
        bodyAr: "العناصر المرتجعة بملحقات مفقودة أو ضرر ظاهر قد تتكلف رسوم إعادة تخزين 15%.",
      },
    ],
  },
};

export const supportArticles: SupportArticle[] = [
  {
    id: "pairing",
    title: "How to pair your AURIC ONE",
    titleAr: "كيف تربط سماعة أوريك ون",
    category: "Getting Started",
    categoryAr: "البداية",
    excerpt: "Step-by-step pairing for iOS, Android, macOS, and Windows.",
    excerptAr: "خطوات الربط لـ iOS وأندرويد وmacOS وويندوز.",
    body: "1. Power on by holding the multifunction button for 2 seconds. The LED will pulse amber. 2. Hold the button for 5 more seconds to enter pairing mode (LED flashes rapidly). 3. Open Bluetooth settings on your device and select AURIC ONE. 4. Confirm the pairing code matches. For multipoint, repeat with a second device — the AURIC ONE remembers up to 8 devices.",
    bodyAr: "1. شغّل بالضغط مطولاً على الزر لمدة ثانيتين. 2. اضغط 5 ثوانٍ إضافية لدخول وضع الربط. 3. افتح إعدادات البلوتوث واختر AURIC ONE. 4. أكد رمز الربط.",
  },
  {
    id: "anc-modes",
    title: "Understanding ANC modes",
    titleAr: "فهم أوضاع إلغاء الضوضاء",
    category: "Features",
    categoryAr: "الميزات",
    excerpt: "Adaptive, Transparency, and Off — when to use each.",
    excerptAr: "تكيّفي، شفاف، وإيقاف — متى تستخدم كل واحد.",
    body: "Adaptive mode continuously samples your environment and adjusts cancellation in real time — best for travel and commuting. Transparency mode passes through external audio with natural spatial cues — best for office conversations. Off disables ANC entirely for maximum battery life — best for quiet environments.",
    bodyAr: "الوضع التكيّفي يأخذ عينات من بيئتك ويعدّل الإلغاء لحظياً — أفضل للسفر. الشفاف يمرر الصوت الخارجي ب naturally — للمكتب. الإيقاف يعطّل الإلغاء لأقصى بطارية.",
  },
  {
    id: "battery-care",
    title: "Battery care best practices",
    titleAr: "أفضل ممارسات العناية بالبطارية",
    category: "Maintenance",
    categoryAr: "الصيانة",
    excerpt: "How to maximize your battery's lifespan over years.",
    excerptAr: "كيف تزيد عمر بطاريتك على مدى سنوات.",
    body: "Lithium-ion cells degrade fastest when held at 100% or below 20% for extended periods. For daily use, charge to 80% and recharge at 30%. Avoid leaving the headphones in hot vehicles. If storing for over a month, charge to 50% first. Our cells are rated for 1,000 cycles to 80% capacity.",
    bodyAr: "خلايا الليثيوم تتدهور أسرع عند 100% أو تحت 20% لفترات طويلة. للاستخدام اليومي، اشحن إلى 80% وأعد الشحن عند 30%.",
  },
  {
    id: "earpads",
    title: "Replacing ear pads",
    titleAr: "استبدال وسائد الأذن",
    category: "Maintenance",
    categoryAr: "الصيانة",
    excerpt: "Tool-free ear pad replacement in under a minute.",
    excerptAr: "استبدال الوسائد دون أدوات في أقل من دقيقة.",
    body: "Ear pads are designed to be user-replaceable. Grip the pad firmly at the bottom edge and pull outward — the magnetic mount releases. Align the new pad's magnetic ring with the earcup and press firmly around the perimeter. Replacement pads are available for $49.",
    bodyAr: "الوسائد قابلة للاستبدال من المستخدم. امسك الوسادة من الحافة السفلية واسحب للخارج — يفك المشبك المغناطيسي.",
  },
  {
    id: "firmware",
    title: "Firmware updates",
    titleAr: "تحديثات البرامج الثابتة",
    category: "Maintenance",
    categoryAr: "الصيانة",
    excerpt: "How to keep your AURIC ONE up to date.",
    excerptAr: "كيف تبقي سماعتك محدثة.",
    body: "Firmware updates are delivered over Bluetooth via the AURIC companion app. The app checks for updates on launch and prompts you to install. Updates typically take 5–10 minutes; do not power off during installation. Release notes are available in-app and on our website.",
    bodyAr: "تُسلّم التحديثات عبر البلوتوث من تطبيق أوريك. يفحص التطبيق التحديثات عند الإطلاق. تستغرق التحديثات 5-10 دقائق.",
  },
  {
    id: "eq",
    title: "Using the parametric EQ",
    titleAr: "استخدام المعادل البارامتري",
    category: "Features",
    categoryAr: "الميزات",
    excerpt: "Five bands of fully parametric EQ explained.",
    excerptAr: "خمس نطاقات من المعادل البارامتري.",
    body: "The AURIC companion app provides five bands of parametric EQ with adjustable frequency, gain, and Q. Presets include Reference (flat), Warm (+2 dB shelf at 200 Hz), Bright (+1.5 dB shelf at 8 kHz), and Vocal Forward (1 dB peak at 2.5 kHz). Custom presets can be saved to the headphones and persist across devices.",
    bodyAr: "يقدم تطبيق أوريك خمس نطاقات من المعادل البارامتري مع تردد وكسب وQ قابل للتعديل. تتضمن الإعدادات المسبقة: مرجعي، دافئ، مشرق، وصوتي.",
  },
];

export const sampleOrders: Order[] = [
  {
    id: "AUR-10247",
    date: "2025-06-15",
    status: "delivered",
    total: 549,
    items: [
      { name: "AURIC ONE", variant: "Obsidian Black", qty: 1, price: 549 },
    ],
    tracking: {
      steps: [
        { label: "Order placed", date: "Jun 15, 09:24", done: true },
        { label: "Payment confirmed", date: "Jun 15, 09:25", done: true },
        { label: "Shipped from Amsterdam", date: "Jun 16, 14:10", done: true },
        { label: "Out for delivery", date: "Jun 18, 08:30", done: true },
        { label: "Delivered", date: "Jun 18, 11:42", done: true },
      ],
      estimatedDelivery: "Jun 18, 2025",
    },
  },
  {
    id: "AUR-10231",
    date: "2025-05-22",
    status: "shipped",
    total: 628,
    items: [
      { name: "AURIC ONE", variant: "Champagne Gold", qty: 1, price: 549 },
      { name: "AURIC Travel Case", variant: "Brown", qty: 1, price: 79 },
    ],
    tracking: {
      steps: [
        { label: "Order placed", date: "May 22, 16:08", done: true },
        { label: "Payment confirmed", date: "May 22, 16:09", done: true },
        { label: "Shipped from LA", date: "May 23, 10:14", done: true },
        { label: "In transit", date: "May 24, 06:20", done: true },
        { label: "Out for delivery", date: "May 26, 07:45", done: false },
      ],
      estimatedDelivery: "May 26, 2025",
    },
  },
  {
    id: "AUR-10198",
    date: "2025-04-08",
    status: "processing",
    total: 1098,
    items: [
      { name: "AURIC ONE", variant: "Midnight Blue", qty: 2, price: 549 },
    ],
    tracking: {
      steps: [
        { label: "Order placed", date: "Apr 8, 11:33", done: true },
        { label: "Payment confirmed", date: "Apr 8, 11:34", done: true },
        { label: "Preparing shipment", date: "Apr 8, 14:20", done: true },
        { label: "Shipped", date: "—", done: false },
        { label: "Delivered", date: "—", done: false },
      ],
      estimatedDelivery: "Apr 12, 2025",
    },
  },
  {
    id: "AUR-10103",
    date: "2025-01-19",
    status: "returned",
    total: 79,
    items: [{ name: "Replacement Ear Pads", variant: "—", qty: 1, price: 79 }],
    tracking: {
      steps: [
        { label: "Order placed", date: "Jan 19, 19:11", done: true },
        { label: "Delivered", date: "Jan 22, 13:50", done: true },
        { label: "Return initiated", date: "Jan 28, 09:02", done: true },
        { label: "Refund processed", date: "Jan 30, 16:45", done: true },
      ],
      estimatedDelivery: "—",
    },
  },
];

export const sampleAddresses: Address[] = [
  {
    id: "addr1",
    label: "Home",
    name: "Marcus Reed",
    line1: "247 Bedford Avenue, Apt 4B",
    city: "Brooklyn",
    state: "NY",
    postal: "11211",
    country: "United States",
    phone: "+1 (917) 555-0142",
    isDefault: true,
  },
  {
    id: "addr2",
    label: "Studio",
    name: "Marcus Reed",
    line1: "445 W 53rd St, Suite 8",
    line2: "Attn: Sterling Sound",
    city: "New York",
    state: "NY",
    postal: "10019",
    country: "United States",
    phone: "+1 (212) 555-8847",
    isDefault: false,
  },
];

export const trendingSearches = [
  "AURIC ONE",
  "Champagne Gold",
  "Travel case",
  "Replacement pads",
  "LDAC",
];

export const popularCategories = [
  "Headphones",
  "Accessories",
  "Replacement parts",
  "Gift cards",
];

export const trustBadges = [
  { icon: "Truck", title: "Free worldwide shipping", titleAr: "شحن عالمي مجاني" },
  { icon: "RotateCcw", title: "30-day returns", titleAr: "إرجاع خلال 30 يوماً" },
  { icon: "Shield", title: "2-year warranty", titleAr: "ضمان سنتان" },
  { icon: "Lock", title: "Secure checkout", titleAr: "دفع آمن" },
];

export const socialLinks = [
  { name: "Instagram", icon: "Instagram", href: "https://instagram.com" },
  { name: "Twitter", icon: "Twitter", href: "https://twitter.com" },
  { name: "YouTube", icon: "Youtube", href: "https://youtube.com" },
  { name: "TikTok", icon: "Music", href: "https://tiktok.com" },
];

export const companyInfo = {
  legalName: "AURIC Audio ApS",
  address: "Bredgade 23, 1260 Copenhagen K, Denmark",
  addressAr: "بريدغادي 23، 1260 كوبنهاغن ك، الدنمارك",
  email: "support@auric.audio",
  pressEmail: "press@auric.audio",
  phone: "+45 70 60 50 40",
  hours: "Mon–Fri, 9:00–18:00 CET",
  hoursAr: "الإثنين-الجمعة، 9:00-18:00 ت.م.أ",
  vat: "DK 41 27 88 16",
  copyright: "© 2025 AURIC Audio ApS. All rights reserved.",
  copyrightAr: "© 2025 أوريك أوديو. جميع الحقوق محفوظة.",
};
