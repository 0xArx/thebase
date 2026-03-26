import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SidebarNav } from '@/components/sidebar-nav'
import { UserNav } from '@/components/user-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'The Base'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:flex-col md:w-60 border-r bg-background shrink-0">
        <div className="h-16 flex items-center px-4 border-b">
          <Link href="/dashboard" className="font-bold text-lg tracking-tight">
            {appName}
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 shrink-0 bg-background">
          <div className="flex items-center gap-2">
            <MobileNav />
            {/* Breadcrumb placeholder — pages can override via slot if needed */}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
