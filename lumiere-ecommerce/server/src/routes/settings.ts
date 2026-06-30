import { Router } from "express";
import { StoreSetting } from "../models/StoreSetting.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    let settings = await StoreSetting.findOne().lean();
    if (!settings) {
      settings = await StoreSetting.create({}) as any;
      settings = (settings as any).toObject();
    }
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

export default router;
