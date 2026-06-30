import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { config } from "../config/index.js";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE } from "../config/index.js";
import { generateOrderNumber, calculatePricing } from "../utils/helpers.js";

const router = Router();

const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
});

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
      variantId: z.string().optional(),
    })
  ).min(1, "Your cart is empty."),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().optional(),
  shippingMethod: z.string().optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["card", "upi", "wallet", "cod"]).optional(),
  notes: z.string().max(500).optional(),
  // clientTotal — used only as a sanity check; backend recomputes from DB
  clientTotal: z.number().optional(),
});

// POST /api/checkout  -> creates order + (mock) payment
router.post("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { items, shippingAddress, billingAddress, sameAsBilling, couponCode, paymentMethod, notes } = parsed.data;

    // Load products from DB (never trust client prices)
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids }, status: "ACTIVE" }).lean();
    if (products.length !== items.length) {
      return res.status(400).json({ error: "Some products in your cart are no longer available." });
    }
    const map = new Map(products.map((p) => [String(p._id), p]));

    // Validate stock & build line items
    const orderItems = items.map((item) => {
      const p = map.get(item.productId)!;
      if (p.stock < item.quantity) {
        throw Object.assign(new Error(`Insufficient stock for ${p.name}. Only ${p.stock} left.`), { status: 400 });
      }
      const lineTotal = Math.round(p.price * item.quantity * 100) / 100;
      return {
        productId: p._id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        quantity: item.quantity,
        image: p.images?.[0]?.url,
        variant: item.variantId || undefined,
        total: lineTotal,
      };
    });

    const subtotal = Math.round(orderItems.reduce((s, i) => s + i.total, 0) * 100) / 100;

    // Validate coupon
    let discount = 0;
    let appliedCoupon: any = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), active: true });
      if (!coupon) {
        return res.status(400).json({ error: "Invalid or expired coupon code." });
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return res.status(400).json({ error: "This coupon has expired." });
      }
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ error: "This coupon has reached its usage limit." });
      }
      if (subtotal < coupon.minCartAmount) {
        return res.status(400).json({
          error: `This coupon requires a minimum order of $${coupon.minCartAmount.toFixed(2)}.`,
        });
      }
      if (coupon.discountType === "PERCENTAGE") {
        discount = Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = Math.min(coupon.discountValue, subtotal);
      }
      appliedCoupon = coupon;
    }

    const pricing = calculatePricing({
      subtotal,
      discount,
      taxRate: TAX_RATE,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      flatShippingRate: FLAT_SHIPPING_RATE,
    });

    // Sanity check against clientTotal (tolerate rounding)
    if (parsed.data.clientTotal !== undefined && Math.abs(parsed.data.clientTotal - pricing.total) > 1) {
      console.warn(`[checkout] Price mismatch: client=${parsed.data.clientTotal} server=${pricing.total}`);
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      userId: req.user!.id,
      status: "PENDING",
      paymentStatus: "PENDING",
      fulfillmentStatus: "UNFULFILLED",
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      tax: pricing.tax,
      shipping: pricing.shipping,
      total: pricing.total,
      currency: "USD",
      couponCode: appliedCoupon?.code,
      notes,
      shippingAddress,
      billingAddress: sameAsBilling ? shippingAddress : billingAddress,
      shippingMethod: parsed.data.shippingMethod || "Standard",
      items: orderItems,
    });

    // MOCK PAYMENT — automatically succeeds in dev mode unless explicitly failed
    const isMock = config.paymentProvider === "MOCK" || !config.paymentSecretKey;
    const paymentStatus: "SUCCESS" | "FAILED" = isMock ? "SUCCESS" : "FAILED";
    const orderPaymentStatus: "PAID" | "FAILED" = isMock ? "PAID" : "FAILED";

    await Payment.create({
      orderId: order._id,
      provider: isMock ? "MOCK" : config.paymentProvider,
      providerPaymentId: `mock_${order._id}_${Date.now()}`,
      amount: order.total,
      currency: "USD",
      status: paymentStatus,
      method: paymentMethod || "card",
    });

    order.paymentStatus = orderPaymentStatus;
    if (orderPaymentStatus === "PAID") {
      order.status = "PROCESSING";
    }
    await order.save();

    // Decrement stock & increment sold count
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      );
    }
    // Increment coupon usage
    if (appliedCoupon) {
      await Coupon.updateOne({ _id: appliedCoupon._id }, { $inc: { usedCount: 1 } });
    }

    res.status(201).json({
      order: {
        id: String(order._id),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        shipping: order.shipping,
        items: order.items,
        shippingAddress: order.shippingAddress,
        estimatedDelivery: getEstimatedDelivery(),
      },
    });
  } catch (err) {
    next(err);
  }
});

function getEstimatedDelivery(): string {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString();
}

// -------------------------
// Orders (user)
// -------------------------
router.get("/orders", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get("/orders/:orderNumber", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber, userId: req.user!.id }).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });
    const payment = await Payment.findOne({ orderId: order._id }).lean();
    res.json({ order, payment });
  } catch (err) {
    next(err);
  }
});

router.post("/orders/:orderNumber/cancel", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber, userId: req.user!.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!["PENDING", "PROCESSING"].includes(order.status)) {
      return res.status(400).json({ error: "This order can no longer be cancelled." });
    }
    order.status = "CANCELLED";
    order.paymentStatus = "REFUNDED";
    await order.save();
    // Restore stock
    for (const item of order.items) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity, sold: -item.quantity } });
    }
    res.json({ ok: true, status: order.status });
  } catch (err) {
    next(err);
  }
});

export default router;
