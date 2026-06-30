'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email.'
    if (!password) errs.password = 'Password is required.'
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
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your account to access orders, wishlist, and faster checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-9"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label className="text-sm font-medium">Password</Label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground underline hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
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
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Signing in…' : (
            <>Sign in <ArrowRight size={15} className="ml-2" /></>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck size={11} /> Secured with 256-bit SSL encryption
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Aurelia?{' '}
        <Link href="/register" className="font-medium text-foreground underline hover:text-foreground/80">
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
        Demo mode — any email and password will sign you in.
      </div>
    </div>
  )
}
