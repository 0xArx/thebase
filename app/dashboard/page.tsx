import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

const checklist = [
  { label: 'Copy .env.example to .env.local and fill in all values', done: true },
  { label: 'Run the initial Supabase migration (supabase/migrations/)', done: false },
  { label: 'Add RESEND_API_KEY to enable email', done: false },
  { label: 'Add STRIPE_SECRET_KEY to enable billing', done: false },
  { label: 'Add NEXT_PUBLIC_SENTRY_DSN to enable error tracking', done: false },
  { label: 'Enable OAuth providers in Supabase → Auth → Providers', done: false },
  { label: 'Connect a custom domain in Vercel dashboard', done: false },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user!.id)
    .single()

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {displayName}</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your project.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Plan</CardDescription>
            <CardTitle className="text-2xl capitalize">{profile?.plan ?? 'Free'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              {profile?.plan === 'pro' ? '✓ Pro access' : 'Upgrade for more'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Auth</CardDescription>
            <CardTitle className="text-2xl">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400">
              Authenticated
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Database</CardDescription>
            <CardTitle className="text-2xl">Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400">
              Connected
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Setup checklist */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Setup checklist</CardTitle>
              <CardDescription>Complete these steps to get production-ready</CardDescription>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">
                Settings <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-start gap-3 text-sm">
                <CheckCircle2
                  className={`h-4 w-4 mt-0.5 shrink-0 ${item.done ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}
                />
                <span className={item.done ? 'line-through text-muted-foreground' : ''}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
