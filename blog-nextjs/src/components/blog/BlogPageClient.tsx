'use client'

import PostCard from '@/components/PostCard'
import LazySection from '@/components/shared/LazySection'
import SectionSkeleton from '@/components/shared/SectionSkeleton'
import NewsletterSignup from '@/components/ui/NewsletterSignup'

import type { WordPressPost } from '@/lib/wordpress';

interface BlogPageClientProps {
  posts: WordPressPost[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
  return (
    <>
      {/* Stunning Hero Section - Always visible */}
      <section className="blog-hero-modern">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-gradient"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Pioneer Insights</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Base.Tube</span>
            <span className="title-line gradient-text">Insights</span>
          </h1>
          
          <p className="hero-subtitle">
            Explore the future of content creation
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{posts.length}+</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Pioneer</div>
              <div className="stat-label">Vision</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">2025</div>
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

      {/* Articles Grid */}
      <section className="articles-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-subtitle">
              Pioneering the next generation of content creation and digital storytelling
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <h3>No posts found</h3>
              <p>Check back soon for groundbreaking content creation insights!</p>
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
              <h2 className="bottom-cta-title">Ready to Pioneer the Future?</h2>
              <p className="bottom-cta-subtitle">
                Join the revolution in content creation and digital storytelling
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
