'use client'

import { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor,
    MouseSensor
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Calendar, Eye, Trash2, Edit2, GripVertical, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ITEMS_PER_PAGE = 20

interface Post {
    id: string
    title: string
    excerpt: string
    cover_image: string
    created_at: string
    slug: string
    published: boolean
    category: string
    type: string
    order_index: number
}

interface AdminPostListProps {
    initialPosts: Post[]
}

function SortablePost({ post, onDelete }: { post: Post, onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: post.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="touch-pan-y">
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 border-border bg-card mb-4">
                <div className="flex items-center p-4 sm:p-6 gap-4 sm:gap-6">
                    {/* Drag Handle */}
                    <div {...attributes} {...listeners} className="cursor-move text-muted-foreground hover:text-foreground touch-none p-1">
                        <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="h-16 w-24 sm:h-24 sm:w-32 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative hidden sm:block">
                        {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <FileText className="h-6 w-6" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${post.published
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                {post.published ? 'Published' : 'Draft'}
                            </span>
                            {post.type === 'project' && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    Project
                                </span>
                            )}
                            <span className="flex items-center text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-secondary text-secondary-foreground">
                                {post.category || 'Uncategorized'}
                            </span>
                        </div>
                        <h3 className="font-semibold text-base sm:text-xl text-foreground truncate mb-1">
                            {post.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm truncate">
                            {post.excerpt || 'No excerpt'}
                        </p>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" title="View" className="h-8 w-8 sm:h-9 sm:w-9">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/admin/editor/${post.id}`}>
                            <Button variant="ghost" size="icon" title="Edit" className="h-8 w-8 sm:h-9 sm:w-9">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            className="h-8 w-8 sm:h-9 sm:w-9 text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => onDelete(post.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export function AdminPostList({ initialPosts }: AdminPostListProps) {
    // Sort initial posts by order_index, then created_at
    const sortedInitial = [...initialPosts].sort((a, b) => {
        if (a.order_index === b.order_index) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return (a.order_index || 0) - (b.order_index || 0)
    })

    const [posts, setPosts] = useState(sortedInitial)
    const [activeTab, setActiveTab] = useState('blogs')
    const [searchQuery, setSearchQuery] = useState('')
    const [pageStates, setPageStates] = useState<Record<string, number>>({})
    const supabase = createClient()

    // Get current page for active tab (default 1)
    const currentPage = pageStates[activeTab] || 1

    const setPage = (page: number) => {
        setPageStates(prev => ({
            ...prev,
            [activeTab]: page
        }))
    }

    // Configure sensors to allow scrolling
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return

        // Optimistic update
        setPosts(prev => prev.filter(p => p.id !== id))

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting post:', error)
            alert('Failed to delete post. Please refresh.')
            // Ideally revert state here, but simple refresh alert is safe for now
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setPosts((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)

                // Update database
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order_index: index,
                }))

                // Fire and forget update
                updates.forEach(async (update) => {
                    await supabase
                        .from('posts')
                        .update({ order_index: update.order_index })
                        .eq('id', update.id)
                })

                return newItems
            })
        }
    }

    // Filter posts for sorting context
    // Projects: Type is project OR category is Projects
    const projects = posts.filter(p => p.type === 'project' || p.category === 'Projects')

    // Straight Talk: Category is Straight Talk AND NOT a project
    const straightTalk = posts.filter(p => p.category === 'Straight Talk' && p.type !== 'project')

    // Blogs: NOT a project, NOT Straight Talk
    const blogs = posts.filter(p =>
        (p.type !== 'project') &&
        (p.category !== 'Projects') &&
        (p.category !== 'Straight Talk')
    )

    const getList = () => {
        let list = []
        if (activeTab === 'projects') list = projects
        else if (activeTab === 'straight-talk') list = straightTalk
        else list = blogs

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase()
            return list.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                (p.excerpt && p.excerpt.toLowerCase().includes(lowerQuery))
            )
        }
        return list
    }

    const filteredList = getList()

    // Pagination Calculations
    const totalItems = filteredList.length
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
    const effectivePage = Math.min(Math.max(1, currentPage), totalPages)

    // Slice current page
    const paginatedList = filteredList.slice(
        (effectivePage - 1) * ITEMS_PER_PAGE,
        effectivePage * ITEMS_PER_PAGE
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <Tabs defaultValue="blogs" onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="blogs">Blogs</TabsTrigger>
                        <TabsTrigger value="straight-talk">Straight Talk</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setPage(1)
                        }}
                        className="pl-8"
                    />
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={paginatedList.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {paginatedList.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                No posts found.
                            </div>
                        ) : (
                            paginatedList.map((post) => (
                                <SortablePost
                                    key={post.id}
                                    post={post}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                        Page {effectivePage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(effectivePage - 1)}
                            disabled={effectivePage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(effectivePage + 1)}
                            disabled={effectivePage >= totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
