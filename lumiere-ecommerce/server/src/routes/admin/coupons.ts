import { Router } from "express";
import { Coupon } from "../../models/Coupon.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ coupons });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.code || !b.discountType || b.discountValue === undefined) {
      return res.status(400).json({ error: "Code, discount type, and value are required." });
    }
    b.code = String(b.code).toUpperCase().trim();
    const coupon = await Coupon.create(b);
    res.status(201).json({ coupon });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ error: "Coupon code already exists." });
    next(err);
  }
});

router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const b = { ...req.body };
    if (b.code) b.code = String(b.code).toUpperCase().trim();
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: b }, { new: true }).lean();
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json({ coupon });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
