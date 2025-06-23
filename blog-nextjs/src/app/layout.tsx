import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "./landing.css";
import "./header.css";
import "./buttons.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base.Tube - The Platform That Pays Creators First",
  description: "Turn your content into tradeable assets. No ads, no algorithms, no subscriptions. Just content passes your fans can buy, own, and resell.",
  keywords: "blockchain content, creator economy, NFT content, digital ownership, content monetization, web3 creators",
  authors: [{ name: "Base.Tube" }],
  openGraph: {
    title: "Base.Tube - The Platform That Pays Creators First",
    description: "Turn your content into tradeable assets. Your fans buy passes, watch content, and can resell. You earn from every transaction.",
    url: "https://base.tube",
    siteName: "Base.Tube",
    images: [
      {
        url: "/images/og-card.webp",
        width: 1200,
        height: 630,
        alt: "Base.Tube - Where creators build their economy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base.Tube - The Platform That Pays Creators First",
    description: "Turn your content into tradeable assets. No ads, no algorithms, no subscriptions.",
    images: ["/images/og-card.webp"],
    creator: "@base_tube",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
