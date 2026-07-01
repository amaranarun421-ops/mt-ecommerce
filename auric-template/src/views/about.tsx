"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { brandStory, productImages, product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SectionHeading } from "@/components/common/section-heading";
import { Building2, MapPin, Users, Target, Eye, ArrowRight, Quote } from "lucide-react";

export function AboutPage({ section }: { section?: "story" }) {
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.about") },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              {t("about.eyebrow")}
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-semibold text-balance leading-[1.05]">
              {t("about.title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              {t("about.subtitle")}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Stat icon={Building2} label={t("about.founded")} value={brandStory.founded} />
              <Stat icon={MapPin} label={t("about.headquarters")} value={brandStory.headquarters.split(",")[0]} />
              <Stat icon={Users} label={t("about.team")} value="47" />
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted shadow-elevated">
            <img
              src="https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80"
              alt="AURIC headphones"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-foreground text-background py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Quote className="w-10 h-10 text-accent/40" />
          <p className="font-display text-2xl lg:text-3xl font-medium leading-relaxed text-balance">
            {language === "ar" ? brandStory.storyAr : brandStory.story}
          </p>
          <div className="flex items-center gap-3 pt-4">
            <div className="h-px w-12 bg-accent" />
            <p className="text-sm text-background/60">— The AURIC founding team</p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border shadow-soft">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{t("about.mission")}</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {language === "ar" ? brandStory.missionAr : brandStory.mission}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-soft">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{t("about.vision")}</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {language === "ar" ? brandStory.visionAr : brandStory.vision}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 lg:pb-32">
        <div className="rounded-3xl overflow-hidden bg-muted/40 p-10 lg:p-16 text-center">
          <SectionHeading
            eyebrow={language === "ar" ? "اكتشف" : "Discover"}
            title={language === "ar" ? "المنتج الذي بُني من أجله كل هذا" : "The product all of this was built for"}
            subtitle={language === "ar" ? product.shortDescriptionAr : product.shortDescription}
          />
          <Button
            size="lg"
            onClick={() => navigate("/product")}
            className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
          >
            {t("about.cta")}
            <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
          </Button>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <Icon className="w-5 h-5 text-accent mb-2" />
      <p className="font-display text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
