"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

/**
 * Hash-based router for the AURIC template.
 * The sandbox only exposes the `/` route, so we route client-side via `#/path`.
 * This still gives the user a real URL they can copy/share, browser back/forward works,
 * and scroll position is restored on navigation.
 */

export type Route = {
  path: string;            // e.g. "/", "/product", "/checkout"
  query: URLSearchParams;  // e.g. ?color=obsidian
  hash: string;            // anchor on the page, e.g. #reviews
};

interface RouterContextType {
  route: Route;
  navigate: (path: string, opts?: { replace?: boolean; scroll?: boolean }) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parseHash(): Route {
  if (typeof window === "undefined") {
    return { path: "/", query: new URLSearchParams(), hash: "" };
  }
  const raw = window.location.hash.replace(/^#/, "") || "/";
  // Split off the in-page anchor (second #)
  const [pathPart, inPageHash = ""] = raw.split("#");
  const [path, queryString = ""] = pathPart.split("?");
  const normalizedPath = path === "" ? "/" : path;
  return {
    path: normalizedPath,
    query: new URLSearchParams(queryString),
    hash: inPageHash ? `#${inPageHash}` : "",
  };
}

const DEFAULT_ROUTE: Route = { path: "/", query: new URLSearchParams(), hash: "" };

export function RouterProvider({ children }: { children: React.ReactNode }) {
  // Always initialize to "/" on both server and client to avoid hydration mismatch.
  // The actual hash is read inside useEffect after mount.
  const [route, setRoute] = useState<Route>(DEFAULT_ROUTE);

  useEffect(() => {
    const update = () => setRoute(parseHash());
    update();
    window.addEventListener("hashchange", update);
    // Ensure there's always a hash so the address bar shows #/
    if (!window.location.hash) {
      window.location.replace("#/");
    }
    return () => window.removeEventListener("hashchange", update);
  }, []);

  // Scroll handling on route change is done in AppShell via a separate effect,
  // to keep this provider SSR-safe.

  const navigate = useCallback(
    (path: string, opts?: { replace?: boolean; scroll?: boolean }) => {
      if (typeof window === "undefined") return;
      const target = `#${path}`;
      if (opts?.replace) {
        window.location.replace(target);
      } else {
        window.location.hash = target;
      }
      // Scrolling is handled by AppShell on hashchange to keep this provider SSR-safe.
    },
    [],
  );

  const back = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate, back }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
