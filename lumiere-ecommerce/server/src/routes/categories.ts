import { Router } from "express";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.get("/featured", async (_req, res, next) => {
  try {
    const categories = await Category.find({ featured: true }).sort({ sortOrder: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });

    const [products, relatedCategories] = await Promise.all([
      Product.find({ categoryId: category._id, status: "ACTIVE" })
        .sort({ sold: -1, createdAt: -1 })
        .limit(24)
        .lean(),
      Category.find({
        _id: { $ne: category._id },
        featured: true,
      })
        .limit(5)
        .select("name slug image")
        .lean(),
    ]);

    res.json({ category, products, relatedCategories });
  } catch (err) {
    next(err);
  }
});

export default router;
