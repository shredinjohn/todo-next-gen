'use client'

import { useState } from 'react'
import { PostCard } from './PostCard'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    cover_image: string | null
    created_at: string
}

interface CategorySectionProps {
    title: string
    posts: BlogPost[]
}

export function CategorySection({ title, posts }: CategorySectionProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Layout configuration
    // First 3: Large Squares (1:1)
    const largePosts = posts.slice(0, 3)
    // Next 4: Small Squares
    const smallPosts = posts.slice(3, 7)
    // The rest: Hidden initially
    const hiddenPosts = posts.slice(7)

    const hasHiddenPosts = hiddenPosts.length > 0

    return (
        <section className="space-y-8 lg:space-y-12 border-t first:border-0 border-border/40 py-12 lg:py-16">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                    {title}.
                </h2>
            </div>

            <div className="space-y-8">
                {/* Large Grid (First 3) */}
                {largePosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {largePosts.map((post, idx) => (
                            <PostCard key={post.id} post={post} variant="default" index={idx} />
                        ))}
                    </div>
                )}

                {/* Small Grid (Next 4) */}
                {smallPosts.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {smallPosts.map((post, idx) => (
                            <div key={post.id}>
                                <PostCard post={post} variant="compact" index={idx + 3} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Expanded Grid (The Rest) */}
                {isExpanded && hasHiddenPosts && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        {hiddenPosts.map((post, idx) => (
                            <div key={post.id}>
                                <PostCard post={post} variant="compact" index={idx + 7} />
                            </div>
                        ))}
                    </div>
                )}

                {/* View More Button */}
                {hasHiddenPosts && (
                    <div className="pt-4 flex justify-center">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="rounded-full px-8"
                        >
                            {isExpanded ? (
                                <>Show Less</>
                            ) : (
                                <>
                                    View More <ChevronDown className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground">No posts available in this section.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
