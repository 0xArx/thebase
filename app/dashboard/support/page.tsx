import { config } from '@/lib/config'

export const metadata = { title: 'Support' }

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Resources and documentation.</p>
      </div>
      <div className="grid gap-3">
        {[
          { title: 'Playbook', desc: 'How to add features, architecture, patterns.', href: '#' },
          { title: 'GitHub', desc: 'Browse source code or open an issue.', href: config.github },
          { title: 'Email support', desc: 'Reach out directly.', href: config.links.support },
        ].map((item) => (
          <a key={item.title} href={item.href}
            className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/40 transition-colors group"
            target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
            <div>
              <p className="text-sm font-medium group-hover:text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
