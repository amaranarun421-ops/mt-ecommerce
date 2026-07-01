"use client";

import { useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { companyInfo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Mail, Phone, Clock, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export function ContactPage() {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t("contact.sent"));
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("contact.title") },
        ]}
      />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-6">
        {/* Info side */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold mb-4 text-balance">
              {t("contact.title")}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">{t("contact.subtitle")}</p>
          </div>

          <div className="space-y-4">
            <ContactItem
              icon={Mail}
              label={t("contact.emailUs")}
              value={companyInfo.email}
              href={`mailto:${companyInfo.email}`}
            />
            <ContactItem
              icon={Phone}
              label={t("contact.callUs")}
              value={companyInfo.phone}
              href={`tel:${companyInfo.phone}`}
            />
            <ContactItem
              icon={Clock}
              label={t("contact.hours")}
              value={language === "ar" ? companyInfo.hoursAr : companyInfo.hours}
            />
            <ContactItem
              icon={MapPin}
              label={t("contact.visitUs")}
              value={language === "ar" ? companyInfo.addressAr : companyInfo.address}
            />
          </div>

          <Card className="border-border shadow-soft overflow-hidden">
            <div className="aspect-[16/10] bg-muted">
              <img
                src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"
                alt="Copenhagen"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="p-5">
              <p className="font-semibold text-sm">AURIC HQ</p>
              <p className="text-xs text-muted-foreground">{companyInfo.address}</p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <Card className="border-border shadow-soft">
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">{t("contact.name")}</Label>
                    <Input required placeholder="Marcus Reed" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">{t("contact.email")}</Label>
                    <Input type="email" required placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("contact.subject")}</Label>
                  <Input required placeholder="How can we help?" />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("contact.message")}</Label>
                  <Textarea required rows={6} placeholder="Tell us more..." />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin me-2" />
                  ) : (
                    <Send className="w-4 h-4 me-2" />
                  )}
                  {t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/40 transition-colors">
      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
        <p className="font-medium text-sm mt-0.5">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }
  return content;
}
