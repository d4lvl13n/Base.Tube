import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import './ai-thumbnails/ai-thumbnails.css';
import './home.css';

const PAGE_URL = 'https://base.tube';
// The brand is already in the title: skip the layout's "%s | Base.Tube" template.
const TITLE = 'Base.Tube: The Creator Hub to Publish, Sell and Grow';
const DESCRIPTION =
  'Publish your films, courses and archives, sell them straight to your fans with a Content Pass, keep 90%, and grow with AI thumbnails and free tools.';
const OG_IMAGE = { url: '/images/og-home.jpg', width: 1200, height: 630, alt: 'Base.Tube: Grow on the feed. Own your audience.', type: 'image/jpeg' };

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: 'creator hub, Content Pass, sell videos to fans, creator platform, AI thumbnails, free YouTube tools, Base.Tube',
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
