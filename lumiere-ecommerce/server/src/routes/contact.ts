import { Router } from "express";
import { z } from "zod";
import { ContactMessage } from "../models/ContactMessage.js";
import { contactLimiter } from "../middleware/index.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  subject: z.string().min(3, "Please add a subject."),
  message: z.string().min(10, "Message should be at least 10 characters.").max(2000),
  phone: z.string().optional(),
});

router.post("/", contactLimiter, async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
    const msg = await ContactMessage.create(parsed.data);
    // MOCK email — log it; in prod would dispatch via SMTP
    console.log(`[contact] New message from ${msg.email}: ${msg.subject}`);
    res.status(201).json({ ok: true, message: "Thanks for reaching out. We'll reply within 24 hours." });
  } catch (err) {
    next(err);
  }
});

export default router;
