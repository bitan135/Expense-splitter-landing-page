"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/base";
import { UserX, Calculator, QrCode, Smartphone } from "lucide-react";

const features = [
    {
        icon: <UserX size={28} className="text-amber-500" />,
        title: "Incognito by Design",
        description: "No sign-ups, no emails, no tracking. Your data stays entirely on your device via IndexedDB."
    },
    {
        icon: <Calculator size={28} className="text-primary" />,
        title: "The Math is Done",
        description: "Advanced algorithms optimize settlements, instantly turning 5 messy debts into 2 simple payments."
    },
    {
        icon: <QrCode size={28} className="text-blue-500" />,
        title: "Scan to Pay",
        description: "No more typing bank details. Use built-in UPI QR codes to settle up instantly from your app of choice."
    },
    {
        icon: <Smartphone size={28} className="text-emerald-500" />,
        title: "Installable Web App",
        description: "A PWA that feels and works like a native app. Add it to your home screen—no App Store bloat required."
    }
];

export function FeatureGrid() {
    return (
        <section className="px-4 py-20 mx-auto max-w-6xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                    Everything You Need.
                    <br />Nothing You Don't.
                </h2>
                <p className="text-muted-foreground font-medium text-lg">
                    Designed for maximum speed and minimum friction.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                        <Card className="p-8 h-full shadow-organic hover:shadow-glow transition-all duration-300 border-border/50 bg-secondary/30">
                            <div className="w-14 h-14 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6 ring-1 ring-border/50">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
