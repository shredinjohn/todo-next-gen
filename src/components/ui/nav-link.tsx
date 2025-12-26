
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface NavLinkProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
    href: string
    children: React.ReactNode
}

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={cn(
                "relative text-sm font-medium transition-colors hover:text-foreground/80 py-1",
                isActive ? "text-foreground" : "text-muted-foreground",
                className
            )}
            {...props}
        >
            <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {children}
            </motion.span>
            {isActive && (
                <motion.div
                    layoutId="navbar-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </Link>
    )
}
