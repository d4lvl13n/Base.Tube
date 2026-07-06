const rows = [
  {
    metric: 'Revenue from 1,000 true fans',
    youtube: '$10–40 / video',
    patreon: '$500–2,500 / month',
    basetube: 'Day one',
  },
  {
    metric: 'Time to first $10k',
    youtube: '2–5 years',
    patreon: '6–18 months',
    basetube: 'One launch',
  },
  {
    metric: 'Platform take rate',
    youtube: '45%',
    patreon: '12%',
    basetube: '10%',
  },
  {
    metric: 'Fan exit when they leave',
    youtube: 'Money gone',
    patreon: 'Money gone',
    basetube: 'Keep or transfer it',
  },
  {
    metric: 'Creator earns on transfers',
    youtube: 'Ad views only',
    patreon: 'None',
    basetube: '5% each transfer',
  },
  {
    metric: 'Payout timing',
    youtube: 'Net 30–60 days',
    patreon: 'Monthly',
    basetube: 'Instant',
  },
];

import ScrollReveal from './ScrollReveal';

export default function ComparisonSection() {
  return (
    <section className="v2-comparison">
      <div className="v2-container">
        <ScrollReveal>
          <div className="v2-comparison-header">
            <span className="v2-label">The Economics</span>
            <h2>The math finally works.</h2>
            <p>
              A creator with 5,000 followers and 1,000 true fans.
              Run the numbers yourself.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="v2-cmp-grid">
            {/* Column headers */}
            <div className="v2-cmp-header-row">
              <div className="v2-cmp-metric-head" />
              <div className="v2-cmp-col-head">YouTube</div>
              <div className="v2-cmp-col-head">Patreon</div>
              <div className="v2-cmp-col-head v2-cmp-col-head--winner">
                Base.Tube
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div key={row.metric} className={`v2-cmp-row${i % 2 === 0 ? ' v2-cmp-row--alt' : ''}`}>
                <div className="v2-cmp-metric">{row.metric}</div>
                <div className="v2-cmp-cell v2-cmp-cell--dim">{row.youtube}</div>
                <div className="v2-cmp-cell v2-cmp-cell--dim">{row.patreon}</div>
                <div className="v2-cmp-cell v2-cmp-cell--win">{row.basetube}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
