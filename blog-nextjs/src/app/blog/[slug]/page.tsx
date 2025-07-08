import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/LandingLayout';
import SocialShareBar from '@/components/ui/SocialShareBar';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import TableOfContents from '@/components/ui/TableOfContents';
import RelatedArticles from '@/components/ui/RelatedArticles';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import { getPostBySlug, getAllPostSlugs, getFeaturedImageUrl, getCleanTitle, getCleanExcerpt, formatDate } from '@/lib/wordpress';

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found - Base.Tube Blog',
    };
  }

  const cleanTitle = getCleanTitle(post);
  const cleanExcerpt = getCleanExcerpt(post);

  return {
    title: `${cleanTitle} - Base.Tube Blog`,
    description: cleanExcerpt.slice(0, 160),
    keywords: 'Base.Tube, Web3, video sharing, decentralized, NFT, content creation',
    openGraph: {
      title: cleanTitle,
      description: cleanExcerpt.slice(0, 160),
      type: 'article',
      url: `https://base.tube/blog/${resolvedParams.slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: [
        {
          url: getFeaturedImageUrl(post),
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanExcerpt.slice(0, 160),
      images: [getFeaturedImageUrl(post)],
    },
    alternates: {
      canonical: `https://base.tube/blog/${resolvedParams.slug}`,
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
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImageUrl(post);
  const cleanTitle = getCleanTitle(post);
  const formattedDate = formatDate(post.date);
  const postUrl = `https://base.tube/blog/${resolvedParams.slug}`;

  return (
    <Layout>
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      
      {/* Table of Contents */}
      <TableOfContents content={post.content.rendered} />
      
      {/* Social Share Bar */}
      <SocialShareBar
        url={postUrl}
        title={cleanTitle}
        description={getCleanExcerpt(post)}
      />
      
      {/* Hero Section with Featured Image */}
      <div className="post-hero">
        <div className="post-hero-image">
          <Image
            src={featuredImage}
            alt={cleanTitle}
            fill
            className="hero-image"
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="post-hero-content">
          <div className="post-breadcrumb">
            <Link href="/blog" className="breadcrumb-link">
              Blog
            </Link>
            <span className="breadcrumb-separator">→</span>
            <span className="breadcrumb-current">Article</span>
          </div>
          
          <h1 className="post-hero-title">{cleanTitle}</h1>
          
          {/* Author Box */}
          <div className="author-card">
            <div className="author-avatar">
              <Image
                src="/images/basetube-logo.png"
                alt="Base.Tube Team"
                width={60}
                height={60}
                className="avatar-image"
              />
            </div>
            <div className="author-info">
              <div className="author-name">Base.Tube Team</div>
              <div className="author-meta">
                <span className="publish-date">{formattedDate}</span>
                <span className="meta-separator">•</span>
                <span className="read-time">5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Article Content */}
      <main className="post-article">
        <div className="article-container">
          {/* Post Content */}
          <article 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Article Footer */}
          <div className="article-footer">
            <div className="article-tags">
              <span className="tag">Web3</span>
              <span className="tag">Video Sharing</span>
              <span className="tag">Base.Tube</span>
            </div>
            
            <div className="article-share">
              <span className="share-label">Share this article</span>
              <div className="share-buttons">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(cleanTitle)}`} 
                   className="share-btn twitter" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                   className="share-btn linkedin" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                   className="share-btn facebook" target="_blank" rel="noopener noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <section className="article-cta">
            <div className="cta-content">
              <h2 className="cta-headline">Ready to Revolutionize Your Video Experience?</h2>
              <p className="cta-subtext">Join Base.Tube and be part of the future of content creation.</p>
              <div className="cta-actions">
                <a href="https://beta.base.tube/" className="cta-btn primary">
                  <span>Join our beta</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="https://base-tube.gitbook.io/base.tube-documentation" className="cta-btn secondary">
                  <span>Learn More</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 9h6v6M15 9l-6 6"/>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="article-navigation">
            <Link href="/blog" className="nav-link back-to-blog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Related Articles */}
      <RelatedArticles 
        currentPostId={post.id}
        _currentPostSlug={resolvedParams.slug}
        maxArticles={3}
      />
      
      {/* Newsletter Signup */}
      <NewsletterSignup 
        title="Don't Miss Our Latest Insights"
        subtitle="Join our community of content creators and stay updated with the latest trends in Web3 and digital innovation"
        compact={true}
      />
    </Layout>
  );
} 