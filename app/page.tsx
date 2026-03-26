import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, ShieldCheck, Database, Palette, Rocket, Code2 } from 'lucide-react'
import { config } from '@/lib/config'

const features = [
  { icon: ShieldCheck, title: 'Auth built in', desc: 'Email, password, and OAuth — session management handled by Supabase.' },
  { icon: Database, title: 'Postgres + RLS', desc: 'Full relational database with row-level security. Safe by default.' },
  { icon: Palette, title: 'shadcn/ui', desc: 'Accessible components you own. Customize everything.' },
  { icon: Zap, title: 'Instant deploy', desc: 'Every push to main ships to production. Preview URLs on every branch.' },
  { icon: Code2, title: 'TypeScript first', desc: 'End-to-end type safety from DB schema to UI components.' },
  { icon: Rocket, title: 'Agentic ready', desc: 'Bootstrap any project with one command. Full CLI/AI control.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 border-b bg-background/90 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-black">{config.logo.letter}</span>
          </div>
          <span className="font-bold text-sm">{config.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login"><Button variant="ghost" size="sm" className="text-sm h-8">Sign in</Button></Link>
          <Link href="/signup"><Button size="sm" className="text-sm h-8 gap-1.5">Get started <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <Badge variant="outline" className="mb-6 text-xs px-3 py-1 gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
          Next.js · Supabase · shadcn/ui · Vercel
        </Badge>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6 max-w-3xl">
          {config.tagline.split(' in ')[0]} in<br />
          <span className="text-muted-foreground">hours, not weeks.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
          {config.description}
        </p>
        <div className="flex items-center gap-3">
          <Link href="/signup"><Button size="lg" className="gap-2 h-11 px-6">Start for free <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
          <Link href="/login"><Button size="lg" variant="outline" className="h-11 px-6">Sign in</Button></Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border shadow-sm">
            {features.map((f) => (
              <div key={f.title} className="bg-background p-6 hover:bg-muted/30 transition-colors group">
                <f.icon className="h-5 w-5 mb-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border bg-foreground text-background px-8 py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to build?</h2>
            <p className="text-background/50 text-sm mb-6">Create your account and have a live app in minutes.</p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2 h-11 px-6">
                Create your account <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <div className="h-5 w-5 rounded bg-foreground flex items-center justify-center">
              <span className="text-background text-[10px] font-black">{config.logo.letter}</span>
            </div>
            {config.name}
          </Link>
          <span>Built with Next.js · Supabase · shadcn/ui · Vercel</span>
        </div>
      </footer>
    </div>
  )
}
