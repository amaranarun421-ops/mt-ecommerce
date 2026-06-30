'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Check, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contact us</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          We&apos;re here to help.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Speak with a real person in our Brooklyn studio — not a chatbot. We&apos;re available seven days a week, 9am–9pm ET, and we typically reply to emails within four business hours.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div>
          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600">
                <Check size={28} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-emerald-900">Message received</h2>
              <p className="mt-2 text-sm text-emerald-800">
                Thanks for reaching out. We&apos;ll reply to your email within four business hours.
              </p>
              <Button
                variant="outline"
                className="mt-5 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                onClick={() => setSent(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">Send us a message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Name</Label>
                  <Input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Maya Reynolds" />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-medium">Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">Subject</Label>
                <Select value={form.subject} onValueChange={(v) => set('subject', v)}>
                  <SelectTrigger><SelectValue placeholder="Choose a topic" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order status or change</SelectItem>
                    <SelectItem value="returns">Return or exchange</SelectItem>
                    <SelectItem value="product">Product question</SelectItem>
                    <SelectItem value="shipping">Shipping &amp; delivery</SelectItem>
                    <SelectItem value="trade">Trade program inquiry</SelectItem>
                    <SelectItem value="press">Press inquiry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">Message</Label>
                <textarea
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                  rows={6}
                  placeholder="How can we help? Include order numbers if relevant."
                  className="flex min-h-[140px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? 'Sending…' : (
                  <><Send size={15} className="mr-2" /> Send message</>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <MessageSquare size={16} /> Get in touch
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+18005550142" className="text-muted-foreground hover:text-foreground">+1 800-555-0142</a>
                  <p className="text-xs text-muted-foreground">Toll-free in the US &amp; Canada</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:studio@aurelia.example.com" className="text-muted-foreground hover:text-foreground">studio@aurelia.example.com</a>
                  <p className="text-xs text-muted-foreground">We reply within 4 business hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Studio</p>
                  <p className="text-muted-foreground">221 Mason Street</p>
                  <p className="text-muted-foreground">Brooklyn, NY 11201</p>
                  <p className="text-xs text-muted-foreground">By appointment only</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-muted-foreground">Mon–Fri: 9am–9pm ET</p>
                  <p className="text-muted-foreground">Sat–Sun: 10am–6pm ET</p>
                  <p className="text-xs text-muted-foreground">Closed on Thanksgiving &amp; Christmas</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <h3 className="font-display text-base font-semibold">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="/faq" className="text-muted-foreground hover:text-foreground">Frequently asked questions</a></li>
              <li><a href="/track-order" className="text-muted-foreground hover:text-foreground">Track your order</a></li>
              <li><a href="/returns" className="text-muted-foreground hover:text-foreground">Start a return</a></li>
              <li><a href="/shipping" className="text-muted-foreground hover:text-foreground">Shipping policy</a></li>
              <li><a href="/trade-program" className="text-muted-foreground hover:text-foreground">Trade program</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
