"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
    id: string
    title: string
    message?: string
    type?: ToastType
    duration?: number
    onClose: (id: string) => void
}

const ICONS = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-destructive" />,
    info: <Info className="w-5 h-5 text-blue-500" />
}

export function Toast({ id, title, message, type = "info", duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true))

        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300) // Wait for exit animation
        }, duration)

        return () => clearTimeout(timer)
    }, [id, duration, onClose])

    return (
        <div
            className={cn(
                "pointer-events-auto flex w-full max-w-md rounded-[20px] glass-header border border-border/50 shadow-2xl p-4 mb-3 items-start gap-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-full opacity-0 scale-95"
            )}
        >
            <div className="shrink-0 pt-0.5">{ICONS[type]}</div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-foreground">{title}</p>
                {message && <p className="text-sm text-muted-foreground leading-snug">{message}</p>}
            </div>
            <button
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(() => onClose(id), 300)
                }}
                className="shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors"
            >
                <X className="w-4 h-4 text-muted-foreground" />
            </button>
        </div>
    )
}

// Global Toast Manager
interface ToastMessage extends Omit<ToastProps, "onClose"> { }

let toastCount = 0
export const toast = {
    messages: [] as ToastMessage[],
    listeners: new Set<(messages: ToastMessage[]) => void>(),

    success: (title: string, message?: string) => toast.show({ id: String(++toastCount), title, message, type: "success" }),
    error: (title: string, message?: string) => toast.show({ id: String(++toastCount), title, message, type: "error" }),
    info: (title: string, message?: string) => toast.show({ id: String(++toastCount), title, message, type: "info" }),

    show: (msg: ToastMessage) => {
        toast.messages = [...toast.messages, msg]
        toast.notify()
    },

    remove: (id: string) => {
        toast.messages = toast.messages.filter(m => m.id !== id)
        toast.notify()
    },

    notify: () => {
        toast.listeners.forEach(listener => listener(toast.messages))
    }
}

export function ToastProvider() {
    const [messages, setMessages] = React.useState<ToastMessage[]>([])

    React.useEffect(() => {
        const listener = (msgs: ToastMessage[]) => setMessages([...msgs])
        toast.listeners.add(listener)
        return () => { toast.listeners.delete(listener) }
    }, [])

    if (messages.length === 0) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[200] flex flex-col items-center pt-safe px-4 pointer-events-none w-full sm:right-4 sm:left-auto sm:top-4 sm:pt-0 sm:items-end sm:max-w-md">
            {messages.map(msg => (
                <Toast key={msg.id} {...msg} onClose={toast.remove} />
            ))}
        </div>
    )
}
