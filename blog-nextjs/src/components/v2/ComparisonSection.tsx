const rows = [
  {
    metric: 'Revenue from 1,000 true fans',
    youtube: '$10–40 / video',
    patreon: '$500–2,500 / month',
    basetube: '$10,000+ day one',
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
    basetube: '5%',
  },
  {
    metric: 'Fan exit when they cancel',
    youtube: 'Money gone',
    patreon: 'Money gone',
    basetube: 'Sell the pass',
  },
  {
    metric: 'Ongoing royalties',
    youtube: 'Ad views only',
    patreon: 'None',
    basetube: '5% on every resale',
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
        <div className="v2-table-wrap">
          <table className="v2-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>YouTube</th>
                <th>Patreon</th>
                <th className="v2-col-highlight">Base.Tube</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.metric}>
                  <td>{row.metric}</td>
                  <td className="dim">{row.youtube}</td>
                  <td className="dim">{row.patreon}</td>
                  <td className="v2-col-highlight">{row.basetube}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
