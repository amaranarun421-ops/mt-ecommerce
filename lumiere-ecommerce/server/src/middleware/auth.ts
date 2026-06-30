import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { User } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "CUSTOMER" | "ADMIN";
  };
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, config.jwtSecret) as { sub: string };
  } catch {
    return null;
  }
}

/** Read JWT from Authorization header OR cookie */
export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;
  return null;
}

/** Optional auth — attaches user if token present, but never blocks */
export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const token = getTokenFromRequest(req);
    if (token) {
      const payload = verifyToken(token);
      if (payload?.sub) {
        const user = await User.findById(payload.sub).lean();
        if (user && !user.banned) {
          req.user = {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    }
  } catch (err) {
    // ignore — optional
  }
  next();
}

/** Required auth — blocks if not logged in */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please sign in." });
  }
  const payload = verifyToken(token);
  if (!payload?.sub) {
    return res.status(401).json({ error: "Session expired. Please sign in again." });
  }
  const user = await User.findById(payload.sub).lean();
  if (!user || user.banned) {
    return res.status(401).json({ error: "Account unavailable. Please contact support." });
  }
  req.user = {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
  next();
}

/** Admin-only access */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required." });
    }
    next();
  });
}
