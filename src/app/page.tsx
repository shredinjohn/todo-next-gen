
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/blog/PostCard'
import { FilterBar } from '@/components/blog/FilterBar'
import { cn } from '@/lib/utils'

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: PageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const categoryFilter = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : null

  // Fetch posts ordered by custom order_index, then created_at
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .neq('type', 'project') // Explicitly exclude projects
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  if (categoryFilter === 'Straight Talk') {
    query = query.eq('category', 'Straight Talk')
  } else if (categoryFilter === 'Tech') {
    // "Tech" here is roughly equivalent to standard blogs + maybe others, 
    // but user requested "Tech" filter. 
    // Assumption: If category is NOT straight talk, it falls under the generic "Tech" umbrella or explicitly named Tech.
    // For now, if they select Tech, we might want to show everything EXCEPT Straight Talk, or strictly 'Tech'.
    // Given the previous code grouped everything else as "Blogs", we will treat "Tech" as "Not Straight Talk".
    query = query.neq('category', 'Straight Talk')
  }
  // If 'All' (categoryFilter is null), we fetch everything mixed.

  const { data: rawPosts } = await query
  const posts = rawPosts || []

  // Layout Logic:
  // 1. Featured: First post
  // 2. Sidebar: Next 3 posts
  // 3. Grid: Remaining posts
  const featuredPost = posts[0]
  const sidebarPosts = posts.slice(1, 4)
  const gridPosts = posts.slice(4)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-8 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12">

        {/* Header / Filter Section */}
        <div className="flex flex-col gap-6 mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Tech, AI & More...
          </h1>

          <FilterBar />
        </div>

        <div className="space-y-20 md:space-y-24">
          {/* === DESKTOP LAYOUT (Unified) === */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 lg:gap-x-6 relative">

              {/* Featured Post (Main) */}
              {featuredPost && (() => {
                // Estimate number of lines based on title length
                // Rough estimate: ~40-50 chars per line on desktop
                const titleLength = featuredPost.title.length
                const estimatedLines = Math.ceil(titleLength / 45)

                // Determine sticky position based on lines
                let stickyClass = 'top-0'
                if (estimatedLines === 2) stickyClass = '-top-12'
                else if (estimatedLines >= 3) stickyClass = '-top-24'

                return (
                  <div className="col-span-1 lg:col-span-3">
                    <div className={`sticky ${stickyClass} self-start`}>
                      <PostCard post={featuredPost} variant="featured" index={0} />
                    </div>
                  </div>
                )
              })()}

              {/* Sidebar Posts (Compact List) */}
              {sidebarPosts.length > 0 && (
                <div className="col-span-1 lg:col-span-1">
                  <div className={cn("flex flex-col gap-6", sidebarPosts.length > 1 && "sticky top-40 self-start")}>
                    {sidebarPosts.map((post, idx) => (
                      <div key={post.id} className="border-b border-border/40 pb-6 last:border-0 last:pb-0">
                        <PostCard post={post} variant="compact" index={idx + 1} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Grid Section */}
            {gridPosts.length > 0 && (
              <div className="border-t border-border/40 mt-12 pt-12">
                <div className="grid gap-x-8 gap-y-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post, idx) => (
                    <PostCard key={post.id} post={post} index={idx + 4} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
