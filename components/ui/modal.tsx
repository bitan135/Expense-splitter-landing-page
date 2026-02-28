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

    // Swipe-to-dismiss physics state
    const [dragY, setDragY] = React.useState(0)
    const isDragging = React.useRef(false)
    const startY = React.useRef(0)

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

    // Touch physics handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true
        startY.current = e.clientY
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return
        const delta = e.clientY - startY.current
        // Only allow dragging downwards
        if (delta > 0) {
            setDragY(delta)
        }
    }

    const handlePointerUp = () => {
        if (!isDragging.current) return
        isDragging.current = false
        // Threshold for dismissal: drag down by 150px
        if (dragY > 150) {
            onClose()
        } else {
            // Spring back to top
            setDragY(0)
        }
    }

    // Dynamic style for dragging
    const modalStyle = dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined
    // Combine base animation class. If we are touching, disable CSS transition to lock to finger.
    const animationClass = dragY > 0 ? '' : (animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0");

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
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
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={modalStyle}
                className={cn(
                    "relative w-full max-w-lg transform rounded-t-3xl bg-background px-6 pb-8 pt-3 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-h-[90vh] overflow-y-auto",
                    animationClass,
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
