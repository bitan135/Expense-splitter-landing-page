"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/base";
import { ArrowRight, ShieldCheck, Zap, WifiOff } from "lucide-react";

export function Hero() {
    const router = useRouter();

    return (
        <section className="relative px-4 pt-24 pb-16 mx-auto max-w-5xl text-center flex flex-col items-center">
            {/* Background Glows & Floating Elements */}
            <div className="absolute inset-0 -z-10 flex justify-center inset-y-0 opacity-50 pointer-events-none">
                <div className="w-full max-w-2xl h-80 bg-primary/20 blur-[120px] rounded-full absolute top-10" />
                <motion.div
                    animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-[10%] w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [20, -20, 20], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-40 left-[10%] w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-secondary text-secondary-foreground ring-1 ring-border/50">
                    <Zap size={14} className="text-amber-500" />
                    <span>V1.0 is now live</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-6">
                    Split Bills, Not <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
                        Friendships.
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 font-medium tracking-tight">
                    The privacy-focused, offline-first expense splitter that works right in your browser. Perfect for Goa trips, PG rent, flatmate groceries, or daily chai/sutta bills. Zero fees, instant UPI.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                    <a
                        href="https://expense-splitter-rose.vercel.app/"
                        className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full shadow-glow bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all active:scale-95 flex items-center justify-center"
                    >
                        Start Splitting Now — It's Free
                        <ArrowRight size={20} className="ml-2" />
                    </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm font-semibold text-muted-foreground/80">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> No Accounts</span>
                    <span className="flex items-center gap-1.5"><WifiOff size={16} /> Works Offline</span>
                    <span className="flex items-center gap-1.5"><Zap size={16} /> Instant UPI</span>
                </div>
            </motion.div>
        </section>
    );
}
