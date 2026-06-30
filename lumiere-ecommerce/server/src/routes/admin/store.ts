import { Router } from "express";
import { ContactMessage } from "../../models/ContactMessage.js";
import { NewsletterSubscriber } from "../../models/NewsletterSubscriber.js";
import { Product } from "../../models/Product.js";
import { StoreSetting } from "../../models/StoreSetting.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = Router();

// ---------- Contact messages ----------
router.get("/messages", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const [total, messages] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);
    res.json({ messages, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
  } catch (err) {
    next(err);
  }
});

router.patch("/messages/:id", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    const update: any = {};
    if (typeof b.read === "boolean") update.read = b.read;
    if (typeof b.replied === "boolean") update.replied = b.replied;
    if (typeof b.reply === "string") update.reply = b.reply;
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!msg) return res.status(404).json({ error: "Message not found" });
    res.json({ message: msg });
  } catch (err) {
    next(err);
  }
});

router.delete("/messages/:id", requireAdmin, async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ---------- Newsletter subscribers ----------
router.get("/subscribers", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;
    const [total, subscribers] = await Promise.all([
      NewsletterSubscriber.countDocuments(),
      NewsletterSubscriber.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);
    res.json({ subscribers, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
  } catch (err) {
    next(err);
  }
});

router.delete("/subscribers/:id", requireAdmin, async (req, res, next) => {
  try {
    const sub = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ error: "Subscriber not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ---------- Inventory ----------
router.get("/inventory", requireAdmin, async (req, res, next) => {
  try {
    const filter: any = { status: "ACTIVE" };
    const status = req.query.status as string | undefined;
    if (status === "low") filter.stock = { $lte: 5, $gt: 0 };
    if (status === "out") filter.stock = { $lte: 0 };
    const products = await Product.find(filter)
      .select("name slug sku stock lowStockThreshold price images")
      .sort({ stock: 1 })
      .lean();
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

router.patch("/inventory/:id", requireAdmin, async (req, res, next) => {
  try {
    const { stock, lowStockThreshold } = req.body || {};
    const update: any = {};
    if (typeof stock === "number") update.stock = Math.max(0, stock);
    if (typeof lowStockThreshold === "number") update.lowStockThreshold = lowStockThreshold;
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// ---------- Store settings ----------
router.get("/settings", requireAdmin, async (_req, res, next) => {
  try {
    let settings = await StoreSetting.findOne().lean();
    if (!settings) {
      const created = await StoreSetting.create({});
      settings = (created as any).toObject();
    }
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

router.patch("/settings", requireAdmin, async (req, res, next) => {
  try {
    const b = req.body || {};
    const updated = await StoreSetting.findOneAndUpdate({}, { $set: b }, { new: true, upsert: true }).lean();
    res.json({ settings: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
