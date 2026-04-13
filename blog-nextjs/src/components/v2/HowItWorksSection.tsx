const creatorSteps = [
  {
    n: '01',
    title: 'Connect your YouTube channel',
    desc: 'Verify ownership in seconds. No migration — you keep uploading where you always have.',
  },
  {
    n: '02',
    title: 'Set your price and supply',
    desc: 'Choose how many passes to sell and at what price. Our algorithm advises based on your audience size.',
  },
  {
    n: '03',
    title: 'Gate your best content',
    desc: 'Mark any unlisted YouTube video as exclusive. Fans with a pass get in. Your public videos stay free.',
  },
  {
    n: '04',
    title: 'Get paid instantly',
    desc: 'No net-30, no minimums. Paid at purchase — plus 5% every time your pass changes hands, forever.',
  },
];

const fanSteps = [
  {
    n: '01',
    title: 'Buy a Content Pass',
    desc: 'One-time purchase with a credit card or crypto. No wallet required. No recurring charges.',
  },
  {
    n: '02',
    title: 'Access all exclusive content',
    desc: 'Watch everything the creator has gated — now and anything they add in the future.',
  },
  {
    n: '03',
    title: 'Keep or sell when you\'re done',
    desc: 'Finished watching? Sell your pass on the marketplace. Your access was never a sunk cost.',
  },
];

import ScrollReveal from './ScrollReveal';

export default function HowItWorksSection() {
  return (
    <section className="v2-hiw" id="how-it-works">
      <div className="v2-container">
        <ScrollReveal>
          <span className="v2-label">How It Works</span>
          <div className="v2-hiw-header">
            <h2>Simple for creators.<br />Simple for fans.</h2>
            <p>
              No platform migration. No wallet setup required. Connect your YouTube,
              set your price, start earning — in under five minutes.
            </p>
          </div>
        </ScrollReveal>

        <div className="v2-hiw-cols">
          {/* Creator column */}
          <ScrollReveal delay={100}>
          <div>
            <div className="v2-hiw-col-title">For Creators</div>
            <div className="v2-hiw-steps">
              {creatorSteps.map((s) => (
                <div key={s.n} className="v2-hiw-step">
                  <span className="v2-hiw-step-num">{s.n}</span>
                  <div>
                    <div className="v2-hiw-step-title">{s.title}</div>
                    <div className="v2-hiw-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          <div className="v2-hiw-divider" />

          {/* Fan column */}
          <ScrollReveal delay={220}>
          <div>
            <div className="v2-hiw-col-title">For Fans</div>
            <div className="v2-hiw-steps">
              {fanSteps.map((s) => (
                <div key={s.n} className="v2-hiw-step">
                  <span className="v2-hiw-step-num">{s.n}</span>
                  <div>
                    <div className="v2-hiw-step-title">{s.title}</div>
                    <div className="v2-hiw-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Footer strip */}
        <ScrollReveal delay={100}>
        <div className="v2-hiw-footer">
          <p className="v2-hiw-footer-text">
            Creator earns. Fan owns. <em>Everyone wins.</em>
          </p>
          <a
            href="https://beta.base.tube/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="v2-btn v2-btn-primary"
          >
            Start for free
          </a>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
