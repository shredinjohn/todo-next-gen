
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

    if (variant === 'featured') {
        return (
            <Link href={`/blog/${post.slug}`} className={cn("group block w-full", className)}>
                <motion.article
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                >
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-muted">
                        {post.cover_image && (
                            <motion.img
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            <span>{post.type || 'Product'}</span>
                            <span>&middot;</span>
                            <time>{formatDate(post.created_at)}</time>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground group-hover:underline decoration-1 underline-offset-4 leading-tight">
                            {post.title}
                        </h2>
                    </div>
                </motion.article>
            </Link>
        )
    }

    // Default Variant (OpenAI Grid Card)
    return (
        <Link href={`/blog/${post.slug}`} className={cn("group block w-full", className)}>
            <motion.article
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
                className="flex flex-col gap-3"
            >
                <div className="relative w-full aspect-square overflow-hidden rounded-md bg-muted">
                    {post.cover_image && (
                        <motion.img
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline decoration-1 underline-offset-4 leading-snug">
                        {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="capitalize">{post.type || 'Research'}</span>
                        <time>{formatDate(post.created_at)}</time>
                    </div>
                </div>
            </motion.article>
        </Link>
    )
}
