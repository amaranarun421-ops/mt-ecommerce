"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import {
  product,
  productImages,
  productFeatures,
  productSpecs,
  comparisonRows,
  reviews,
  reviewDistribution,
  faqs,
  testimonials,
  accessories,
  trustBadges,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RatingStars } from "@/components/common/rating-stars";
import { SectionHeading } from "@/components/common/section-heading";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Lock,
  AudioWaveform,
  Waves,
  BatteryFull,
  Feather,
  Check,
  Plus,
  Minus,
  Quote,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const featureIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AudioWaveform,
  Waves,
  BatteryFull,
  Feather,
};

const trustIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  RotateCcw,
  Shield,
  Lock,
};

export function HomePage() {
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <TrustBadges />
      <ShowcaseSection />
      <FeaturesSection />
      <SpecificationsSection />
      <ComparisonSection />
      <LifestyleSection />
      <GallerySection />
      <TestimonialsSection />
      <ReviewsPreviewSection />
      <FaqPreviewSection />
      <NewsletterSection />
      <InstagramGallerySection />
    </div>
  );
}

/* -------------------------------------------------------------- HERO */
function HeroSection() {
  const { t, isRTL, language } = useLanguage();
  const { navigate } = useRouter();
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-gradient-to-b from-cream/60 to-background overflow-hidden min-h-[calc(100vh-6.5rem)] lg:min-h-[calc(100vh-7rem)] flex items-center">
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 -start-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Text */}
          <div className={cn("space-y-4 lg:space-y-6 order-2 lg:order-1", isRTL && "lg:order-1")}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
              <span className="text-xs font-semibold tracking-wider uppercase text-accent">
                {t("hero.eyebrow")}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-balance">
              {t("hero.title")}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-xl leading-relaxed text-pretty">
              {t("hero.description")}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-xs sm:text-sm text-muted-foreground">{t("hero.price.from")}</span>
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tabular-nums">
                ${product.price}
              </span>
              <span className="text-sm sm:text-base lg:text-lg text-muted-foreground line-through tabular-nums">
                ${product.compareAtPrice}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-xs font-semibold">
                {t("hero.save")}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/product")}
                className="h-11 sm:h-12 px-5 sm:px-6 lg:px-7 bg-foreground hover:bg-foreground/90 text-background btn-shine"
              >
                {t("hero.cta.shop")}
                <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/reviews")}
                className="h-11 sm:h-12 px-5 sm:px-6 lg:px-7"
              >
                <Star className="w-4 h-4 me-1.5 fill-accent text-accent" />
                {t("hero.cta.reviews")}
              </Button>
            </div>

            {/* Inline reviews summary */}
            <div className="flex items-center gap-3 sm:gap-4 pt-1">
              <RatingStars rating={product.rating} size="sm" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {product.reviewCount.toLocaleString()} {t("reviews.reviews")}
                </span>
              </div>
            </div>
          </div>

          {/* Image — auto height mode, fits container */}
          <div className={cn("order-1 lg:order-2 relative w-full", isRTL && "lg:order-2")}>
            <div className="relative w-full h-auto aspect-[16/10] sm:aspect-[16/10] lg:aspect-[4/5] xl:aspect-[5/6] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-muted to-cream shadow-elevated">
              {productImages.slice(0, 3).map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={language === "ar" ? img.altAr : img.alt}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-all duration-700",
                    active === i ? "opacity-100 scale-100" : "opacity-0 scale-105",
                  )}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}

              {/* Image switcher dots */}
              <div className="absolute bottom-4 sm:bottom-5 inset-x-0 flex items-center justify-center gap-2 z-10">
                {productImages.slice(0, 3).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      active === i ? "w-8 bg-accent" : "w-1.5 bg-foreground/30",
                    )}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating spec card */}
              <div className="absolute top-3 end-3 sm:top-4 sm:end-4 glass rounded-xl sm:rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-soft z-10">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Driver
                </p>
                <p className="text-xs sm:text-sm font-display font-semibold">40mm Beryllium</p>
              </div>
              <div className="absolute bottom-3 start-3 sm:bottom-4 sm:start-4 glass rounded-xl sm:rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-soft z-10">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Battery
                </p>
                <p className="text-xs sm:text-sm font-display font-semibold">60 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- TRUST BADGES */
function TrustBadges() {
  const { t, language } = useLanguage();
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {trustBadges.map((b) => {
            const Icon = trustIconMap[b.icon] ?? Shield;
            return (
              <div key={b.title} className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm font-medium">
                  {language === "ar" ? b.titleAr : b.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- SHOWCASE */
function ShowcaseSection() {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[5/6] rounded-3xl overflow-hidden bg-muted shadow-elevated">
              <img
                src={productImages[1].src}
                alt={language === "ar" ? productImages[1].altAr : productImages[1].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 start-1/2 -translate-x-1/2 lg:start-auto lg:translate-x-0 lg:end-8 lg:-translate-y-1/2 lg:top-1/2 glass rounded-2xl p-5 shadow-elevated w-[260px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                  <AudioWaveform className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sampled at</p>
                  <p className="text-sm font-semibold">50,000 Hz</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Real-time DSP shaping for adaptive noise cancellation.
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-7">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                {t("showcase.eyebrow")}
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-balance leading-[1.1]">
                {t("showcase.title")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                {t("showcase.body")}
              </p>
            </div>

            {/* Highlight ticks */}
            <ul className="space-y-3">
              {(language === "ar" ? product.highlightsAr : product.highlights).map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm lg:text-base text-foreground">{h}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/product")}
              className="h-12 px-6 group"
            >
              {t("hero.cta.explore")}
              <ArrowUpRight className="w-4 h-4 ms-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- FEATURES */
function FeaturesSection() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 lg:py-32 bg-foreground text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute top-1/4 start-1/4 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-1/4 end-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
            {t("features.eyebrow")}
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-balance leading-[1.1] mb-4">
            {t("features.title")}
          </h2>
          <p className="text-lg text-background/70 text-pretty">{t("features.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image switcher */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-background/5 shadow-elevated">
            {productFeatures.map((f, i) => (
              <img
                key={f.id}
                src={f.image}
                alt={language === "ar" ? f.titleAr : f.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-all duration-700",
                  active === i ? "opacity-100 scale-100" : "opacity-0 scale-105",
                )}
                loading="lazy"
              />
            ))}
            <div className="absolute bottom-5 inset-x-5 flex items-center justify-between gap-3">
              <div className="glass rounded-full px-4 py-2 text-sm font-medium">
                {String(active + 1).padStart(2, "0")} / {String(productFeatures.length).padStart(2, "0")}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActive((a) => (a - 1 + productFeatures.length) % productFeatures.length)}
                  className="w-10 h-10 rounded-full glass hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActive((a) => (a + 1) % productFeatures.length)}
                  className="w-10 h-10 rounded-full glass hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {productFeatures.map((f, i) => {
              const Icon = featureIconMap[f.icon] ?? AudioWaveform;
              const isActive = active === i;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full text-start p-5 lg:p-6 rounded-2xl border transition-all duration-300",
                    isActive
                      ? "bg-background/5 border-accent shadow-soft"
                      : "border-background/10 hover:border-background/20 hover:bg-background/[0.03]",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isActive ? "bg-accent text-accent-foreground" : "bg-background/5 text-accent",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl font-semibold mb-1.5">
                        {language === "ar" ? f.titleAr : f.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm text-background/70 leading-relaxed transition-all",
                          isActive ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0 overflow-hidden",
                        )}
                      >
                        {language === "ar" ? f.descriptionAr : f.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- SPECIFICATIONS */
function SpecificationsSection() {
  const { t, language } = useLanguage();
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("specs.eyebrow")}
          title={t("specs.title")}
          subtitle={t("specs.subtitle")}
        />

        <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {productSpecs.map((spec) => (
            <div key={spec.label} className="bg-background p-6 hover:bg-muted/30 transition-colors">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                {language === "ar" ? spec.labelAr : spec.label}
              </p>
              <p className="font-display text-lg font-semibold">
                {language === "ar" ? spec.valueAr : spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- COMPARISON */
function ComparisonSection() {
  const { t, language } = useLanguage();
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("comparison.eyebrow")}
          title={t("comparison.title")}
          subtitle={t("comparison.subtitle")}
        />

        <div className="mt-12 lg:mt-16 overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
          {/* Header */}
          <div className="grid grid-cols-3 bg-foreground text-background">
            <div className="p-5 lg:p-6">
              <p className="text-xs uppercase tracking-wider text-background/60 font-semibold">
                {language === "ar" ? "الميزة" : "Feature"}
              </p>
            </div>
            <div className="p-5 lg:p-6 text-center border-s border-background/10">
              <p className="font-display text-lg font-semibold text-accent">
                {t("comparison.auric")}
              </p>
            </div>
            <div className="p-5 lg:p-6 text-center border-s border-background/10">
              <p className="font-display text-lg font-semibold text-background/80">
                {t("comparison.other")}
              </p>
            </div>
          </div>

          {/* Rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={row.feature}
              className={cn(
                "grid grid-cols-3 border-t border-border",
                i % 2 === 1 && "bg-muted/20",
              )}
            >
              <div className="p-4 lg:p-5 text-sm font-medium">
                {language === "ar" ? row.featureAr : row.feature}
              </div>
              <div className="p-4 lg:p-5 text-center text-sm font-semibold text-accent border-s border-border">
                {language === "ar" ? row.auricAr : row.auric}
              </div>
              <div className="p-4 lg:p-5 text-center text-sm text-muted-foreground border-s border-border">
                {language === "ar" ? row.competitor.valueAr : row.competitor.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- LIFESTYLE */
function LifestyleSection() {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-foreground text-background">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative">
              <img
                src={productImages[3].src}
                alt={language === "ar" ? productImages[3].altAr : productImages[3].alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent lg:bg-gradient-to-r" />
            </div>
            <div className="p-8 lg:p-16 space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                {t("lifestyle.eyebrow")}
              </p>
              <h2 className="font-display text-3xl lg:text-5xl font-semibold text-balance leading-[1.1]">
                {t("lifestyle.title")}
              </h2>
              <p className="text-lg text-background/70 leading-relaxed text-pretty">
                {t("lifestyle.body")}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="font-display text-3xl font-semibold text-accent">284g</p>
                  <p className="text-xs text-background/60 mt-1">{language === "ar" ? "الوزن" : "Weight"}</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-accent">8h+</p>
                  <p className="text-xs text-background/60 mt-1">{language === "ar" ? "جلسات بلا إرهاق" : "Fatigue-free"}</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-accent">IPX4</p>
                  <p className="text-xs text-background/60 mt-1">{language === "ar" ? "مقاوم للعرق" : "Sweat-proof"}</p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => navigate("/product")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine mt-4"
              >
                {t("hero.cta.shop")}
                <ArrowRight className="w-4 h-4 ms-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- GALLERY */
function GallerySection() {
  const { t, language } = useLanguage();
  const gallery = [
    productImages[0],
    productImages[2],
    productImages[4],
    productImages[1],
    productImages[5],
    productImages[3],
  ];
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("gallery.eyebrow")}
          title={t("gallery.title")}
          subtitle={t("gallery.subtitle")}
        />
        <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {gallery.map((img, i) => (
            <div
              key={i}
              className={cn(
                "zoom-container relative rounded-2xl overflow-hidden bg-background shadow-soft",
                i === 0 && "col-span-2 row-span-2 aspect-square lg:aspect-[4/3]",
                i !== 0 && "aspect-square",
              )}
            >
              <img
                src={img.src}
                alt={language === "ar" ? img.altAr : img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- TESTIMONIALS */
function TestimonialsSection() {
  const { t, language } = useLanguage();
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("testimonials.eyebrow")}
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        />
        <div className="mt-12 lg:mt-16 grid md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((item) => (
            <Card key={item.id} className="relative border-border shadow-soft hover:shadow-elevated transition-shadow duration-500">
              <CardContent className="p-7 space-y-5">
                <Quote className="w-8 h-8 text-accent/30" />
                <RatingStars rating={item.rating} />
                <p className="text-base text-foreground leading-relaxed text-pretty">
                  "{language === "ar" ? item.quoteAr : item.quote}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ar" ? item.roleAr : item.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- REVIEWS PREVIEW */
function ReviewsPreviewSection() {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();
  const featured = reviews.slice(0, 3);

  return (
    <section id="reviews" className="py-20 lg:py-32 bg-muted/30 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Summary */}
          <div className="lg:col-span-4 space-y-6">
            <SectionHeading
              eyebrow={t("reviews.eyebrow")}
              title={t("reviews.title")}
              align="start"
            />
            <p className="text-muted-foreground text-pretty">{t("reviews.subtitle")}</p>

            {/* Rating summary */}
            <div className="flex items-center gap-5 p-6 rounded-2xl bg-background border border-border shadow-soft">
              <div className="text-center">
                <p className="font-display text-5xl font-semibold text-accent tabular-nums">
                  {product.rating}
                </p>
                <RatingStars rating={product.rating} size="sm" className="mt-1.5 justify-center" />
              </div>
              <div className="h-16 w-px bg-border" />
              <div>
                <p className="font-display text-3xl font-semibold tabular-nums">
                  {product.reviewCount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("reviews.based")} {t("reviews.reviews")}
                </p>
              </div>
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              {reviewDistribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-muted-foreground flex items-center gap-1">
                    {d.stars}
                    <Star className="w-3 h-3 fill-accent text-accent" />
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${d.percent}%` }} />
                  </div>
                  <span className="w-12 text-end text-xs text-muted-foreground tabular-nums">
                    {d.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/reviews")}
              className="group"
            >
              {t("common.viewAll")}
              <ArrowRight className="w-4 h-4 ms-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Featured reviews */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4 lg:gap-5">
            {featured.map((r, i) => (
              <Card
                key={r.id}
                className={cn(
                  "border-border shadow-soft hover:shadow-elevated transition-shadow duration-500",
                  i === 0 && "sm:col-span-2",
                )}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-semibold text-sm">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.location}</p>
                      </div>
                    </div>
                    <RatingStars rating={r.rating} size="xs" />
                  </div>
                  <h4 className="font-display font-semibold text-base leading-snug">
                    {language === "ar" ? r.titleAr : r.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {language === "ar" ? r.bodyAr : r.body}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent">
                        <Check className="w-3 h-3" />
                        {t("reviews.verified")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- FAQ PREVIEW */
function FaqPreviewSection() {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          subtitle={t("faq.subtitle")}
        />
        <Accordion type="single" collapsible className="mt-12 lg:mt-16 space-y-3">
          {faqs.slice(0, 5).map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-2xl px-5 lg:px-6 shadow-soft data-[state=open]:bg-muted/30 transition-colors"
            >
              <AccordionTrigger className="text-start font-display text-base lg:text-lg font-semibold hover:no-underline py-5">
                {language === "ar" ? item.qAr : item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm lg:text-base text-muted-foreground leading-relaxed pb-5">
                {language === "ar" ? item.aAr : item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-10">
          <Button variant="outline" onClick={() => navigate("/faq")} className="group">
            {t("faq.contact")}
            <ArrowRight className="w-4 h-4 ms-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- NEWSLETTER */
function NewsletterSection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 lg:py-28 bg-foreground text-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          {t("newsletter.eyebrow")}
        </p>
        <h2 className="font-display text-4xl lg:text-5xl font-semibold text-balance leading-[1.1]">
          {t("newsletter.title")}
        </h2>
        <p className="text-lg text-background/70 text-pretty max-w-2xl mx-auto">
          {t("newsletter.subtitle")}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = new FormData(form).get("email") as string;
            if (email) {
              toast.success("Subscribed", {
                description: "Welcome to the inner circle. Check your inbox.",
              });
              form.reset();
            }
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4"
        >
          <input
            type="email"
            name="email"
            required
            placeholder={t("newsletter.placeholder")}
            className="flex-1 h-12 px-4 rounded-lg bg-background/5 border border-background/15 text-background placeholder:text-background/40 focus:outline-none focus:border-accent focus:bg-background/10 transition-colors"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
          >
            {t("newsletter.subscribe")}
          </Button>
        </form>
        <p className="text-xs text-background/40">{t("newsletter.privacy")}</p>
      </div>
    </section>
  );
}

/* --------------------------------------------------- INSTAGRAM GALLERY */
function InstagramGallerySection() {
  const { navigate } = useRouter();
  const images = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
  ];
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
            @auric.audio
          </p>
          <h2 className="font-display text-2xl lg:text-3xl font-semibold">
            In the wild
          </h2>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {images.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="zoom-container relative aspect-square rounded-xl overflow-hidden bg-muted group"
            >
              <img src={src} alt="AURIC in use" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
