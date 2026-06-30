import { Router } from "express";
import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { User } from "../../models/User.js";
import { Review } from "../../models/Review.js";
import { ContactMessage } from "../../models/ContactMessage.js";
import { NewsletterSubscriber } from "../../models/NewsletterSubscriber.js";
import { requireAdmin } from "../../middleware/auth.js";

const router = Router();

router.get("/stats", requireAdmin, async (_req, res, next) => {
  try {
    const [
      totalRevenueAgg,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      bestSellers,
      salesLast7,
      contactUnread,
      newsletterCount,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$total" }, avg: { $avg: "$total" }, count: { $sum: 1 } } },
      ]),
      Order.countDocuments(),
      User.countDocuments({ role: "CUSTOMER" }),
      Product.countDocuments({ status: "ACTIVE" }),
      Order.countDocuments({ status: { $in: ["PENDING", "PROCESSING"] } }),
      Product.countDocuments({ stock: { $lte: 5 }, status: "ACTIVE" }),
      Order.find().sort({ createdAt: -1 }).limit(8).populate("userId", "name email").lean(),
      Product.find({ status: "ACTIVE" }).sort({ sold: -1 }).limit(6).select("name slug price images sold stock rating").lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, paymentStatus: "PAID" } },
        { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        }},
        { $sort: { _id: 1 } },
      ]),
      ContactMessage.countDocuments({ read: false }),
      NewsletterSubscriber.countDocuments({ active: true }),
    ]);

    const revenue = totalRevenueAgg[0]?.total || 0;
    const avgOrder = totalRevenueAgg[0]?.avg || 0;
    const conversionRate = totalCustomers > 0 ? (totalRevenueAgg[0]?.count || 0) / totalCustomers * 100 : 0;

    res.json({
      revenue: Math.round(revenue * 100) / 100,
      avgOrderValue: Math.round(avgOrder * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      contactUnread,
      newsletterCount,
      recentOrders,
      bestSellers,
      salesLast7,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
