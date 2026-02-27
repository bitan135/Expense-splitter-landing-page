"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const [show, setShow] = React.useState(isOpen)
    const [animate, setAnimate] = React.useState(false)

    React.useEffect(() => {
        if (isOpen) {
            setShow(true)
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden'
            setTimeout(() => setAnimate(true), 10)
        } else {
            setAnimate(false)
            document.body.style.overflow = ''
            setTimeout(() => setShow(false), 200)
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!show) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 transition-opacity duration-200",
                    animate ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />
            {/* Bottom Sheet */}
            <div
                className={cn(
                    "relative w-full max-w-lg transform rounded-t-3xl bg-background px-6 pb-8 pt-3 shadow-2xl transition-all duration-200 ease-out max-h-[90vh] overflow-y-auto",
                    animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
                    className
                )}
            >
                {/* Drag Handle */}
                <div className="flex justify-center mb-4">
                    <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors -mr-1"
                    >
                        <X className="h-5 w-5 opacity-50" />
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    )
}
