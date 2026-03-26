'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ variant = 'button' }: { variant?: 'button' | 'menu-item' }) {
  const router = useRouter()
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  if (variant === 'menu-item') {
    return (
      <button onClick={handleLogout}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive cursor-pointer">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    )
  }
  return <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
}
