"use client";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-3 max-w-3xl",
        align === "center" ? "text-center mx-auto" : "text-start",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-balance leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base lg:text-lg text-muted-foreground text-pretty leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
