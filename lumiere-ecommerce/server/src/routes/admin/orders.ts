import { Router } from "express";
import { Order } from "../../models/Order.js";
import { Payment } from "../../models/Payment.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const paymentStatus = req.query.paymentStatus as string | undefined;
    const search = req.query.q as string | undefined;

    const filter: any = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.firstName": { $regex: search, $options: "i" } },
        { "shippingAddress.lastName": { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
      ];
    }

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId", "name email").lean(),
    ]);
    res.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAdmin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email phone").lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    const payment = await Payment.findOne({ orderId: order._id }).lean();
    res.json({ order, payment });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status, fulfillmentStatus, trackingNumber } = req.body || {};
    const update: any = {};
    if (status) update.status = status;
    if (fulfillmentStatus) update.fulfillmentStatus = fulfillmentStatus;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;
    if (status === "DELIVERED") update.fulfillmentStatus = "DELIVERED";
    if (status === "SHIPPED") update.fulfillmentStatus = "SHIPPED";
    const order = await Order.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;
