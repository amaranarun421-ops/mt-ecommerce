"use client";

import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  Compass,
  WifiOff,
  Wrench,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorPage({ code }: { code: "404" | "500" | "offline" | "maintenance" | "comingSoon" }) {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();

  const config = {
    "404": {
      icon: Compass,
      title: t("error.404.title"),
      body: t("error.404.body"),
      iconColor: "text-accent",
      bg: "bg-accent/10",
    },
    "500": {
      icon: AlertTriangle,
      title: t("error.500.title"),
      body: t("error.500.body"),
      iconColor: "text-destructive",
      bg: "bg-destructive/10",
    },
    offline: {
      icon: WifiOff,
      title: t("error.offline.title"),
      body: t("error.offline.body"),
      iconColor: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    maintenance: {
      icon: Wrench,
      title: t("error.maintenance.title"),
      body: t("error.maintenance.body"),
      iconColor: "text-accent",
      bg: "bg-accent/10",
    },
    comingSoon: {
      icon: Clock,
      title: t("error.comingSoon.title"),
      body: t("error.comingSoon.body"),
      iconColor: "text-accent",
      bg: "bg-accent/10",
    },
  };

  const c = config[code];
  const Icon = c.icon;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="relative inline-flex mb-8">
          <div className={cn("absolute inset-0 rounded-full animate-ping opacity-50", c.bg)} />
          <div className={cn("relative w-24 h-24 rounded-full flex items-center justify-center", c.bg)}>
            <Icon className={cn("w-12 h-12", c.iconColor)} />
          </div>
        </div>

        {code === "404" && (
          <p className="font-display text-7xl lg:text-9xl font-bold text-foreground/10 mb-4 tabular-nums">404</p>
        )}

        <h1 className="font-display text-3xl lg:text-4xl font-semibold mb-3 text-balance">
          {c.title}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-pretty">
          {c.body}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {code !== "maintenance" && code !== "offline" && (
            <Button
              onClick={() => navigate("/")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
            >
              {t("error.home")}
              <ArrowRight className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 ms-1"} />
            </Button>
          )}
          {(code === "500" || code === "offline") && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              {t("error.retry")}
            </Button>
          )}
          {code === "comingSoon" && (
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to AURIC ONE
            </Button>
          )}
        </div>

        {/* Breadcrumbs for SEO */}
        <div className="sr-only">
          <Breadcrumbs items={[{ label: t("nav.home"), href: "/" }, { label: c.title }]} />
        </div>
      </div>
    </div>
  );
}
