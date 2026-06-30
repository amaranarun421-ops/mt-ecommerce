// Curated Unsplash images for the Lumière catalog.
// All URLs are direct Unsplash CDN images (royalty-free, no API key needed).
const u = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const UNSPLASH = {
  furniture: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
  lighting: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
  decor: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
  bedding: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
  stationery: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  hero1: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
  hero2: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80",
  hero3: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=80",
  promo1: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1400&q=80",
  promo2: "https://images.unsplash.com/photo-1602874801006-e26c4b6d4a5e?auto=format&fit=crop&w=1400&q=80",
  about: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  avatar1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  avatar2: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  avatar3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  avatar4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  avatar5: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  avatar6: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
} as const;

export type ImageSet = { primary: string; gallery: { url: string; altText: string }[] };

export function makeGallery(photos: string[], altBase: string): ImageSet {
  const gallery = photos.slice(0, 4).map((url, i) => ({ url, altText: `${altBase} — view ${i + 1}` }));
  return { primary: gallery[0]?.url || "", gallery };
}

// Each product family has 3–4 curated Unsplash photos
export const PRODUCT_PHOTOS: Record<string, string[]> = {
  sofa1: [
    u("1555041469-a586c9b5f5b1"),
    u("1567016432779-094069958ea5"),
    u("1540574163026-643ea20ade25"),
    u("1586023492125-27b2c045efd7"),
  ],
  chair1: [
    u("1592078615290-033ee584e267"),
    u("1506439773649-6e0eb8cfb237"),
    u("1519947486511-46149fa0a254"),
    u("1567538096630-e0c55bd6374c"),
  ],
  table1: [
    u("1577140917170-285929fb55b7"),
    u("1532372320572-cda25653a26d"),
    u("1538688525198-9b88f6f53126"),
  ],
  shelf1: [
    u("1594620302200-9a762244a156"),
    u("1524758631624-e2822e304c36"),
    u("1581094288338-2314dddb7ece"),
  ],
  bed1: [
    u("1505693416388-ac5ce068fe85"),
    u("1522771739844-6a9f6d5f14af"),
    u("1631049307264-da0ec9d70304"),
  ],
  lamp1: [
    u("1507473885765-e6ed057f782c"),
    u("1513506003901-1e6a229e2d15"),
    u("1567538096630-e0c55bd6374c"),
  ],
  lamp2: [
    u("1517991104123-1d56a6e81ed9"),
    u("1565814329452-e1efa11c5b89"),
  ],
  pendant1: [
    u("1513506003901-1e6a229e2d15"),
    u("1567538096630-e0c55bd6374c"),
  ],
  vase1: [
    u("1578500494198-246f612d3b3d"),
    u("1493663284031-b7e3aefcae8e"),
  ],
  rug1: [
    u("1600121848594-d8644e57abab"),
    u("1581539250439-c96689b516dd"),
    u("1583847268964-b28dc8f51f92"),
  ],
  frame1: [
    u("1513519245088-0e12902e5a38"),
    u("1493663284031-b7e3aefcae8e"),
  ],
  candle1: [
    u("1602874801006-e26c4b6d4a5e"),
    u("1600612253971-422e7f7faeb6"),
  ],
  plant1: [
    u("1485955900006-10f4d324d411"),
    u("1459411552884-841db9b3cc2a"),
    u("1463320726281-696a485928c7"),
  ],
  mug1: [
    u("1514228742587-6b1558fcca3d"),
    u("1556909114-f6e7ad7d3136"),
    u("1577937927133-66ef06acdf18"),
  ],
  kettle1: [
    u("1493946740644-2d8a1f1a47aff"),
    u("1556909114-f6e7ad7d3136"),
  ],
  board1: [
    u("1556909114-44e3e70034e2"),
    u("1556909114-f6e7ad7d3136"),
  ],
  cookware1: [
    u("1556909114-4c13d8c84f3c"),
    u("1556909114-f6e7ad7d3136"),
  ],
  throw1: [
    u("1522771739844-6a9f6d5f14af"),
    u("1631049307264-da0ec9d70304"),
  ],
  pillow1: [
    u("1583845112203-29329902332e"),
    u("1522771739844-6a9f6d5f14af"),
  ],
  notebook1: [
    u("1455390582262-044cdead277a"),
    u("1531346878377-a5be20888e57"),
  ],
  desk1: [
    u("1593062096033-9a26b09da705"),
    u("1518455027359-f3f8164ba6bd"),
  ],
};
