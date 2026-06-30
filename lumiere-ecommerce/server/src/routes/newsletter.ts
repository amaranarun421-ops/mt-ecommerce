import { Router } from "express";
import { z } from "zod";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { User } from "../models/User.js";
import { optionalAuth, AuthRequest } from "../middleware/auth.js";
import { newsletterLimiter } from "../middleware/index.js";

const router = Router();

const subSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

router.post("/", newsletterLimiter, optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const parsed = subSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const email = parsed.data.email.toLowerCase().trim();

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        await existing.save();
        return res.json({ ok: true, message: "You're subscribed again. Welcome back!" });
      }
      return res.status(200).json({ ok: true, message: "You're already subscribed." });
    }
    await NewsletterSubscriber.create({
      email,
      userId: req.user?.id,
      source: req.body?.source || "FOOTER",
    });
    res.status(201).json({ ok: true, message: "Thanks for subscribing!" });
  } catch (err) {
    next(err);
  }
});

router.post("/unsubscribe", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required." });
    await NewsletterSubscriber.updateOne(
      { email: email.toLowerCase().trim() },
      { active: false }
    );
    res.json({ ok: true, message: "You have been unsubscribed." });
  } catch (err) {
    next(err);
  }
});

export default router;
