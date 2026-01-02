
'use client'

import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12
py-6 sm:py-8 md:py-10 lg:py-16
pb-0
">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-24 items-center">

                    {/* Left Col: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-5 relative group"
                    >
                        <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted max-w-md mx-auto md:max-w-none">
                            <img
                                src="https://i.ibb.co/s9MsP8Mm/1583756508787-e-1768435200-v-beta-t-CVlk-NFo-Ko-Iz2-D-y0r-GZm-Z-4p-MKu-a-A-j-F7-FYJe70-ZA.jpg"
                                alt="Joshua Aaron Philip"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
                        </div>
                        {/* Decorative Detail */}
                        <div className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
                    </motion.div>

                    {/* Right Col: Content */}
                    <div className="md:col-span-7 space-y-6 sm:space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
                                Joshua Philip
                            </h1>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground tracking-tight">
                                Senior Analyst. Problem Solver.
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground border-l-2 border-primary/20 pl-4 sm:pl-6"
                        >
                            <p>
                                Accomplished Senior Analyst with a track record of success, including two Sirius Awards and a Decision Problem Solver Award.
                            </p>
                            <p>
                                I specialize in crafting insightful reports and dashboards, streamlining deployment through automated data cleaning and transformation to ensure rapid, precise reporting.
                            </p>
                            <p>
                                Leveraging proficiency in automated ETL pipelines, scalable data models, and AI-driven processes, I elevate operational efficiency and propel business growth.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <Link href="/">
                                <Button size="lg" className="rounded-full px-6 sm:px-8 w-full sm:w-auto">
                                    Read Blog
                                </Button>
                            </Link>
                            <Link href="https://www.linkedin.com/in/joshua-aaron-067b27b6/" target="_blank">
                                <Button variant="outline" size="lg" className="rounded-full px-6 sm:px-8 group w-full sm:w-auto">
                                    Connect
                                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
