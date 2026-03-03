"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
    imageSrc: string;
    alt: string;
    className?: string;
    float?: boolean;
    delay?: number;
}

export function DeviceMockup({ imageSrc, alt, className, float = true, delay = 0 }: DeviceMockupProps) {
    const floatAnimation = float ? {
        y: [0, -15, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: delay
        }
    } : {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            animate={floatAnimation}
            className={cn("relative mx-auto shrink-0 flex items-center justify-center", className)}
        >
            {/* Strict static bounds: 280x606 guarantees zero layout shifting or collapsing on any viewport */}
            <div
                className="relative rounded-[3rem] p-[8px] bg-gradient-to-br from-[#e0e3e5] via-[#f4f5f6] to-[#d0d4d8] dark:from-[#2a2d32] dark:via-[#1a1c1e] dark:to-[#111214] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-inset ring-white/50 dark:ring-white/10"
                style={{ width: "280px", height: "606px" }}
            >
                {/* Inner Screen Bezel */}
                <div className="relative w-full h-full bg-black rounded-[2.6rem] overflow-hidden shadow-inner ring-[2px] ring-black/5 dark:ring-white/5">

                    {/* Notch */}
                    <div className="absolute top-2 inset-x-0 h-[26px] flex justify-center z-20 pointer-events-none">
                        <div className="w-[90px] h-full bg-black rounded-full shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)] flex items-center justify-between px-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#111] shadow-[inset_0_1px_2px_rgba(0,0,0,1)] ring-[0.5px] ring-white/10"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500/30 blur-[1px]"></div>
                        </div>
                    </div>

                    <div className="absolute top-[10%] -left-3 w-4 h-[2px] bg-black/20 dark:bg-white/10 blur-[1px]" />
                    <div className="absolute top-[80%] -left-3 w-4 h-[2px] bg-black/20 dark:bg-white/10 blur-[1px]" />
                    <div className="absolute top-[10%] -right-3 w-4 h-[2px] bg-black/20 dark:bg-white/10 blur-[1px]" />

                    {/* Actual Content */}
                    <div className="relative w-full h-full bg-[#111] overflow-hidden rounded-[2.4rem] ring-1 ring-black/20 dark:ring-white/5 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={imageSrc}
                                alt={alt}
                                fill
                                className="object-cover object-top"
                                sizes="280px"
                                priority
                                unoptimized
                            />
                        </div>
                        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />
                    </div>
                </div>

                {/* Hardware Buttons Overlay (Visual Only) */}
                <div className="absolute top-[25%] -left-[2px] w-[3px] h-10 bg-gradient-to-b from-[#b0b4b8] to-[#909498] dark:from-[#3a3d42] dark:to-[#2a2c30] rounded-l-md shadow-sm border-r border-black/10 dark:border-white/5" />
                <div className="absolute top-[33%] -left-[2px] w-[3px] h-14 bg-gradient-to-b from-[#b0b4b8] to-[#909498] dark:from-[#3a3d42] dark:to-[#2a2c30] rounded-l-md shadow-sm border-r border-black/10 dark:border-white/5" />
                <div className="absolute top-[41%] -left-[2px] w-[3px] h-14 bg-gradient-to-b from-[#b0b4b8] to-[#909498] dark:from-[#3a3d42] dark:to-[#2a2c30] rounded-l-md shadow-sm border-r border-black/10 dark:border-white/5" />
                <div className="absolute top-[30%] -right-[2px] w-[3px] h-16 bg-gradient-to-b from-[#b0b4b8] to-[#909498] dark:from-[#3a3d42] dark:to-[#2a2c30] rounded-r-md shadow-sm border-l border-black/10 dark:border-white/5" />
            </div>
        </motion.div>
    );
}
