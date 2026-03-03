"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "Do I really not need an account?",
        answer: "Yes! There are zero sign-ups, zero passwords, and zero email verifications. You just open the app and instantly start adding expenses. Your friends don't need accounts to view or pay either."
    },
    {
        question: "Where is my exact data stored?",
        answer: "Your privacy is our priority. All your group data, expenses, and balances are stored locally on your device using IndexedDB. We literally have no servers that can see your transactions."
    },
    {
        question: "How does the 'Smart Math' algorithm work?",
        answer: "If Sneha owes Rahul ₹500, and Rahul owes Aditya ₹500, our greedy settlement algorithm simplifies this so Sneha just pays Aditya ₹500 directly via UPI. It mathematically minimizes the total number of transactions your group has to make."
    },
    {
        question: "Does this work when I'm offline?",
        answer: "100%. Because we are a Progressive Web App (PWA) with local-first architecture, you can log expenses while trekking in the mountains with zero bars of signal."
    },
    {
        question: "How do I install the app?",
        answer: "No App Store needed. Open the site in Safari (iOS) or Chrome (Android) and tap 'Add to Home Screen'. It will install natively without the bloat."
    }
];

export function FaqSection() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="py-24 px-4 max-w-3xl mx-auto w-full">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Common Questions.
                </h2>
                <p className="text-muted-foreground text-lg font-medium">
                    Everything you need to know about the product.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => {
                    const isOpen = openIdx === idx;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className={cn(
                                "border border-border/50 rounded-2xl overflow-hidden transition-all duration-300",
                                isOpen ? "bg-secondary/30 shadow-organic" : "bg-transparent hover:bg-secondary/10"
                            )}
                        >
                            <button
                                onClick={() => setOpenIdx(isOpen ? null : idx)}
                                className="flex items-center justify-between w-full p-6 text-left"
                            >
                                <span className="text-lg font-bold pr-4">{faq.question}</span>
                                <div className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                    isOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                                )}>
                                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    isOpen ? "max-h-96 opacity-100 pb-6 px-6" : "max-h-0 opacity-0 px-6"
                                )}
                            >
                                <p className="text-muted-foreground leading-relaxed font-medium">
                                    {faq.answer}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
