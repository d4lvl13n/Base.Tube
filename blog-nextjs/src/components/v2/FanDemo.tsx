'use client';

export default function FanDemo() {
  return (
    <div className="fd-wrap" aria-hidden>
      {/* Step indicator */}
      <div className="fd-steps-bar">
        <div className="fd-dot fd-dot--1" />
        <div className="fd-dot-line" />
        <div className="fd-dot fd-dot--2" />
        <div className="fd-dot-line" />
        <div className="fd-dot fd-dot--3" />
      </div>

      {/* ── Step 1: Buy with card or crypto ───── */}
      <div className="fd-step fd-step--1">
        <div className="fd-step-num">Step 1</div>
        <div className="fd-step-title">Buy a Content Pass</div>
        <div className="fd-buy-card">
          <div className="fd-buy-thumb" />
          <div className="fd-buy-info">
            <div className="fd-buy-creator">@EpicGaming</div>
            <div className="fd-buy-name">Content Pass</div>
          </div>
          <div className="fd-buy-price">$20</div>
        </div>
        <div className="fd-pay-toggle">
          <div className="fd-pay-opt fd-pay-opt--card">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
            Card
          </div>
          <div className="fd-pay-opt fd-pay-opt--crypto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Crypto
          </div>
        </div>
        <div className="fd-buy-btn">
          <span className="fd-buy-btn-text">Buy now — $20</span>
          <span className="fd-buy-btn-shimmer" />
        </div>
        <div className="fd-buy-check">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span>Pass purchased</span>
        </div>
      </div>

      {/* ── Step 2: Unlock premium content ────── */}
      <div className="fd-step fd-step--2">
        <div className="fd-step-num">Step 2</div>
        <div className="fd-step-title">Unlock premium content</div>
        <div className="fd-player">
          <div className="fd-player-screen">
            {/* Fake video gradient */}
            <div className="fd-player-visual" />
            {/* Play button */}
            <div className="fd-player-play">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </div>
            {/* Progress bar */}
            <div className="fd-player-bar">
              <div className="fd-player-progress" />
            </div>
            {/* Branding */}
            <div className="fd-player-brand">BASE.TUBE</div>
          </div>
          {/* Unlock badge */}
          <div className="fd-player-unlock">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" /></svg>
            <span>Pass holder access</span>
          </div>
        </div>
      </div>

      {/* ── Step 3: Own it — forever ──────────── */}
      <div className="fd-step fd-step--3">
        <div className="fd-step-num">Step 3</div>
        <div className="fd-step-title">Own it — forever</div>
        <div className="fd-own-list">
          <div className="fd-buy-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span>Buy once — access never expires</span>
          </div>
          <div className="fd-buy-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span>No subscription, no monthly reset</span>
          </div>
          <div className="fd-buy-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span>Transfer or gift your pass anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
