import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  name: string;
  image?: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
  banned: boolean;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IAddress {
  _id?: string;
  label: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: "Home" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "United States" },
    phone: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, select: false },
    name: { type: String, required: true },
    image: String,
    role: { type: String, enum: ["CUSTOMER", "ADMIN"], default: "CUSTOMER", index: true },
    phone: String,
    banned: { type: Boolean, default: false },
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  // Enforce single default address
  if (this.addresses && this.addresses.length > 0) {
    const defaults = this.addresses.filter((a) => a.isDefault);
    if (defaults.length > 1) {
      this.addresses.forEach((a, i) => {
        if (i !== this.addresses.length - 1) a.isDefault = false;
      });
    }
  }
  next();
});

UserSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", UserSchema);
