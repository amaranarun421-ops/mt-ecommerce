import { Seo } from "@/components/shared/Seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const TABLES = [
  {
    title: "Bedding",
    sizes: [
      { label: "Twin", dimensions: "66\" × 90\" (168 × 229 cm)" },
      { label: "Twin XL", dimensions: "66\" × 96\" (168 × 244 cm)" },
      { label: "Full / Double", dimensions: "81\" × 90\" (206 × 229 cm)" },
      { label: "Queen", dimensions: "90\" × 90\" (229 × 229 cm)" },
      { label: "King", dimensions: "108\" × 90\" (274 × 229 cm)" },
      { label: "Cal King", dimensions: "102\" × 96\" (259 × 244 cm)" },
    ],
  },
  {
    title: "Rugs",
    sizes: [
      { label: "Runner", dimensions: "2' × 7' (61 × 213 cm)" },
      { label: "Small", dimensions: "3' × 5' (91 × 152 cm)" },
      { label: "Medium", dimensions: "5' × 8' (152 × 244 cm)" },
      { label: "Large", dimensions: "8' × 10' (244 × 305 cm)" },
      { label: "Extra Large", dimensions: "9' × 12' (274 × 366 cm)" },
      { label: "Round 8'", dimensions: "8' diameter (244 cm)" },
    ],
  },
  {
    title: "Furniture — seating",
    sizes: [
      { label: "1-Seater", dimensions: "Up to 60\" wide — fits 1 adult comfortably" },
      { label: "2-Seater", dimensions: "60\"–80\" wide — fits 2 adults" },
      { label: "3-Seater", dimensions: "80\"–95\" wide — fits 3 adults" },
      { label: "Sectional (L-shape)", dimensions: "100\"–120\" on the long side" },
      { label: "Dining chair seat height", dimensions: "18\" standard (45 cm)" },
    ],
  },
  {
    title: "Tables",
    sizes: [
      { label: "Side table", dimensions: "16\"–22\" diameter" },
      { label: "Coffee table", dimensions: "36\"–48\" wide × 18\"–22\" deep" },
      { label: "Dining (4-seater)", dimensions: "60\" × 30\"–36\"" },
      { label: "Dining (6-seater)", dimensions: "78\" × 36\"" },
      { label: "Dining (8-seater)", dimensions: "96\" × 36\"–42\"" },
      { label: "Standard table height", dimensions: "30\" (76 cm)" },
    ],
  },
];

export default function SizeGuidePage() {
  return (
    <>
      <Seo title="Size Guide" description="Dimensions and sizing reference for Lumière's bedding, rugs, furniture, and tables." canonical="/size-guide" />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Size Guide" }]} className="mb-6" />
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">Size Guide</h1>
          <p className="text-muted-foreground mb-8">Reference dimensions to help you choose the right piece for your space. When in doubt, contact us — we're happy to help.</p>

          <div className="rounded-xl bg-accent/40 border border-accent p-5 mb-8">
            <h2 className="font-display text-base font-semibold mb-2">Before you order</h2>
            <ul className="text-sm text-accent-foreground space-y-1.5">
              <li>• Measure your space — including doorways, hallways, and stairwells the piece will need to pass through.</li>
              <li>• Account for at least 18" of walking space around furniture.</li>
              <li>• For rugs, leave 12–18" of floor visible around the perimeter in dining rooms, and front-legs-on-rug in living rooms.</li>
              <li>• Each product page lists its exact dimensions and weight.</li>
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {TABLES.map((t) => (
              <div key={t.title} className="card-premium p-6">
                <h2 className="font-display text-lg font-semibold mb-4">{t.title}</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 font-medium text-muted-foreground">Size</th>
                      <th className="pb-2 font-medium text-muted-foreground">Dimensions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {t.sizes.map((s) => (
                      <tr key={s.label}>
                        <td className="py-2.5 font-medium">{s.label}</td>
                        <td className="py-2.5 text-muted-foreground">{s.dimensions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-3">Still not sure? We're here to help.</p>
            <Link to="/contact"><Button>Contact Support</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
