"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { companyInfo, socialLinks } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Instagram,
  Twitter,
  Youtube,
  Music,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram,
  Twitter,
  Youtube,
  Music,
};

export function Footer() {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    if (email) {
      toast.success("Subscribed", {
        description: "Welcome to the inner circle. Check your inbox.",
      });
      form.reset();
    }
  };

  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("footer.shop"),
      links: [
        { label: t("nav.product"), href: "/product" },
        { label: t("nav.accessories"), href: "/accessories" },
        { label: t("nav.reviews"), href: "/reviews" },
        { label: t("compare.title"), href: "/compare" },
        { label: t("search.title"), href: "/search" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("nav.about"), href: "/about" },
        { label: "Brand story", href: "/about/brand-story" },
        { label: t("contact.title"), href: "/contact" },
        { label: t("support.title"), href: "/support" },
        { label: t("faq.eyebrow"), href: "/faq" },
      ],
    },
    {
      title: t("footer.help"),
      links: [
        { label: t("policy.shipping"), href: "/shipping-policy" },
        { label: t("policy.returns"), href: "/returns" },
        { label: t("policy.warranty"), href: "/warranty" },
        { label: t("policy.refund"), href: "/refund-policy" },
        { label: "Track order", href: "/track" },
      ],
    },
  ];

  return (
    <footer className="bg-foreground text-background mt-auto">
      {/* Newsletter band */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                {t("newsletter.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-balance leading-tight">
                {t("newsletter.title")}
              </h2>
              <p className="text-background/70 text-base lg:text-lg max-w-xl text-pretty">
                {t("newsletter.subtitle")}
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-none">
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 h-12 bg-background/5 border-background/15 text-background placeholder:text-background/40 focus-visible:bg-background/10 focus-visible:border-accent"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-6 btn-shine"
                >
                  {t("newsletter.subscribe")}
                  <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
                </Button>
              </form>
              <p className="text-xs text-background/50 mt-3">{t("newsletter.privacy")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand block */}
          <div className="col-span-2 lg:col-span-3 space-y-5">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
              aria-label="AURIC home"
            >
              <FooterLogo />
              <span className="font-display text-2xl font-semibold tracking-tight">
                {t("brand.name")}
              </span>
            </button>
            <p className="text-background/70 text-sm max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="space-y-2 text-sm text-background/70">
              <a
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                {companyInfo.email}
              </a>
              <a
                href={`tel:${companyInfo.phone}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" />
                {companyInfo.phone}
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {companyInfo.address}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((s) => {
                const Icon = socialIconMap[s.icon] ?? Mail;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full border border-background/15 hover:border-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.15em] text-background/50 font-semibold">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => navigate(link.href)}
                      className="text-sm text-background/75 hover:text-accent transition-colors text-start inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ChevronRight
                        className={`w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${isRTL ? "rotate-180" : ""}`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/60 text-center sm:text-start">
              {isRTL ? companyInfo.copyrightAr : companyInfo.copyright}
            </p>
            <div className="flex items-center gap-4 text-xs text-background/60">
              <button onClick={() => navigate("/terms")} className="hover:text-accent transition-colors">
                {t("footer.terms")}
              </button>
              <span className="w-px h-3 bg-background/20" />
              <button onClick={() => navigate("/privacy")} className="hover:text-accent transition-colors">
                {t("footer.privacy")}
              </button>
              <span className="w-px h-3 bg-background/20" />
              <button onClick={() => navigate("/terms")} className="hover:text-accent transition-colors">
                {t("footer.accessibility")}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-background/40 text-center mt-4">
            {t("footer.poweredBy")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent" aria-hidden>
      <rect width="64" height="64" rx="14" fill="currentColor" opacity="0.15" />
      <path
        d="M16 24C16 19.5817 19.5817 16 24 16H40C44.4183 16 48 19.5817 48 24V40C48 44.4183 44.4183 48 40 48H24C19.5817 48 16 44.4183 16 40V24Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M22 30C22 27.7909 23.7909 26 26 26H38C40.2091 26 42 27.7909 42 30V38C42 40.2091 40.2091 42 38 42H26C23.7909 42 22 40.2091 22 38V30Z"
        fill="currentColor"
      />
      <circle cx="32" cy="34" r="3.5" fill="currentColor" className="fill-foreground" />
      <path d="M14 22L16 18M50 22L48 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
