'use client';

import ScrollReveal from './ScrollReveal';
import ProblemDemo from './ProblemDemo';

export default function ProblemSection() {
  return (
    <section className="v2-problem">
      <div className="v2-container">
        <ScrollReveal>
          <span className="v2-label">The Problem</span>
        </ScrollReveal>

        <div className="v2-problem-grid">
          {/* Left: copy */}
          <ScrollReveal delay={100}>
          <div className="v2-problem-text v2-problem-text--spaced">
            <h2>
              Subscriptions are broken.<br />
              For everyone.
            </h2>
            <p>
              Fans pay monthly, lose everything when they cancel, and get
              nothing for being early. Creators get paid for views, not loyalty
              — and watch their income reset to zero the moment someone hits
              &ldquo;unsubscribe.&rdquo;
            </p>
            <p>
              No reward for being first. No exit if you change your mind.
              No upside for either side.
            </p>
            <div>
              <a
                href="/content-pass"
                className="v2-btn v2-btn-primary"
              >
                There&apos;s a better way →
              </a>
            </div>
          </div>
          </ScrollReveal>

          {/* Right: animated comparison */}
          <ScrollReveal delay={220}>
            <ProblemDemo />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
