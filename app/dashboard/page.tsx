import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowUpRight, Zap, ShieldCheck, Database, Rocket } from 'lucide-react'
import { config } from '@/lib/config'

export const metadata = { title: 'Dashboard' }

const steps = [
  { label: 'Run Supabase migrations', cmd: 'npm run db:push', done: false },
  { label: 'Add RESEND_API_KEY to enable email', done: false },
  { label: 'Add STRIPE_SECRET_KEY to enable billing', done: false },
  { label: 'Set NEXT_PUBLIC_SENTRY_DSN for error tracking', done: false },
  { label: 'Connect a custom domain in Vercel', done: false },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles').select('full_name, plan').eq('id', user!.id).single()

  const name = profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">{greeting}</p>
        <h1 className="text-2xl font-bold tracking-tight mt-0.5">{name} 👋</h1>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Auth', value: 'Active', icon: ShieldCheck, color: 'text-green-500' },
          { label: 'Database', value: 'Connected', icon: Database, color: 'text-blue-500' },
          { label: 'Plan', value: profile?.plan === 'pro' ? 'Pro' : 'Free', icon: Zap, color: 'text-amber-500' },
          { label: 'Deploy', value: 'Live', icon: Rocket, color: 'text-violet-500' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-none bg-muted/50 dark:bg-muted/20">
            <CardContent className="p-4">
              <s.icon className={`h-4 w-4 ${s.color} mb-3`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold mt-0.5">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checklist */}
      <div className="rounded-xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Get production-ready</h2>
          <Badge variant="outline" className="text-xs">{steps.filter(s => !s.done).length} left</Badge>
        </div>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold
                ${step.done ? 'border-green-500 bg-green-500 text-white' : 'border-border text-muted-foreground'}`}>
                {step.done ? '✓' : i + 1}
              </div>
              <div>
                <p className={`text-sm ${step.done ? 'line-through text-muted-foreground' : ''}`}>{step.label}</p>
                {step.cmd && !step.done && (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded mt-1 inline-block text-muted-foreground font-mono">
                    {step.cmd}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Read the Playbook', desc: 'Architecture, patterns, feature guide', href: config.links.docs },
          { label: 'View on GitHub', desc: 'Browse source or open an issue', href: config.github },
        ].map((link) => (
          <Link key={link.label} href={link.href}
            className="group flex items-center justify-between p-4 rounded-xl border hover:border-foreground/20 hover:bg-muted/40 transition-all">
            <div>
              <p className="text-sm font-medium">{link.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
