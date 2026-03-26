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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(80),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface Props {
  user: User
  profile: { full_name: string | null; avatar_url: string | null } | null
}

export function ProfileForm({ user, profile }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? 'U').toUpperCase()

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: profile?.full_name ?? '' },
  })

  async function onSubmit(values: ProfileFormValues) {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: values.full_name, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to update profile.')
    } else {
      toast.success('Profile updated.')
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Photo</CardTitle>
          <CardDescription>Your avatar shown across the app.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20 text-lg">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">
              Avatar URL can be set via your OAuth provider or updated directly in the database.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your name and email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" {...register('full_name')} placeholder="Jane Doe" />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email ?? ''} disabled className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Email changes require re-authentication. Contact support to update.
              </p>
            </div>
            <Separator />
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
