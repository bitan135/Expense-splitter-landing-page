import Script from "next/script";
import { Hero } from "@/components/marketing/hero";
import { AppPreview } from "@/components/marketing/app-preview";
import { SocialProof } from "@/components/marketing/social-proof";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FaqSection } from "@/components/marketing/faq";
import { StickyHeader } from "@/components/marketing/sticky-header";
import { Header } from "@/components/layout/header";
import { BentoFeatures } from "@/components/marketing/bento-features";
import { PwaInstallGuide } from "@/components/marketing/pwa-install-guide";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Expense Splitter | Split Bills, Not Friendships",
    description: "The privacy-focused, offline-first expense splitter. Instantly calculate debts and settle up via UPI with zero transaction fees.",
    openGraph: {
        title: "Expense Splitter | Split Bills, Not Friendships",
        description: "The privacy-first expense splitter that works offline. Settle up instantly via UPI.",
        url: "https://expense-splitter-rose.vercel.app/",
        siteName: "Expense Splitter",
        images: [
            {
                url: "/screenshots/home.png", // Optional preview card
                width: 1200,
                height: 630,
            }
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Expense Splitter | Split Bills, Not Friendships",
        description: "Calculate who owes who effortlessly. No accounts, offline-first, instant UPI.",
        images: ["/screenshots/home.png"],
    }
};

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen pb-[calc(env(safe-area-inset-bottom)+2rem)]">
            {/* Structural SEO Data */}
            <Script id="json-ld" type="application/ld+json">
                {JSON.stringify([
                    {
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Expense Splitter",
                        "operatingSystem": "Web, iOS, Android",
                        "applicationCategory": "FinanceApplication",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "The offline-first, privacy-focused expense splitter with integrated UPI.",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "104"
                        },
                        "featureList": [
                            "No signups required",
                            "Offline-first PWA",
                            "UPI Integration",
                            "Optimized settlements",
                            "100% Data Privacy"
                        ]
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Is Expense Splitter really free?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, it is 100% free with zero transaction fees."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Do I need to create an account?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No! We believe in privacy by design. There are no sign-ups or emails required."
                                }
                            }
                        ]
                    }
                ])}
            </Script>

            {/* Simple Header for Marketing Page */}
            <Header title="Expense Splitter" />

            {/* 🆕 Sticky Header for continuous conversion */}
            <StickyHeader />

            <main className="flex-1 w-full flex flex-col items-center">
                <Hero />

                {/* 🆕 Interactive App Mockup integrated smoothly into Hero flow */}
                <div className="w-full px-4 -mt-4 mb-20 z-10 flex justify-center">
                    <AppPreview />
                </div>

                {/* 🆕 Solid Social Proof Section */}
                <div className="w-full">
                    <SocialProof />
                </div>

                {/* Divider */}
                <div className="w-full max-w-4xl mx-auto h-[1px] bg-border/50 my-8" />

                <FeatureGrid />

                {/* Divider */}
                <div className="w-full max-w-4xl mx-auto h-[1px] bg-border/50 my-12" />

                {/* 🆕 Bento Features Section */}
                <BentoFeatures />

                {/* Divider */}
                <div className="w-full max-w-4xl mx-auto h-[1px] bg-border/50 my-12" />

                <HowItWorks />

                {/* Divider */}
                <div className="w-full max-w-4xl mx-auto h-[1px] bg-border/50 my-12" />

                {/* 🆕 PWA Install Guide */}
                <PwaInstallGuide />

                {/* Divider */}
                <div className="w-full max-w-4xl mx-auto h-[1px] bg-border/50 my-12" />

                {/* 🆕 FAQ Section */}
                <FaqSection />
            </main>

            <footer className="w-full border-t border-border/50 py-8 mt-20 text-center px-4">
                <p className="text-muted-foreground font-medium flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <span>&copy; {new Date().getFullYear()} Expense Splitter.</span>
                    <span className="hidden sm:inline-block opacity-50">&bull;</span>
                    <span className="opacity-50">Local-First. Privacy-First.</span>
                </p>
            </footer>
        </div>
    );
}
