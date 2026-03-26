'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

interface Props {
  user: User
  profile: { plan: string | null; stripe_customer_id: string | null } | null
  isStripeEnabled: boolean
}

export function SettingsTabs({ user, profile, isStripeEnabled }: Props) {
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

  async function handleDeleteAccount() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    // Note: actual user deletion requires a server action or API route calling admin API
    toast.info('Account deletion requested. Contact support to complete.')
    setDeleting(false)
    setDeleteOpen(false)
  }

  return (
    <Tabs defaultValue="account">
      <TabsList className="mb-6">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="danger">Danger zone</TabsTrigger>
      </TabsList>

      {/* Account */}
      <TabsContent value="account" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Account ID</p>
                <p className="text-sm text-muted-foreground font-mono text-xs">{user.id}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Member since</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Billing */}
      <TabsContent value="billing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
            <CardDescription>Your current subscription.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{isPro ? 'Pro' : 'Free'} plan</p>
                <p className="text-sm text-muted-foreground">
                  {isPro ? 'Full access to all features.' : 'Limited access. Upgrade to unlock everything.'}
                </p>
              </div>
              <Badge variant={isPro ? 'default' : 'secondary'}>{isPro ? 'Pro' : 'Free'}</Badge>
            </div>
            <Separator />
            {!isStripeEnabled ? (
              <p className="text-sm text-muted-foreground">
                Billing is not configured. Set <code className="bg-muted px-1 rounded text-xs">STRIPE_SECRET_KEY</code> to enable.
              </p>
            ) : isPro ? (
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Manage billing
              </Button>
            ) : (
              <Button onClick={handleUpgrade} disabled={upgrading}>
                {upgrading ? 'Redirecting…' : 'Upgrade to Pro'}
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Email notifications</CardTitle>
            <CardDescription>Choose what emails you receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { id: 'marketing', label: 'Product updates', description: 'News, features, and announcements.' },
              { id: 'security', label: 'Security alerts', description: 'Login from new devices or locations.' },
              { id: 'billing', label: 'Billing updates', description: 'Receipts and subscription changes.' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">{item.label}</Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  id={item.id}
                  defaultChecked={item.id !== 'marketing'}
                  onCheckedChange={(checked) =>
                    toast.success(`${item.label} ${checked ? 'enabled' : 'disabled'}`)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Danger zone */}
      <TabsContent value="danger" className="space-y-4">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger zone</CardTitle>
            <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data.
                </p>
              </div>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                  Delete account
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete account?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your account and all associated data.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                      {deleting ? 'Deleting…' : 'Delete my account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
