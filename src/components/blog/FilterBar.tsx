'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export function FilterBar() {
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get('category') || 'All'

    const filters = [
        { name: 'All', value: null }, // distinct from string 'All' for cleaner URL if desired, or use 'All'
        { name: 'Straight Talk', value: 'Straight Talk' },
        { name: 'Tech', value: 'Tech' },
        // Add more if needed later
    ]

    return (
        <div className="flex items-center gap-6 mb-8 text-base font-medium">
            {filters.map((filter) => {
                const isActive = filter.value === currentCategory || (filter.value === null && !searchParams.get('category'))

                return (
                    <Link
                        key={filter.name}
                        href={filter.value ? `/?category=${encodeURIComponent(filter.value)}` : '/'}
                        className={cn(
                            "transition-colors hover:text-foreground/80",
                            isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        {filter.name}
                    </Link>
                )
            })}
        </div>
    )
}
