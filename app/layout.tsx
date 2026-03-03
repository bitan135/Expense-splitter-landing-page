import type { Metadata, Viewport } from "next";
import { ViewTransitions } from 'next-view-transitions';
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
  metadataBase: new URL("https://expense-splitter-rose.vercel.app"),
  title: {
    default: "Expense Splitter | Split Bills, Not Friendships",
    template: "%s | Expense Splitter",
  },
  description: "The premium, privacy-focused, offline-first expense splitter that works right in your browser. Fast, free, and UPI-ready.",
  keywords: ["expense splitter", "split bills", "bill splitter", "split bills app", "expense tracker", "UPI expenses", "offline expense tracking", "group expenses", "travel expenses", "splitwise alternative", "free expense splitter"],
  authors: [{ name: "Expense Splitter Team" }],
  creator: "Expense Splitter",
  publisher: "Expense Splitter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Splitter",
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
  openGraph: {
    title: "Expense Splitter | Split Bills, Not Friendships",
    description: "The premium, privacy-focused, offline-first expense splitter that works right in your browser. Fast, free, and UPI-ready.",
    url: "https://expense-splitter-rose.vercel.app/",
    siteName: "Expense Splitter",
    images: [
      {
        url: "/icon-512.png", // Will use a higher resolution hero image eventually, falling back to icon
        width: 1200,
        height: 630,
        alt: "Expense Splitter Application Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expense Splitter | Privacy-First Group Expenses",
    description: "The premium, privacy-focused, offline-first expense splitter. Split bills effortlessly with friends without the awkward math.",
    images: ["/icon-512.png"],
    creator: "@ExpenseSplitter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
