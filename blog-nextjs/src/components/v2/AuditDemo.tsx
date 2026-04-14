'use client';

export default function AuditDemo() {
  return (
    <div className="ad-wrap" aria-hidden>
      {/* ── Input phase ───────────────────────── */}
      <div className="ad-input-phase">
        {/* Tab bar */}
        <div className="ad-tabs">
          <div className="ad-tab ad-tab--active">Image URL</div>
          <div className="ad-tab">Upload</div>
          <div className="ad-tab">YouTube</div>
        </div>

        {/* URL input */}
        <div className="ad-url-field">
          <span className="ad-url-typing">https://youtube.com/vi/thumb_hq.jpg</span>
          <span className="ad-cursor" />
        </div>

        {/* Context fields */}
        <div className="ad-context">
          <div className="ad-context-label">Video context</div>
          <div className="ad-context-fields">
            <div className="ad-field">
              <span className="ad-field-text ad-field-fill">Epic Gaming PC Build</span>
            </div>
            <div className="ad-field">
              <span className="ad-field-text ad-field-fill ad-field-fill--2">Gaming</span>
            </div>
          </div>
        </div>

        {/* Analyze button */}
        <div className="ad-btn">
          <span className="ad-btn-text">Analyze thumbnail</span>
          <span className="ad-btn-shimmer" />
        </div>
      </div>

      {/* ── Output phase ──────────────────────── */}
      <div className="ad-output-phase">
        {/* Score ring */}
        <div className="ad-score-block">
          <div className="ad-ring">
            <svg viewBox="0 0 80 80" className="ad-ring-svg">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--v2-orange)" strokeWidth="5"
                strokeDasharray="213.6" strokeDashoffset="213.6" strokeLinecap="round"
                className="ad-ring-fill" />
            </svg>
            <div className="ad-ring-val">6.1</div>
          </div>
          <div className="ad-score-label">Above Average</div>
          <div className="ad-score-title">CTR Score</div>
        </div>

        {/* Stats row */}
        <div className="ad-stats-row">
          <div className="ad-stat-card">
            <span className="ad-stat-val">3.3%</span>
            <span className="ad-stat-label">Est. CTR</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-val">3</span>
            <span className="ad-stat-label">Strengths</span>
          </div>
          <div className="ad-stat-card">
            <span className="ad-stat-val">3</span>
            <span className="ad-stat-label">To fix</span>
          </div>
        </div>

        {/* Metric cards */}
        <div className="ad-metrics">
          <div className="ad-metric ad-metric--1">
            <span className="ad-metric-score">7.0</span>
            <span className="ad-metric-name">Readability</span>
          </div>
          <div className="ad-metric ad-metric--2">
            <span className="ad-metric-score">7.0</span>
            <span className="ad-metric-name">Contrast</span>
          </div>
          <div className="ad-metric ad-metric--3">
            <span className="ad-metric-score">6.0</span>
            <span className="ad-metric-name">Composition</span>
          </div>
          <div className="ad-metric ad-metric--4">
            <span className="ad-metric-score">5.0</span>
            <span className="ad-metric-name">Brightness</span>
          </div>
        </div>
      </div>
    </div>
  );
}
