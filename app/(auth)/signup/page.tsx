'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${location.origin}/dashboard` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true); setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-5">
        <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            We sent a link to <strong className="text-foreground">{email}</strong>.<br />
            Click it to activate your account.
          </p>
        </div>
        <Link href="/login"><Button variant="outline" className="w-full">Back to sign in</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-1">Free to start. No credit card needed.</p>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
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
          <Input id="password" type="password" placeholder="Min. 6 characters"
            value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" className="h-10" />
        </div>
        <Button type="submit" className="w-full h-10" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
