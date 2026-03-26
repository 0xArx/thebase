import Link from 'next/link'
import { config } from '@/lib/config'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col bg-foreground text-background p-10 justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-background/10 border border-background/20 flex items-center justify-center">
            <span className="text-background text-sm font-black">{config.logo.letter}</span>
          </div>
          <span className="font-bold">{config.name}</span>
        </Link>
        <div className="space-y-4">
          <p className="text-2xl font-bold leading-snug text-background/90">
            {config.tagline}
          </p>
          <p className="text-sm text-background/50">{config.description}</p>
        </div>
        <p className="text-xs text-background/30">© {new Date().getFullYear()} {config.name}</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[360px]">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-black">{config.logo.letter}</span>
            </div>
            <span className="font-bold text-sm">{config.name}</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
