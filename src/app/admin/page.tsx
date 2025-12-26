
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminPostList } from '@/components/admin/AdminPostList'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch posts ordered by order_index ascending (custom order)
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-muted/40 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Manage your content and Drag to Reorder.</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Link href="/">
                            <Button variant="outline" className="flex-1 sm:flex-none">View Site</Button>
                        </Link>
                        <Link href="/admin/editor/new">
                            <Button className="flex-1 sm:flex-none">
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Button>
                        </Link>
                    </div>
                </header>

                <div>
                    <AdminPostList initialPosts={posts || []} />
                </div>
            </div>
        </div>
    )
}
