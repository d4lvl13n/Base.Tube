import { Metadata } from 'next';
import Layout from '@/components/Layout';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { BlogStructuredData, BlogPostListStructuredData } from '@/components/seo/StructuredData';
import { getAllPosts } from '@/lib/wordpress';

// SEO metadata
export const metadata: Metadata = {
  title: 'Creator Economy Blog',
  description: 'Guides, tools, and trends for YouTube, TikTok, and Instagram creators. Monetization strategies, AI workflows, and platform comparisons.',
  keywords: 'creator economy, YouTube monetization, TikTok creators, content creation tools, AI tools creators, creator income, platform comparison',
  authors: [{ name: 'Base.Tube Team', url: 'https://base.tube' }],
  openGraph: {
    title: 'Creator Economy Blog | Base.Tube',
    description: 'Guides, tools, and trends for YouTube, TikTok, and Instagram creators. Monetization strategies, AI workflows, and platform comparisons.',
    type: 'website',
    url: 'https://base.tube/blog',
    siteName: 'Base.Tube',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Creator Economy Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    creator: '@base_tube',
    title: 'Creator Economy Blog | Base.Tube',
    description: 'Guides, tools, and trends for YouTube, TikTok, and Instagram creators. Monetization strategies, AI workflows, and platform comparisons.',
    images: ['https://base.tube/images/og-card.webp'],
  },
  alternates: {
    canonical: 'https://base.tube/blog',
    types: {
      'application/rss+xml': 'https://base.tube/feed.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default async function BlogPage() {
  // Fetch all posts at build time
  const posts = await getAllPosts();

  // Strip heavy content from posts for the listing page — PostCard only needs
  // title, slug, date, excerpt, and featured image. This cuts page size by ~80%.
  const lightPosts = posts.map(post => ({
    ...post,
    content: { rendered: '', protected: false },
  }));

  return (
    <Layout>
      {/* SEO Structured Data */}
      <BlogStructuredData />
      <BlogPostListStructuredData posts={lightPosts} />

      <BlogPageClient posts={lightPosts} />
    </Layout>
  );
}
