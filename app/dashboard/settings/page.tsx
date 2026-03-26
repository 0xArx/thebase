import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsTabs } from './settings-tabs'

export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, stripe_customer_id')
    .eq('id', user.id)
    .single()

  const isStripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>
      <SettingsTabs
        user={user}
        profile={profile}
        isStripeEnabled={isStripeEnabled}
      />
    </div>
  )
}
