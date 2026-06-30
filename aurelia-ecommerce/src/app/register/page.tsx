'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[k]
        return next
      })
    }
  }

  const passwordStrength = (() => {
    const p = form.password
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email.'
    if (form.password.length < 8) errs.password = 'Use at least 8 characters.'
    if (!agreed) errs.agreed = 'Please accept the terms to continue.'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    setTimeout(() => router.push('/account'), 800)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 lg:py-20">
      <div className="text-center">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Aurelia
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join 84,000+ design-led shoppers. Get 10% off your first order when you subscribe to our newsletter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">First name</Label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                placeholder="Maya"
                autoComplete="given-name"
                className="pl-9"
              />
            </div>
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Last name</Label>
            <Input
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              placeholder="Reynolds"
              autoComplete="family-name"
            />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-9"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="pl-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition',
                    passwordStrength >= i
                      ? passwordStrength <= 2
                        ? 'bg-red-500'
                        : passwordStrength <= 3
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border"
          />
          <span>
            I agree to the{' '}
            <Link href="/terms" className="text-foreground underline">terms of service</Link>,{' '}
            <Link href="/privacy" className="text-foreground underline">privacy policy</Link>, and to receive order-related emails.
          </span>
        </label>
        {errors.agreed && <p className="-mt-2 text-xs text-red-600">{errors.agreed}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Creating account…' : (
            <>Create account <ArrowRight size={15} className="ml-2" /></>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck size={11} /> Secured with 256-bit SSL encryption
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground underline hover:text-foreground/80">
          Sign in
        </Link>
      </p>

      <ul className="mt-8 space-y-2 rounded-xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground">
        <li className="flex items-center gap-2"><Check size={12} className="text-emerald-600" /> Free shipping over $99</li>
        <li className="flex items-center gap-2"><Check size={12} className="text-emerald-600" /> 30-day returns, no questions asked</li>
        <li className="flex items-center gap-2"><Check size={12} className="text-emerald-600" /> 10-year warranty on every frame</li>
        <li className="flex items-center gap-2"><Check size={12} className="text-emerald-600" /> Sync cart &amp; wishlist across devices</li>
      </ul>
    </div>
  )
}
