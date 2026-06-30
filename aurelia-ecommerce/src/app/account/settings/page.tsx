'use client'

import { useState } from 'react'
import { Bell, Globe, Lock, Save, Check, Trash2 } from 'lucide-react'
import { AccountLayout } from '@/components/shop/account-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AccountSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState({
    marketingEmails: true,
    orderUpdates: true,
    priceDropAlerts: false,
    weeklyNewsletter: true,
    smsNotifications: false,
  })
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en-US')

  const setPref = (k: keyof typeof prefs, v: boolean) =>
    setPrefs((p) => ({ ...p, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AccountLayout>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage notifications, preferences, and account security.
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        {/* Notifications */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell size={16} className="text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <SwitchRow
              title="Order updates"
              desc="Shipping confirmations, delivery updates, and tracking notifications"
              checked={prefs.orderUpdates}
              onChange={(v) => setPref('orderUpdates', v)}
            />
            <SwitchRow
              title="Marketing emails"
              desc="New collections, seasonal offers, and exclusive previews"
              checked={prefs.marketingEmails}
              onChange={(v) => setPref('marketingEmails', v)}
            />
            <SwitchRow
              title="Price drop alerts"
              desc="Get notified when items in your wishlist drop in price"
              checked={prefs.priceDropAlerts}
              onChange={(v) => setPref('priceDropAlerts', v)}
            />
            <SwitchRow
              title="Weekly newsletter"
              desc="Studio letters, design notes, and the occasional offer (twice a month)"
              checked={prefs.weeklyNewsletter}
              onChange={(v) => setPref('weeklyNewsletter', v)}
            />
            <SwitchRow
              title="SMS notifications"
              desc="Order updates by text message. Standard rates apply."
              checked={prefs.smsNotifications}
              onChange={(v) => setPref('smsNotifications', v)}
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe size={16} className="text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold">Preferences</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
                  <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="ja-JP">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock size={16} className="text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Current password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-sm font-medium">New password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">Confirm new password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Use at least 12 characters with a mix of letters, numbers, and symbols. We recommend a password manager.
            </p>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit">
            {saved ? (
              <><Check size={15} className="mr-1.5" /> Saved</>
            ) : (
              <><Save size={15} className="mr-1.5" /> Save all changes</>
            )}
          </Button>
          {saved && <span className="text-sm text-emerald-700">Settings updated.</span>}
        </div>
      </form>

      {/* Danger zone */}
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-display text-lg font-semibold text-red-900">Danger zone</h2>
        <p className="mt-1 text-sm text-red-700">
          Once you delete your account, there is no going back. All your orders, addresses, and wishlist will be permanently removed.
        </p>
        <Button variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-100">
          <Trash2 size={14} className="mr-1.5" /> Delete account
        </Button>
      </section>
    </AccountLayout>
  )
}

function SwitchRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
