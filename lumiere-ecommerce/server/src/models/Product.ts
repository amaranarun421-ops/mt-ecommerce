import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage {
  url: string;
  altText: string;
  position: number;
}

export interface IProductVariant {
  name: string; // e.g. "Size", "Color"
  value: string; // e.g. "XL", "Red"
  sku?: string;
  price?: number; // override
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency: string;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  sold: number;
  trending: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  featured: boolean;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  brand?: string;
  material?: string;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  weight?: number;
  dimensions?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  categoryId: mongoose.Types.ObjectId;
  images: IProductImage[];
  variants: IProductVariant[];
  specifications: { label: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    altText: { type: String, required: true },
    position: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    sku: String,
    price: Number,
    stock: { type: Number, default: 0 },
  },
  { _id: true }
);

const SpecificationSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: String,
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    trending: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    bestSeller: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["ACTIVE", "DRAFT", "ARCHIVED"], default: "ACTIVE", index: true },
    brand: String,
    material: String,
    careInstructions: String,
    shippingInfo: String,
    returnPolicy: String,
    weight: Number,
    dimensions: String,
    seoTitle: String,
    seoDescription: String,
    tags: { type: [String], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    images: { type: [ProductImageSchema], default: [] },
    variants: { type: [ProductVariantSchema], default: [] },
    specifications: { type: [SpecificationSchema], default: [] },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: "text", description: "text", tags: "text", brand: "text" });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
