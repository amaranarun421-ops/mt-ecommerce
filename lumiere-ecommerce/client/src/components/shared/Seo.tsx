import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
  children?: ReactNode;
}

export function Seo({ title, description, image, canonical, type = "website", jsonLd, children }: SeoProps) {
  const fullTitle = title.includes("Lumière") ? title : `${title} | Lumière`;
  const desc = description || "Shop hand-crafted furniture, lighting, decor, and lifestyle essentials. Free shipping over $75. 30-day returns. Designed in San Francisco.";
  const img = image || "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={img} />
      <meta property="og:site_name" content="Lumière" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
      {children}
    </Helmet>
  );
}
