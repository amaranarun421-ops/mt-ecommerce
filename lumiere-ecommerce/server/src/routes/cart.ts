import { Router } from "express";
import { Product } from "../models/Product.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Cart is stored client-side (zustand persisted). The server provides a
// validation endpoint used at checkout time to verify prices & stock.

router.post("/validate", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const items: Array<{ productId: string; quantity: number; variantId?: string }> = req.body?.items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids }, status: "ACTIVE" }).lean();
    const map = new Map(products.map((p) => [String(p._id), p]));

    const validated = items.map((item) => {
      const p = map.get(item.productId);
      if (!p) return { ...item, error: "Product unavailable", available: false };
      const stock = p.stock;
      const qty = Math.max(1, Math.min(item.quantity, stock));
      return {
        productId: item.productId,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        image: p.images?.[0]?.url,
        requestedQuantity: item.quantity,
        quantity: qty,
        stock,
        inStock: stock > 0,
        lineTotal: Math.round(p.price * qty * 100) / 100,
      };
    });

    const subtotal = validated.reduce((s, i) => s + (i.lineTotal || 0), 0);
    const unavailable = validated.filter((v) => (v as any).error);

    res.json({
      items: validated,
      subtotal: Math.round(subtotal * 100) / 100,
      ...(unavailable.length > 0 ? { warnings: unavailable.map((u) => `${(u as any).name}: ${(u as any).error}`) } : {}),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
