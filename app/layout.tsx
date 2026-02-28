import type { Metadata, Viewport } from "next";
import { ViewTransitions } from 'next-view-transitions';
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F6F0" }, // Sunlit Terrarium
    { media: "(prefers-color-scheme: dark)", color: "#020617" }, // Bioluminescent Forest
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // For notch support
};

export const metadata: Metadata = {
  title: "Expense Splitter",
  description: "Offline Expense Splitter PWA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Splitter",
    startupImage: [],
  },
  icons: {
    icon: [
      { url: "/icon-192.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-192-light.png", media: "(prefers-color-scheme: light)" },
    ],
    shortcut: "/icon-192.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { ErrorBoundary } from "@/components/error-boundary"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geist.variable} antialiased`}>
          {/* iOS FastClick Activator Hack: Forces instant :active evaluation */}
          <script dangerouslySetInnerHTML={{ __html: 'document.addEventListener("touchstart", function() {}, {passive: true});' }} />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StoreProvider>
              <ErrorBoundary>
                <ToastProvider />
                <div className="mx-auto min-h-screen bg-background text-foreground safe-area-padding max-w-md shadow-2xl safe-area-shadow overflow-hidden relative pb-16">
                  {children}
                </div>
              </ErrorBoundary>
            </StoreProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
