
'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { Loader2, ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const isNew = id === 'new'
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!isNew)
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [projectLink, setProjectLink] = useState('')
    const [content, setContent] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [published, setPublished] = useState(false)
    const [postType, setPostType] = useState('post')
    const [category, setCategory] = useState('Tech & Thoughts')
    const [uploading, setUploading] = useState(false)

    // Auto-generate slug from title if new
    useEffect(() => {
        if (isNew && title) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
    }, [title, isNew])

    useEffect(() => {
        if (!isNew) {
            fetchPost()
        }
    }, [id])

    const fetchPost = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            if (data) {
                setTitle(data.title)
                setSlug(data.slug)
                setExcerpt(data.excerpt || '')
                setProjectLink(data.project_link || '')
                setContent(data.content || '')
                setCoverImage(data.cover_image || '')
                setPublished(data.published)
                setPostType(data.type || 'post')
                setCategory(data.category || 'Tech & Thoughts')
            }
        } catch (error) {
            console.error('Error fetching post:', error)
            router.push('/admin')
        } finally {
            setFetching(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `covers/${fileName}`

            // Try to upload to 'blog-images' bucket
            const { error: uploadError, data } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file)

            if (uploadError) {
                // If bucket doesn't exist, this might fail. We should ideally prompt.
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath)

            setCoverImage(publicUrl)
        } catch (error: any) {
            console.error('Upload error:', error)
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const postData = {
                title,
                slug,
                excerpt,
                project_link: projectLink,
                content,
                cover_image: coverImage,
                published,
                type: postType,
                category: category,
                author_id: user.id
            }

            if (isNew) {
                const { error } = await supabase.from('posts').insert(postData)
                if (error) throw error
            } else {
                const { error } = await supabase.from('posts').update(postData).eq('id', id)
                if (error) throw error
            }

            // Explicitly alert success before redirecting to ensure user knows it worked
            alert('Post saved successfully!')

            router.push('/admin')
            router.refresh()
        } catch (error: any) {
            console.error('Error saving post:', error)
            console.error('Error details:', error.message, error.details || '')
            alert(`Failed to save post: ${error.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="min-h-screen bg-muted/40 pb-20">
            <div className="bg-background border-b border-border sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center w-full sm:w-auto gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold truncate flex-1">{isNew ? 'Create New Post' : 'Edit Post'}</h1>
                    </div>
                    <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
                        <div className="flex items-center gap-2 mr-2">
                            <Label className="text-sm text-gray-500 hidden xs:block">Status:</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPublished(!published)}
                                className={`w-28 transition-colors ${published
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200'
                                    }`}
                            >
                                {published ? 'Published' : 'Draft'}
                            </Button>
                        </div>
                        <Button onClick={handleSave} disabled={loading} className="bg-black text-white hover:bg-gray-800 flex-1 sm:flex-none">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            <span className="whitespace-nowrap">{isNew ? 'Create' : 'Save'}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title"
                                className="text-lg font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor content={content} onChange={setContent} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">Post Type</Label>
                            <select
                                id="type"
                                value={postType}
                                onChange={(e) => setPostType(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="post">Blog Post</option>
                                <option value="project">Project</option>
                            </select>
                        </div>
                        {postType !== 'project' && (
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="Straight Talk">Straight Talk</option>
                                    <option value="Tech & Thoughts">Tech & Thoughts</option>
                                </select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="post-url-slug"
                            />
                            <p className="text-xs text-gray-500">URL friendly name</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt / Description</Label>
                            <Textarea
                                id="excerpt"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Short summary for the card..."
                                className="min-h-[100px]"
                            />
                        </div>
                        {postType === 'project' && (
                            <div className="space-y-2">
                                <Label htmlFor="project_link">Project External Link</Label>
                                <Input
                                    id="project_link"
                                    value={projectLink}
                                    onChange={(e) => setProjectLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                />
                                <p className="text-xs text-gray-500">Direct link to the project site/repo</p>
                            </div>
                        )}
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="space-y-2">
                                <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
                                    <Upload className="h-4 w-4" />
                                    <span>Upload Cover Photo</span>
                                </Label>
                                <Input
                                    id="upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                {uploading && <div className="text-xs text-muted-foreground animate-pulse">Uploading image...</div>}
                            </div>

                            <div className="space-y-2 text-center text-xs text-muted-foreground">
                                <p>— OR —</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover">Cover Image URL</Label>
                                <Input
                                    id="cover"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            {coverImage && (
                                <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-100 border mt-2 relative group">
                                    <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setCoverImage('')}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
