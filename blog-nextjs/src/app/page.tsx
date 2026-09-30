import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import './home.css';

const PAGE_URL = 'https://base.tube';
// The brand is already in the title: skip the layout's "%s | Base.Tube" template.
const TITLE = 'Base.Tube: Stop Renting Fans. Own Your Audience.';
const DESCRIPTION =
  'On the big platforms your fans are a number the platform keeps. On Base.Tube they buy your work directly with a Content Pass, and every buyer stays yours.';
const OG_IMAGE = { url: '/images/og-home.jpg', width: 1200, height: 630, alt: 'Base.Tube: Stop renting fans. Own your audience.', type: 'image/jpeg' };

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: 'own your audience, sell directly to fans, Content Pass, creator platform, creator hub, Base.Tube',
  alternates: {
    canonical: PAGE_URL,
    types: { 'application/rss+xml': `${PAGE_URL}/feed.xml` },
  },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'Base.Tube',
    locale: 'en_US',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    creator: '@base_tube',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

// Organization and WebSite structured data come from the root layout (one of each on every page).
export default function Home() {
  return <HomePage />;
}
