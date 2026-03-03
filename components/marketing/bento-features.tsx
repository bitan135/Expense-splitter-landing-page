"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, WifiOff, SplitSquareHorizontal } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BentoFeatures() {
    return (
        <section className="px-4 py-24 mx-auto max-w-6xl w-full relative">
            {/* CSS Gradients instead of buggy images */}
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-amber-500/5 to-background" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-primary/10 via-amber-500/10 to-transparent blur-[120px] rounded-full" />
            </div>

            <div className="text-center mb-16 relative z-10">
                {/* 🆕 Trust Badge injected to bridge the hero gap */}
                <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full bg-background/50 backdrop-blur-md shadow-sm border border-border/50">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white shadow-sm
                                ${i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : i === 3 ? 'bg-emerald-500' : 'bg-purple-500 z-10'}
                            `}>
                                {String.fromCharCode(64 + i)} {/* A, B, C, D */}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground">
                        <span className="text-foreground tracking-tight">₹1.5M+</span> split globally
                    </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 relative">
                    Designed for Speed <br className="hidden sm:block" /> and Privacy.
                </h2>
                <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto tracking-tight">
                    A suite of powerful features packed into an ultra-lightweight app. No fluff, just math.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                {/* Feature 1: Offline First (Spans 2 columns on desktop) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/20 dark:border-white/10 shadow-organic hover:shadow-glow transition-all duration-300 p-8 flex flex-col justify-end backdrop-blur-sm"
                >
                    <div className="absolute top-6 right-6 p-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
                        <WifiOff className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Offline-First Architecture</h3>
                        <p className="text-muted-foreground font-medium md:max-w-[70%] text-balance">
                            No signal in the mountains? No problem. The app works entirely offline and caches your expenses securely using PWA technologies.
                        </p>
                    </div>
                </motion.div>

                {/* Feature 2: Smart Math */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-white/20 dark:border-white/10 shadow-organic hover:shadow-glow transition-all duration-300 p-8 flex flex-col justify-end backdrop-blur-sm"
                >
                    <div className="absolute top-6 right-6 p-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
                        <SplitSquareHorizontal className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Smart Math</h3>
                        <p className="text-muted-foreground font-medium text-balance">
                            Our algorithm optimizes debts to minimize total transactions across the group.
                        </p>
                    </div>
                </motion.div>

                {/* Feature 3: Privacy */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/20 dark:border-white/10 shadow-organic hover:shadow-glow transition-all duration-300 p-8 flex flex-col justify-end backdrop-blur-sm"
                >
                    <div className="absolute top-6 right-6 p-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">100% Private</h3>
                        <p className="text-muted-foreground font-medium text-balance">
                            No cloud sync means your financial data stays strictly on your personal device.
                        </p>
                    </div>
                </motion.div>

                {/* Feature 4: Lightning Fast (Spans 2 columns) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/20 dark:border-white/10 shadow-organic hover:shadow-glow transition-all duration-300 p-8 flex flex-col justify-end backdrop-blur-sm"
                >
                    <div className="absolute top-6 right-6 p-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
                        <Zap className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Zero Friction Setup</h3>
                        <p className="text-muted-foreground font-medium md:max-w-[70%] text-balance">
                            No cumbersome sign-up processes, no forced logins. Just open the web app and start splitting instantly with friends.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
