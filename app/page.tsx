import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const features = [
  {
    title: 'Authentication',
    description: 'Email/password login out of the box via Supabase Auth. Session management handled automatically.',
    icon: '🔐',
  },
  {
    title: 'Database',
    description: 'Postgres database with row-level security. Type-safe queries and real-time subscriptions included.',
    icon: '🗄️',
  },
  {
    title: 'UI Components',
    description: 'Accessible shadcn/ui components built on Radix primitives. Fully customizable to your brand.',
    icon: '🎨',
  },
  {
    title: 'Deployed on Vercel',
    description: 'Edge network, automatic CI/CD from GitHub, preview deploys on every PR. Zero-config performance.',
    icon: '⚡',
  },
  {
    title: 'TypeScript First',
    description: 'End-to-end type safety from database schema to UI components. Catch bugs at compile time.',
    icon: '🛡️',
  },
  {
    title: 'Production Ready',
    description: 'Middleware-based auth guards, server components, and optimized bundle. Ship from day one.',
    icon: '🚀',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">The Base</span>
            <Badge variant="secondary" className="text-xs">v1.0</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        <Badge variant="outline" className="mb-6 text-sm px-4 py-1">
          Next.js · Supabase · shadcn/ui · Vercel
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
          Your startup&apos;s
          <br />
          <span className="text-gray-400">foundation, complete.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          The Base gives you auth, database, UI, and hosting in one opinionated template.
          Stop configuring. Start building what matters.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="px-8">Start for free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8">Sign in</Button>
          </Link>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need, nothing you don&apos;t</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Each piece chosen for production use at scale, not just demos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border border-gray-100 hover:border-gray-200 transition-colors">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to build?</h2>
        <p className="text-gray-500 text-lg mb-8">Create your account and get started in minutes.</p>
        <Link href="/signup">
          <Button size="lg" className="px-10">Create your account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between">
          <span className="font-semibold text-gray-900">The Base</span>
          <p className="text-gray-400 text-sm">Built with Next.js, Supabase, shadcn/ui, and Vercel.</p>
        </div>
      </footer>
    </div>
  )
}
