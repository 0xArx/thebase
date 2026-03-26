export const metadata = { title: 'Support' }

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Resources and documentation.</p>
      </div>
      <div className="grid gap-4">
        {[
          { title: 'Documentation', desc: 'Read PLAYBOOK.md for the full development guide.', href: '#' },
          { title: 'GitHub', desc: 'Browse the source code or open an issue.', href: 'https://github.com/0xArx/the-base' },
          { title: 'Email', desc: 'Reach out directly for support.', href: 'mailto:support@thebase.app' },
        ].map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="block border rounded-lg p-4 hover:bg-muted transition-colors"
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
