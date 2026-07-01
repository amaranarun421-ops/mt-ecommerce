"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { supportArticles, companyInfo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Search, LifeBuoy, ChevronRight, Mail, MessageSquare, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SupportPage() {
  const { t, language, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [ticketOpen, setTicketOpen] = useState(false);

  const categories = useMemo(() => {
    const map: Record<string, typeof supportArticles> = {};
    supportArticles.forEach((a) => {
      const cat = language === "ar" ? a.categoryAr : a.category;
      if (!map[cat]) map[cat] = [];
      map[cat].push(a);
    });
    return map;
  }, [language]);

  const filtered = useMemo(() => {
    if (!query.trim()) return supportArticles;
    const q = query.toLowerCase();
    return supportArticles.filter((a) => {
      const title = (language === "ar" ? a.titleAr : a.title).toLowerCase();
      const excerpt = (language === "ar" ? a.excerptAr : a.excerpt).toLowerCase();
      return title.includes(q) || excerpt.includes(q);
    });
  }, [query, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("support.title") },
        ]}
      />

      {/* Hero */}
      <div className="text-center mt-6 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
          <LifeBuoy className="w-7 h-7 text-accent" />
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold mb-3">{t("support.title")}</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">{t("support.subtitle")}</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("support.search")}
            className="h-14 ps-12 text-base"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <QuickAction icon={BookOpen} label={t("support.browse")} onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })} />
        <QuickAction icon={Mail} label={t("support.contactSupport")} onClick={() => navigate("/contact")} />
        <QuickAction icon={MessageSquare} label={t("support.openTicket")} onClick={() => setTicketOpen(true)} />
      </div>

      {/* Categories */}
      <section id="categories" className="space-y-8 scroll-mt-24">
        <h2 className="font-display text-2xl font-semibold">{t("support.browse")}</h2>
        {Object.entries(categories).map(([cat, articles]) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {articles.map((a) => (
                <Card
                  key={a.id}
                  className="border-border shadow-soft hover:shadow-elevated transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-5 flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-sm">{language === "ar" ? a.titleAr : a.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {language === "ar" ? a.excerptAr : a.excerpt}
                      </p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-1", isRTL && "rotate-180")} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Ticket form */}
      {ticketOpen && (
        <Card className="border-border shadow-soft mt-12">
          <CardContent className="p-6 lg:p-8">
            <h2 className="font-display text-xl font-semibold mb-4">{t("support.openTicket")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTicketOpen(false);
                toast.success(t("support.ticketSubmitted", { n: Math.floor(Math.random() * 9000) + 1000 }));
                (e.target as HTMLFormElement).reset();
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("support.ticketSubject")}</Label>
                  <Input required />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("support.ticketOrder")}</Label>
                  <Input placeholder="AUR-10247" />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("support.ticketCategory")}</Label>
                  <select className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm">
                    <option>Technical</option>
                    <option>Order</option>
                    <option>Warranty</option>
                    <option>Billing</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">{t("support.ticketPriority")}</Label>
                  <select className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm">
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">{t("support.ticketMessage")}</Label>
                <Textarea required rows={5} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine">
                  {t("support.ticketSubmit")}
                </Button>
                <Button type="button" variant="outline" onClick={() => setTicketOpen(false)}>
                  {t("common.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contact info */}
      <Card className="border-border shadow-soft mt-12 bg-muted/30">
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold text-sm">{t("contact.emailUs")}</p>
            <p className="text-2xl font-display font-semibold mt-1">{companyInfo.email}</p>
          </div>
          <Button onClick={() => navigate("/contact")} variant="outline">
            {t("support.contactSupport")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-5 rounded-2xl border border-border bg-background hover:shadow-soft transition-shadow text-start"
    >
      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <span className="font-medium text-sm flex-1">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
