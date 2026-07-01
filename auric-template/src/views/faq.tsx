"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { faqs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SectionHeading } from "@/components/common/section-heading";
import { Search, MessageSquare } from "lucide-react";
import { useState, useMemo } from "react";

export function FaqPage() {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter((f) => {
      const question = (language === "ar" ? f.qAr : f.q).toLowerCase();
      const answer = (language === "ar" ? f.aAr : f.a).toLowerCase();
      return question.includes(q) || answer.includes(q);
    });
  }, [query, language]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("faq.eyebrow") },
        ]}
      />

      <div className="mt-6 mb-10">
        <SectionHeading
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          subtitle={t("faq.subtitle")}
        />
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FAQs..."
          className="h-12 ps-12"
        />
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="space-y-3">
        {filtered.map((item, i) => (
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

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No FAQs match your search.</p>
        </div>
      )}

      {/* CTA */}
      <Card className="border-border shadow-soft mt-12 bg-muted/30">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-display text-xl font-semibold">Still have questions?</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Our team replies within 4 hours, Monday through Friday.
          </p>
          <Button onClick={() => navigate("/contact")} className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
            {t("faq.contact")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
