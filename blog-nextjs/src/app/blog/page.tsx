import { Metadata } from 'next';
import Layout from '@/components/Layout';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { BlogStructuredData, BlogPostListStructuredData } from '@/components/seo/StructuredData';
import { getAllPosts } from '@/lib/wordpress';

// SEO metadata
export const metadata: Metadata = {
  title: 'Base.Tube Insights | Web3 Video Sharing Blog',
  description: 'Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.',
  keywords: 'Base.Tube, Web3, video sharing, decentralized, NFT, content creation, digital storytelling, blog, blockchain, creator economy',
  authors: [{ name: 'Base.Tube Team', url: 'https://base.tube' }],
  openGraph: {
    title: 'Base.Tube Insights | Web3 Video Sharing Blog',
    description: 'Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.',
    type: 'website',
    url: 'https://base.tube/blog',
    siteName: 'Base.Tube',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Blog - Web3 Video Sharing Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@base_tube',
    creator: '@base_tube',
    title: 'Base.Tube Insights | Web3 Video Sharing Blog',
    description: 'Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.',
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

  return (
    <Layout>
      {/* SEO Structured Data */}
      <BlogStructuredData />
      <BlogPostListStructuredData posts={posts} />
      
      <BlogPageClient posts={posts} />
    </Layout>
  );
}
