'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  User,
  Settings,
  CreditCard,
  HelpCircle,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

const bottomItems = [
  { href: '/dashboard/support', label: 'Help & Support', icon: HelpCircle },
]

export function SidebarNav() {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive(item.href, item.exact)
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="border-t p-3 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
