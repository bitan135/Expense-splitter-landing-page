"use client"
import Image from "next/image"

interface HeaderProps {
    title: string
    rightAction?: React.ReactNode
    children?: React.ReactNode
}

export function Header({ title, rightAction, children }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full glass-header pt-safe transition-all duration-200">
            <div className="flex h-14 items-center justify-between px-4 max-w-5xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 shrink-0 overflow-hidden rounded-[0.35rem] shadow-sm">
                        <Image src="/logo-flat.png" alt="Logo" fill className="object-cover" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-foreground truncate">
                        {title}
                    </h1>
                </div>
                {rightAction && <div>{rightAction}</div>}
            </div>
            {children}
        </header>
    )
}
