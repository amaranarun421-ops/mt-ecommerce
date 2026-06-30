import { Router } from "express";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { requireAuth, AuthRequest } from "../middleware/auth.js";

// Wishlist stored on the user document for simplicity (array of product IDs).
const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.id).lean();
    const ids = (user as any)?.wishlist || [];
    const products = await Product.find({ _id: { $in: ids }, status: "ACTIVE" })
      .select("name slug price compareAtPrice rating reviewCount images brand stock")
      .lean();
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

router.post("/:productId", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).select("_id").lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    await User.updateOne(
      { _id: req.user!.id },
      { $addToSet: { wishlist: product._id } }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/:productId", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user!.id },
      { $pull: { wishlist: req.params.productId as any } }
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
