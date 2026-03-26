'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <p className="text-sm text-destructive bg-destructive/8 border border-destructive/15 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm">Password</Label>
          <Input id="password" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className="h-10" />
        </div>
        <Button type="submit" className="w-full h-10" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        No account?{' '}
        <Link href="/signup" className="text-foreground font-medium underline-offset-4 hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
