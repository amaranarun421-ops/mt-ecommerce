import { Router } from "express";
import { Category } from "../../models/Category.js";
import { requireAdmin } from "../../middleware/auth.js";
import { slugify } from "../../utils/helpers.js";

const router = Router();

router.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: "Category name is required." });
    const slug = b.slug ? slugify(b.slug) : slugify(b.name);
    const category = await Category.create({ ...b, slug });
    res.status(201).json({ category });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ error: "Category with this slug already exists." });
    next(err);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (b.slug) b.slug = slugify(b.slug);
    if (b.name && !b.slug) b.slug = slugify(b.name);
    const category = await Category.findByIdAndUpdate(req.params.id, { $set: b }, { new: true }).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ category });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
