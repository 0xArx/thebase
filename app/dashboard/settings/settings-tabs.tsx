'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

interface Props {
  user: User
  profile: { plan: string | null; stripe_customer_id: string | null } | null
  isStripeEnabled: boolean
}

function SettingsTabsInner({ user, profile, isStripeEnabled }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const isPro = profile?.plan === 'pro'

  async function handleUpgrade() {
    setUpgrading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url, error } = await res.json()
    if (error || !url) { toast.error('Could not start checkout.'); setUpgrading(false); return }
    window.location.href = url
  }

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'account') params.delete('tab')
    else params.set('tab', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs defaultValue={searchParams.get('tab') ?? 'account'} onValueChange={handleTabChange}>
      <TabsList className="mb-6 h-9">
        <TabsTrigger value="account" className="text-xs">Account</TabsTrigger>
        <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
        <TabsTrigger value="danger" className="text-xs text-destructive data-[state=active]:text-destructive">Danger</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <div className="space-y-5 max-w-sm">
          {[
            { label: 'Email address', value: user.email },
            { label: 'Account ID', value: user.id, mono: true },
            { label: 'Member since', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
              <p className={`text-sm font-medium ${row.mono ? 'font-mono text-xs break-all' : ''}`}>{row.value}</p>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="billing">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <div>
              <p className="text-sm font-medium capitalize">{isPro ? 'Pro' : 'Free'} plan</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isPro ? 'All features unlocked.' : 'Upgrade for full access.'}</p>
            </div>
            <Badge variant={isPro ? 'default' : 'secondary'} className="text-xs">{isPro ? 'Pro' : 'Free'}</Badge>
          </div>
          {!isStripeEnabled ? (
            <p className="text-xs text-muted-foreground">Set <code className="bg-muted px-1 rounded">STRIPE_SECRET_KEY</code> to enable billing.</p>
          ) : isPro ? (
            <Button variant="outline" size="sm">Manage subscription</Button>
          ) : (
            <Button size="sm" onClick={handleUpgrade} disabled={upgrading}>
              {upgrading ? 'Redirecting…' : 'Upgrade to Pro'}
            </Button>
          )}
        </div>
      </TabsContent>

      <TabsContent value="notifications">
        <div className="space-y-5 max-w-sm">
          {[
            { id: 'security', label: 'Security alerts', desc: 'New logins and suspicious activity.', on: true },
            { id: 'billing', label: 'Billing updates', desc: 'Receipts and subscription changes.', on: true },
            { id: 'product', label: 'Product updates', desc: 'New features and announcements.', on: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <Label htmlFor={item.id} className="text-sm cursor-pointer">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch id={item.id} defaultChecked={item.on}
                onCheckedChange={v => toast.success(`${item.label} ${v ? 'on' : 'off'}`)} />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="danger">
        <div className="max-w-sm p-4 rounded-xl border border-destructive/20 space-y-3">
          <div>
            <p className="text-sm font-medium text-destructive">Delete account</p>
            <p className="text-xs text-muted-foreground mt-1">Permanent. All your data will be removed.</p>
          </div>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger render={<Button variant="destructive" size="sm" />}>
              Delete account
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>This cannot be undone. All your data will be permanently deleted.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, delete everything'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export function SettingsTabs(props: Props) {
  return (
    <Suspense fallback={<div className="h-40" />}>
      <SettingsTabsInner {...props} />
    </Suspense>
  )
}
