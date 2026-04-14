import Link from 'next/link';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import ContentPassDemo from './ContentPassDemo';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const fanSteps = [
  {
    n: '01',
    title: 'Find a creator you believe in',
    detail: 'Not a creator you want to rent from — one you want to own a piece of. That distinction matters.',
  },
  {
    n: '02',
    title: 'Buy their Content Pass',
    detail: 'Pay with a credit card or crypto. No wallet required at checkout. No recurring charge. One payment, done.',
  },
  {
    n: '03',
    title: 'Access all exclusive content instantly',
    detail: 'Everything they\'ve gated — now and everything they add in the future — for as long as you hold the pass.',
  },
  {
    n: '04',
    title: 'Hold, grow, or exit — your call',
    detail: 'If you\'re done, list your pass on the marketplace at any price you choose. If the creator blows up, your pass is worth more. If they quit, you can still sell. Unlike a subscription, you always have an exit.',
  },
];

const faqs = [
  {
    q: 'Isn\'t this just an NFT?',
    a: 'Content Passes use the same technology, but that\'s not the product. The product is a tradeable membership with real utility — access to a creator\'s exclusive content. Fans buy with a credit card and never see a wallet unless they want one. The "NFT" part is invisible infrastructure.',
  },
  {
    q: 'Why not just use Patreon?',
    a: 'Patreon is rent. You pay $10/month for 12 months, you\'ve spent $120 — and when you leave, it\'s gone. On Base.Tube you buy once and can sell when you\'re done. Your $120 isn\'t gone; it\'s liquid. That\'s a fundamentally different relationship with the creator and with your money.',
  },
  {
    q: 'What if no one buys my pass?',
    a: 'You already have an audience. Even 1% of 5,000 followers is 50 passes. At $10 each, that\'s $500 from a single post — more than most creators make in a month on YouTube with that audience size. And that\'s not including resale royalties.',
  },
  {
    q: 'Do I need a crypto wallet?',
    a: 'No. Fans buy with a credit card. Creators receive fiat payouts. Wallets are optional — you can claim a pass to a self-custody wallet later if you want to trade it on external marketplaces, but it\'s never required.',
  },
  {
    q: 'What if the creator stops making content?',
    a: 'Sell your pass. That\'s the point. Subscriptions trap you — you stop paying and lose everything. A Content Pass gives you an exit. If the creator goes quiet and demand drops, you sell at a discount. You\'re never stuck.',
  },
  {
    q: 'What if my YouTube channel gets terminated?',
    a: 'You can host your content directly on Base.Tube — no YouTube dependency required. Native video hosting is already live on the platform. Your exclusive content stays accessible to pass holders regardless of what happens on YouTube.',
  },
  {
    q: 'Can I change the price of new passes after launch?',
    a: 'Yes. Price changes apply only to passes issued after the change. Existing pass holders are never affected — their pass trades freely at market price on the secondary market.',
  },
];

export default function ContentPassPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <section className="v2-cp-hero">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Content Pass</span>
              <h1 className="v2-cp-h1">
                Own your access.<br />
                <em>Exit when you want.</em>
              </h1>
              <p className="v2-cp-sub">
                Subscriptions are rent — you pay monthly and lose everything when you leave.
                A Content Pass is ownership. Buy once, access forever, sell anytime.
                The creator economy, but you actually own it.
              </p>
              <div className="v2-cp-hero-actions">
                <a
                  href="https://beta.base.tube/sign-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v2-btn v2-btn-primary"
                >
                  Create your first pass
                </a>
                <Link href="/" className="v2-btn v2-btn-ghost">
                  Back to overview
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── THE PROBLEM ────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The problem</span>
              <h2 className="v2-cp-section-h2">The math doesn&apos;t work. For anyone.</h2>
            </ScrollReveal>

            <div className="v2-cp-problem-grid">
              <ScrollReveal delay={80}>
                <div className="v2-cp-problem-card">
                  <div className="v2-cp-problem-who orange">For Creators</div>
                  <p className="v2-cp-problem-intro">
                    Small and mid-tier creators are trapped. Loyal communities,
                    no real income.
                  </p>
                  <div className="v2-cp-problem-table">
                    <div className="v2-cp-problem-row header">
                      <span>Platform</span>
                      <span>Reality at 5k followers</span>
                    </div>
                    <div className="v2-cp-problem-row">
                      <span>YouTube</span>
                      <span>5-10k views = $10–40/video. Years to meaningful income.</span>
                    </div>
                    <div className="v2-cp-problem-row">
                      <span>TikTok</span>
                      <span>Millions of views = pennies. No direct monetization path.</span>
                    </div>
                    <div className="v2-cp-problem-row">
                      <span>Patreon</span>
                      <span>2-5% conversion. 5k followers = ~150 subscribers = $750/mo before fees.</span>
                    </div>
                  </div>
                  <div className="v2-cp-problem-stat">
                    <span className="v2-cp-problem-stat-val">4.1 mo</span>
                    <span className="v2-cp-problem-stat-label">
                      Avg. Patreon subscriber retention (down from 8.2 mo in 2023). Fans aren&apos;t leaving creators — they&apos;re leaving subscriptions.
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="v2-cp-problem-card">
                  <div className="v2-cp-problem-who blue">For Fans</div>
                  <p className="v2-cp-problem-intro">
                    Subscriptions are a one-way street. You pay. You leave. It&apos;s gone.
                  </p>
                  <div className="v2-cp-comparison-list">
                    <div className="v2-cp-comparison-row negative">
                      <span className="v2-cp-comparison-icon">✕</span>
                      <span>$10/month × 12 months = $120 gone forever</span>
                    </div>
                    <div className="v2-cp-comparison-row negative">
                      <span className="v2-cp-comparison-icon">✕</span>
                      <span>Unsubscribe = lose everything instantly</span>
                    </div>
                    <div className="v2-cp-comparison-row negative">
                      <span className="v2-cp-comparison-icon">✕</span>
                      <span>No upside for being an early supporter</span>
                    </div>
                    <div className="v2-cp-comparison-row negative">
                      <span className="v2-cp-comparison-icon">✕</span>
                      <span>No exit, no liquidity, no ownership</span>
                    </div>
                    <div className="v2-cp-comparison-row negative">
                      <span className="v2-cp-comparison-icon">✕</span>
                      <span>You rent access. You never own anything.</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── WHAT IT IS ─────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">The solution</span>
              <h2 className="v2-cp-section-h2">Buy once. Own forever. Sell anytime.</h2>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="v2-cp-solution-box">
                <div className="v2-cp-solution-item">
                  <span className="v2-cp-solution-icon orange">◆</span>
                  <div>
                    <div className="v2-cp-solution-title">One-time purchase</div>
                    <div className="v2-cp-solution-desc">Not a subscription. Buy once, own forever. No monthly drain.</div>
                  </div>
                </div>
                <div className="v2-cp-solution-item">
                  <span className="v2-cp-solution-icon orange">◆</span>
                  <div>
                    <div className="v2-cp-solution-title">Limited supply</div>
                    <div className="v2-cp-solution-desc">Creators set a fixed number of passes. Scarcity creates real value.</div>
                  </div>
                </div>
                <div className="v2-cp-solution-item">
                  <span className="v2-cp-solution-icon orange">◆</span>
                  <div>
                    <div className="v2-cp-solution-title">Tradeable on marketplace</div>
                    <div className="v2-cp-solution-desc">Exit when you want. Sell at market price. Your access is liquid.</div>
                  </div>
                </div>
                <div className="v2-cp-solution-item">
                  <span className="v2-cp-solution-icon orange">◆</span>
                  <div>
                    <div className="v2-cp-solution-title">Price set by the market</div>
                    <div className="v2-cp-solution-desc">Not by the platform. If the creator grows, so does the value of your pass.</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="v2-cp-prose" style={{ marginTop: 40 }}>
              <ScrollReveal delay={120}>
                <p>
                  A Content Pass is a tradeable membership. One purchase gives a fan lifetime
                  access to all of a creator&apos;s exclusive content — past and future — for as long
                  as they hold it. When they&apos;re done, they sell. The next buyer gets the same access.
                  The creator earns a 5% royalty on that sale, written into the smart contract.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={180}>
                <p>
                  Creators set a fixed supply. 500 passes means 500 passes — forever. That scarcity
                  is real, and it belongs to the creator. If your channel grows and demand for passes
                  increases, existing holders benefit. Your true fans become your earliest investors.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={220}>
              <div className="v2-cp-proof-bar">
                <div className="v2-cp-proof-logo">TIME</div>
                <p className="v2-cp-proof-text">
                  When TIME Magazine gated premium content behind a one-time access pass in 2025, they saw a{' '}
                  <strong>30% increase in premium engagement</strong> and{' '}
                  <strong>22% quarterly digital revenue growth</strong>. The mechanic works at scale. We built it for creators.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── CREATOR STEPS ──────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <div className="v2-cp-how-layout">
              <ScrollReveal>
                <div className="v2-cp-how-copy">
                  <span className="v2-label">For Creators</span>
                  <h2 className="v2-cp-section-h2">
                    Earn the day you launch.<br />Not after years of grinding.
                  </h2>
                  <p className="v2-cp-sub">
                    No platform migration. No new upload workflow. Connect your YouTube,
                    set your price, and start earning — in under five minutes.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <ContentPassDemo />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── FAN STEPS ──────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">For Fans</span>
              <h2 className="v2-cp-section-h2">
                Support creators<br />with an exit strategy.
              </h2>
              <p className="v2-cp-sub" style={{ marginBottom: 48 }}>
                Early supporters should be rewarded. If the creator blows up, you benefit.
                If you change your mind, you sell. You&apos;re never stuck.
              </p>
            </ScrollReveal>
            <div className="v2-cp-steps">
              {fanSteps.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 70}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num" style={{ color: 'var(--v2-blue)' }}>{s.n}</div>
                    <div className="v2-cp-step-body">
                      <div className="v2-cp-step-title">{s.title}</div>
                      <p className="v2-cp-step-detail">{s.detail}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── ECONOMICS ──────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Economics</span>
              <h2 className="v2-cp-section-h2">The numbers that actually matter.</h2>
            </ScrollReveal>

            {/* Creator comparison */}
            <ScrollReveal delay={80}>
              <div className="v2-cp-econ-label">For Creators — income at 5k followers, 1,000 true fans</div>
              <div className="v2-cp-econ-table">
                <div className="v2-cp-econ-row header">
                  <span>Platform</span>
                  <span>Monthly</span>
                  <span>Time to $10k</span>
                  <span>Ongoing</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>YouTube</span>
                  <span className="muted">$100–400</span>
                  <span className="muted">2–5 years</span>
                  <span className="muted">Ad views only</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>Patreon</span>
                  <span className="muted">$5k–10k</span>
                  <span className="muted">1–2 years</span>
                  <span className="muted">Monthly drain on fans</span>
                </div>
                <div className="v2-cp-econ-row highlight">
                  <span>Base.Tube</span>
                  <span className="orange">Day 1</span>
                  <span className="orange">One sale</span>
                  <span className="orange">5% on all resales</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Fan comparison */}
            <ScrollReveal delay={160}>
              <div className="v2-cp-econ-label" style={{ marginTop: 48 }}>For Fans — what actually happens to your money</div>
              <div className="v2-cp-econ-table">
                <div className="v2-cp-econ-row header">
                  <span>Scenario</span>
                  <span>Patreon (12 mo)</span>
                  <span>Content Pass</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>Creator stagnates</span>
                  <span className="muted">–$120 (gone forever)</span>
                  <span className="yellow">–$5 (sell at discount)</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>Creator quits</span>
                  <span className="muted">–$120 (gone forever)</span>
                  <span className="yellow">–$10 (worst case)</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>Creator grows 2×</span>
                  <span className="muted">–$120 (no upside)</span>
                  <span className="green">+$10 profit</span>
                </div>
                <div className="v2-cp-econ-row highlight">
                  <span>Creator goes viral</span>
                  <span className="muted">–$120 (no upside)</span>
                  <span className="green">+$90 profit</span>
                </div>
              </div>
              <div className="v2-cp-econ-callout">
                Capped downside. Uncapped upside.
              </div>
            </ScrollReveal>

            {/* Revenue split */}
            <ScrollReveal delay={240}>
              <div className="v2-cp-econ-label" style={{ marginTop: 48 }}>Revenue split — every primary sale</div>
              <div className="v2-econ-split" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="v2-econ-split-item orange">
                  <span className="v2-econ-pct">90%</span>
                  <span className="v2-econ-who">Creator</span>
                  <span className="v2-econ-note">Paid at purchase</span>
                </div>
                <div className="v2-econ-split-item">
                  <span className="v2-econ-pct">10%</span>
                  <span className="v2-econ-who">Platform</span>
                  <span className="v2-econ-note">Base.Tube fee</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Worked example */}
            <ScrollReveal delay={300}>
              <div className="v2-econ-example">
                <div className="v2-econ-example-title">Worked example — 500 passes at $20</div>
                <div className="v2-econ-example-body">
                  <p>Gross: <strong>$10,000</strong>. Here&apos;s where it goes.</p>
                  <div className="v2-econ-table">
                    <div className="v2-econ-row">
                      <span>Creator receives immediately</span>
                      <span className="orange">$9,000</span>
                    </div>
                    <div className="v2-econ-row">
                      <span>Platform fee (10%)</span>
                      <span>$1,000</span>
                    </div>
                  </div>
                  <p>
                    Six months later a fan resells at <strong>$35</strong> (channel grew).
                    Creator earns <strong>$1.75 royalty</strong>, automatically. No action required.
                    Fan made a <strong>$15.50 profit</strong> on a $20 purchase.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">FAQ</span>
              <h2 className="v2-cp-section-h2">The objections, answered.</h2>
            </ScrollReveal>
            <div className="v2-faq">
              {faqs.map((item, i) => (
                <ScrollReveal key={i} delay={i * 35}>
                  <details className="v2-faq-item">
                    <summary className="v2-faq-q">{item.q}</summary>
                    <p className="v2-faq-a">{item.a}</p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="v2-cta">
          <div className="v2-cta-glow" aria-hidden />
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-cta-content">
                <h2>
                  Stop grinding.<br />
                  <em className="v2-cta-em-orange">Start owning.</em>
                </h2>
                <p>
                  Every creator who ever built something real started before
                  the world was ready. This is that moment.
                </p>
                <div className="v2-cta-actions">
                  <a
                    href="https://beta.base.tube/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary v2-btn-primary--lg"
                  >
                    Launch my first pass →
                  </a>
                  <Link href="/" className="v2-btn v2-btn-ghost">
                    Back to overview
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>

      <Sep />
      <Footer />
    </div>
  );
}
