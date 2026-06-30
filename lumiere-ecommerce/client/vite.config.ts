import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    // No proxy needed — the client uses an in-browser mock API layer (lib/api.ts)
    // that returns mock data directly without any HTTP calls.
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react", "sonner", "react-helmet-async"],
          "forms-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
          "charts-vendor": ["recharts"],
        },
      },
    },
  },
});
