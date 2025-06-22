import { Metadata } from 'next';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
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
      {/* Stunning Hero Section */}
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

      {/* Featured Posts Section */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Stories</h2>
            <p className="section-subtitle">
              Pioneering the next generation of content creation and digital storytelling
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="featured-grid">
              {posts.slice(0, 3).map((post, index) => (
                <div key={post.id} className={`featured-card ${index === 0 ? 'featured-main' : 'featured-side'}`}>
                  <PostCard post={post} featured={true} />
                </div>
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

      {/* Latest Articles Grid */}
      {posts.length > 3 && (
        <section className="articles-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Latest Articles</h2>
              <div className="section-filter">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Innovation</button>
                <button className="filter-btn">Creators</button>
                <button className="filter-btn">Future</button>
              </div>
            </div>

            <div className="articles-grid">
              {posts.slice(3).map((post) => (
                <div key={post.id} className="article-card">
                  <PostCard post={post} featured={false} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="load-more-section">
              <button className="load-more-btn">
                <span>Load More Articles</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="newsletter-cta-section">
        <div className="cta-background">
          <div className="cta-particles"></div>
        </div>
        
        <div className="cta-content-modern">
          <div className="cta-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          
          <h2 className="cta-headline">Stay Ahead of the Curve</h2>
          <p className="cta-description">
            Get exclusive insights on the future of content creation and digital innovation
          </p>
          
          <div className="cta-actions-modern">
            <div className="email-capture">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="email-input-modern"
              />
              <button className="subscribe-btn-modern">
                <span>Join Pioneers</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <div className="social-proof">
              <div className="proof-avatars">
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar-more">+</div>
              </div>
              <span className="proof-text">Join 500+ content pioneers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta-section">
        <div className="bottom-cta-content">
          <h2 className="bottom-cta-title">Ready to Pioneer the Future?</h2>
          <p className="bottom-cta-subtitle">
            Join Base.Tube and be at the forefront of content creation innovation
          </p>
          
          <div className="bottom-cta-buttons">
            <a href="https://beta.base.tube/" className="cta-btn-primary">
              <span>Pioneer with Us</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
            <a href="https://base-tube.gitbook.io/base.tube-documentation" className="cta-btn-secondary">
              <span>Explore Innovation</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
} 