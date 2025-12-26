'use client'

import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Project {
    id: string
    title: string
    slug: string
    excerpt: string
    cover_image: string
    type: string
    project_link?: string
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('published', true)
            .eq('type', 'project')
            .order('created_at', { ascending: false })

        if (data) {
            setProjects(data as Project[])
        }
        setLoading(false)
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-7xl space-y-8 animate-pulse">
                    <div className="h-16 w-64 bg-muted rounded-2xl" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64 bg-muted rounded-3xl" />
                        <div className="hidden md:block h-64 bg-muted rounded-3xl" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
        >
            <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-12">

                {projects.length > 0 ? (
                    <div className="max-w-7xl mx-auto">

                        {/* Heading */}
                        <div    >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
                            >
                                Selected Works
                            </motion.h1>
                        </div>

                        {/* MOBILE LIST VIEW (Responsive Mode) */}
                        <div className="flex md:hidden flex-col gap-12 sm:gap-16">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="group relative"
                                >
                                    {/* Landscape Aspect Ratio Card */}
                                    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-border bg-card shadow-2xl text-white">
                                        <img
                                            src={project.cover_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                            <div className="space-y-3">
                                                <h3 className="text-3xl font-bold tracking-tighter leading-none text-white">
                                                    {project.title}
                                                </h3>
                                                <p className="text-zinc-200 text-sm leading-relaxed line-clamp-2">
                                                    {project.excerpt}
                                                </p>
                                                <div className="flex flex-row items-center gap-3 pt-3 flex-wrap">
                                                    <Link href={`/blog/${project.slug}`}>
                                                        <Button className="rounded-full bg-white text-black py-6 px-8 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all border-0">
                                                            Read More
                                                        </Button>
                                                    </Link>
                                                    {project.project_link && (
                                                        <Link href={project.project_link} target="_blank">
                                                            <Button variant="outline" className="rounded-full border-white/20 bg-white/5 backdrop-blur-md py-6 px-8 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 text-white">
                                                                Link <ExternalLink className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* DESKTOP VIEW: PREMIUM CAROUSEL */}
                        <div className="hidden md:block relative">
                            <div className="relative h-[650px] flex items-center justify-center">
                                {[-1, 0, 1].map((offset) => {
                                    const index = (currentIndex + offset + projects.length) % projects.length
                                    const project = projects[index]
                                    if (projects.length === 1 && offset !== 0) return null
                                    if (projects.length === 2 && offset === -1) return null

                                    const isCenter = offset === 0

                                    return (
                                        <motion.div
                                            key={`${project.id}-carousel`}
                                            animate={{
                                                scale: isCenter ? 1 : 0.8,
                                                opacity: isCenter ? 1 : 0.4,
                                                zIndex: isCenter ? 30 : 10,
                                                x: offset * 450,
                                                y: isCenter ? 0 : 20
                                            }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className={`absolute w-[700px] aspect-[16/10] rounded-[3rem] overflow-hidden border border-border bg-black shadow-2xl group text-white ${isCenter ? 'cursor-default' : 'cursor-pointer'}`}
                                            onClick={() => {
                                                if (offset === -1) prevSlide()
                                                if (offset === 1) nextSlide()
                                            }}
                                        >
                                            <img
                                                src={project.cover_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                                            <div className={`absolute bottom-0 left-0 right-0 p-12 transition-all duration-500 ${isCenter ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                                <h2 className="text-6xl font-bold tracking-tighter mb-4">{project.title}</h2>
                                                <p className="text-zinc-200 max-w-lg mb-8 text-lg font-medium tracking-tight leading-snug line-clamp-2">{project.excerpt}</p>
                                                <div className="flex gap-4">
                                                    <Link href={`/blog/${project.slug}`}>
                                                        <Button className="rounded-full bg-white text-black py-7 px-10 text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform hover:bg-zinc-200 border-0">
                                                            Read More
                                                        </Button>
                                                    </Link>
                                                    {project.project_link && (
                                                        <Link href={project.project_link} target="_blank">
                                                            <Button variant="outline" className="rounded-full border-white/20 bg-white/5 backdrop-blur-md py-7 px-10 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors text-white">
                                                                Link <ExternalLink className="h-3 w-3" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Carousel Nav */}
                            <div className="mt-12 flex items-center justify-between">
                                <div className="flex gap-3">
                                    {projects.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-foreground w-12' : 'bg-muted-foreground/30 w-4'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={prevSlide} variant="outline" className="rounded-full h-14 w-14 p-0 border-input hover:bg-accent hover:text-accent-foreground bg-transparent text-foreground">
                                        <ArrowLeft className="h-6 w-6" />
                                    </Button>
                                    <Button onClick={nextSlide} variant="outline" className="rounded-full h-14 w-14 p-0 border-input hover:bg-accent hover:text-accent-foreground bg-transparent text-foreground">
                                        <ArrowRight className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-40 text-muted-foreground">No work found.</div>
                )}
            </div>
        </motion.div>
    )
}
