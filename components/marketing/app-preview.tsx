"use client";

import { motion } from "framer-motion";
import { DeviceMockup } from "./device-mockup";

export function AppPreview() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-12 relative flex justify-center perspective-1000">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 flex justify-center items-center opacity-30 pointer-events-none">
                <div className="w-[80%] h-[80%] bg-gradient-to-tr from-primary/40 to-amber-500/40 blur-[120px] rounded-full" />
            </div>

            {/* Clean Hero Mockup - no distracting/buggy floating elements */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative z-10"
            >
                <DeviceMockup
                    imageSrc="/screenshots/hero-groups.png"
                    alt="Expense Splitter App Interface"
                    float={true}
                />
            </motion.div>
        </div>
    );
}
