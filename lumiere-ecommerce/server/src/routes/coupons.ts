import { Router } from "express";
import { Coupon } from "../models/Coupon.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Validate coupon (public — used at cart/checkout)
router.post("/validate", async (req, res, next) => {
  try {
    const { code, subtotal } = req.body || {};
    if (!code || typeof subtotal !== "number") {
      return res.status(400).json({ error: "Coupon code and cart subtotal are required." });
    }
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
    if (!coupon) return res.status(404).json({ error: "Invalid coupon code." });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ error: "This coupon has expired." });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "This coupon has reached its usage limit." });
    }
    if (subtotal < coupon.minCartAmount) {
      return res.status(400).json({
        error: `Minimum order of $${coupon.minCartAmount.toFixed(2)} required for this coupon.`,
      });
    }
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }
    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      description: coupon.description,
    });
  } catch (err) {
    next(err);
  }
});

// List active coupons (public-ish — for showcase on cart)
router.get("/", async (_req, res, next) => {
  try {
    const coupons = await Coupon.find({ active: true, expiresAt: { $gt: new Date() } })
      .select("code description discountType discountValue minCartAmount maxDiscount")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json({ coupons });
  } catch (err) {
    next(err);
  }
});

export default router;
