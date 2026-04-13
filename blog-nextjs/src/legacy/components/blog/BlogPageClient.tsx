'use client'

import { useState, useCallback } from 'react'
import PostCard from '@/components/PostCard'
import LazySection from '@/components/shared/LazySection'
import SectionSkeleton from '@/components/shared/SectionSkeleton'
import NewsletterSignup from '@/components/ui/NewsletterSignup'

import type { WordPressPost } from '@/lib/wordpress';

const POSTS_PER_PAGE = 12;

interface BlogPageClientProps {
  posts: WordPressPost[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const hasMore = visibleCount < posts.length;

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + POSTS_PER_PAGE, posts.length));
  }, [posts.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="blog-hero-modern">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-gradient"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Creator Insights</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">Base.Tube</span>
            <span className="title-line gradient-text">Insights</span>
          </h1>

          <p className="hero-subtitle">
            Guides, tools, and trends for content creators
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{posts.length}+</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Creator</div>
              <div className="stat-label">Economy</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">2026</div>
              <div className="stat-label">Latest</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l3 3 7-7"/>
              <path d="M7 6l3 3 7-7"/>
            </svg>
          </div>
          <span>Explore Articles</span>
        </div>
      </section>

      {/* Articles Grid — paginated */}
      <section className="articles-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-subtitle">
              Monetization strategies, AI tools, and platform insights for creators
            </p>
          </div>

          {posts.length > 0 ? (
            <>
              <div className="post-grid">
                {posts.slice(0, visibleCount).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button
                    onClick={loadMore}
                    className="cta-btn-secondary"
                    style={{ cursor: 'pointer' }}
                  >
                    Load More Articles ({posts.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <h3>No posts found</h3>
              <p>Check back soon for creator economy insights!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA with Lazy Loading */}
      <LazySection
        threshold={0.1}
        rootMargin="50px"
        fallback={<SectionSkeleton height="500px" />}
        minHeight="500px"
      >
        <NewsletterSignup />
      </LazySection>

      {/* Bottom CTA with Lazy Loading */}
      <LazySection
        threshold={0.1}
        rootMargin="50px"
        fallback={<SectionSkeleton height="400px" />}
        minHeight="400px"
      >
        <section className="bottom-cta-section">
          <div className="section-container">
            <div className="bottom-cta-content">
              <h2 className="bottom-cta-title">Ready to Grow Your Creator Business?</h2>
              <p className="bottom-cta-subtitle">
                Join Base.Tube and monetize your audience with tradeable memberships
              </p>
              <div className="bottom-cta-buttons">
                <a href="/landing" className="cta-btn-primary">
                  Explore Platform
                </a>
                <a href="#newsletter" className="cta-btn-secondary">
                  Get Updates
                </a>
              </div>
            </div>
          </div>
        </section>
      </LazySection>
    </>
  )
} 
