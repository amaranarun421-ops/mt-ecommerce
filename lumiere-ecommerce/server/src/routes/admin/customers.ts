import { Router } from "express";
import { User } from "../../models/User.js";
import { Order } from "../../models/Order.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.q as string | undefined;

    const filter: any = { role: "CUSTOMER" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [total, customers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-passwordHash").lean(),
    ]);

    // Attach spending summary
    const customerIds = customers.map((c) => c._id);
    const spendings = await Order.aggregate([
      { $match: { userId: { $in: customerIds }, paymentStatus: "PAID" } },
      { $group: { _id: "$userId", totalSpent: { $sum: "$total" }, orderCount: { $sum: 1 } } },
    ]);
    const spendingMap = new Map(spendings.map((s) => [String(s._id), s]));

    const enriched = customers.map((c) => ({
      ...c,
      totalSpent: spendingMap.get(String(c._id))?.totalSpent || 0,
      orderCount: spendingMap.get(String(c._id))?.orderCount || 0,
    }));

    res.json({ customers: enriched, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAdmin, async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select("-passwordHash").lean();
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    const orders = await Order.find({ userId: customer._id }).sort({ createdAt: -1 }).lean();
    const spending = await Order.aggregate([
      { $match: { userId: customer._id, paymentStatus: "PAID" } },
      { $group: { _id: null, totalSpent: { $sum: "$total" }, orderCount: { $sum: 1 } } },
    ]);
    res.json({
      customer,
      orders,
      summary: spending[0] || { totalSpent: 0, orderCount: 0 },
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/ban", requireAdmin, async (req, res, next) => {
  try {
    const { banned } = req.body || {};
    const user = await User.findByIdAndUpdate(req.params.id, { banned: !!banned }, { new: true }).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ error: "Customer not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
