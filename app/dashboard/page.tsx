import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-2xl">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-green-700 bg-green-50">Authenticated</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Plan</CardDescription>
            <CardTitle className="text-2xl">Free</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Hobby</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Database</CardDescription>
            <CardTitle className="text-2xl">Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-blue-700 bg-blue-50">Connected</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
          <CardDescription>Next steps to customize The Base for your product</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
            <li>Read <code className="bg-gray-100 px-1 rounded">PLAYBOOK.md</code> for the full development guide</li>
            <li>Add your Supabase tables in <code className="bg-gray-100 px-1 rounded">supabase/migrations/</code></li>
            <li>Customize the landing page in <code className="bg-gray-100 px-1 rounded">app/page.tsx</code></li>
            <li>Add your product features in <code className="bg-gray-100 px-1 rounded">app/dashboard/</code></li>
            <li>Configure your domain in the Vercel dashboard</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
