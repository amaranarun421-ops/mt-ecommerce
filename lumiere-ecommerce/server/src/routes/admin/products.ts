import { Router } from "express";
import { Product } from "../../models/Product.js";
import { Category } from "../../models/Category.js";
import { requireAdmin } from "../../middleware/auth.js";
import { slugify } from "../../utils/helpers.js";

const router = Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.q as string | undefined;
    const status = req.query.status as string | undefined;

    const filter: any = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
    if (status) filter.status = status;

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("categoryId", "name slug").lean(),
    ]);
    res.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.name || !b.price || !b.categoryId) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }
    const slug = b.slug ? slugify(b.slug) : slugify(b.name);
    const sku = b.sku || `LUM-${Date.now().toString(36).toUpperCase()}`;
    const product = await Product.create({
      ...b,
      slug,
      sku,
      tags: Array.isArray(b.tags) ? b.tags : (typeof b.tags === "string" ? b.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
    });
    res.status(201).json({ product });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "A product with this slug or SKU already exists." });
    }
    next(err);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (b.slug) b.slug = slugify(b.slug);
    if (typeof b.tags === "string") {
      b.tags = b.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: b }, { new: true }).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
