import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["700", "800"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Build Tamil Nadu — What Should We Build for Tamil Nadu?",
  description:
    "A citizen-driven technology initiative collecting ideas from people across Tamil Nadu and building solutions for real-world problems.",
  keywords: [
    "Build Tamil Nadu",
    "Tamil Nadu technology ideas",
    "technology for Tamil Nadu",
    "Tamil Nadu innovation",
    "citizen technology Tamil Nadu",
    "Tamil Nadu problems",
    "build for Tamil Nadu",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tnbuild.wedigistudio.com"
  ),
  openGraph: {
    title: "Build Tamil Nadu — What Should We Build for Tamil Nadu?",
    description:
      "A citizen-driven technology initiative. Tell us the problem. Tamil Nadu decides what we build.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://tnbuild.wedigistudio.com",
    siteName: "Build Tamil Nadu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Build Tamil Nadu",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Tamil Nadu — What Should We Build for Tamil Nadu?",
    description:
      "A citizen-driven technology initiative. Tell us the problem. Tamil Nadu decides what we build.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} data-scroll-behavior="smooth">
      <body className="font-inter antialiased bg-surface text-navy" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
