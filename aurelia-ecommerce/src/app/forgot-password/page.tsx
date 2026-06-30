'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Enter a valid email.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 800)
  }

  if (sent) {
    return (
      <div className="mx-auto flex max-w-md flex-col px-4 py-12 text-center sm:px-6 lg:py-20">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={32} className="text-emerald-700" />
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Check your inbox</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
          The link is valid for 30 minutes.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder, or{' '}
          <button onClick={() => setSent(false)} className="text-foreground underline">try a different email</button>.
        </p>
        <Link href="/login" className="mt-8">
          <Button variant="outline" className="w-full">
            <ArrowLeft size={14} className="mr-1.5" /> Back to sign in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 lg:py-20">
      <div className="text-center">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Aurelia
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email you used to sign up, and we&apos;ll send you a reset link.
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
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Sending reset link…' : (
            <>Send reset link <ArrowRight size={15} className="ml-2" /></>
          )}
        </Button>
      </form>

      <Link href="/login" className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={12} className="mr-1 inline" /> Back to sign in
      </Link>
    </div>
  )
}
