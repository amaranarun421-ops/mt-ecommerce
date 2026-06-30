import mongoose, { Schema, Document } from "mongoose";

export interface IStoreSetting extends Document {
  storeName: string;
  storeTagline: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  freeShippingThreshold: number;
  flatShippingRate: number;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  pinterestUrl?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  updatedAt: Date;
}

const StoreSettingSchema = new Schema<IStoreSetting>(
  {
    storeName: { type: String, default: "Lumière" },
    storeTagline: { type: String, default: "Premium Lifestyle, Curated for You" },
    logoUrl: String,
    email: { type: String, default: "support@lumiere.store" },
    phone: { type: String, default: "+1 (800) 555-0142" },
    address: { type: String, default: "1208 Market Street, San Francisco, CA 94103" },
    currency: { type: String, default: "USD" },
    currencySymbol: { type: String, default: "$" },
    taxRate: { type: Number, default: 0.08 },
    freeShippingThreshold: { type: Number, default: 75 },
    flatShippingRate: { type: Number, default: 6.95 },
    facebookUrl: String,
    twitterUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
    pinterestUrl: String,
    defaultSeoTitle: String,
    defaultSeoDescription: String,
  },
  { timestamps: true }
);

export const StoreSetting = mongoose.model<IStoreSetting>("StoreSetting", StoreSettingSchema);
