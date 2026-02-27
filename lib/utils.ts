import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
export const getTimestamp = () => Date.now()

/** Smart currency format: ₹10 for whole, ₹10.50 for decimals */
export const formatAmount = (n: number): string => {
    const abs = Math.abs(n)
    return abs % 1 === 0 ? `₹${abs.toFixed(0)}` : `₹${abs.toFixed(2)}`
}
