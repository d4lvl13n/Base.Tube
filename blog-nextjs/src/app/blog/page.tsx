import { Metadata } from 'next';
import Layout from '@/components/Layout';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { getAllPosts } from '@/lib/wordpress';

// SEO metadata
export const metadata: Metadata = {
  title: 'Base.Tube Insights - Web3 Video Sharing Blog',
  description: 'Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.',
  keywords: 'Base.Tube, Web3, video sharing, decentralized, NFT, content creation, digital storytelling, blog',
  openGraph: {
    title: 'Base.Tube Insights - Web3 Video Sharing Blog',
    description: 'Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.',
    type: 'website',
    url: 'https://base.tube/blog',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base.Tube Insights - Web3 Video Sharing Blog',
    description: 'Exploring the Future of Web3 Video Sharing. Discover insights about decentralized content creation, NFTs, and the future of digital storytelling.',
    images: ['https://base.tube/images/og-card.webp'],
  },
};

export default async function BlogPage() {
  // Fetch all posts at build time
  const posts = await getAllPosts();

  return (
    <Layout>
      <BlogPageClient posts={posts} />
    </Layout>
  );
} 