import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Truck, Lock, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Seo } from "@/components/shared/Seo";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, cn } from "@/lib/utils";
import { calculatePricing } from "@/lib/pricing";
import { toast } from "sonner";
import type { Address, ShippingAddress } from "@/types";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "ZIP / postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  shippingMethod: z.enum(["standard", "express"]).default("standard"),
  paymentMethod: z.enum(["card", "upi", "wallet", "cod"]).default("card"),
  notes: z.string().max(500).optional(),
  sameAsBilling: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { items, subtotal, couponCode, couponDiscount } = useCartStore();
  const clearCart = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState<string>("");

  const pricing = calculatePricing({ subtotal: subtotal(), discount: couponDiscount });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      country: "United States",
      shippingMethod: "standard",
      paymentMethod: "card",
      sameAsBilling: true,
    },
  });

  const shippingMethod = watch("shippingMethod");
  const expressSurcharge = shippingMethod === "express" ? 15 : 0;
  const totalWithExpress = pricing.total + expressSurcharge;

  if (items.length === 0) {
    return (
      <div className="container-premium section-py">
        <EmptyState
          icon={<Truck size={28} />}
          title="Your cart is empty"
          description="Add some products to your cart before checking out."
          action={<Link to="/shop"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  const applySavedAddress = (id: string) => {
    setSavedAddressId(id);
    const addr = user?.addresses?.find((a) => a._id === id);
    if (addr) {
      setValue("firstName", addr.firstName);
      setValue("lastName", addr.lastName);
      setValue("address1", addr.address1);
      setValue("address2", addr.address2 || "");
      setValue("city", addr.city);
      setValue("state", addr.state);
      setValue("postalCode", addr.postalCode);
      setValue("country", addr.country);
      setValue("phone", addr.phone || "");
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const shippingAddress: ShippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
      };
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variantId: i.variantId })),
        shippingAddress,
        billingAddress: data.sameAsBilling ? shippingAddress : shippingAddress,
        sameAsBilling: data.sameAsBilling,
        shippingMethod: data.shippingMethod === "express" ? "Express (2-day)" : "Standard",
        couponCode,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        clientTotal: totalWithExpress,
      };
      const { data: res } = await api.post("/checkout", payload);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order/success/${res.order.orderNumber}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
      // Try to extract order number if it exists
      if (msg.includes("stock") || msg.includes("Insufficient")) {
        navigate("/cart");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Checkout" canonical="/checkout" />
      <div className="container-premium section-py">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-6" />
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <div className="space-y-8">
            {/* Contact */}
            <section className="card-premium p-6">
              <h2 className="font-display text-lg font-semibold mb-4">1. Contact information</h2>
              <Input
                label="Email address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                hint="Order confirmation will be sent here"
              />
            </section>

            {/* Shipping address */}
            <section className="card-premium p-6">
              <h2 className="font-display text-lg font-semibold mb-4">2. Shipping address</h2>

              {user?.addresses && user.addresses.length > 0 && (
                <div className="mb-4">
                  <Select label="Use a saved address" value={savedAddressId} onChange={(e) => applySavedAddress(e.target.value)}>
                    <option value="">Enter a new address</option>
                    {user.addresses.map((a: Address) => (
                      <option key={a._id} value={a._id}>
                        {a.label} — {a.firstName} {a.lastName}, {a.address1}, {a.city}, {a.state} {a.postalCode}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First name" {...register("firstName")} error={errors.firstName?.message} required />
                <Input label="Last name" {...register("lastName")} error={errors.lastName?.message} required />
              </div>
              <div className="mt-4">
                <Input label="Street address" {...register("address1")} error={errors.address1?.message} required placeholder="123 Main St" />
              </div>
              <div className="mt-4">
                <Input label="Apartment, suite, etc. (optional)" {...register("address2")} />
              </div>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <Input label="City" {...register("city")} error={errors.city?.message} required />
                <Input label="State / Province" {...register("state")} error={errors.state?.message} required />
                <Input label="ZIP / Postal code" {...register("postalCode")} error={errors.postalCode?.message} required />
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <Input label="Country" {...register("country")} error={errors.country?.message} required />
                <Input label="Phone (optional)" {...register("phone")} />
              </div>
            </section>

            {/* Shipping method */}
            <section className="card-premium p-6">
              <h2 className="font-display text-lg font-semibold mb-4">3. Delivery method</h2>
              <div className="space-y-2">
                <label className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors", shippingMethod === "standard" ? "border-primary bg-accent/30" : "border-border hover:bg-secondary")}>
                  <span className="flex items-center gap-3">
                    <input type="radio" value="standard" {...register("shippingMethod")} className="text-primary" />
                    <span>
                      <span className="block text-sm font-medium text-foreground">Standard shipping</span>
                      <span className="block text-xs text-muted-foreground">3–5 business days</span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{pricing.shipping === 0 ? "Free" : formatPrice(pricing.shipping)}</span>
                </label>
                <label className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors", shippingMethod === "express" ? "border-primary bg-accent/30" : "border-border hover:bg-secondary")}>
                  <span className="flex items-center gap-3">
                    <input type="radio" value="express" {...register("shippingMethod")} className="text-primary" />
                    <span>
                      <span className="block text-sm font-medium text-foreground">Express shipping</span>
                      <span className="block text-xs text-muted-foreground">2 business days · Order by 2pm PT</span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{formatPrice(pricing.shipping + 15)}</span>
                </label>
              </div>
            </section>

            {/* Payment */}
            <section className="card-premium p-6">
              <h2 className="font-display text-lg font-semibold mb-4">4. Payment method</h2>
              <div className="rounded-lg bg-accent/40 border border-accent p-3 mb-4 text-xs text-accent-foreground flex items-start gap-2">
                <Lock size={14} className="mt-0.5 shrink-0" />
                <span>This is a demo store. No real payment will be processed. Use any details to test the checkout flow.</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: "card", label: "Credit card" },
                  { value: "upi", label: "UPI" },
                  { value: "wallet", label: "Wallet" },
                  { value: "cod", label: "Cash on delivery" },
                ].map((m) => (
                  <label key={m.value} className={cn("rounded-lg border p-3 text-center cursor-pointer text-sm transition-colors", watch("paymentMethod") === m.value ? "border-primary bg-accent/30" : "border-border hover:bg-secondary")}>
                    <input type="radio" value={m.value} {...register("paymentMethod")} className="sr-only" />
                    {m.label}
                  </label>
                ))}
              </div>
              {watch("paymentMethod") === "card" && (
                <div className="mt-4 space-y-4">
                  <Input label="Card number" placeholder="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry" placeholder="MM / YY" />
                    <Input label="CVC" placeholder="123" />
                  </div>
                  <p className="text-xs text-muted-foreground">Demo mode — any input will be accepted.</p>
                </div>
              )}
              <div className="mt-4">
                <Input label="Order notes (optional)" {...register("notes")} placeholder="Special delivery instructions, gift message, etc." />
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-premium p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>

              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId || ""}`} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover bg-muted" loading="lazy" />
                      <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      {item.variantLabel && <p className="text-xs text-muted-foreground">{item.variantLabel}</p>}
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(pricing.subtotal)}</span></div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-success"><span className="text-success">Discount {couponCode ? `(${couponCode})` : ""}</span><span>−{formatPrice(pricing.discount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(pricing.tax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{pricing.shipping === 0 ? "Free" : formatPrice(pricing.shipping)}</span></div>
                {expressSurcharge > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Express surcharge</span><span>{formatPrice(expressSurcharge)}</span></div>
                )}
              </div>

              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="font-display text-base font-semibold">Total</span>
                <span className="font-display text-xl font-semibold">{formatPrice(totalWithExpress)}</span>
              </div>

              <Button type="submit" size="lg" shine className="w-full" disabled={submitting}>
                {submitting ? "Placing order…" : <>Place Order <ArrowRight size={16} /></>}
              </Button>

              <div className="space-y-2 pt-2">
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck size={14} /> Secure SSL encrypted checkout
                </p>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Truck size={14} /> Free returns within 30 days
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}
