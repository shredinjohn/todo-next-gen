'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavLink } from '@/components/ui/nav-link'
import { Github, Twitter, Menu, X, Linkedin } from 'lucide-react'
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
                        <span className="font-bold text-lg sm:text-xl tracking-tighter">JOSHUA PHILIP</span>
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
                        <Link href="https://www.linkedin.com/in/joshua-aaron-067b27b6/" target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.22-.6-1.93-1.84-1.93-1 0-1.62.67-1.62 1.93V19h-3v-9h3v1.2c.49-.62 1.23-1.06 2.59-1.06 1.95 0 3.87 1.21 3.87 5.1z" />
                                </svg>
                                <span className="sr-only">LinkedIn</span>
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
                            <Link href="https://www.linkedin.com/in/joshua-aaron-067b27b6/" target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4 mr-2"
                                    >
                                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.22-.6-1.93-1.84-1.93-1 0-1.62.67-1.62 1.93V19h-3v-9h3v1.2c.49-.62 1.23-1.06 2.59-1.06 1.95 0 3.87 1.21 3.87 5.1z" />
                                    </svg>
                                    LinkedIn
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
