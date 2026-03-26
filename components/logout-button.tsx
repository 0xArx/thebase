'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'button' | 'menu-item'
}

export default function LogoutButton({ variant = 'button' }: LogoutButtonProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (variant === 'menu-item') {
    return (
      <button
        onClick={handleLogout}
        className="flex w-full items-center px-2 py-1.5 text-sm cursor-pointer text-red-600 hover:text-red-700"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </button>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Sign out
    </Button>
  )
}
