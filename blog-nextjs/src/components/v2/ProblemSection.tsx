const rows = [
  {
    platform: 'YouTube',
    take: '45%',
    payout: 'Net 60 days',
    exit: '✗ None',
    bad: true,
  },
  {
    platform: 'Patreon',
    take: '12%',
    payout: 'Monthly',
    exit: '✗ None',
    bad: true,
  },
  {
    platform: 'Base.Tube',
    take: '5%',
    payout: 'Instant',
    exit: '✓ Resell',
    bad: false,
  },
];

import ScrollReveal from './ScrollReveal';

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
          <div className="v2-problem-text">
            <h2>
              Subscriptions are broken.<br />
              For everyone.
            </h2>
            <p style={{ marginTop: 20 }}>
              Fans pay monthly, lose everything when they cancel, and get
              nothing for being early. Creators get paid for views, not loyalty
              — and watch their income reset to zero the moment someone hits
              &ldquo;unsubscribe.&rdquo;
            </p>
            <p style={{ marginTop: 16 }}>
              No reward for being first. No exit if you change your mind.
              No upside for either side.
            </p>
          </div>
          </ScrollReveal>

          {/* Right: comparison mini-table */}
          <ScrollReveal delay={220}>
          <div className="v2-problem-table">
            {/* Header */}
            <div className="v2-ptable-row head">
              <div className="v2-ptable-cell">Platform</div>
              <div className="v2-ptable-cell">Take rate</div>
              <div className="v2-ptable-cell">Fan exit?</div>
            </div>

            {rows.map((r) => (
              <div key={r.platform} className="v2-ptable-row">
                <div className={`v2-ptable-cell label ${!r.bad ? 'good' : ''}`}>
                  {r.platform}
                </div>
                <div className={`v2-ptable-cell ${r.bad ? 'bad' : 'good'}`}>
                  {r.take}
                </div>
                <div className={`v2-ptable-cell ${r.bad ? 'bad' : 'good'}`}>
                  {r.exit}
                </div>
              </div>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
