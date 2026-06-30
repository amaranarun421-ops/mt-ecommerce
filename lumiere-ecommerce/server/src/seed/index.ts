import { connectDB, disconnectDB } from "../config/db.js";
import { config } from "../config/index.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { StoreSetting } from "../models/StoreSetting.js";
import bcrypt from "bcryptjs";
import { UNSPLASH, PRODUCT_PHOTOS, makeGallery } from "./unsplash.js";

async function main() {
  await connectDB();

  console.log("[seed] Wiping existing data...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Coupon.deleteMany({}),
    Order.deleteMany({}),
    StoreSetting.deleteMany({}),
  ]);

  // -------- Admin user --------
  const adminPasswordHash = await bcrypt.hash(config.adminPassword, 12);
  const admin = await User.create({
    name: "Store Admin",
    email: config.adminEmail,
    passwordHash: adminPasswordHash,
    role: "ADMIN",
  });
  console.log(`[seed] Admin created: ${admin.email}`);

  // -------- Demo customers --------
  const demoPasswordHash = await bcrypt.hash("Password123", 12);
  const demoCustomers = await User.create([
    { name: "Emma Thompson", email: "emma@example.com", passwordHash: demoPasswordHash, role: "CUSTOMER" },
    { name: "James Carter", email: "james@example.com", passwordHash: demoPasswordHash, role: "CUSTOMER" },
    { name: "Sofia Ramirez", email: "sofia@example.com", passwordHash: demoPasswordHash, role: "CUSTOMER" },
  ]);

  // -------- Categories --------
  const categories = await Category.create([
    {
      name: "Furniture",
      slug: "furniture",
      description: "Hand-crafted furniture designed to last a lifetime.",
      longDescription: "Our furniture collection brings together considered design, sustainably sourced materials, and exceptional craftsmanship. Each piece is made by artisans who obsess over the details — from the joinery to the final coat of natural oil. Whether you are furnishing your first apartment or refining a forever home, you will find timeless silhouettes that grow with you.",
      image: UNSPLASH.furniture,
      icon: "Sofa",
      featured: true,
      sortOrder: 1,
      seoTitle: "Premium Hand-Crafted Furniture | Lumière",
      seoDescription: "Shop sustainably made sofas, chairs, tables, and shelving. Free shipping on orders over $75. Crafted to last for decades.",
    },
    {
      name: "Lighting",
      slug: "lighting",
      description: "Lighting that sets the mood in every room.",
      longDescription: "The right light transforms a space. Our lighting edit spans sculptural floor lamps, warm pendants, and task lights that blend form and function. Choose from solid brass, hand-blown glass, and natural linen shades — all rated for energy-efficient LED bulbs.",
      image: UNSPLASH.lighting,
      icon: "Lamp",
      featured: true,
      sortOrder: 2,
      seoTitle: "Designer Lighting & Lamps | Lumière",
      seoDescription: "Floor lamps, pendants, and task lights in solid brass, hand-blown glass, and natural linen. Energy-efficient, designer-grade.",
    },
    {
      name: "Decor",
      slug: "decor",
      description: "Finishing touches that make a house feel like home.",
      longDescription: "Decor is where personality lives. Our curated collection includes hand-thrown ceramics, wool rugs, framed prints, and natural candles — each piece chosen to add warmth, texture, and a quiet sense of craft to your space.",
      image: UNSPLASH.decor,
      icon: "Flower",
      featured: true,
      sortOrder: 3,
      seoTitle: "Home Decor & Accents | Lumière",
      seoDescription: "Hand-thrown ceramics, wool rugs, framed prints, and natural candles. Curated decor that brings warmth to any room.",
    },
    {
      name: "Kitchen",
      slug: "kitchen",
      description: "Kitchen essentials worth reaching for every day.",
      longDescription: "Daily rituals deserve beautiful tools. Our kitchen edit features stoneware mugs, cast-iron cookware, hand-finished cutting boards, and quiet kettles — pieces that elevate the everyday without showing off.",
      image: UNSPLASH.kitchen,
      icon: "CookingPot",
      featured: true,
      sortOrder: 4,
      seoTitle: "Premium Kitchen Essentials | Lumière",
      seoDescription: "Stoneware mugs, cast-iron cookware, cutting boards, and quiet kettles. Kitchen tools designed to last for years.",
    },
    {
      name: "Bedding",
      slug: "bedding",
      description: "Linen and cotton bedding made for restful nights.",
      longDescription: "Sleep is the foundation of a good day. Our bedding is woven from long-staple cotton and stonewashed European linen, pre-washed for softness and made to last. Pair with our wool throws and down-alternative pillows for a bed that invites you to linger.",
      image: UNSPLASH.bedding,
      icon: "Bed",
      featured: true,
      sortOrder: 5,
      seoTitle: "Linen & Cotton Bedding | Lumière",
      seoDescription: "Long-staple cotton sheets, stonewashed European linen, wool throws, and down-alternative pillows. Free shipping over $75.",
    },
    {
      name: "Stationery",
      slug: "stationery",
      description: "Notebooks, desk accessories, and quiet tools.",
      longDescription: "The right desk setup makes space for thinking. Our stationery edit features lay-flat notebooks, solid brass desk accessories, and fine-writing pens — quietly considered objects that make working from home feel less like work.",
      image: UNSPLASH.stationery,
      icon: "PenTool",
      featured: false,
      sortOrder: 6,
      seoTitle: "Premium Notebooks & Desk Accessories | Lumière",
      seoDescription: "Lay-flat notebooks, solid brass desk accessories, and fine-writing pens. Tools for considered work.",
    },
  ]);
  console.log(`[seed] ${categories.length} categories created`);

  // -------- Products --------
  type ProductSeed = {
    name: string;
    price: number;
    categoryId: string;
    photos: string[];
    brand?: string;
    sku?: string;
    description: string;
    shortDescription?: string;
    material?: string;
    careInstructions?: string;
    shippingInfo?: string;
    returnPolicy?: string;
    weight?: number;
    dimensions?: string;
    compareAtPrice?: number;
    trending?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    featured?: boolean;
    stock?: number;
    lowStockThreshold?: number;
    tags?: string[];
    specifications?: { label: string; value: string }[];
    variants?: { name: string; value: string; price?: number; stock: number }[];
  };

  const productsData: ProductSeed[] = [
    // Furniture
    {
      name: "Aalto Linen 3-Seater Sofa",
      price: 1899,
      compareAtPrice: 2299,
      categoryId: categories[0]._id.toString(),
      photos: PRODUCT_PHOTOS.sofa1,
      brand: "Lumière Studio",
      sku: "LUM-SF-001",
      description: "The Aalto sofa is built on a kiln-dried hardwood frame with hand-tied springs and high-resilience foam wrapped in feather-down blend. The removable linen-blend cover is soft to the touch and machine-washable, so it ages gracefully with your home. Designed in our San Francisco studio and built by a third-generation workshop in North Carolina.",
      shortDescription: "Hand-tied springs, feather-down cushions, machine-washable linen cover.",
      material: "70% Linen, 28% Cotton, 2% Elastane; Solid kiln-dried oak frame",
      careInstructions: "Spot clean with mild detergent. Cover is removable and machine-washable on cold. Air dry only.",
      shippingInfo: "Ships in 2–3 weeks. White-glove delivery included within the contiguous US.",
      returnPolicy: "30-day returns. Item must be unused and in original packaging.",
      weight: 88,
      dimensions: "84\" W × 38\" D × 32\" H",
      trending: true, bestSeller: true, featured: true,
      stock: 12, lowStockThreshold: 3,
      tags: ["sofa", "living room", "linen", "modern"],
      specifications: [
        { label: "Frame", value: "Kiln-dried solid oak" },
        { label: "Cushions", value: "Feather-down blend over HR foam" },
        { label: "Cover", value: "Removable linen-blend, machine-washable" },
        { label: "Assembly", value: "Tool-free, 4 minutes" },
        { label: "Warranty", value: "10-year frame warranty" },
      ],
    },
    {
      name: "Halden Lounge Chair",
      price: 749,
      compareAtPrice: 899,
      categoryId: categories[0]._id.toString(),
      photos: PRODUCT_PHOTOS.chair1,
      brand: "Lumière Studio",
      sku: "LUM-CH-002",
      description: "The Halden lounge chair pairs a steam-bent ash frame with a vegetable-tanned leather sling that softens beautifully with use. Inspired by 1950s Scandinavian reading chairs, it's the kind of seat you sink into with a book and lose an afternoon.",
      shortDescription: "Steam-bent ash frame with vegetable-tanned leather sling.",
      material: "Solid ash, full-grain vegetable-tanned leather",
      careInstructions: "Dust frame weekly. Condition leather every 6 months with a neutral leather balm.",
      shippingInfo: "Ships in 1–2 weeks. Free curbside delivery.",
      returnPolicy: "30-day returns. Original packaging required.",
      weight: 24,
      dimensions: "30\" W × 32\" D × 34\" H",
      trending: true, newArrival: true, featured: true,
      stock: 18, lowStockThreshold: 5,
      tags: ["chair", "lounge", "leather", "scandinavian"],
      specifications: [
        { label: "Frame", value: "Steam-bent solid ash" },
        { label: "Sling", value: "Full-grain vegetable-tanned leather" },
        { label: "Weight capacity", value: "300 lbs" },
        { label: "Assembly", value: "None — ships fully assembled" },
      ],
    },
    {
      name: "Maren Oak Dining Table",
      price: 1299,
      categoryId: categories[0]._id.toString(),
      photos: PRODUCT_PHOTOS.table1,
      brand: "Lumière Studio",
      sku: "LUM-TB-003",
      description: "A solid white oak dining table that seats six comfortably. The Maren features hand-finished edges and a natural oil finish that brings out the wood's grain and deepens with age. Built to be the centerpiece of weekly dinners for decades.",
      shortDescription: "Solid white oak, seats six, natural oil finish.",
      material: "Solid white oak, natural hardwax oil finish",
      careInstructions: "Wipe spills immediately. Re-oil annually with food-safe oil. Avoid direct sunlight.",
      shippingInfo: "Ships in 3–4 weeks. White-glove delivery included.",
      returnPolicy: "Made-to-order. Final sale unless damaged in transit.",
      weight: 145,
      dimensions: "78\" L × 36\" W × 30\" H",
      bestSeller: true, featured: true,
      stock: 6, lowStockThreshold: 2,
      tags: ["dining table", "oak", "wood"],
      specifications: [
        { label: "Material", value: "Solid white oak" },
        { label: "Finish", value: "Natural hardwax oil" },
        { label: "Seats", value: "6 adults" },
        { label: "Assembly", value: "Attaches legs with provided hardware (5 min)" },
      ],
    },
    {
      name: "Soren Modular Bookshelf",
      price: 549,
      compareAtPrice: 699,
      categoryId: categories[0]._id.toString(),
      photos: PRODUCT_PHOTOS.shelf1,
      brand: "Lumière Studio",
      sku: "LUM-SH-004",
      description: "A modular shelving system that grows with your space. Start with one unit and add cubes as your library — or plant collection — expands. Each cube is rated to hold 40 lbs and ships flat-packed with a single tool for assembly.",
      shortDescription: "Modular cubes, expandable, ships flat-packed.",
      material: "FSC-certified birch plywood, matte lacquer",
      careInstructions: "Dust with a dry cloth. Avoid water exposure.",
      shippingInfo: "Ships in 2–3 business days. Free standard shipping.",
      returnPolicy: "30-day returns in original flat-pack.",
      weight: 22,
      dimensions: "30\" W × 12\" D × 30\" H (per cube)",
      newArrival: true, trending: true,
      stock: 35,
      tags: ["shelf", "modular", "storage"],
      specifications: [
        { label: "Material", value: "FSC birch plywood" },
        { label: "Capacity", value: "40 lbs per shelf" },
        { label: "Assembly", value: "Single Allen key, 10 minutes" },
      ],
    },
    {
      name: "Florentine Upholstered Bed",
      price: 1099,
      compareAtPrice: 1349,
      categoryId: categories[0]._id.toString(),
      photos: PRODUCT_PHOTOS.bed1,
      brand: "Lumière Studio",
      sku: "LUM-BD-005",
      description: "A low-profile platform bed with a channel-tufted headboard upholstered in performance boucle. Solid wood slats support any mattress without a box spring. Available in Queen and King.",
      shortDescription: "Channel-tufted boucle headboard, solid wood slats.",
      material: "Performance boucle, kiln-dried wood frame",
      careInstructions: "Vacuum regularly. Spot clean with water-based cleaner.",
      shippingInfo: "Ships in 2–3 weeks. White-glove delivery in contiguous US.",
      returnPolicy: "30-day returns. Original packaging required.",
      weight: 95,
      dimensions: "64\" W × 84\" L × 42\" H (Queen)",
      featured: true, bestSeller: true,
      stock: 8, lowStockThreshold: 2,
      tags: ["bed", "bedroom", "upholstered"],
      specifications: [
        { label: "Sizes", value: "Queen, King" },
        { label: "Headboard", value: "Channel-tufted performance boucle" },
        { label: "Slats", value: "Solid wood, no box spring needed" },
      ],
      variants: [
        { name: "Size", value: "Queen", price: 1099, stock: 5 },
        { name: "Size", value: "King", price: 1299, stock: 3 },
      ],
    },
    // Lighting
    {
      name: "Archer Brass Floor Lamp",
      price: 289,
      compareAtPrice: 359,
      categoryId: categories[1]._id.toString(),
      photos: PRODUCT_PHOTOS.lamp1,
      brand: "Halo Works",
      sku: "LUM-LT-006",
      description: "An architectural floor lamp in solid brass with a hand-blown opal glass shade. The Archer's articulated arm lets you direct light exactly where you need it, whether next to a reading chair or behind a desk. Built to outlast trends and bulbs alike.",
      shortDescription: "Solid brass, hand-blown opal glass, articulated arm.",
      material: "Solid brass, hand-blown opal glass",
      careInstructions: "Wipe brass with a dry microfiber cloth. Glass shade is hand-washable.",
      shippingInfo: "Ships in 3–5 business days.",
      returnPolicy: "30-day returns.",
      weight: 12,
      dimensions: "60\" H × 18\" arm reach",
      trending: true, featured: true, bestSeller: true,
      stock: 22,
      tags: ["lamp", "floor lamp", "brass", "lighting"],
      specifications: [
        { label: "Bulb", value: "E26, 60W max (LED recommended)" },
        { label: "Cord", value: "10 ft clear braided" },
        { label: "Switch", value: "Inline foot dimmer" },
      ],
    },
    {
      name: "Lumen Ceramic Table Lamp",
      price: 149,
      categoryId: categories[1]._id.toString(),
      photos: PRODUCT_PHOTOS.lamp2,
      brand: "Halo Works",
      sku: "LUM-LT-007",
      description: "A soft, sculptural table lamp with a hand-glazed ceramic base and natural linen shade. The Lumen throws warm, diffused light perfect for bedside tables or hallway consoles.",
      shortDescription: "Hand-glazed ceramic, natural linen shade.",
      material: "Hand-glazed stoneware, linen shade",
      careInstructions: "Dust with a dry cloth.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 6,
      dimensions: "20\" H × 12\" shade diameter",
      newArrival: true,
      stock: 40,
      tags: ["lamp", "table lamp", "ceramic"],
      specifications: [
        { label: "Bulb", value: "E26, 40W max" },
        { label: "Cord", value: "6 ft cream" },
      ],
    },
    {
      name: "Orbit Pendant Light",
      price: 219,
      compareAtPrice: 279,
      categoryId: categories[1]._id.toString(),
      photos: PRODUCT_PHOTOS.pendant1,
      brand: "Halo Works",
      sku: "LUM-LT-008",
      description: "A spun-aluminum pendant with a soft matte finish and integrated LED panel rated for 25,000 hours. The Orbit works as a single statement or in clusters over a kitchen island.",
      shortDescription: "Spun aluminum, integrated LED, 25,000-hour life.",
      material: "Spun aluminum, matte powder coat",
      careInstructions: "Dust with a dry cloth.",
      shippingInfo: "Ships in 5–7 business days. Hardwire installation required.",
      returnPolicy: "30-day returns.",
      weight: 4,
      dimensions: "12\" diameter × 10\" H",
      trending: true,
      stock: 28,
      tags: ["pendant", "lighting", "led"],
      specifications: [
        { label: "Light source", value: "Integrated LED, 15W, 2700K" },
        { label: "Cord", value: "10 ft black braided" },
        { label: "Canopy", value: "5\" matte aluminum" },
      ],
    },
    // Decor
    {
      name: "Casa Hand-Thrown Vase Set",
      price: 89,
      categoryId: categories[2]._id.toString(),
      photos: PRODUCT_PHOTOS.vase1,
      brand: "Terra Studio",
      sku: "LUM-DC-009",
      description: "A set of three hand-thrown stoneware vases in complementary silhouettes. Each piece is finished with a matte reactive glaze, so no two are exactly alike. Beautiful with dried stems or alone as objects.",
      shortDescription: "Set of 3, hand-thrown stoneware, matte reactive glaze.",
      material: "Hand-thrown stoneware",
      careInstructions: "Hand wash. Not food-safe.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 3,
      dimensions: "Set of 3: 6\", 8\", 10\" H",
      bestSeller: true, featured: true,
      stock: 60,
      tags: ["vase", "ceramics", "decor"],
      specifications: [
        { label: "Material", value: "Hand-thrown stoneware" },
        { label: "Finish", value: "Matte reactive glaze" },
        { label: "Set of", value: "3 vases" },
      ],
    },
    {
      name: "Marrakech Wool Rug 8x10",
      price: 499,
      compareAtPrice: 649,
      categoryId: categories[2]._id.toString(),
      photos: PRODUCT_PHOTOS.rug1,
      brand: "Lumière Studio",
      sku: "LUM-DC-010",
      description: "Hand-knotted by Berber artisans in Morocco, the Marrakech rug features a timeless geometric pattern in undyed wool. Each rug takes 4–6 weeks to make and ships with a certificate of authenticity.",
      shortDescription: "Hand-knotted Moroccan wool, geometric pattern, 8x10.",
      material: "100% undyed Berber wool",
      careInstructions: "Vacuum on low without beater bar. Professional clean for spills.",
      shippingInfo: "Ships in 1–2 weeks. Free shipping.",
      returnPolicy: "30-day returns. Roll-packed — allow 48h to lay flat.",
      weight: 28,
      dimensions: "8 ft × 10 ft",
      trending: true, featured: true,
      stock: 14, lowStockThreshold: 4,
      tags: ["rug", "wool", "moroccan"],
      specifications: [
        { label: "Material", value: "100% undyed Berber wool" },
        { label: "Construction", value: "Hand-knotted, 200 KPSI" },
        { label: "Origin", value: "Atlas Mountains, Morocco" },
      ],
    },
    {
      name: "Folio Set of 3 Framed Prints",
      price: 129,
      categoryId: categories[2]._id.toString(),
      photos: PRODUCT_PHOTOS.frame1,
      brand: "Wall Workshop",
      sku: "LUM-DC-011",
      description: "A curated trio of archival prints in solid oak frames. Each print is giclee-printed on cotton rag paper and signed by the artist. Hang as a set or scatter through the home.",
      shortDescription: "3 archival prints, solid oak frames.",
      material: "Cotton rag paper, solid oak frames, glass",
      careInstructions: "Dust frames with a dry cloth. Avoid direct sunlight to prevent fading.",
      shippingInfo: "Ships in 3–5 business days.",
      returnPolicy: "30-day returns.",
      weight: 4,
      dimensions: "Each frame 16\" × 20\"",
      newArrival: true,
      stock: 45,
      tags: ["prints", "wall art", "frames"],
      specifications: [
        { label: "Print type", value: "Giclee on cotton rag" },
        { label: "Frame", value: "Solid oak, glass front" },
        { label: "Set of", value: "3 prints" },
      ],
    },
    {
      name: "Ember Soy Candle Trio",
      price: 69,
      compareAtPrice: 84,
      categoryId: categories[2]._id.toString(),
      photos: PRODUCT_PHOTOS.candle1,
      brand: "Ember",
      sku: "LUM-DC-012",
      description: "Three 8oz soy-wax candles in our most-loved scents: Cedar & Sage, Fig & Cedar, and Amber & Oud. Cotton wicks, 50-hour burn time each, and reusable glass vessels.",
      shortDescription: "3 soy candles, 50-hour burn each.",
      material: "Soy wax, cotton wick, glass vessel",
      careInstructions: "Trim wick to 1/4\" before each burn. Burn max 4 hours at a time.",
      shippingInfo: "Ships in 1–2 business days.",
      returnPolicy: "30-day returns.",
      weight: 2,
      dimensions: "3 × 8oz candles",
      bestSeller: true,
      stock: 120,
      tags: ["candles", "scent", "home"],
      specifications: [
        { label: "Wax", value: "100% soy" },
        { label: "Burn time", value: "50 hours per candle" },
        { label: "Vessel", value: "Reusable glass" },
      ],
    },
    {
      name: "Verdant Planter Trio",
      price: 79,
      categoryId: categories[2]._id.toString(),
      photos: PRODUCT_PHOTOS.plant1,
      brand: "Terra Studio",
      sku: "LUM-DC-013",
      description: "A trio of stoneware planters in graduated sizes, each with a drainage hole and matching saucer. Perfect for small succulents, herbs, or trailing pothos.",
      shortDescription: "3 stoneware planters with saucers.",
      material: "Glazed stoneware",
      careInstructions: "Wipe with damp cloth. Drainage hole prevents overwatering.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 4,
      dimensions: "4\", 5\", 6\" diameter",
      newArrival: true,
      stock: 50,
      tags: ["planters", "plants", "ceramics"],
      specifications: [
        { label: "Material", value: "Glazed stoneware" },
        { label: "Set of", value: "3 planters with saucers" },
        { label: "Drainage", value: "Yes, with saucer" },
      ],
    },
    // Kitchen
    {
      name: "Stoneware Mug Set of 4",
      price: 56,
      compareAtPrice: 72,
      categoryId: categories[3]._id.toString(),
      photos: PRODUCT_PHOTOS.mug1,
      brand: "Terra Studio",
      sku: "LUM-KT-014",
      description: "A set of four 12oz stoneware mugs in warm earth tones. Each mug is hand-glazed, so subtle variations in color and texture are part of their charm. Dishwasher and microwave safe.",
      shortDescription: "Set of 4, 12oz, hand-glazed, dishwasher safe.",
      material: "Stoneware, reactive glaze",
      careInstructions: "Dishwasher and microwave safe.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 4,
      dimensions: "4\" H × 3.5\" diameter (each)",
      bestSeller: true, featured: true,
      stock: 80,
      tags: ["mugs", "kitchen", "ceramics"],
      specifications: [
        { label: "Set of", value: "4 mugs" },
        { label: "Capacity", value: "12 oz each" },
        { label: "Care", value: "Dishwasher & microwave safe" },
      ],
    },
    {
      name: "Quiet Whistle Kettle",
      price: 99,
      categoryId: categories[3]._id.toString(),
      photos: PRODUCT_PHOTOS.kettle1,
      brand: "Halo Works",
      sku: "LUM-KT-015",
      description: "A polished stainless steel stovetop kettle with a soft two-tone whistle and an ergonomic handle that stays cool. Holds 2.5 quarts — enough for a full teapot or a round of pour-overs.",
      shortDescription: "Stainless steel, 2.5-quart, cool-touch handle.",
      material: "18/10 stainless steel",
      careInstructions: "Hand wash. Do not boil dry.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 3,
      dimensions: "9\" H × 8\" diameter",
      trending: true,
      stock: 38,
      tags: ["kettle", "kitchen", "stovetop"],
      specifications: [
        { label: "Capacity", value: "2.5 quarts" },
        { label: "Material", value: "18/10 stainless steel" },
        { label: "Compatible", value: "Gas, electric, induction" },
      ],
    },
    {
      name: "Walnut Edge-Grain Board",
      price: 89,
      compareAtPrice: 109,
      categoryId: categories[3]._id.toString(),
      photos: PRODUCT_PHOTOS.board1,
      brand: "Lumière Studio",
      sku: "LUM-KT-016",
      description: "A generous edge-grain cutting board cut from a single piece of American black walnut. Features a juice groove on one side and a flat prep surface on the other. Finished with food-safe mineral oil and beeswax.",
      shortDescription: "American black walnut, reversible, juice groove.",
      material: "American black walnut",
      careInstructions: "Hand wash, dry immediately. Re-oil monthly with food-safe mineral oil.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 5,
      dimensions: "18\" L × 12\" W × 1.25\" H",
      bestSeller: true,
      stock: 45,
      tags: ["cutting board", "kitchen", "wood"],
      specifications: [
        { label: "Material", value: "American black walnut" },
        { label: "Construction", value: "Edge-grain, single piece" },
        { label: "Finish", value: "Mineral oil and beeswax" },
      ],
    },
    {
      name: "Cast Iron 10\" Skillet",
      price: 79,
      categoryId: categories[3]._id.toString(),
      photos: PRODUCT_PHOTOS.cookware1,
      brand: "Forge",
      sku: "LUM-KT-017",
      description: "Pre-seasoned cast iron skillet that sears, bakes, and lasts forever. Heat-treated for a smoother finish than traditional cast iron. Use on any stovetop, in the oven, or over a campfire.",
      shortDescription: "Pre-seasoned, smoother finish, lifetime piece.",
      material: "Cast iron, vegetable oil seasoning",
      careInstructions: "Hand wash, dry immediately, rub with oil. Do not soak or use soap.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 6,
      dimensions: "10\" diameter × 2\" H",
      trending: true,
      stock: 65,
      tags: ["cookware", "cast iron", "kitchen"],
      specifications: [
        { label: "Material", value: "Cast iron, pre-seasoned" },
        { label: "Diameter", value: "10 inches" },
        { label: "Warranty", value: "Lifetime" },
      ],
    },
    // Bedding
    {
      name: "Stonewashed Linen Duvet Cover",
      price: 219,
      compareAtPrice: 279,
      categoryId: categories[4]._id.toString(),
      photos: PRODUCT_PHOTOS.throw1,
      brand: "Lumière Home",
      sku: "LUM-BD-018",
      description: "A stonewashed European flax linen duvet cover that gets softer with every wash. Natural temperature regulation keeps you cool in summer and warm in winter. Coconut shell buttons at the closure.",
      shortDescription: "Stonewashed European flax linen, gets softer with wash.",
      material: "100% European flax linen, 160 GSM",
      careInstructions: "Machine wash cold, tumble dry low. Ironing not required — embrace the wrinkles.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns. Unused in original packaging.",
      weight: 3,
      dimensions: "Queen or King",
      bestSeller: true, featured: true,
      stock: 50,
      tags: ["bedding", "linen", "duvet"],
      specifications: [
        { label: "Material", value: "100% European flax linen" },
        { label: "Weight", value: "160 GSM" },
        { label: "Closure", value: "Coconut shell buttons" },
      ],
      variants: [
        { name: "Size", value: "Queen", price: 219, stock: 25 },
        { name: "Size", value: "King", price: 249, stock: 20 },
        { name: "Color", value: "Natural", stock: 25 },
        { name: "Color", value: "Clay", stock: 20 },
      ],
    },
    {
      name: "Down-Alternative Pillow Pair",
      price: 89,
      categoryId: categories[4]._id.toString(),
      photos: PRODUCT_PHOTOS.pillow1,
      brand: "Lumière Home",
      sku: "LUM-BD-019",
      description: "A pair of plush pillows with a microfiber fill that mimics the loft and feel of down — hypoallergenic and machine-washable. 300-thread-count cotton sateen shell.",
      shortDescription: "Pair of 2, hypoallergenic, machine-washable.",
      material: "Cotton sateen shell, microfiber fill",
      careInstructions: "Machine wash cold, tumble dry low.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 3,
      dimensions: "Standard or King",
      newArrival: true,
      stock: 70,
      tags: ["pillows", "bedding"],
      specifications: [
        { label: "Set of", value: "2 pillows" },
        { label: "Fill", value: "Hypoallergenic microfiber" },
        { label: "Shell", value: "300-thread-count cotton sateen" },
      ],
    },
    // Stationery
    {
      name: "Atlas Lay-Flat Notebook Set",
      price: 39,
      categoryId: categories[5]._id.toString(),
      photos: PRODUCT_PHOTOS.notebook1,
      brand: "Daily Edit",
      sku: "LUM-ST-020",
      description: "A set of three lay-flat dot-grid notebooks with smyth-sewn bindings and 120 GSM paper that resists bleed-through. Covers are vegan leather, embossed with the Atlas crest.",
      shortDescription: "Set of 3, dot grid, lay-flat binding.",
      material: "120 GSM paper, vegan leather cover",
      careInstructions: "Keep dry. Store flat.",
      shippingInfo: "Ships in 1–2 business days.",
      returnPolicy: "30-day returns.",
      weight: 1,
      dimensions: "5.5\" × 8.25\" (each)",
      trending: true, newArrival: true,
      stock: 100,
      tags: ["notebook", "stationery", "desk"],
      specifications: [
        { label: "Set of", value: "3 notebooks" },
        { label: "Pages", value: "192 each, dot grid" },
        { label: "Binding", value: "Smyth-sewn, lay-flat" },
      ],
    },
    {
      name: "Brass Desk Organizer",
      price: 65,
      compareAtPrice: 79,
      categoryId: categories[5]._id.toString(),
      photos: PRODUCT_PHOTOS.desk1,
      brand: "Daily Edit",
      sku: "LUM-ST-021",
      description: "A solid brass desk organizer with compartments for pens, phone, and small notepads. Develops a rich patina over time that you can polish back to a shine — or leave as a record of use.",
      shortDescription: "Solid brass, multi-compartment, ages beautifully.",
      material: "Solid brass, raw finish",
      careInstructions: "Wipe dry. Polish with brass cleaner to restore shine, or let patina develop.",
      shippingInfo: "Ships in 2–3 business days.",
      returnPolicy: "30-day returns.",
      weight: 2,
      dimensions: "8\" L × 3\" W × 4\" H",
      featured: true,
      stock: 55,
      tags: ["desk", "organizer", "brass"],
      specifications: [
        { label: "Material", value: "Solid brass" },
        { label: "Compartments", value: "4" },
        { label: "Finish", value: "Raw — develops patina" },
      ],
    },
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const { photos, name, ...rest } = p;
    const imgSet = makeGallery(photos, name);
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    const product = await Product.create({
      ...rest,
      name,
      slug: baseSlug,
      images: imgSet.gallery,
      variants: rest.variants || [],
      specifications: rest.specifications || [],
      rating: 4 + Math.random(), // 4.0–5.0
      reviewCount: Math.floor(Math.random() * 80) + 5,
      sold: Math.floor(Math.random() * 200) + 10,
      status: "ACTIVE",
    });
    createdProducts.push(product);
  }
  console.log(`[seed] ${createdProducts.length} products created`);

  // -------- Reviews --------
  const reviewTemplates = [
    { rating: 5, title: "Beautiful craftsmanship", comment: "Exceeded expectations. The materials feel premium and the finish is flawless. Would buy again." },
    { rating: 5, title: "Worth every penny", comment: "I was hesitant about the price but this is genuinely a piece that will last. Photos don't do it justice." },
    { rating: 4, title: "Lovely, minor assembly quibble", comment: "Gorgeous piece overall. Took a bit of fiddling to assemble but instructions were clear." },
    { rating: 5, title: "Perfect gift", comment: "Bought as a housewarming gift and it was a huge hit. Packaging was beautiful too." },
    { rating: 5, title: "Daily joy", comment: "Use this every day and it brings a small moment of joy each time. Cannot recommend enough." },
    { rating: 4, title: "Great quality, slightly different color", comment: "Quality is excellent. The actual color is a touch warmer than the photos but still lovely." },
    { rating: 5, title: "Better than expected", comment: "Wasn't sure about ordering furniture online but this is genuinely beautiful. Delivery was smooth." },
  ];
  const reviewAuthors = ["Sarah M.", "Daniel K.", "Priya R.", "Marcus L.", "Elena V.", "Tom B.", "Aisha N."];
  for (const product of createdProducts.slice(0, 12)) {
    const n = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < n; i++) {
      const t = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      await Review.create({
        productId: product._id,
        userId: demoCustomers[i % demoCustomers.length]._id,
        authorName: reviewAuthors[i % reviewAuthors.length],
        rating: t.rating,
        title: t.title,
        comment: t.comment,
        verified: true,
        status: "APPROVED",
      });
    }
  }
  console.log("[seed] Reviews created");

  // -------- Coupons --------
  await Coupon.create([
    {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minCartAmount: 50,
      usageLimit: 1000,
      perUserLimit: 1,
      active: true,
    },
    {
      code: "LUMIERE25",
      description: "$25 off orders over $200",
      discountType: "FIXED",
      discountValue: 25,
      minCartAmount: 200,
      usageLimit: 500,
      perUserLimit: 1,
      active: true,
    },
    {
      code: "FREESHIP",
      description: "15% off (covers shipping on most orders)",
      discountType: "PERCENTAGE",
      discountValue: 15,
      minCartAmount: 100,
      maxDiscount: 50,
      usageLimit: 0,
      perUserLimit: 5,
      active: true,
    },
    {
      code: "SEASON20",
      description: "Seasonal — 20% off everything",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minCartAmount: 0,
      maxDiscount: 200,
      usageLimit: 0,
      perUserLimit: 1,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true,
    },
  ]);
  console.log("[seed] Coupons created");

  // -------- Store settings --------
  await StoreSetting.create({
    storeName: "Lumière",
    storeTagline: "Premium lifestyle, curated for you",
    email: "support@lumiere.store",
    phone: "+1 (800) 555-0142",
    address: "1208 Market Street, San Francisco, CA 94103",
    currency: "USD",
    currencySymbol: "$",
    taxRate: 0.08,
    freeShippingThreshold: 75,
    flatShippingRate: 6.95,
    facebookUrl: "https://facebook.com/lumiere.store",
    twitterUrl: "https://twitter.com/lumiere_store",
    instagramUrl: "https://instagram.com/lumiere.store",
    youtubeUrl: "https://youtube.com/@lumiere",
    pinterestUrl: "https://pinterest.com/lumiere_store",
    defaultSeoTitle: "Lumière — Premium Furniture, Decor & Lifestyle",
    defaultSeoDescription: "Shop hand-crafted furniture, lighting, decor, and lifestyle essentials. Free shipping over $75. 30-day returns. Designed in San Francisco.",
  });
  console.log("[seed] Store settings created");

  console.log("\n[seed] ✅ Seed complete");
  console.log(`[seed] Admin login: ${config.adminEmail} / ${config.adminPassword}`);
  console.log(`[seed] Demo customer: emma@example.com / Password123`);

  await disconnectDB();
}

main().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
