import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Try again later." },
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages from this IP. Please try later." },
});

export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many subscription attempts." },
});

// Global error handler
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("[error]", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  const status = (err as any).status || (err as any).statusCode || 500;
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "Something went wrong on our end. Please try again."
      : err.message;
  res.status(status).json({ error: message });
}

// 404 handler
export function notFound(req: Request, _res: Response, next: NextFunction) {
  const err = new Error(`Not found: ${req.method} ${req.originalUrl}`) as any;
  err.status = 404;
  next(err);
}
