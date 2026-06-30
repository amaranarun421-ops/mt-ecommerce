import { Router } from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Review } from "../models/Review.js";
import { optionalAuth, AuthRequest } from "../middleware/auth.js";
import { escapeRegExp } from "../utils/helpers.js";

const router = Router();

// List products with filters/sort/pagination
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(req.query.limit as string) || 12));
    const skip = (page - 1) * limit;

    const filter: any = { status: "ACTIVE" };

    const q = req.query.q as string | undefined;
    if (q && q.trim()) {
      filter.$or = [
        { name: { $regex: escapeRegExp(q.trim()), $options: "i" } },
        { description: { $regex: escapeRegExp(q.trim()), $options: "i" } },
        { brand: { $regex: escapeRegExp(q.trim()), $options: "i" } },
        { tags: { $regex: escapeRegExp(q.trim()), $options: "i" } },
      ];
    }

    const categorySlug = req.query.category as string | undefined;
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug }).lean();
      if (cat) filter.categoryId = cat._id;
    }

    const featured = req.query.featured as string | undefined;
    if (featured === "true") filter.featured = true;
    if (req.query.trending === "true") filter.trending = true;
    if (req.query.newArrival === "true") filter.newArrival = true;
    if (req.query.bestSeller === "true") filter.bestSeller = true;

    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    if (!isNaN(minPrice)) filter.price = { ...filter.price, $gte: minPrice };
    if (!isNaN(maxPrice)) filter.price = { ...filter.price, $lte: maxPrice };

    if (req.query.inStock === "true") filter.stock = { $gt: 0 };

    const minRating = parseFloat(req.query.minRating as string);
    if (!isNaN(minRating)) filter.rating = { $gte: minRating };

    if (req.query.brand) {
      const brands = (req.query.brand as string).split(",").filter(Boolean);
      if (brands.length) filter.brand = { $in: brands };
    }

    // Sort
    const sort: any = {};
    const sortBy = (req.query.sort as string) || "relevance";
    switch (sortBy) {
      case "price-asc": sort.price = 1; break;
      case "price-desc": sort.price = -1; break;
      case "newest": sort.createdAt = -1; break;
      case "rating": sort.rating = -1; break;
      case "popular": sort.sold = -1; break;
      default:
        // "relevance" — use text score if searching, else default to newest + best sellers
        if (q && q.trim()) sort.score = { $meta: "textScore" };
        else { sort.featured = -1; sort.sold = -1; sort.createdAt = -1; }
        break;
    }

    const projection = q && q.trim() ? { score: { $meta: "textScore" } } : {};
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({ path: "categoryId", select: "name slug" })
        .lean(),
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get product filters facet (brands, price range, categories)
router.get("/meta/facets", async (_req, res, next) => {
  try {
    const [priceAgg, brandsAgg, categories] = await Promise.all([
      Product.aggregate([
        { $match: { status: "ACTIVE" } },
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]),
      Product.aggregate([
        { $match: { status: "ACTIVE", brand: { $ne: null, $ne: "" } } },
        { $group: { _id: "$brand", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Category.find().select("name slug").sort({ name: 1 }).lean(),
    ]);
    res.json({
      price: priceAgg[0] || { min: 0, max: 1000 },
      brands: brandsAgg.map((b) => ({ name: b._id, count: b.count })),
      categories,
    });
  } catch (err) {
    next(err);
  }
});

// Get single product by slug
router.get("/:slug", optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: { $in: ["ACTIVE", "DRAFT"] } })
      .populate({ path: "categoryId", select: "name slug description longDescription" })
      .lean();
    if (!product) return res.status(404).json({ error: "Product not found" });

    const [reviews, related] = await Promise.all([
      Review.find({ productId: product._id, status: "APPROVED" })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Product.find({
        _id: { $ne: product._id },
        categoryId: product.categoryId._id ?? product.categoryId,
        status: "ACTIVE",
      })
        .sort({ sold: -1 })
        .limit(6)
        .select("name slug price compareAtPrice rating reviewCount images brand")
        .lean(),
    ]);

    res.json({ product, reviews, related });
  } catch (err) {
    next(err);
  }
});

// Track recently viewed (client-driven; safe)
router.post("/:id/view", async (req, res) => {
  res.json({ ok: true });
});

export default router;
