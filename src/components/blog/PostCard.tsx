
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PostCardProps {
    post: {
        title: string
        slug: string
        excerpt: string | null
        cover_image: string | null
        created_at: string
        type?: string
    }
    variant?: 'default' | 'featured' | 'compact'
    index?: number
    className?: string
}

export function PostCard({ post, variant = 'default', index = 0, className }: PostCardProps) {
    const delay = index * 0.05 // Faster stagger

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    // Metadata Display Logic: Use Category if available, else Type
    // @ts-ignore - Assuming post might have category property from Supabase even if not in strict interface yet
    const categoryLabel = post.category || post.type || 'Article'

    if (variant === 'featured') {
        return (
            <Link href={`/blog/${post.slug}`} className={cn("group block w-full", className)}>
                <motion.article
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
                    className="flex flex-col gap-4 pb-6 lg:pb-0"
                >
                    {/* Featured aspect ratio: 1:1 on mobile, 16/9 on desktop */}
                    <div className="relative w-full aspect-[1/1] lg:aspect-[16/9] overflow-hidden rounded-md bg-muted select-none">
                        {post.cover_image && (
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover will-change-transform"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            <span>{categoryLabel}</span>
                            <span>&middot;</span>
                            <time>{formatDate(post.created_at)}</time>
                        </div>
                        <h2 className="text-xl md:text-3xl lg:text-[2.5rem] font-bold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors leading-[1.1]">
                            {post.title}
                        </h2>
                    </div>
                </motion.article>
            </Link>
        )
    }

    if (variant === 'compact') {
        return (
            <Link href={`/blog/${post.slug}`} className={cn("group block w-full", className)}>
                <motion.article
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
                    className="flex flex-col gap-3"
                >
                    {/* Sidebar aspect ratio: 1:1 */}
                    <div className="relative w-full aspect-[1/1] overflow-hidden rounded-md bg-muted select-none">
                        {post.cover_image && (
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover will-change-transform"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors leading-snug">
                            {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                            <span>{categoryLabel}</span>
                            <span>&middot;</span>
                            <time>{formatDate(post.created_at)}</time>
                        </div>
                    </div>
                </motion.article>
            </Link>
        )
    }

    // Default Grid Variant
    return (
        <Link href={`/blog/${post.slug}`} className={cn("group block w-full", className)}>
            <motion.article
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
                className="flex flex-col gap-3"
            >
                {/* Bottom Grid aspect ratio: 1:1 */}
                <div className="relative w-full aspect-[1/1] overflow-hidden rounded-md bg-muted select-none">
                    {post.cover_image && (
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover will-change-transform"
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors leading-snug">
                        {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                        <span>{categoryLabel}</span>
                        <span>&middot;</span>
                        <time>{formatDate(post.created_at)}</time>
                    </div>
                </div>
            </motion.article>
        </Link>
    )
}
