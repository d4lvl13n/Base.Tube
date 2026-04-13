'use client'

import { useState } from 'react';

interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export default function NewsletterSignup({ 
  title = "Stay Ahead of the Curve",
  subtitle = "Get exclusive insights on the future of content creation and digital innovation",
  showIcon = true,
  compact = false
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('https://formspree.io/f/mvgrqevw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          _subject: 'New Base.Tube Newsletter Subscription',
          _replyto: email,
          source: 'Base.Tube Website'
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome aboard! Check your email for confirmation.');
        setEmail('');
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      // Log error for debugging and satisfy linter
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <section className={`newsletter-signup ${compact ? 'compact' : ''}`}>
      <div className="newsletter-container">
        <div className="newsletter-background">
          <div className="newsletter-particles"></div>
          <div className="newsletter-gradient"></div>
        </div>
        
        <div className="newsletter-content">
          {showIcon && (
            <div className="newsletter-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
          )}
          
          <div className="newsletter-text">
            <h2 className="newsletter-title">{title}</h2>
            <p className="newsletter-subtitle">{subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <div className="email-input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="newsletter-email-input"
                  disabled={status === 'loading'}
                  required
                />
                <button
                  type="submit"
                  className={`newsletter-submit-btn ${status}`}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Pioneers</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              {message && (
                <div className={`form-message ${status}`}>
                  {status === 'success' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  ) : status === 'error' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  ) : null}
                  <span>{message}</span>
                </div>
              )}
            </div>
          </form>
          
          <div className="newsletter-features">
            <div className="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>Weekly insights</span>
            </div>
            <div className="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>Exclusive content</span>
            </div>
            <div className="feature-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>No spam, ever</span>
            </div>
          </div>
          
          <div className="newsletter-social-proof">
            <div className="proof-avatars">
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar-more">+</div>
            </div>
            <span className="proof-text">Join content creators</span>
          </div>
        </div>
      </div>
    </section>
  );
} 