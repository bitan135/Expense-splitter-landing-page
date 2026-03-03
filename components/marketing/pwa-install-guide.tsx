"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Share, PlusSquare, Smartphone, MoreVertical, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function PwaInstallGuide() {
    const [os, setOs] = useState<"ios" | "android">("ios");

    // Auto-detect the OS on mount dynamically so we show the correct instructions out of the gate
    useEffect(() => {
        if (typeof window !== "undefined") {
            const ua = window.navigator.userAgent.toLowerCase();
            if (/android/i.test(ua)) setOs("android");
        }
    }, []);

    const content = {
        ios: [
            { icon: <Share className="w-8 h-8" />, title: "Tap Share", desc: "Open Safari and tap the share icon mapped at the bottom of the screen." },
            { icon: <PlusSquare className="w-8 h-8" />, title: "Add to Home Screen", desc: "Scroll down the menu and select the 'Add to Home Screen' option." },
            { icon: <Smartphone className="w-8 h-8" />, title: "Ready to Split", desc: "Launch the native-like Expense Splitter directly from your home screen." }
        ],
        android: [
            { icon: <MoreVertical className="w-8 h-8" />, title: "Open Menu", desc: "Open Chrome and tap the 3-dot menu at the top right of your browser." },
            { icon: <Download className="w-8 h-8" />, title: "Install App", desc: "Select 'Install app' or 'Add to Home Screen' from the drawer menu." },
            { icon: <Smartphone className="w-8 h-8" />, title: "Ready to Split", desc: "Launch the native-like Expense Splitter directly from your home screen." }
        ]
    };

    return (
        <section className="px-4 py-24 mx-auto max-w-5xl w-full">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Install in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">3 Seconds.</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto tracking-tight">
                    No App Store required. Get the full, lightning-fast offline experience installed as a PWA straight from your browser.
                </p>

                {/* OS Toggle Switch */}
                <div className="flex items-center justify-center gap-2 mt-10 p-1.5 bg-secondary/50 rounded-full w-fit mx-auto ring-1 ring-border/50">
                    <button
                        onClick={() => setOs("ios")}
                        className={cn("px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300", os === "ios" ? "bg-background shadow-organic text-foreground ring-1 ring-black/5 dark:ring-white/5" : "text-muted-foreground hover:text-foreground")}
                    >
                        iPhone / iPad
                    </button>
                    <button
                        onClick={() => setOs("android")}
                        className={cn("px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300", os === "android" ? "bg-background shadow-organic text-foreground ring-1 ring-black/5 dark:ring-white/5" : "text-muted-foreground hover:text-foreground")}
                    >
                        Android
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative mt-16">
                {/* Connecting Line (Desktop Only) */}
                <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

                <AnimatePresence mode="popLayout">
                    {content[os].map((step, idx) => (
                        <motion.div
                            key={`${os}-${idx}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{
                                duration: 0.5,
                                delay: idx * 0.15,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="relative z-10 w-20 h-20 rounded-3xl bg-background border border-border/50 shadow-organic group-hover:shadow-glow group-hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-primary mb-6 ring-1 ring-black/5 dark:ring-white/5">
                                {step.icon}
                                {/* Step Number Indicator */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm ring-4 ring-background shadow-sm">
                                    {idx + 1}
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground font-medium px-4 text-balance">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}
