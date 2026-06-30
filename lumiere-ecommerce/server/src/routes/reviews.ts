import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { optionalAuth, requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(3, "Please write a few words about your experience.").max(2000),
  authorName: z.string().min(1).optional(),
  authorEmail: z.string().email().optional(),
});

// Get reviews for a product
router.get("/product/:productId", async (req, res, next) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      status: "APPROVED",
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
});

// Create a review (logged-in users; verified-buyer flag set if they have a delivered order)
router.post("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const { rating, title, comment } = parsed.data;
    const productId = req.body.productId as string;
    if (!productId) return res.status(400).json({ error: "Product ID is required." });

    const product = await Product.findById(productId).select("_id name");
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Verified buyer check
    const userOrders = await Order.find({
      userId: req.user!.id,
      "items.productId": product._id,
      status: { $in: ["DELIVERED", "SHIPPED", "PROCESSING"] },
    }).lean();
    const verified = userOrders.length > 0;

    // Prevent duplicates (one review per user per product)
    const existing = await Review.findOne({ productId, userId: req.user!.id });
    if (existing) return res.status(409).json({ error: "You have already reviewed this product." });

    const review = await Review.create({
      productId,
      userId: req.user!.id as any,
      authorName: req.user!.name,
      authorEmail: req.user!.email,
      rating,
      title,
      comment,
      verified,
      status: "APPROVED", // auto-approve for demo; admin can reject later
    });

    // Recompute product rating
    const agg = await Review.aggregate([
      { $match: { productId: product._id, status: "APPROVED" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    if (agg[0]) {
      await Product.updateOne(
        { _id: product._id },
        { rating: Math.round(agg[0].avg * 10) / 10, reviewCount: agg[0].count }
      );
    }

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!review) return res.status(404).json({ error: "Review not found." });
    // Recompute rating
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
