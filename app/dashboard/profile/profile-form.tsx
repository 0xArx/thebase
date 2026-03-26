'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const schema = z.object({ full_name: z.string().min(1, 'Name is required').max(80) })
type Values = z.infer<typeof schema>

interface Props {
  user: User
  profile: { full_name: string | null; avatar_url: string | null } | null
}

export function ProfileForm({ user, profile }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? 'U').toUpperCase()

  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: profile?.full_name ?? '' },
  })

  async function onSubmit(values: Values) {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles')
      .update({ full_name: values.full_name, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setSaving(false)
    if (error) { toast.error('Failed to save.'); return }
    toast.success('Profile saved.')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-border">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
          <AvatarFallback className="bg-foreground text-background font-bold text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{profile?.full_name ?? 'No name set'}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" {...register('full_name')} placeholder="Jane Doe" autoComplete="name" className="h-10" />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email-display">Email</Label>
          <Input id="email-display" value={user.email ?? ''} disabled className="h-10 bg-muted text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
        </div>
      </div>

      <Button type="submit" disabled={saving} className="w-24">
        {saving ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}
