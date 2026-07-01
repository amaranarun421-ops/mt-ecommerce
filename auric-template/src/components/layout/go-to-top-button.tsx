"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/contexts/router-context";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function GoToTopButton() {
  const { route } = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // When on product page, the sticky purchase bar occupies the bottom — lift the button above it
  const isProductPage = route.path === "/product";

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={cn(
        "fixed end-4 z-30 w-11 h-11 rounded-full bg-foreground text-background shadow-elevated flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110",
        isProductPage ? "bottom-20 lg:bottom-6" : "bottom-6",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

