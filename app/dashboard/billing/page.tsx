import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Billing' }

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, stripe_customer_id')
    .eq('id', user.id)
    .single()

  const isPro = profile?.plan === 'pro'
  const isStripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your plan and payment details.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Your active subscription.</CardDescription>
            </div>
            <Badge variant={isPro ? 'default' : 'secondary'} className="capitalize">
              {profile?.plan ?? 'free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">{isPro ? 'Pro' : 'Free'}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${isPro ? 'text-green-600' : 'text-muted-foreground'}`}>
                {isPro ? 'Active' : 'No active subscription'}
              </span>
            </div>
          </div>

          {!isStripeEnabled ? (
            <p className="text-sm text-muted-foreground">
              Billing is not configured. Set{' '}
              <code className="bg-muted px-1 rounded text-xs">STRIPE_SECRET_KEY</code>{' '}
              in your environment to enable payments.
            </p>
          ) : isPro ? (
            <Link href="/api/stripe/portal" className={cn(buttonVariants({ variant: 'outline' }))}>
              Manage subscription →
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro to unlock all features.
              </p>
              <form action="/api/stripe/checkout" method="POST">
                <Button type="submit">Upgrade to Pro</Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
