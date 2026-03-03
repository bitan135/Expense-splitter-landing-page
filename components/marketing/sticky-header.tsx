"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function StickyHeader() {
    const { scrollY } = useScroll();

    // Header appears only after scrolling down 400px
    const opacity = useTransform(scrollY, [300, 400], [0, 1]);
    const y = useTransform(scrollY, [300, 400], [-50, 0]);
    const pointerEvents = useTransform(scrollY, [300, 400], ["none", "auto"]);

    return (
        <motion.header
            style={{ opacity, y, pointerEvents: pointerEvents as any }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-background/80 backdrop-blur-lg border-b border-border/50"
        >
            <div className="flex items-center gap-2 font-bold tracking-tight">
                <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-md shadow-sm">
                    <Image src="/logo-flat.png" alt="Expense Splitter Logo" fill className="object-cover" />
                </div>
                <span className="hidden sm:inline-block">Expense Splitter</span>
            </div>

            <a
                href="https://expense-splitter-rose.vercel.app/"
                className="h-9 px-4 text-sm font-bold rounded-full shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all active:scale-95 flex items-center justify-center"
            >
                Get Started
                <ArrowRight size={14} className="ml-1.5" />
            </a>
        </motion.header>
    );
}
