import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import LogoutButton from '@/components/logout-button'
import { User, Settings } from 'lucide-react'

export async function UserNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? 'U').toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}>
        <Avatar className="h-9 w-9">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? ''} />}
          <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.full_name ?? 'My Account'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<span />}>
          <LogoutButton variant="menu-item" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
