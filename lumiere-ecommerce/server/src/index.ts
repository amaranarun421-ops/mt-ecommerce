import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "./config/index.js";
import { connectDB } from "./config/db.js";
import { apiLimiter, errorHandler, notFound } from "./middleware/index.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import checkoutRoutes from "./routes/checkout.js";
import couponRoutes from "./routes/coupons.js";
import reviewRoutes from "./routes/reviews.js";
import newsletterRoutes from "./routes/newsletter.js";
import contactRoutes from "./routes/contact.js";
import settingsRoutes from "./routes/settings.js";

import adminDashboard from "./routes/admin/dashboard.js";
import adminProducts from "./routes/admin/products.js";
import adminCategories from "./routes/admin/categories.js";
import adminOrders from "./routes/admin/orders.js";
import adminCoupons from "./routes/admin/coupons.js";
import adminReviews from "./routes/admin/reviews.js";
import adminCustomers from "./routes/admin/customers.js";
import adminStore from "./routes/admin/store.js";

import { Product } from "./models/Product.js";
import { runAutoSeed } from "./seed/auto-seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy (needed for rate limiting behind Caddy)
app.set("trust proxy", 1);

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());

// CORS — allow the Vite dev client
app.use(
  cors({
    origin: [config.clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Logging
app.use(morgan(config.isDev ? "dev" : "combined"));

// Rate limit the whole API
app.use("/api", apiLimiter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "lumiere-server", env: config.nodeEnv, time: new Date().toISOString() });
});

// Public API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);

// Admin API
app.use("/api/admin/dashboard", adminDashboard);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/categories", adminCategories);
app.use("/api/admin/orders", adminOrders);
app.use("/api/admin/coupons", adminCoupons);
app.use("/api/admin/reviews", adminReviews);
app.use("/api/admin/customers", adminCustomers);
app.use("/api/admin/store", adminStore);

// 404 + error handler (must be last)
app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();

  // Auto-seed if DB is empty (dev convenience for in-memory MongoDB)
  if (config.isDev) {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[server] DB is empty — auto-seeding...");
      try {
        await runAutoSeed();
        console.log("[server] ✅ Auto-seed complete");
      } catch (err) {
        console.error("[server] Auto-seed failed:", err);
      }
    } else {
      console.log(`[server] DB already has ${count} products, skipping auto-seed`);
    }
  }

  app.listen(config.port, () => {
    console.log(`[server] Lumière API listening on http://localhost:${config.port}`);
    console.log(`[server] CORS allowed for: ${config.clientUrl}`);
  });
}

start().catch((err) => {
  console.error("[server] Fatal:", err);
  process.exit(1);
});
