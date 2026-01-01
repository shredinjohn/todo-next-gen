'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavLink } from '@/components/ui/nav-link'
import { Github, Twitter, Menu, X } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { useState, useEffect } from 'react'

export function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                : 'border-b border-transparent bg-transparent'
                }`}
        >
            <div className="max-w-[1600px] mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6 md:px-10 lg:px-12">
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-lg sm:text-xl tracking-tighter">JOSHUA PHILIP.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <NavLink href="/">Blog</NavLink>
                        <NavLink href="/about">About</NavLink>
                        <NavLink href="/projects">Projects</NavLink>
                    </nav>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Desktop Social Icons */}
                    <div className="hidden sm:flex items-center space-x-2">
                        <Link href="https://github.com" target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Button>
                        </Link>
                        <Link href="https://twitter.com" target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
                                <Twitter className="h-4 w-4" />
                                <span className="sr-only">Twitter</span>
                            </Button>
                        </Link>
                    </div>

                    <ModeToggle />

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-8 w-8"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background">
                    <nav className="flex flex-col space-y-4 p-4">
                        <NavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                            Blog
                        </NavLink>
                        <NavLink href="/about" onClick={() => setMobileMenuOpen(false)}>
                            About
                        </NavLink>
                        <NavLink href="/projects" onClick={() => setMobileMenuOpen(false)}>
                            Projects
                        </NavLink>

                        {/* Mobile Social Links */}
                        <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                            <Link href="https://github.com" target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="sm">
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                            </Link>
                            <Link href="https://twitter.com" target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="sm">
                                    <Twitter className="h-4 w-4 mr-2" />
                                    Twitter
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
