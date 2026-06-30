import type { Metadata } from 'next'
import { products, getCategoryById } from '@/data/catalog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return {
      title: 'Product not found',
      description: 'The product you are looking for could not be found.',
    }
  }

  const siteUrl = 'https://aurelia-store.example.com'
  const url = `${siteUrl}/products/${product.slug}`

  return {
    title: product.name,
    description: product.shortDesc,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} · Aurelia`,
      description: product.shortDesc,
      url,
      type: 'website',
      images: [
        {
          url: product.featuredImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} · Aurelia`,
      description: product.shortDesc,
      images: [product.featuredImage],
    },
  }
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  const category = product ? getCategoryById(product.categoryId) : null

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.shortDesc,
        sku: product.sku,
        brand: { '@type': 'Brand', name: 'Aurelia' },
        category: category?.name,
        image: product.images,
        offers: {
          '@type': 'Offer',
          url: `https://aurelia-store.example.com/products/${product.slug}`,
          price: product.price,
          priceCurrency: 'USD',
          availability:
            product.quantity > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      }
    : null

  const breadcrumbSchema = product && category
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aurelia-store.example.com/' },
          { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://aurelia-store.example.com/shop' },
          { '@type': 'ListItem', position: 3, name: category.name, item: `https://aurelia-store.example.com/shop?category=${category.slug}` },
          { '@type': 'ListItem', position: 4, name: product.name, item: `https://aurelia-store.example.com/products/${product.slug}` },
        ],
      }
    : null

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  )
}
