import { Router } from "express";
import { Review } from "../../models/Review.js";
import { Product } from "../../models/Product.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const rating = parseInt(req.query.rating as string);

    const filter: any = {};
    if (status) filter.status = status;
    if (!isNaN(rating)) filter.rating = rating;

    const [total, reviews] = await Promise.all([
      Review.countDocuments(filter),
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId", "name slug images")
        .lean(),
    ]);
    res.json({ reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Recompute product rating
    const agg = await Review.aggregate([
      { $match: { productId: review.productId, status: "APPROVED" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.updateOne(
      { _id: review.productId },
      { rating: agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0, reviewCount: agg[0]?.count || 0 }
    );

    res.json({ review });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    const agg = await Review.aggregate([
      { $match: { productId: review.productId, status: "APPROVED" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.updateOne(
      { _id: review.productId },
      { rating: agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0, reviewCount: agg[0]?.count || 0 }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
