export const metadata = { title: 'Features' }

export default function FeaturesPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Features</h1>
        <p className="text-muted-foreground">Your product features go here.</p>
      </div>
      <div className="rounded-xl border border-dashed p-16 text-center">
        <p className="text-sm text-muted-foreground">
          Add your first feature page in{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">app/dashboard/features/</code>
        </p>
      </div>
    </div>
  )
}
