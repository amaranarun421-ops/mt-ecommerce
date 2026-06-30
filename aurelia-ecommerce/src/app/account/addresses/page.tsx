'use client'

import { useState } from 'react'
import { Plus, MapPin, Edit, Trash2, Check, Star } from 'lucide-react'
import { AccountLayout } from '@/components/shop/account-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  street: string
  apartment?: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'a1',
    label: 'Home',
    firstName: 'Maya',
    lastName: 'Reynolds',
    street: '221 Mason Street',
    apartment: 'Apt 4B',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11201',
    country: 'United States',
    phone: '+1 (646) 555-0192',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Work',
    firstName: 'Maya',
    lastName: 'Reynolds',
    street: '350 Fifth Avenue',
    apartment: 'Suite 7200',
    city: 'New York',
    state: 'NY',
    zip: '10118',
    country: 'United States',
    phone: '+1 (212) 555-0142',
    isDefault: false,
  },
]

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)

  const openAdd = () => {
    setEditing(null)
    setOpen(true)
  }
  const openEdit = (a: Address) => {
    setEditing(a)
    setOpen(true)
  }

  const handleSave = (data: Omit<Address, 'id'>) => {
    if (editing) {
      setAddresses((arr) => arr.map((a) => (a.id === editing.id ? { ...editing, ...data } : a)))
    } else {
      const id = `a${Date.now()}`
      const next: Address = { ...data, id }
      if (data.isDefault) {
        setAddresses((arr) => [next, ...arr.map((a) => ({ ...a, isDefault: false }))])
      } else {
        setAddresses((arr) => [...arr, next])
      }
    }
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setAddresses((arr) => arr.filter((a) => a.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses((arr) => arr.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <AccountLayout>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Save addresses for faster checkout. You can keep up to 10 saved addresses.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus size={15} className="mr-1.5" /> Add address
            </Button>
          </DialogTrigger>
          <AddressForm
            editing={editing}
            onSave={handleSave}
            onCancel={() => setOpen(false)}
          />
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MapPin size={26} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-lg font-semibold">No saved addresses yet</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add an address to make checkout faster next time.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={cn(
                'relative rounded-2xl border-2 bg-card p-5',
                a.isDefault ? 'border-foreground/60' : 'border-border'
              )}
            >
              {a.isDefault && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-background">
                  <Star size={9} className="fill-background" /> Default
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {a.label}
              </p>
              <p className="mt-2 text-sm font-medium">
                {a.firstName} {a.lastName}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {a.street}{a.apartment ? `, ${a.apartment}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {a.city}, {a.state} {a.zip}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{a.country}</p>
              <p className="mt-2 text-xs text-muted-foreground">{a.phone}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                  <Edit size={12} className="mr-1.5" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)}>
                  <Trash2 size={12} className="mr-1.5" /> Delete
                </Button>
                {!a.isDefault && (
                  <Button size="sm" variant="ghost" onClick={() => handleSetDefault(a.id)}>
                    <Check size={12} className="mr-1.5" /> Set default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}

function AddressForm({
  editing,
  onSave,
  onCancel,
}: {
  editing: Address | null
  onSave: (a: Omit<Address, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<Address, 'id'>>(
    editing || {
      label: '',
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
      phone: '',
      isDefault: false,
    }
  )

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{editing ? 'Edit address' : 'Add new address'}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
        className="space-y-4"
      >
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Label</Label>
          <Input value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="Home, Work, etc." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">First name</Label>
            <Input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Last name</Label>
            <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Street address</Label>
          <Input value={form.street} onChange={(e) => set('street', e.target.value)} required />
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Apartment, suite (optional)</Label>
          <Input value={form.apartment} onChange={(e) => set('apartment', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">City</Label>
            <Input value={form.city} onChange={(e) => set('city', e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">State</Label>
            <Input value={form.state} onChange={(e) => set('state', e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">ZIP</Label>
            <Input value={form.zip} onChange={(e) => set('zip', e.target.value)} required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Country</Label>
            <Input value={form.country} onChange={(e) => set('country', e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Phone</Label>
            <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => set('isDefault', e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Set as default address
        </label>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{editing ? 'Save changes' : 'Add address'}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
