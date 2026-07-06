'use client';

export default function ProblemDemo() {
  return (
    <div className="pbd-wrap" aria-hidden>
      {/* ── Phase 1: The Drain ────────────────── */}
      <div className="pbd-phase pbd-phase--drain">
        <div className="pbd-phase-label">Subscription</div>
        <div className="pbd-drain-display">
          <div className="pbd-drain-months">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={`pbd-drain-bar pbd-drain-bar--${i + 1}`}>
                <span className="pbd-drain-bar-fill" />
              </div>
            ))}
          </div>
          <div className="pbd-drain-counter">
            <span className="pbd-drain-amt">$120</span>
            <span className="pbd-drain-sub">spent over 12 months</span>
          </div>
        </div>
        <div className="pbd-drain-exit">
          <span className="pbd-drain-exit-label">You cancel.</span>
        </div>
        <div className="pbd-drain-result">
          <span className="pbd-drain-zero">$0</span>
          <span className="pbd-drain-zero-sub">Value remaining</span>
        </div>
      </div>

      {/* ── Divider ───────────────────────────── */}
      <div className="pbd-divider">
        <span className="pbd-divider-or">or</span>
      </div>

      {/* ── Phase 2: The Own ──────────────────── */}
      <div className="pbd-phase pbd-phase--own">
        <div className="pbd-phase-label pbd-phase-label--good">Content Pass</div>
        <div className="pbd-own-payment">
          <span className="pbd-own-once">$20</span>
          <span className="pbd-own-once-sub">one time</span>
        </div>
        <div className="pbd-own-timeline">
          <div className="pbd-own-access">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span>12 months of access</span>
          </div>
          <div className="pbd-own-grow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v2-orange)" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            <span>One payment &rarr; access never expires</span>
          </div>
        </div>
        <div className="pbd-own-exit">
          <span className="pbd-own-exit-label">You leave.</span>
        </div>
        <div className="pbd-own-result">
          <span className="pbd-own-profit">Yours</span>
          <span className="pbd-own-profit-sub">Access you keep or transfer</span>
        </div>
      </div>

      {/* ── Bottom line ───────────────────────── */}
      <div className="pbd-bottom">
        <span className="pbd-bottom-text">
          Same creator. Same content. Same 12 months.
        </span>
      </div>
    </div>
  );
}
