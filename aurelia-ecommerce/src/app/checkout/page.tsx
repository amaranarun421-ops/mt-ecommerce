'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { useCommerceStore, selectCartSubtotal, selectCartCount } from '@/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

type Step = 'contact' | 'shipping' | 'payment' | 'review'

interface FormState {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  apartment: string
  city: string
  state: string
  zip: string
  country: string
  shipToBilling: boolean
  deliveryMethod: 'standard' | 'express' | 'white-glove'
  paymentMethod: 'card' | 'paypal' | 'affirm'
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvc: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useCommerceStore((s) => s.cart)
  const subtotal = useCommerceStore(selectCartSubtotal)
  const count = useCommerceStore(selectCartCount)
  const coupon = useCommerceStore((s) => s.coupon)
  const clearCart = useCommerceStore((s) => s.clearCart)

  const [step, setStep] = useState<Step>('contact')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    shipToBilling: true,
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    notes: '',
  })

  const discount = coupon
    ? coupon.type === 'PERCENTAGE'
      ? (subtotal * coupon.value) / 100
      : coupon.type === 'FIXED'
      ? Math.min(coupon.value, subtotal)
      : 0
    : 0
  const deliveryCost = form.deliveryMethod === 'express' ? 24 : form.deliveryMethod === 'white-glove' ? 149 : subtotal - discount >= 99 ? 0 : 9
  const tax = Math.max(0, subtotal - discount) * 0.0825
  const total = Math.max(0, subtotal - discount) + deliveryCost + tax

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[key]
        return next
      })
    }
  }

  const validateContact = () => {
    const errs: Record<string, string> = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email.'
    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.'
    if (!form.phone.trim()) errs.phone = 'Phone is required for delivery.'
    return errs
  }

  const validateShipping = () => {
    const errs: Record<string, string> = {}
    if (!form.address.trim()) errs.address = 'Street address is required.'
    if (!form.city.trim()) errs.city = 'City is required.'
    if (!form.state.trim()) errs.state = 'State is required.'
    if (!form.zip.trim()) errs.zip = 'ZIP code is required.'
    return errs
  }

  const validatePayment = () => {
    const errs: Record<string, string> = {}
    if (form.paymentMethod === 'card') {
      if (!form.cardNumber.trim()) errs.cardNumber = 'Card number is required.'
      else if (form.cardNumber.replace(/\s/g, '').length < 15) errs.cardNumber = 'Enter a valid card number.'
      if (!form.cardName.trim()) errs.cardName = 'Name on card is required.'
      if (!form.cardExpiry.trim()) errs.cardExpiry = 'Expiry is required.'
      if (!form.cardCvc.trim()) errs.cardCvc = 'CVC is required.'
    }
    return errs
  }

  const handleNext = () => {
    let errs: Record<string, string> = {}
    if (step === 'contact') errs = validateContact()
    if (step === 'shipping') errs = validateShipping()
    if (step === 'payment') errs = validatePayment()

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 'contact') setStep('shipping')
    else if (step === 'shipping') setStep('payment')
    else if (step === 'payment') setStep('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    if (step === 'shipping') setStep('contact')
    else if (step === 'payment') setStep('shipping')
    else if (step === 'review') setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = () => {
    setSubmitting(true)
    setTimeout(() => {
      const orderId = `AUR-${Date.now().toString().slice(-8)}`
      try {
        sessionStorage.setItem(
          'aurelia:last-order',
          JSON.stringify({
            orderId,
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            deliveryMethod: form.deliveryMethod,
            paymentMethod: form.paymentMethod,
            items: cart,
            subtotal,
            discount,
            shipping: deliveryCost,
            tax,
            total,
            placedAt: new Date().toISOString(),
          })
        )
      } catch {}
      clearCart()
      setSubmitting(false)
      router.push('/order-success')
    }, 1500)
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Your cart is empty
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Add something to your cart before checking out.
          </p>
          <Link href="/shop" className="mt-5">
            <Button>Browse the shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
          <li><ChevronRight size={11} /></li>
          <li className="text-foreground">Checkout</li>
        </ol>
      </nav>

      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Checkout
        </h1>
        <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to cart
        </Link>
      </div>

      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap items-center gap-3 text-sm">
        {(['contact', 'shipping', 'payment', 'review'] as Step[]).map((s, i) => {
          const isActive = step === s
          const isDone = ['contact', 'shipping', 'payment', 'review'].indexOf(step) > i
          return (
            <li key={s} className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                  isActive ? 'bg-foreground text-background' : isDone ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {isDone ? <Check size={12} /> : i + 1}
              </span>
              <span className={cn(isActive ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {s === 'contact' && 'Contact'}
                {s === 'shipping' && 'Shipping'}
                {s === 'payment' && 'Payment'}
                {s === 'review' && 'Review'}
              </span>
              {i < 3 && <ChevronRight size={14} className="text-muted-foreground/50" />}
            </li>
          )
        })}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Form column */}
        <div>
          {step === 'contact' && (
            <FormCard title="Contact information" description="We'll use this to send your order confirmation and shipping updates.">
              <div className="grid gap-4">
                <Field label="Email" error={errors.email} required>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" error={errors.firstName} required>
                    <Input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} autoComplete="given-name" />
                  </Field>
                  <Field label="Last name" error={errors.lastName} required>
                    <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} autoComplete="family-name" />
                  </Field>
                </div>
                <Field label="Phone" error={errors.phone} required help="For delivery updates only.">
                  <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" autoComplete="tel" />
                </Field>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox id="marketing" defaultChecked />
                  Email me about new arrivals and seasonal offers
                </label>
              </div>
            </FormCard>
          )}

          {step === 'shipping' && (
            <FormCard title="Shipping address" description="Where should we send your order?">
              <div className="grid gap-4">
                <Field label="Street address" error={errors.address} required>
                  <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="221 Mason Street" autoComplete="address-line1" />
                </Field>
                <Field label="Apartment, suite, etc. (optional)">
                  <Input value={form.apartment} onChange={(e) => set('apartment', e.target.value)} placeholder="Apt 4B" autoComplete="address-line2" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" error={errors.city} required>
                    <Input value={form.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" />
                  </Field>
                  <Field label="State" error={errors.state} required>
                    <Input value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="NY" autoComplete="address-level1" />
                  </Field>
                  <Field label="ZIP" error={errors.zip} required>
                    <Input value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="11201" autoComplete="postal-code" />
                  </Field>
                </div>
                <Field label="Country">
                  <Input value={form.country} onChange={(e) => set('country', e.target.value)} />
                </Field>
              </div>

              <hr className="my-6 border-border" />

              <h3 className="mb-3 text-sm font-semibold">Delivery method</h3>
              <RadioGroup
                value={form.deliveryMethod}
                onValueChange={(v) => set('deliveryMethod', v)}
                className="space-y-2"
              >
                <DeliveryOption
                  value="standard"
                  title="Standard shipping"
                  desc="3–5 business days"
                  price={subtotal - discount >= 99 ? 'Free' : '$9'}
                  selected={form.deliveryMethod === 'standard'}
                />
                <DeliveryOption
                  value="express"
                  title="Express shipping"
                  desc="1–2 business days"
                  price="$24"
                  selected={form.deliveryMethod === 'express'}
                />
                <DeliveryOption
                  value="white-glove"
                  title="White-glove delivery"
                  desc="Room of choice, assembly & packaging removal"
                  price="$149"
                  selected={form.deliveryMethod === 'white-glove'}
                />
              </RadioGroup>

              <Field label="Order notes (optional)" className="mt-4">
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Gate code, delivery instructions, etc."
                />
              </Field>
            </FormCard>
          )}

          {step === 'payment' && (
            <FormCard title="Payment method" description="All payments are encrypted and processed through PCI-DSS Level 1 certified providers.">
              <RadioGroup
                value={form.paymentMethod}
                onValueChange={(v) => set('paymentMethod', v)}
                className="space-y-2"
              >
                <PaymentOption
                  value="card"
                  title="Credit / debit card"
                  desc="Visa, Mastercard, Amex, Discover"
                  icon={CreditCard}
                  selected={form.paymentMethod === 'card'}
                />
                <PaymentOption
                  value="paypal"
                  title="PayPal"
                  desc="You'll be redirected to PayPal to complete payment"
                  selected={form.paymentMethod === 'paypal'}
                />
                <PaymentOption
                  value="affirm"
                  title="Affirm — pay over time"
                  desc="0% APR for 6 months on orders over $250"
                  selected={form.paymentMethod === 'affirm'}
                />
              </RadioGroup>

              {form.paymentMethod === 'card' && (
                <div className="mt-5 grid gap-4 rounded-lg border border-border bg-secondary/30 p-4">
                  <Field label="Card number" error={errors.cardNumber} required>
                    <Input
                      value={form.cardNumber}
                      onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                  </Field>
                  <Field label="Name on card" error={errors.cardName} required>
                    <Input value={form.cardName} onChange={(e) => set('cardName', e.target.value)} autoComplete="cc-name" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry (MM/YY)" error={errors.cardExpiry} required>
                      <Input
                        value={form.cardExpiry}
                        onChange={(e) => set('cardExpiry', formatExpiry(e.target.value))}
                        placeholder="08/27"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                    </Field>
                    <Field label="CVC" error={errors.cardCvc} required>
                      <Input
                        value={form.cardCvc}
                        onChange={(e) => set('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                    </Field>
                  </div>
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Lock size={11} /> Test mode — no real payment will be processed. Use 4242 4242 4242 4242, any future date, any CVC.
                  </p>
                </div>
              )}

              {form.paymentMethod === 'paypal' && (
                <p className="mt-5 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                  You&apos;ll be redirected to PayPal after reviewing your order.
                </p>
              )}

              {form.paymentMethod === 'affirm' && (
                <p className="mt-5 rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                  Pay {formatPrice(total / 6)} per month for 6 months at 0% APR. Eligibility check happens on the next step.
                </p>
              )}

              <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox id="billing-same" defaultChecked />
                Billing address same as shipping
              </label>
            </FormCard>
          )}

          {step === 'review' && (
            <FormCard title="Review your order" description="Please double-check everything before placing your order.">
              <div className="space-y-4">
                <ReviewBlock title="Contact" onEdit={() => setStep('contact')}>
                  <p className="text-sm">{form.firstName} {form.lastName}</p>
                  <p className="text-sm text-muted-foreground">{form.email} · {form.phone}</p>
                </ReviewBlock>
                <ReviewBlock title="Ship to" onEdit={() => setStep('shipping')}>
                  <p className="text-sm">{form.address}{form.apartment ? `, ${form.apartment}` : ''}</p>
                  <p className="text-sm text-muted-foreground">{form.city}, {form.state} {form.zip}</p>
                  <p className="text-sm text-muted-foreground">{form.country}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {form.deliveryMethod === 'standard' && 'Standard shipping · 3–5 business days'}
                    {form.deliveryMethod === 'express' && 'Express shipping · 1–2 business days'}
                    {form.deliveryMethod === 'white-glove' && 'White-glove delivery · room of choice + assembly'}
                  </p>
                </ReviewBlock>
                <ReviewBlock title="Payment" onEdit={() => setStep('payment')}>
                  {form.paymentMethod === 'card' && (
                    <>
                      <p className="text-sm">Credit / debit card</p>
                      <p className="text-sm text-muted-foreground">
                        {form.cardName} · •••• {form.cardNumber.replace(/\s/g, '').slice(-4)}
                      </p>
                    </>
                  )}
                  {form.paymentMethod === 'paypal' && <p className="text-sm">PayPal</p>}
                  {form.paymentMethod === 'affirm' && <p className="text-sm">Affirm — 6 monthly payments of {formatPrice(total / 6)}</p>}
                </ReviewBlock>

                {form.notes && (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order notes</p>
                    <p className="text-sm text-muted-foreground">{form.notes}</p>
                  </div>
                )}

                {/* Items */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Items ({count})
                  </p>
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {cart.map((line) => (
                      <li key={`${line.productId}-${line.variantColor}-${line.variantSize}`} className="flex gap-3 p-3">
                        <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{line.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {[line.variantColor, line.variantSize].filter(Boolean).join(' · ')} · Qty {line.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold tabular-nums">
                            {formatPrice(line.price * line.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {submitting && (
                  <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <Loader2 size={16} className="animate-spin" />
                    Processing your payment securely…
                  </div>
                )}
              </div>
            </FormCard>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex items-center justify-between">
            {step !== 'contact' ? (
              <Button variant="ghost" onClick={handleBack} disabled={submitting}>
                <ArrowLeft size={15} className="mr-1.5" /> Back
              </Button>
            ) : (
              <Link href="/cart">
                <Button variant="ghost">
                  <ArrowLeft size={15} className="mr-1.5" /> Back to cart
                </Button>
              </Link>
            )}

            {step !== 'review' ? (
              <Button onClick={handleNext} size="lg" className="rounded-full">
                Continue <ChevronRight size={15} className="ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                size="lg"
                className="rounded-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="mr-2 animate-spin" /> Placing order…
                  </>
                ) : (
                  <>
                    <Lock size={15} className="mr-2" /> Place order · {formatPrice(total)}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto scroll-premium pr-1">
              {cart.map((line) => (
                <li key={`${line.productId}-${line.variantColor}-${line.variantSize}`} className="flex gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image src={line.image} alt={line.name} fill sizes="48px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-xs font-medium leading-tight">{line.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {[line.variantColor, line.variantSize].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <p className="self-center text-xs font-semibold tabular-nums">
                    {formatPrice(line.price * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({coupon?.code})</span>
                  <span className="tabular-nums">−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {deliveryCost === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (estimated)</span>
                <span className="tabular-nums">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2 rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <ShieldCheck size={13} /> PCI-DSS Level 1 encrypted checkout
              </p>
              <p className="flex items-center gap-2">
                <Truck size={13} /> Free returns for 30 days
              </p>
              <p className="flex items-center gap-2">
                <Lock size={13} /> We never see or store your card details
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function FormCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Field({
  label,
  error,
  required,
  help,
  className,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  help?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 flex items-center gap-1 text-sm font-medium">
        {label}
        {required && <span className="text-red-600">*</span>}
      </Label>
      {children}
      {help && <p className="mt-1 text-[11px] text-muted-foreground">{help}</p>}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

function DeliveryOption({
  value,
  title,
  desc,
  price,
  selected,
}: {
  value: string
  title: string
  desc: string
  price: string
  selected: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition',
        selected ? 'border-foreground bg-secondary/40' : 'border-border hover:border-foreground/30'
      )}
    >
      <RadioGroupItem value={value} id={`delivery-${value}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <span className="text-sm font-semibold">{price}</span>
    </label>
  )
}

function PaymentOption({
  value,
  title,
  desc,
  icon: Icon,
  selected,
}: {
  value: string
  title: string
  desc: string
  icon?: React.ElementType
  selected: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition',
        selected ? 'border-foreground bg-secondary/40' : 'border-border hover:border-foreground/30'
      )}
    >
      <RadioGroupItem value={value} id={`pay-${value}`} />
      {Icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
          <Icon size={16} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </label>
  )
}

function ReviewBlock({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
        <button onClick={onEdit} className="text-xs font-medium text-foreground underline hover:text-foreground/80">
          Edit
        </button>
      </div>
      {children}
    </div>
  )
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}
