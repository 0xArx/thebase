'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/sidebar-nav'
import { Menu } from 'lucide-react'
import { config } from '@/lib/config'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden h-8 w-8" />}>
        <Menu className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <div className="h-14 flex items-center px-4 border-b">
          <div className="flex items-center gap-2 font-bold text-sm">
            <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-black">{config.logo.letter}</span>
            </div>
            {config.name}
          </div>
        </div>
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}
