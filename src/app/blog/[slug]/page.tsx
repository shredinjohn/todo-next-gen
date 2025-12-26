
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!post) {
        notFound()
    }

    return {
        title: `${post.title} | Joshua Aaron`,
        description: post.excerpt || `Read ${post.title} on Joshua Aaron's blog.`,
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read ${post.title} on Joshua Aaron's blog.`,
            type: 'article',
            publishedTime: post.created_at,
            authors: ['Joshua Aaron'],
            images: post.cover_image ? [{ url: post.cover_image }] : undefined,
        },
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-muted/30 border-b border-border/40">
                <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
                    <Link href="/" className="inline-block mb-6 sm:mb-8">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-foreground text-muted-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Blog
                        </Button>
                    </Link>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                            <time dateTime={post.created_at}>
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            <span>•</span>
                            <span>By Admin</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                {post.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
                {post.cover_image && (
                    <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-muted shadow-sm">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className="prose prose-base sm:prose-lg dark:prose-invert prose-gray max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-a:text-foreground prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:block
            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />
            </div>
        </article>
    )
}
