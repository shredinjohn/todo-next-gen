
export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            <div className="relative flex flex-col items-center gap-8">
                {/* Simple Loader */}
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary animate-pulse">
                        Loading
                    </p>
                    <div className="h-[1px] w-12 bg-primary/20" />
                </div>
            </div>
        </div>
    )
}
