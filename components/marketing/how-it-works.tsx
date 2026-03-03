"use client";

import { motion } from "framer-motion";
import { DeviceMockup } from "./device-mockup";
import { cn } from "@/lib/utils";

const steps = [
    {
        number: "01",
        title: "Create a Group",
        description: "Name your Goa trip, weekend dinner, or shared PG. Add everyone in two seconds without forcing them to download anything.",
        image: "/screenshots/home.png",
        align: "left"
    },
    {
        number: "02",
        title: "Add Expenses",
        description: "Log who paid for what. See exactly how the expense is split with our transparent breakdown. It even works offline!",
        image: "/screenshots/add.png",
        align: "right"
    },
    {
        number: "03",
        title: "Settle Up via UPI",
        description: "Our 'Smart Math' algorithm minimizes transactions. Use the optimized plan to settle up instantly via PhonePe, GPay, or Paytm.",
        image: "/screenshots/group.png",
        align: "left"
    }
];

export function HowItWorks() {
    return (
        <section className="px-4 py-24 mx-auto max-w-6xl w-full">
            <div className="text-center mb-24">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                    Three Steps to Zero Drama.
                </h2>
                <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto">
                    Split bills effortlessly without the awkward math or bloated apps.
                </p>
            </div>

            <div className="space-y-32">
                {steps.map((step, idx) => {
                    const isLeft = step.align === "left";

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "flex flex-col md:flex-row items-center gap-12 md:gap-24",
                                !isLeft && "md:flex-row-reverse"
                            )}
                        >
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex-1 space-y-6 text-center md:text-left"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-primary font-bold text-2xl mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{step.title}</h3>
                                <p className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>

                            {/* Device Mockup */}
                            <div className="flex-1 w-full flex justify-center">
                                <DeviceMockup
                                    imageSrc={step.image}
                                    alt={step.title}
                                    float={false}
                                    className="shadow-organic mt-8 md:mt-0"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
