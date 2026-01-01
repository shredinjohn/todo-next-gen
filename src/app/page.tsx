
import { createClient } from '@/lib/supabase/server'
import { CategorySection } from '@/components/blog/CategorySection'
import { PostCard } from '@/components/blog/PostCard'
import { cn } from '@/lib/utils'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  // Fetch posts ordered by custom order_index, then created_at
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .neq('type', 'project') // Explicitly exclude projects
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  // Categorize posts
  const straightTalkPosts = posts?.filter(post => post.category === 'Straight Talk') || []
  const blogPosts = posts?.filter(post =>
    (post.category === 'Blogs' || !post.category || (post.category !== 'Straight Talk')) &&
    post.category !== 'Projects' // Extra safety check
  ) || []

  // Desktop Logic (Featured + Sidebar)
  const straightTalkFeatured = straightTalkPosts[0]
  const straightTalkSidebar = straightTalkPosts.slice(1, 4)
  const blogsFeatured = blogPosts[0]
  const blogsSidebar = blogPosts.slice(1, 4) // Next 3 posts

  // Remaining posts logic for desktop grid if needed
  const gridPosts = [
    ...straightTalkPosts.slice(4),
    ...blogPosts.slice(4)
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 md :py-12">
        <div className="space-y-16 sm:space-y-20 md:space-y-32">

          {/* === MOBILE LAYOUT (< lg) === */}
          <div className="lg:hidden space-y-12">
            <CategorySection title="Straight Talk" posts={straightTalkPosts} />
            <CategorySection title="Blogs" posts={blogPosts} />
          </div>


          {/* === DESKTOP LAYOUT (>= lg) === */}
          <div className="hidden lg:block space-y-32">

            {/* Section 1: Straight Talk */}
            <div>
              <div className="top-14 z-30 bg-background/95 backdrop-blur pb-4 pt-2 mb-8">
                <h1 className="sticky text-5xl font-extrabold tracking-tight text-foreground">
                  Straight Talk.
                </h1>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 lg:gap-x-6 relative">
                {/* Featured Post (Main) */}
                {straightTalkFeatured && (
                  <div className="col-span-1 lg:col-span-3">
                    <div className="sticky top-0 self-start">
                      <PostCard post={straightTalkFeatured} variant="featured" index={0} />
                    </div>
                  </div>
                )}

                {/* Sidebar Posts (Compact List) */}
                {straightTalkSidebar && straightTalkSidebar.length > 0 && (
                  <div className="col-span-1 lg:col-span-1">
                    <div className={cn("flex flex-col gap-6", straightTalkSidebar.length > 1 && "sticky top-40 self-start")}>
                      {straightTalkSidebar.map((post, idx) => (
                        <div key={post.id} className="border-b border-border/40 pb-6 last:border-0 last:pb-0">
                          <PostCard post={post} variant="compact" index={idx + 1} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Blogs */}
            {blogsFeatured && (
              <div className="border-t border-border/40">
                <div className="top-14 z-30 bg-background/95 backdrop-blur pb-4 pt-2 mb-8">
                  <h2 className="text-5xl font-extrabold tracking-tight text-foreground">
                    Blogs.
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 lg:gap-x-6 relative">
                  {/* Featured Post (Main) */}
                  <div className="col-span-1 lg:col-span-3">
                    <div className="sticky top-12 self-start">
                      <PostCard post={blogsFeatured} variant="featured" index={0} />
                    </div>
                  </div>

                  {/* Sidebar Posts (Compact List) */}
                  {blogsSidebar && blogsSidebar.length > 0 && (
                    <div className="col-span-1 lg:col-span-1">
                      <div className={cn("flex flex-col gap-6", blogsSidebar.length > 1 && "sticky top-40 self-start")}>
                        {blogsSidebar.map((post, idx) => (
                          <div key={post.id} className="border-b border-border/40 pb-6 last:border-0 last:pb-0">
                            <PostCard post={post} variant="compact" index={idx + 1} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Section: Standard Grid - Optional for Desktop if posts > 4 */}
            {gridPosts && gridPosts.length > 0 && (
              <div className="pt-16 border-t border-border/40">
                <div className="grid gap-x-8 gap-y-12 grid-cols-3">
                  {gridPosts.map((post, idx) => (
                    <PostCard key={post.id} post={post} index={idx} />
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
