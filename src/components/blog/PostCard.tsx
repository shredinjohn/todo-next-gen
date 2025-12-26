
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface PostCardProps {
    post: {
        title: string
        slug: string
        excerpt: string | null
        cover_image: string | null
        created_at: string
    }
    variant?: 'default' | 'featured' | 'compact'
    index?: number
}

export function PostCard({ post, variant = 'default', index = 0 }: PostCardProps) {
    const delay = index * 0.1

    if (variant === 'featured') {
        return (
            <Link href={`/blog/${post.slug}`} className="group block h-full">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black isolate"
                >
                    {post.cover_image && (
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 scale-[1.01]"
                            />
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                            <span className="bg-primary px-2 py-0.5 rounded text-primary-foreground text-xs uppercase tracking-wider">Featured</span>
                            <time suppressHydrationWarning>
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white leading-tight group-hover:underline decoration-2 underline-offset-4">
                            {post.title}
                        </h2>
                    </div>
                </motion.article>
            </Link>
        )
    }

    if (variant === 'compact') {
        return (
            <Link href={`/blog/${post.slug}`} className="group block">
                <motion.article
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: delay, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-square overflow-hidden rounded-lg bg-black isolate"
                >
                    {post.cover_image && (
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 scale-[1.01]"
                            />
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col gap-1">
                        <time className="text-xs text-white/80 font-medium" suppressHydrationWarning>
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                        <h2 className="text-base font-bold tracking-tight text-white group-hover:underline decoration-2 underline-offset-2 line-clamp-2 leading-tight">
                            {post.title}
                        </h2>
                    </div>
                </motion.article>
            </Link>
        )
    }

    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-square overflow-hidden rounded-xl bg-black isolate"
            >
                {post.cover_image && (
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 scale-[1.01]"
                        />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col gap-2">
                    <time className="text-xs text-white/80 font-medium" suppressHydrationWarning>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </time>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:underline decoration-2 underline-offset-4 line-clamp-2">
                        {post.title}
                    </h2>
                </div>
            </motion.article>
        </Link>
    )
}
