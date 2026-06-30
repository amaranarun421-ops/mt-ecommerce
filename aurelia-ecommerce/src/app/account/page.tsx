'use client'

import { useState } from 'react'
import { User, Mail, Phone, Save, Check } from 'lucide-react'
import { AccountLayout } from '@/components/shop/account-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AccountProfilePage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    firstName: 'Maya',
    lastName: 'Reynolds',
    email: 'maya@example.com',
    phone: '+1 (646) 555-0192',
    birthdate: '1989-04-12',
  })

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AccountLayout>
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information. This will be used for order confirmations and shipping updates.
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">First name</Label>
              <Input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Last name</Label>
              <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Phone</Label>
            <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Birthdate (optional)</Label>
            <Input type="date" value={form.birthdate} onChange={(e) => set('birthdate', e.target.value)} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">
              {saved ? (
                <><Check size={15} className="mr-1.5" /> Saved</>
              ) : (
                <><Save size={15} className="mr-1.5" /> Save changes</>
              )}
            </Button>
            {saved && <span className="text-sm text-emerald-700">Profile updated.</span>}
          </div>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={User} label="Member since" value="Apr 2023" />
        <StatCard icon={Mail} label="Total orders" value="14" />
        <StatCard icon={Phone} label="Support tickets" value="0 open" />
      </div>
    </AccountLayout>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon size={16} className="text-muted-foreground" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  )
}
