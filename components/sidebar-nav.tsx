'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Sparkles, HelpCircle } from 'lucide-react'

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/features', label: 'Features', icon: Sparkles },
]
const bottomNav = [
  { href: '/dashboard/support', label: 'Help & Support', icon: HelpCircle },
]

export function SidebarNav() {
  const pathname = usePathname()
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="flex flex-col h-full py-4">
      <div className="flex-1 px-3 space-y-0.5">
        {mainNav.map((item) => (
          <Link key={item.href} href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
              isActive(item.href, item.exact)
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}>
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="px-3 pt-4 border-t space-y-0.5">
        {bottomNav.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150">
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
