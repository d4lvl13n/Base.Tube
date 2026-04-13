import { Metadata } from 'next';
import Layout from '@/components/LandingLayout';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Newsletter - Base.Tube',
  description: 'Join our newsletter for exclusive insights on Web3, content creation, and digital innovation.',
  keywords: 'Base.Tube, newsletter, Web3, content creation, digital innovation, insights',
  openGraph: {
    title: 'Newsletter - Base.Tube',
    description: 'Join our newsletter for exclusive insights on Web3, content creation, and digital innovation.',
    type: 'website',
    url: 'https://base.tube/newsletter',
    images: [
      {
        url: 'https://base.tube/images/og-card.webp',
        width: 1200,
        height: 630,
        alt: 'Base.Tube Newsletter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter - Base.Tube',
    description: 'Join our newsletter for exclusive insights on Web3, content creation, and digital innovation.',
    images: ['https://base.tube/images/og-card.webp'],
  },
};

export default function NewsletterPage() {
  return (
    <Layout>
      <div className="newsletter-page">
        <div className="newsletter-hero">
          <div className="hero-background">
            <div className="hero-particles"></div>
            <div className="hero-gradient"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">📧</span>
              <span>Newsletter</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-line">Join the</span>
              <span className="title-line gradient-text">Revolution</span>
            </h1>
            
            <p className="hero-subtitle">
              Be the first to know about the latest in Web3 content creation
            </p>
          </div>
        </div>
        
        <NewsletterSignup 
          title="Welcome to the Future of Content"
          subtitle="Get weekly insights, exclusive content, and early access to new features. Join content creators who are already ahead of the curve."
          showIcon={false}
        />
        
        <section className="newsletter-benefits">
          <div className="benefits-container">
            <h2 className="benefits-title">What You&apos;ll Get</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="benefit-title">Exclusive Insights</h3>
                <p className="benefit-description">
                  Get insider knowledge about Web3 trends, content monetization, and platform updates before anyone else.
                </p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="benefit-title">Community Access</h3>
                <p className="benefit-description">
                  Connect with like-minded creators, share experiences, and collaborate on groundbreaking projects.
                </p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h3 className="benefit-title">Early Access</h3>
                <p className="benefit-description">
                  Be among the first to try new features, beta programs, and exclusive tools for content creators.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 