"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { policies } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PolicyKey = keyof typeof policies;

export function PolicyPage({ policy }: { policy: PolicyKey }) {
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const data = policies[policy];
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: language === "ar" ? data.titleAr : data.title },
        ]}
      />

      <div className="grid lg:grid-cols-12 gap-8 mt-6">
        {/* TOC */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-border shadow-soft">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                {t("policy.tableOfContents")}
              </p>
              <div className="space-y-1">
                {data.sections.map((section, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveSection(i);
                      document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-start text-sm rounded-md transition-colors",
                      activeSection === i ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="flex-1">{language === "ar" ? section.headingAr : section.heading}</span>
                    <ChevronRight className={cn("w-3.5 h-3.5 opacity-50", isRTL && "rotate-180")} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Content */}
        <article className="lg:col-span-9 space-y-8">
          <header>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold mb-3">
              {language === "ar" ? data.titleAr : data.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("policy.lastUpdated")}: June 1, 2025
            </p>
          </header>

          {data.sections.map((section, i) => (
            <section
              key={i}
              id={`section-${i}`}
              className="scroll-mt-24 space-y-3 pb-8 border-b border-border last:border-0"
            >
              <h2 className="font-display text-2xl font-semibold">
                {language === "ar" ? section.headingAr : section.heading}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                {language === "ar" ? section.bodyAr : section.body}
              </p>
            </section>
          ))}

          <div className="p-5 rounded-xl bg-muted/40 text-sm text-muted-foreground">
            Questions about this policy?{" "}
            <button onClick={() => navigate("/contact")} className="text-accent font-medium hover:underline">
              Contact our team
            </button>{" "}
            — we reply within 4 hours.
          </div>
        </article>
      </div>
    </div>
  );
}
