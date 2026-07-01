"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useAuth } from "@/contexts/auth-context";
import {
  product,
  productImages,
  productColors,
  productSpecs,
  productFeatures,
  accessories,
  reviews,
  reviewDistribution,
  faqs,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { RatingStars } from "@/components/common/rating-stars";
import { SectionHeading } from "@/components/common/section-heading";
import {
  Heart,
  Share2,
  GitCompare,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Check,
  Minus,
  Plus,
  Star,
  Package,
  FileText,
  Download,
  Headphones,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function ProductPage({ section }: { section?: "accessories" | "reviews" }) {
  // All hooks must run before any early return — Rules of Hooks
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted, toggleCompare, isComparing, canAddToCompare, addRecentlyViewed } = useWishlist();

  const [color, setColor] = useState(productColors[0]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (section) return; // skip for accessories/reviews views
    addRecentlyViewed({
      productId: product.sku,
      name: product.name,
      variant: color.name,
      price: product.price,
      image: productImages[0].src,
    });
  }, [section, addRecentlyViewed, color.name]);

  if (section === "accessories") return <AccessoriesOnly />;
  if (section === "reviews") return <ReviewsOnly />;

  const handleAdd = () => {
    addToCart(
      {
        productId: product.sku,
        name: product.name,
        variant: color.name,
        price: product.price,
        image: productImages[0].src,
      },
      qty,
    );
    toast.success(t("cartDrawer.added"), {
      description: `${product.name} — ${color.name} × ${qty}`,
    });
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate("/checkout");
  };

  const inWishlist = isWishlisted(product.sku);
  const inCompare = isComparing(product.sku);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.product"), href: "/product" },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main product section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <ProductGallery
            activeImg={activeImg}
            setActiveImg={setActiveImg}
            onZoom={() => setZoomOpen(true)}
          />

          {/* Product info */}
          <div className="space-y-7 lg:sticky lg:top-24 lg:self-start">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                  {language === "ar" ? product.collectionAr : product.collection}
                </Badge>
                <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-semibold text-balance leading-tight">
                {product.name}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                {language === "ar" ? product.shortDescriptionAr : product.shortDescription}
              </p>
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating} size="sm" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  · {product.reviewCount.toLocaleString()} {t("reviews.reviews")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-display text-4xl font-semibold tabular-nums">
                ${product.price}
              </span>
              <span className="text-lg text-muted-foreground line-through tabular-nums">
                ${product.compareAtPrice}
              </span>
              <Badge className="bg-accent/15 text-accent border-0 hover:bg-accent/15">
                Save ${product.compareAtPrice - product.price}
              </Badge>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                {t("product.inStock")}
              </span>
              <span className="text-muted-foreground">
                · {product.stock} {language === "ar" ? "متاحة" : "available"}
              </span>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label3>{t("product.color")}</Label3>
                <span className="text-sm font-medium text-foreground">
                  {language === "ar" ? color.nameAr : color.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {productColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c)}
                    className={cn(
                      "relative w-12 h-12 rounded-full border-2 transition-all duration-200",
                      color.id === c.id
                        ? "border-accent scale-110 shadow-soft"
                        : "border-border hover:border-muted-foreground hover:scale-105",
                    )}
                    style={{ backgroundColor: c.hex }}
                    aria-label={language === "ar" ? c.nameAr : c.name}
                  >
                    {color.id === c.id && (
                      <Check
                        className={cn(
                          "absolute inset-0 m-auto w-5 h-5",
                          c.id === "champagne" || c.id === "silver" ? "text-foreground" : "text-background",
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-border rounded-lg h-12">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                size="lg"
                className="flex-1 h-12 bg-foreground hover:bg-foreground/90 text-background btn-shine"
              >
                <ShoppingBag className="w-4 h-4 me-2" />
                {t("product.addToCart")}
              </Button>
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
              >
                {t("product.buyNow")}
              </Button>
            </div>

            {/* Secondary actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toggleWishlist({
                    productId: product.sku,
                    name: product.name,
                    variant: color.name,
                    price: product.price,
                    image: productImages[0].src,
                  });
                  toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
                className="flex-1"
              >
                <Heart className={cn("w-4 h-4 me-1.5", inWishlist && "fill-accent text-accent")} />
                {t("product.wishlist")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!inCompare && !canAddToCompare) {
                    toast.error(t("compare.maxReached"));
                    return;
                  }
                  toggleCompare({
                    productId: product.sku,
                    name: product.name,
                    variant: color.name,
                    price: product.price,
                    image: productImages[0].src,
                  });
                  toast.success(inCompare ? "Removed from compare" : "Added to compare");
                }}
                className="flex-1"
              >
                <GitCompare className={cn("w-4 h-4 me-1.5", inCompare && "text-accent")} />
                {t("product.compare")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success(t("common.copied"));
                  }
                }}
                aria-label={t("product.share")}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Separator />

            {/* Trust info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TrustItem icon={Truck} label={t("product.estimatedDelivery")} value={t("product.deliveryValue")} />
              <TrustItem icon={RotateCcw} label={t("product.returns")} value={t("product.returnsValue")} />
              <TrustItem icon={Shield} label={t("product.warranty")} value={t("product.warrantyValue")} />
            </div>

            <Separator />

            {/* Highlights */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold">
                {language === "ar" ? "أبرز الميزات" : "Highlights"}
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {(language === "ar" ? product.highlightsAr : product.highlights).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: description / specs / features / reviews */}
      <section className="bg-muted/30 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description" className="space-y-8">
            <TabsList className="bg-background border border-border h-auto p-1.5 flex flex-wrap">
              <TabsTrigger value="description" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                {t("product.description")}
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                {t("product.features")}
              </TabsTrigger>
              <TabsTrigger value="specs" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                {t("product.specifications")}
              </TabsTrigger>
              <TabsTrigger value="box" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                {t("product.inTheBox")}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                {t("product.reviews")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-5">
                  <h3 className="font-display text-2xl lg:text-3xl font-semibold text-balance">
                    {language === "ar" ? "هذه ليست سماعة. بل آلة موسيقية." : "This is not a headphone. It is an instrument."}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                    {language === "ar" ? product.longDescriptionAr : product.longDescription}
                  </p>
                  <div className="space-y-2 pt-2">
                    {[
                      language === "ar" ? "محركات بيريليوم 40 مم مشغولة بدقة 0.5 ميكرون" : "40mm beryllium drivers machined to 0.5 microns",
                      language === "ar" ? "مضخم Class-A مخصص للتحولات الاستوديو" : "Custom Class-A discrete amplifier for studio transients",
                      language === "ar" ? "8 ميكروفونات، 50,000 عينة/ث" : "8 microphones, 50,000 samples/sec",
                      language === "ar" ? "بطارية 60 ساعة مع شحن سريع 5V" : "60-hour battery with 5V fast charge",
                    ].map((line) => (
                      <div key={line} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-foreground">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-background shadow-soft">
                  <img
                    src={productImages[4].src}
                    alt={language === "ar" ? productImages[4].altAr : productImages[4].alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid sm:grid-cols-2 gap-5">
                {productFeatures.map((f) => (
                  <Card key={f.id} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={f.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="font-display text-lg font-semibold">
                        {language === "ar" ? f.titleAr : f.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === "ar" ? f.descriptionAr : f.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
                {productSpecs.map((spec) => (
                  <div key={spec.label} className="bg-background p-5 hover:bg-muted/30 transition-colors">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                      {language === "ar" ? spec.labelAr : spec.label}
                    </p>
                    <p className="font-display text-base font-semibold">
                      {language === "ar" ? spec.valueAr : spec.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button variant="outline">
                  <Download className="w-4 h-4 me-2" />
                  {t("product.downloadSpecSheet")}
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 me-2" />
                  {t("product.downloadManual")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="box">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Headphones, label: product.name, sub: language === "ar" ? "السماعة الرئيسية" : "Main headphone" },
                  { icon: Package, label: t("product.case"), sub: language === "ar" ? "علبة سفر فاخرة" : "Premium travel case" },
                  { icon: Cable, label: t("product.cable"), sub: "USB-C, 1m" },
                  { icon: FileText, label: t("product.manual"), sub: language === "ar" ? "دليل البدء" : "Quick start guide" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Card key={i} className="text-center border-border shadow-soft">
                      <CardContent className="p-6 space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsInline />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Frequently bought together */}
      <FBTSection />

      {/* Related products */}
      <RelatedSection />

      {/* Recently viewed */}
      <RecentlyViewedSection />

      {/* Zoom dialog */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomOpen(false)}
        >
          <button
            className="absolute top-5 end-5 text-background hover:text-accent transition-colors"
            onClick={() => setZoomOpen(false)}
            aria-label={t("nav.close")}
          >
            <Plus className="w-8 h-8 rotate-45" />
          </button>
          <img
            src={productImages[activeImg].src}
            alt=""
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function Cable(props: { className?: string }) {
  // Simple inline icon substitute (avoids extra lucide import)
  return <Package {...props} />;
}

function Label3({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-foreground">{children}</p>;
}

function TrustItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
      <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ProductGallery({
  activeImg,
  setActiveImg,
  onZoom,
}: {
  activeImg: number;
  setActiveImg: (n: number) => void;
  onZoom: () => void;
}) {
  const { t, language } = useLanguage();
  const gallery = productImages;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-elevated group">
        <img
          src={gallery[activeImg].src}
          alt={language === "ar" ? gallery[activeImg].altAr : gallery[activeImg].alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Arrows */}
        <button
          onClick={() => setActiveImg((activeImg - 1 + gallery.length) % gallery.length)}
          className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 rtl:flip" />
        </button>
        <button
          onClick={() => setActiveImg((activeImg + 1) % gallery.length)}
          className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 rtl:flip" />
        </button>
        {/* Zoom button */}
        <button
          onClick={onZoom}
          className="absolute end-3 top-3 w-10 h-10 rounded-full glass hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
          aria-label={t("product.fullscreen")}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        {/* Counter */}
        <div className="absolute bottom-3 end-3 glass rounded-full px-3 py-1 text-xs font-medium">
          {activeImg + 1} / {gallery.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2">
        {gallery.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={cn(
              "aspect-square rounded-lg overflow-hidden border-2 transition-all",
              activeImg === i ? "border-accent scale-105" : "border-transparent hover:border-border opacity-70 hover:opacity-100",
            )}
          >
            <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewsInline() {
  const { t, language } = useLanguage();
  const featured = reviews.slice(0, 4);
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-5">
        {featured.map((r) => (
          <Card key={r.id} className="border-border shadow-soft">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center font-semibold text-sm">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.location}</p>
                  </div>
                </div>
                <RatingStars rating={r.rating} size="xs" />
              </div>
              <h4 className="font-semibold text-sm">{language === "ar" ? r.titleAr : r.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {language === "ar" ? r.bodyAr : r.body}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                <span>{new Date(r.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                {r.verified && (
                  <span className="inline-flex items-center gap-1 text-accent font-medium">
                    <Check className="w-3 h-3" />
                    {t("reviews.verified")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button variant="outline" onClick={() => (window.location.hash = "#/reviews")}>
          {t("common.viewAll")} {product.reviewCount.toLocaleString()} {t("reviews.reviews")}
        </Button>
      </div>
    </div>
  );
}

function FBTSection() {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const [bundle, setBundle] = useState([true, true, false]);
  const items = [
    { ...accessories[0], image: productImages[0].src, name: product.name, price: product.price, variant: "Obsidian Black" },
    accessories[0],
    accessories[1],
  ];
  const total = items.filter((_, i) => bundle[i]).reduce((s, it) => s + it.price, 0);
  const saving = Math.round(total * 0.1);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-8">
          {t("product.fbt")}
        </h2>
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-muted/30 transition-colors">
                <input
                  type="checkbox"
                  checked={bundle[i]}
                  onChange={(e) => setBundle((b) => b.map((v, j) => (j === i ? e.target.checked : v)))}
                  className="w-5 h-5 rounded accent-accent"
                />
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img src={it.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{language === "ar" ? (it as any).nameAr || it.name : it.name}</p>
                  <p className="text-xs text-muted-foreground">${it.price}</p>
                </div>
              </div>
            ))}
          </div>
          <Card className="border-border shadow-soft sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("product.totalBundle")}</span>
                  <span className="font-semibold tabular-nums">${total}</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>{t("product.fbtSave", { n: `$${saving}` })}</span>
                  <span className="font-semibold tabular-nums">-${saving}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-display font-semibold tabular-nums">${total - saving}</span>
                </div>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
                onClick={() => {
                  items.forEach((it, i) => {
                    if (bundle[i]) {
                      addToCart({
                        productId: it.id || product.sku,
                        name: it.name,
                        variant: (it as any).variant || "",
                        price: it.price,
                        image: it.image,
                      });
                    }
                  });
                  toast.success(t("cartDrawer.added"));
                }}
              >
                {t("product.addBundle")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function RelatedSection() {
  const { t, language } = useLanguage();
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-8">
          {t("product.related")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {accessories.map((a) => (
            <Card key={a.id} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow group cursor-pointer" >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={a.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="font-semibold text-sm">{language === "ar" ? a.nameAr : a.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{language === "ar" ? a.descriptionAr : a.description}</p>
                  <p className="font-display font-semibold tabular-nums">${a.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentlyViewedSection() {
  const { t } = useLanguage();
  const { recentlyViewed } = useWishlist();
  if (recentlyViewed.length === 0) return null;
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl lg:text-3xl font-semibold mb-8">
          {t("product.recentlyViewed")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentlyViewed.slice(0, 5).map((item) => (
            <Card key={item.productId} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.variant}</p>
                  <p className="font-semibold text-sm tabular-nums">${item.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccessoriesOnly() {
  const { t, language } = useLanguage();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <Breadcrumbs items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.accessories") }]} />
      <SectionHeading
        eyebrow={language === "ar" ? "مواد مكمّلة" : "Companion pieces"}
        title={language === "ar" ? "ملحقات أوريك ون" : "AURIC ONE accessories"}
        subtitle={language === "ar" ? "صُممت لاستكمال التجربة." : "Designed to complete the experience."}
      />
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {accessories.map((a) => (
          <Card key={a.id} className="overflow-hidden border-border shadow-soft hover:shadow-elevated transition-shadow group">
            <CardContent className="p-0">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={a.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5 space-y-2">
                <p className="font-semibold">{language === "ar" ? a.nameAr : a.name}</p>
                <p className="text-sm text-muted-foreground">{language === "ar" ? a.descriptionAr : a.description}</p>
                <p className="font-display text-lg font-semibold tabular-nums">${a.price}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReviewsOnly() {
  const { t, language } = useLanguage();
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Breadcrumbs items={[{ label: t("nav.home"), href: "/" }, { label: t("nav.reviews") }]} />
        <SectionHeading
          eyebrow={t("reviews.eyebrow")}
          title={t("reviews.title")}
          subtitle={t("reviews.subtitle")}
          align="start"
        />
      </div>
      <ReviewsListFull />
    </div>
  );
}

export function ReviewsListFull() {
  const { t, language } = useLanguage();
  const [sort, setSort] = useState<"helpful" | "recent" | "high" | "low">("helpful");
  const [filter, setFilter] = useState<number | null>(null);

  let sorted = [...reviews];
  if (filter) sorted = sorted.filter((r) => r.rating === filter);
  if (sort === "helpful") sorted.sort((a, b) => b.helpful - a.helpful);
  if (sort === "recent") sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (sort === "high") sorted.sort((a, b) => b.rating - a.rating);
  if (sort === "low") sorted.sort((a, b) => a.rating - b.rating);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-2xl bg-muted/40 border border-border">
            <div className="text-center space-y-2">
              <p className="font-display text-5xl font-semibold text-accent tabular-nums">
                {product.rating}
              </p>
              <RatingStars rating={product.rating} className="justify-center" />
              <p className="text-xs text-muted-foreground">
                {product.reviewCount.toLocaleString()} {t("reviews.reviews")}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">{t("reviews.distribution")}</p>
            {reviewDistribution.map((d) => (
              <button
                key={d.stars}
                onClick={() => setFilter(filter === d.stars ? null : d.stars)}
                className={cn(
                  "w-full flex items-center gap-2 text-sm p-2 rounded-md transition-colors",
                  filter === d.stars ? "bg-accent/10 text-accent" : "hover:bg-muted",
                )}
              >
                <span className="w-8 flex items-center gap-0.5">
                  {d.stars}
                  <Star className="w-3 h-3 fill-accent text-accent" />
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${d.percent}%` }} />
                </div>
                <span className="w-10 text-end text-xs text-muted-foreground tabular-nums">{d.count}</span>
              </button>
            ))}
            {filter && (
              <Button variant="ghost" size="sm" onClick={() => setFilter(null)} className="mt-2">
                {t("search.clear")}
              </Button>
            )}
          </div>
        </aside>

        {/* Reviews list */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {sorted.length} {t("reviews.reviews")}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="text-sm border border-border rounded-md px-3 py-2 bg-background"
            >
              <option value="helpful">{t("reviews.mostHelpful")}</option>
              <option value="recent">{t("reviews.mostRecent")}</option>
              <option value="high">{t("reviews.highestRated")}</option>
              <option value="low">{t("reviews.lowestRated")}</option>
            </select>
          </div>
          {sorted.map((r) => (
            <Card key={r.id} className="border-border shadow-soft">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-semibold">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.location} · {r.variant}</p>
                    </div>
                  </div>
                  <RatingStars rating={r.rating} size="xs" />
                </div>
                <h4 className="font-display font-semibold text-base">{language === "ar" ? r.titleAr : r.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{language === "ar" ? r.bodyAr : r.body}</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                  <span className="text-muted-foreground">
                    {new Date(r.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  <div className="flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 rotate-90" />
                      {t("reviews.helpful")} ({r.helpful})
                    </button>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-accent font-medium">
                        <Check className="w-3 h-3" />
                        {t("reviews.verified")}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
