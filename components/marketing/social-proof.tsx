"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "Finally, an app that doesn't force my friends to create an account or download anything just to settle a ₹2500 weekend dinner.",
        author: "Sneha R.",
        role: "Weekend Planner"
    },
    {
        quote: "The auto-generated UPI QR code is magic. No more awkwardly sharing phone numbers or 'bro GPay me' texts after paying the rent.",
        author: "Rohit M.",
        role: "PG Roommate"
    },
    {
        quote: "Saved us hours of messy math on our 4-day Goa trip. The fact that it works perfectly offline is just insanely good out there.",
        author: "Aditya T.",
        role: "Trip Organizer"
    }
];

export function SocialProof() {
    return (
        <section className="py-24 px-4 bg-secondary/30 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative">
                <div className="text-center mb-16">
                    <div className="flex justify-center gap-1 mb-4 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={24} className="fill-current" />
                        ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Loved by transparent groups.
                    </h2>
                    <p className="text-muted-foreground mt-4 text-lg font-medium">
                        Over 10,000+ seamless settlements. Zero friendships lost.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="bg-background/80 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-organic hover:shadow-glow transition-all duration-300"
                        >
                            <p className="text-lg font-medium leading-relaxed italic mb-6">"{t.quote}"</p>
                            <div>
                                <p className="font-bold text-foreground">{t.author}</p>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
