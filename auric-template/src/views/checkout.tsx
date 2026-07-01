"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/contexts/router-context";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import {
  Truck,
  CreditCard,
  FileText,
  Check,
  Lock,
  ChevronLeft,
  Wallet,
  ShieldCheck,
  Gift,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "shipping" | "billing" | "payment" | "review";
const STEPS: { id: Step; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "shipping", label: "checkout.step.shipping", icon: Truck },
  { id: "billing", label: "checkout.step.billing", icon: FileText },
  { id: "payment", label: "checkout.step.payment", icon: CreditCard },
  { id: "review", label: "checkout.step.review", icon: ShieldCheck },
];

export function CheckoutPage({ initialStep = "shipping" }: { initialStep?: Step }) {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const { items, subtotal, shippingCost, tax, total, giftWrap, coupon, shippingMethod, setShippingMethod, clearCart } = useCart();
  const { user, setVerifiedBuyer } = useAuth();
  const [step, setStep] = useState<Step>(initialStep);
  const [processing, setProcessing] = useState(false);
  const [billingSame, setBillingSame] = useState(true);
  const [payment, setPayment] = useState<"card" | "paypal" | "applePay" | "klarna">("card");
  const [agreed, setAgreed] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const [ship, setShip] = useState({
    email: user?.email || "",
    phone: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal: "",
    country: "US",
  });
  const [bill, setBill] = useState({ ...ship });
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  // Redirect to cart if empty (but allow order success)
  useEffect(() => {
    if (items.length === 0) {
      const path = window.location.hash;
      if (!path.includes("/order/")) {
        navigate("/cart");
      }
    }
  }, [items.length, navigate]);

  const fmt = (n: number) => `$${n.toLocaleString()}`;
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const discount = coupon ? Math.round(subtotal * coupon.discount) : 0;
  const giftWrapCost = giftWrap ? 9 : 0;

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) {
      setStep(next.id);
      navigate(`/checkout/${next.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) {
      setStep(prev.id);
      navigate(`/checkout/${prev.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/cart");
    }
  };

  const handlePlaceOrder = async () => {
    if (!agreed) {
      toast.error("Please accept the terms to continue");
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setProcessing(false);
    setVerifiedBuyer(true);
    clearCart();
    navigate("/order/success");
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: t("nav.home"), href: "/" },
          { label: t("cart.title"), href: "/cart" },
          { label: t("checkout.title") },
        ]}
      />

      <h1 className="font-display text-3xl lg:text-4xl font-semibold mt-4 mb-6">
        {t("checkout.title")}
      </h1>

      {/* Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-3xl">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => i < stepIndex && setStep(s.id)}
                  className="flex items-center gap-2 group"
                  disabled={i > stepIndex}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      done && "bg-accent text-accent-foreground",
                      active && "bg-foreground text-background ring-4 ring-foreground/10",
                      !done && !active && "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:inline",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {t(s.label)}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 mx-3 transition-colors",
                      i < stepIndex ? "bg-accent" : "bg-border",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Step content */}
        <div className="lg:col-span-7">
          {step === "shipping" && (
            <Card className="border-border shadow-soft">
              <CardContent className="p-6 lg:p-8 space-y-6">
                <h2 className="font-display text-xl font-semibold">{t("checkout.shippingAddress")}</h2>

                {/* Contact */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("checkout.contact")}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t("checkout.email")} value={ship.email} onChange={(v) => setShip({ ...ship, email: v })} type="email" required />
                    <Field label={t("checkout.phone")} value={ship.phone} onChange={(v) => setShip({ ...ship, phone: v })} type="tel" required />
                  </div>
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t("checkout.firstName")} value={ship.firstName} onChange={(v) => setShip({ ...ship, firstName: v })} required />
                    <Field label={t("checkout.lastName")} value={ship.lastName} onChange={(v) => setShip({ ...ship, lastName: v })} required />
                  </div>
                  <Field label={t("checkout.address1")} value={ship.address1} onChange={(v) => setShip({ ...ship, address1: v })} required />
                  <Field label={t("checkout.address2")} value={ship.address2} onChange={(v) => setShip({ ...ship, address2: v })} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label={t("checkout.city")} value={ship.city} onChange={(v) => setShip({ ...ship, city: v })} required />
                    <Field label={t("checkout.state")} value={ship.state} onChange={(v) => setShip({ ...ship, state: v })} required />
                    <Field label={t("checkout.postal")} value={ship.postal} onChange={(v) => setShip({ ...ship, postal: v })} required />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">{t("checkout.country")}</Label>
                    <select
                      value={ship.country}
                      onChange={(e) => setShip({ ...ship, country: e.target.value })}
                      className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm"
                    >
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>

                <Separator />

                {/* Shipping method */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("checkout.shippingMethod")}
                  </p>
                  {[
                    { id: "standard" as const, label: t("checkout.shipping.standard"), price: t("checkout.shipping.standardPrice"), icon: Truck },
                    { id: "express" as const, label: t("checkout.shipping.express"), price: t("checkout.shipping.expressPrice"), icon: Truck },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors",
                        shippingMethod === opt.id ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === opt.id}
                        onChange={() => setShippingMethod(opt.id)}
                        className="accent-accent"
                      />
                      <opt.icon className="w-4 h-4 text-accent" />
                      <span className="flex-1 text-sm font-medium">{opt.label}</span>
                      <span className={cn("text-sm font-semibold", opt.id === "standard" ? "text-accent" : "")}>{opt.price}</span>
                    </label>
                  ))}
                </div>

                <Button size="lg" onClick={goNext} className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background btn-shine">
                  {t("checkout.continue")}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "billing" && (
            <Card className="border-border shadow-soft">
              <CardContent className="p-6 lg:p-8 space-y-6">
                <h2 className="font-display text-xl font-semibold">{t("checkout.billingAddress")}</h2>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingSame}
                    onChange={(e) => setBillingSame(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm font-medium">{t("checkout.billingSame")}</span>
                </label>

                {!billingSame && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label={t("checkout.firstName")} value={bill.firstName} onChange={(v) => setBill({ ...bill, firstName: v })} required />
                      <Field label={t("checkout.lastName")} value={bill.lastName} onChange={(v) => setBill({ ...bill, lastName: v })} required />
                    </div>
                    <Field label={t("checkout.address1")} value={bill.address1} onChange={(v) => setBill({ ...bill, address1: v })} required />
                    <Field label={t("checkout.address2")} value={bill.address2} onChange={(v) => setBill({ ...bill, address2: v })} />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Field label={t("checkout.city")} value={bill.city} onChange={(v) => setBill({ ...bill, city: v })} required />
                      <Field label={t("checkout.state")} value={bill.state} onChange={(v) => setBill({ ...bill, state: v })} required />
                      <Field label={t("checkout.postal")} value={bill.postal} onChange={(v) => setBill({ ...bill, postal: v })} required />
                    </div>
                  </div>
                )}

                {billingSame && (
                  <div className="p-4 rounded-lg bg-muted/40 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-accent inline me-2" />
                    {ship.address1}, {ship.city}, {ship.state} {ship.postal}, {ship.country}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={goBack} className="sm:w-auto">
                    <ChevronLeft className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 me-1"} />
                    {t("checkout.back")}
                  </Button>
                  <Button size="lg" onClick={goNext} className="flex-1 bg-foreground hover:bg-foreground/90 text-background btn-shine">
                    {t("checkout.continue")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "payment" && (
            <Card className="border-border shadow-soft">
              <CardContent className="p-6 lg:p-8 space-y-6">
                <h2 className="font-display text-xl font-semibold">{t("checkout.paymentMethod")}</h2>

                <div className="space-y-3">
                  {[
                    { id: "card" as const, label: t("checkout.payment.card"), icon: CreditCard },
                    { id: "paypal" as const, label: t("checkout.payment.paypal"), icon: Wallet },
                    { id: "applePay" as const, label: t("checkout.payment.applePay"), icon: Wallet },
                    { id: "klarna" as const, label: t("checkout.payment.klarna"), icon: Wallet },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors",
                        payment === opt.id ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                        className="accent-accent"
                      />
                      <opt.icon className="w-4 h-4 text-accent" />
                      <span className="flex-1 text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="space-y-4 pt-2">
                    <Field label={t("checkout.cardNumber")} value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="1234 5678 9012 3456" required />
                    <Field label={t("checkout.cardName")} value={card.name} onChange={(v) => setCard({ ...card, name: v })} required />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label={t("checkout.cardExpiry")} value={card.expiry} onChange={(v) => setCard({ ...card, expiry: v })} placeholder="MM / YY" required />
                      <Field label={t("checkout.cardCvc")} value={card.cvc} onChange={(v) => setCard({ ...card, cvc: v })} placeholder="123" required />
                    </div>
                  </div>
                )}

                {payment !== "card" && (
                  <div className="p-6 rounded-lg bg-muted/40 text-center">
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to {payment === "paypal" ? "PayPal" : payment === "applePay" ? "Apple Pay" : "Klarna"} to complete your purchase securely.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  {t("checkout.securePayment")}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={goBack} className="sm:w-auto">
                    <ChevronLeft className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 me-1"} />
                    {t("checkout.back")}
                  </Button>
                  <Button size="lg" onClick={goNext} className="flex-1 bg-foreground hover:bg-foreground/90 text-background btn-shine">
                    {t("checkout.continue")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "review" && (
            <Card className="border-border shadow-soft">
              <CardContent className="p-6 lg:p-8 space-y-6">
                <h2 className="font-display text-xl font-semibold">{t("checkout.review.order")}</h2>

                {/* Items review */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.variant} · Qty {item.qty}</p>
                      </div>
                      <p className="font-semibold text-sm tabular-nums">${(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Shipping review */}
                <ReviewBlock title={t("checkout.shippingAddress")}>
                  <p>{ship.firstName} {ship.lastName}</p>
                  <p>{ship.address1}</p>
                  {ship.address2 && <p>{ship.address2}</p>}
                  <p>{ship.city}, {ship.state} {ship.postal}</p>
                  <p>{ship.email} · {ship.phone}</p>
                </ReviewBlock>

                {/* Payment review */}
                <ReviewBlock title={t("checkout.paymentMethod")}>
                  <p className="capitalize">{payment === "card" ? t("checkout.payment.card") : payment === "paypal" ? "PayPal" : payment === "applePay" ? "Apple Pay" : "Klarna"}</p>
                  {payment === "card" && card.number && <p>•••• {card.number.slice(-4)}</p>}
                </ReviewBlock>

                <Separator />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 accent-accent mt-0.5"
                  />
                  <span className="text-sm">{t("checkout.terms")}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribe}
                    onChange={(e) => setSubscribe(e.target.checked)}
                    className="w-4 h-4 accent-accent mt-0.5"
                  />
                  <span className="text-sm text-muted-foreground">{t("checkout.subscribeMarketing")}</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={goBack} className="sm:w-auto">
                    <ChevronLeft className={isRTL ? "w-4 h-4 rotate-180 me-1" : "w-4 h-4 me-1"} />
                    {t("checkout.back")}
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={!agreed || processing}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground btn-shine"
                  >
                    {processing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin me-2" />
                        {t("checkout.processing")}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 me-2" />
                        {t("checkout.review.placeOrder")} · {fmt(total)}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-5">
          <Card className="border-border shadow-soft lg:sticky lg:top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold">{t("checkout.summary")}</h2>

              <div className="space-y-3 max-h-72 overflow-y-auto scroll-premium">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-semibold flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.variant}</p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">${(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <Row label={t("cart.subtotal")} value={fmt(subtotal)} />
                {discount > 0 && <Row label={`${t("checkout.coupon")} (${coupon?.code})`} value={`−${fmt(discount)}`} accent />}
                {giftWrapCost > 0 && <Row label={t("cart.giftWrap")} value={fmt(giftWrapCost)} />}
                <Row label={t("cart.estimatedShipping")} value={shippingCost === 0 ? t("cart.free") : fmt(shippingCost)} accent={shippingCost === 0} />
                <Row label={t("cart.estimatedTax")} value={fmt(tax)} />
                <Separator />
                <div className="flex justify-between text-base pt-1">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-display text-xl font-semibold tabular-nums">{fmt(total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL encrypted</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PCI-DSS</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium mb-1.5 block">
        {label} {required && <span className="text-accent">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", accent ? "text-accent font-medium" : "font-medium")}>{value}</span>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg bg-muted/40 space-y-1">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">{title}</p>
      <div className="text-sm text-foreground space-y-0.5">{children}</div>
    </div>
  );
}
