'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/sidebar-nav'
import { Menu } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <div className="h-16 flex items-center px-4 border-b font-bold text-lg">
          {process.env.NEXT_PUBLIC_APP_NAME ?? 'The Base'}
        </div>
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}
