import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken, AuthRequest, requireAuth, optionalAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/index.js";
import { config } from "../config/index.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function setAuthCookie(res: any, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Register
router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, passwordHash, role: "CUSTOMER" });

    const token = signToken(String(user._id));
    setAuthCookie(res, token);
    res.status(201).json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "No account found with this email." });
    }
    if (user.banned) {
      return res.status(403).json({ error: "Your account has been suspended. Please contact support." });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    const token = signToken(String(user._id));
    setAuthCookie(res, token);
    res.json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone, image: user.image },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

// Current session
router.get("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        image: user.image,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update profile
router.patch("/profile", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { name, phone, image } = req.body || {};
    const update: any = {};
    if (typeof name === "string" && name.trim().length >= 2) update.name = name.trim();
    if (typeof phone === "string") update.phone = phone.trim();
    if (typeof image === "string") update.image = image;
    const user = await User.findByIdAndUpdate(req.user!.id, { $set: update }, { new: true }).lean();
    res.json({
      user: user
        ? { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone, image: user.image, addresses: user.addresses }
        : null,
    });
  } catch (err) {
    next(err);
  }
});

// Change password
router.patch("/password", requireAuth, authLimiter, async (req: AuthRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({ error: "Both current and new passwords are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }
    const user = await User.findById(req.user!.id).select("+passwordHash");
    if (!user || !user.passwordHash) return res.status(404).json({ error: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Current password is incorrect." });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Manage addresses
router.post("/addresses", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const body = req.body || {};
    const addr = {
      label: body.label || "Home",
      firstName: body.firstName,
      lastName: body.lastName,
      company: body.company,
      address1: body.address1,
      address2: body.address2,
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      country: body.country || "United States",
      phone: body.phone,
      isDefault: !!body.isDefault,
    };
    if (!addr.firstName || !addr.lastName || !addr.address1 || !addr.city || !addr.state || !addr.postalCode) {
      return res.status(400).json({ error: "Missing required address fields." });
    }
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (addr.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    user.addresses.push(addr as any);
    await user.save();
    res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
});

router.patch("/addresses/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ error: "Address not found" });
    const body = req.body || {};
    Object.assign(addr, {
      label: body.label ?? addr.label,
      firstName: body.firstName ?? addr.firstName,
      lastName: body.lastName ?? addr.lastName,
      company: body.company ?? addr.company,
      address1: body.address1 ?? addr.address1,
      address2: body.address2 ?? addr.address2,
      city: body.city ?? addr.city,
      state: body.state ?? addr.state,
      postalCode: body.postalCode ?? addr.postalCode,
      country: body.country ?? addr.country,
      phone: body.phone ?? addr.phone,
      isDefault: body.isDefault ?? addr.isDefault,
    });
    if (addr.isDefault) {
      user.addresses.forEach((a) => {
        if (a._id?.toString() !== req.params.id) a.isDefault = false;
      });
    }
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
});

router.delete("/addresses/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.addresses.id(req.params.id)?.deleteOne();
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
});

export default router;
