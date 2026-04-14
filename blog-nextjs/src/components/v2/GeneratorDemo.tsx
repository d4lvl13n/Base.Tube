'use client';

export default function GeneratorDemo() {
  return (
    <div className="gd-wrap" aria-hidden>
      {/* ── Input phase ───────────────────────── */}
      <div className="gd-input-phase">
        {/* Tab bar */}
        <div className="gd-tabs">
          <div className="gd-tab gd-tab--active">Free</div>
          <div className="gd-tab">CTR</div>
        </div>

        {/* Prompt area */}
        <div className="gd-prompt-area">
          <div className="gd-prompt-label">Describe Your Thumbnail</div>
          <div className="gd-prompt-text">
            <span className="gd-typing">Epic gaming PC build with RGB lights and dramatic smoke</span>
            <span className="gd-cursor" />
          </div>
        </div>

        {/* Style pills */}
        <div className="gd-styles">
          <div className="gd-style-label">Style</div>
          <div className="gd-style-row">
            <div className="gd-pill">Default</div>
            <div className="gd-pill gd-pill--pick">Cinematic</div>
            <div className="gd-pill">Vibrant</div>
          </div>
        </div>

        {/* Generate button */}
        <div className="gd-gen-btn">
          <span className="gd-gen-text">Generate thumbnails</span>
          <span className="gd-gen-shimmer" />
        </div>
      </div>

      {/* ── Output phase ──────────────────────── */}
      <div className="gd-output-phase">
        <div className="gd-results-label">4 variants generated</div>
        <div className="gd-results-grid">
          <div className="gd-thumb gd-thumb--1">
            <div className="gd-thumb-inner" />
            <div className="gd-thumb-score gd-thumb-score--best">8.4</div>
          </div>
          <div className="gd-thumb gd-thumb--2">
            <div className="gd-thumb-inner" />
            <div className="gd-thumb-score">7.1</div>
          </div>
          <div className="gd-thumb gd-thumb--3">
            <div className="gd-thumb-inner" />
            <div className="gd-thumb-score">6.8</div>
          </div>
          <div className="gd-thumb gd-thumb--4">
            <div className="gd-thumb-inner" />
            <div className="gd-thumb-score">5.9</div>
          </div>
        </div>
        <div className="gd-best-label">Highest CTR projected: Variant 1</div>
      </div>
    </div>
  );
}
