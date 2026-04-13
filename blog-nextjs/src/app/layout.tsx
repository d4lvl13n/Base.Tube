import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://base.tube'),
  title: {
    default: "Base.Tube - The Platform That Pays Creators First",
    template: "%s | Base.Tube"
  },
  description: "Turn your content into tradeable assets. No ads, no algorithms, no subscriptions. Just content passes your fans can buy, own, and resell.",
  keywords: "creator economy, content monetization, content pass, creator platform, tradeable access, fan ownership, direct monetization",
  authors: [{ name: "Base.Tube", url: "https://base.tube" }],
  creator: "Base.Tube",
  publisher: "Base.Tube",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Base.Tube - The Platform That Pays Creators First",
    description: "Turn your content into tradeable assets. Your fans buy passes, watch content, and can resell. You earn from every transaction.",
    url: "https://base.tube",
    siteName: "Base.Tube",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-card.webp",
        width: 1200,
        height: 630,
        alt: "Base.Tube - Where creators build their economy",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@base_tube",
    creator: "@base_tube",
    title: "Base.Tube - The Platform That Pays Creators First",
    description: "Turn your content into tradeable assets. No ads, no algorithms, no subscriptions.",
    images: ["/images/og-card.webp"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://base.tube",
    types: {
      'application/rss+xml': 'https://base.tube/feed.xml',
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Base.Tube Insights RSS Feed"
          href="/feed.xml"
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://wp.base.tube" />
        <link rel="dns-prefetch" href="https://wp.base.tube" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Site-wide Structured Data */}
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        
        {children}
        <Analytics />
      </body>
    </html>
  );
}
