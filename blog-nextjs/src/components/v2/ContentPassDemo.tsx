'use client';

export default function ContentPassDemo() {
  return (
    <div className="cpd-wrap" aria-hidden>
      {/* Step indicator */}
      <div className="cpd-steps-bar">
        <div className="cpd-dot cpd-dot--1" />
        <div className="cpd-dot-line" />
        <div className="cpd-dot cpd-dot--2" />
        <div className="cpd-dot-line" />
        <div className="cpd-dot cpd-dot--3" />
        <div className="cpd-dot-line" />
        <div className="cpd-dot cpd-dot--4" />
      </div>

      {/* ── Step 1: Connect YouTube ──────────── */}
      <div className="cpd-step cpd-step--1">
        <div className="cpd-step-num">Step 1</div>
        <div className="cpd-yt-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
          </svg>
        </div>
        <div className="cpd-step-title">Connect your YouTube channel</div>
        <div className="cpd-yt-btn">
          <span className="cpd-yt-btn-text">Verify with Google</span>
        </div>
        <div className="cpd-yt-check">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Channel connected</span>
        </div>
      </div>

      {/* ── Step 2: Paste video URL ──────────── */}
      <div className="cpd-step cpd-step--2">
        <div className="cpd-step-num">Step 2</div>
        <div className="cpd-step-title">Paste your video link</div>
        <div className="cpd-url-field">
          <span className="cpd-url-typing">https://youtube.com/watch?v=dR4x...</span>
          <span className="cpd-cursor" />
        </div>
        <div className="cpd-video-card">
          <div className="cpd-video-thumb" />
          <div className="cpd-video-info">
            <div className="cpd-video-title">Epic Gaming PC Build 2026</div>
            <div className="cpd-video-meta">Unlisted &middot; 14:32</div>
          </div>
        </div>
      </div>

      {/* ── Step 3: Set price & supply ────────── */}
      <div className="cpd-step cpd-step--3">
        <div className="cpd-step-num">Step 3</div>
        <div className="cpd-step-title">Set your price &amp; supply</div>
        <div className="cpd-price-row">
          <div className="cpd-price-field">
            <div className="cpd-price-label">Price per pass</div>
            <div className="cpd-price-val">
              <span className="cpd-price-sign">$</span>
              <span className="cpd-price-num">20</span>
            </div>
          </div>
          <div className="cpd-price-field">
            <div className="cpd-price-label">Total supply</div>
            <div className="cpd-price-val">
              <span className="cpd-price-num">500</span>
              <span className="cpd-price-unit">passes</span>
            </div>
          </div>
        </div>
        <div className="cpd-revenue">
          <span className="cpd-revenue-label">Projected revenue</span>
          <span className="cpd-revenue-val">$9,000</span>
          <span className="cpd-revenue-note">after 10% platform fee</span>
        </div>
      </div>

      {/* ── Step 4: Content gated ────────────── */}
      <div className="cpd-step cpd-step--4">
        <div className="cpd-lock-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--v2-orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <div className="cpd-step-title">Your content is now gated</div>
        <div className="cpd-pass-preview">
          <div className="cpd-pass-card">
            <div className="cpd-pass-top">
              <span className="cpd-pass-tag">Content Pass</span>
              <span className="cpd-pass-price">$20</span>
            </div>
            <div className="cpd-pass-creator">Epic Gaming PC Build 2026</div>
            <div className="cpd-pass-bottom">
              <span className="cpd-pass-supply">487 / 500 remaining</span>
              <span className="cpd-pass-live">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
