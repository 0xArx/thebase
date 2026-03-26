import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SidebarNav } from '@/components/sidebar-nav'
import { UserNav } from '@/components/user-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { config } from '@/lib/config'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen bg-muted/40 dark:bg-zinc-950">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-background focus:text-foreground focus:text-sm focus:rounded-md focus:shadow">
        Skip to main content
      </a>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:flex-col md:w-56 shrink-0 p-3 pr-0">
        <div className="flex flex-col h-full rounded-xl border bg-background shadow-sm overflow-hidden">
          <div className="h-14 flex items-center px-4 border-b shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm tracking-tight">
              <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center shrink-0">
                <span className="text-background text-xs font-black">{config.logo.letter}</span>
              </div>
              {config.name}
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <SidebarNav />
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden p-3 gap-3">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-4 rounded-xl border bg-background shadow-sm shrink-0">
          <MobileNav />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 min-h-0 rounded-xl border bg-background shadow-sm overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
