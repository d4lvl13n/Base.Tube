import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/seo/StructuredData";
import { MetaPixelPageView } from "@/components/analytics/MetaPixelPageView";
import { dmSerifDisplay, geistMono, inter } from "@/lib/fonts";
import "./globals.css";
import "./v2.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://base.tube'),
  title: {
    default: "Base.Tube - The Platform That Pays Creators First",
    template: "%s | Base.Tube"
  },
  description: "Turn your content into passes your fans truly own. No ads, no algorithms, no subscriptions — just one-time access your fans buy, own, and can transfer.",
  keywords: "creator economy, content monetization, content pass, creator platform, transferable access, fan ownership, direct monetization",
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
    description: "Turn your content into passes your fans own. Your fans buy a pass once, watch the content, and can transfer it — no subscriptions, no monthly reset.",
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
    description: "Turn your content into passes your fans own. No ads, no algorithms, no subscriptions.",
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
        className={`${inter.variable} ${dmSerifDisplay.variable} ${geistMono.variable} antialiased`}
      >
        {/* Site-wide Structured Data */}
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        
        {children}
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DQELH44BE4"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-DQELH44BE4');`}
        </Script>
        {/* X conversion tracking base code. The pixel keeps the ad click id (twclid) in the _twclid
            cookie on .base.tube; checkout passes it to Stripe and the backend reports the trial or
            payment to X's Conversion API (base-be, services/analytics/xConversions.ts). */}
        <Script id="x-pixel" strategy="afterInteractive">
          {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','pmr62');`}
        </Script>
        {/* Meta pixel "Base.tube" (Codolie labs portfolio). It keeps the ad click (_fbc) and browser (_fbp) ids in cookies
            on .base.tube; checkout passes them to Stripe and the backend reports the trial or payment to
            Meta's Conversions API (base-be, services/analytics/metaConversions.ts). */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1690314265834751');
fbq('track','PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} alt="" src="https://www.facebook.com/tr?id=1690314265834751&ev=PageView&noscript=1" />
        </noscript>
        <MetaPixelPageView />
      </body>
    </html>
  );
}
