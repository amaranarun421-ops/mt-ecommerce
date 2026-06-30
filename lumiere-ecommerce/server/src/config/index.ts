import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@12345",
  paymentProvider: process.env.PAYMENT_PROVIDER || "MOCK",
  paymentSecretKey: process.env.PAYMENT_SECRET_KEY || "",
  paymentPublicKey: process.env.PAYMENT_PUBLIC_KEY || "",
  emailServer: process.env.EMAIL_SERVER || "",
  emailFrom: process.env.EMAIL_FROM || "no-reply@lumiere.store",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  isDev: (process.env.NODE_ENV || "development") !== "production",
};

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_SHIPPING_RATE = 6.95;
