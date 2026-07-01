"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Truck, Shield, RotateCcw } from "lucide-react";

const announcements = [
  { key: "announce.1", icon: Truck },
  { key: "announce.2", icon: Shield },
  { key: "announce.3", icon: RotateCcw },
];

export function AnnouncementBar() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const Current = announcements[index];
  const Icon = Current.icon;

  return (
    <div className="bg-foreground text-background text-[13px] font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10 relative overflow-hidden">
          <div
            key={index}
            className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <Icon className="w-3.5 h-3.5 text-accent" />
            <span className="tracking-wide">{t(Current.key)}</span>
          </div>
          {/* Progress dots */}
          <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-1">
            {announcements.map((_, i) => (
              <span
                key={i}
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-4 bg-accent" : "w-1.5 bg-background/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
