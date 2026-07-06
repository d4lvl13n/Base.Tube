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
    title: 'Keep it, or move on — your call',
    detail: 'If you\'re done, transfer your pass to another fan — you\'re not locked in like a subscription. Your access is yours to keep or hand off, on your terms.',
  },
];

const faqs = [
  {
    q: 'Isn\'t this just an NFT?',
    a: 'Content Passes use the same technology, but that\'s not the product. The product is a transferable membership with real utility — access to a creator\'s exclusive content. Fans buy with a credit card and never see a wallet unless they want one. The "NFT" part is invisible infrastructure.',
  },
  {
    q: 'Why not just use Patreon?',
    a: 'Patreon is rent. You pay $10/month for 12 months, you\'ve spent $120 — and when you leave, it\'s gone. On Base.Tube you buy once and own your access. When you\'re done, you can transfer it to another fan instead of losing everything. That\'s a fundamentally different relationship with the creator.',
  },
  {
    q: 'What if no one buys my pass?',
    a: 'You already have an audience. Even 1% of 5,000 followers is 50 passes. At $10 each, that\'s $500 from a single post — more than most creators make in a month on YouTube with that audience size. And that\'s not including transfer royalties.',
  },
  {
    q: 'Do I need a crypto wallet?',
    a: 'No. Fans buy with a credit card. Creators receive fiat payouts. Wallets are optional — you can claim a pass to a self-custody wallet later if you want to hold or transfer it on external marketplaces, but it\'s never required.',
  },
  {
    q: 'What if the creator stops making content?',
    a: 'Transfer your pass. That\'s the point. Subscriptions trap you — you stop paying and lose everything. A Content Pass lets you hand your access to another fan instead. You\'re never stuck with nothing.',
  },
  {
    q: 'What if my YouTube channel gets terminated?',
    a: 'You can host your content directly on Base.Tube — no YouTube dependency required. Native video hosting is already live on the platform. Your exclusive content stays accessible to pass holders regardless of what happens on YouTube.',
  },
  {
    q: 'Can I change the price of new passes after launch?',
    a: 'Yes. Price changes apply only to passes issued after the change. Existing pass holders are never affected — their pass can be transferred freely on the secondary market.',
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
                A Content Pass is ownership. Buy once, access forever, transfer anytime.
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
                      <span>No reward for being an early supporter</span>
                    </div>
                    <div className="v2-cp-comparison-row negative">
                      <span className="v2-cp-comparison-icon">✕</span>
                      <span>No exit, no ownership — just renting</span>
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
              <h2 className="v2-cp-section-h2">Buy once. Own forever. Transfer anytime.</h2>
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
                    <div className="v2-cp-solution-desc">Creators set a fixed number of passes. Scarcity keeps access exclusive.</div>
                  </div>
                </div>
                <div className="v2-cp-solution-item">
                  <span className="v2-cp-solution-icon orange">◆</span>
                  <div>
                    <div className="v2-cp-solution-title">Transferable anytime</div>
                    <div className="v2-cp-solution-desc">Not locked in. Transfer or hand off your pass whenever you want.</div>
                  </div>
                </div>
                <div className="v2-cp-solution-item">
                  <span className="v2-cp-solution-icon orange">◆</span>
                  <div>
                    <div className="v2-cp-solution-title">Truly yours</div>
                    <div className="v2-cp-solution-desc">No monthly bill, no expiry, and no switch-off when you stop paying — because you never were.</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="v2-cp-prose" style={{ marginTop: 40 }}>
              <ScrollReveal delay={120}>
                <p>
                  A Content Pass is a transferable membership. One purchase gives a fan lifetime
                  access to all of a creator&apos;s exclusive content — past and future — for as long
                  as they hold it. When they&apos;re done, they can pass it on. The next holder gets the
                  same access. The creator earns a 5% royalty each time a pass changes hands, written
                  into the smart contract.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={180}>
                <p>
                  Creators set a fixed supply. 500 passes means 500 passes — forever. That scarcity
                  is real, and it belongs to the creator. Your most committed fans get something
                  lasting — genuine ownership of their access, not a feed they rent by the month.
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
                Support creators<br />without being locked in.
              </h2>
              <p className="v2-cp-sub" style={{ marginBottom: 48 }}>
                Back the creators you believe in and get lasting access — not a subscription that
                vanishes when you stop paying. Change your mind? Hand your pass to another fan.
                You&apos;re never stuck.
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
              <div className="v2-cp-econ-label" style={{ marginTop: 48 }}>For Fans — what you&apos;re left with</div>
              <div className="v2-cp-econ-table">
                <div className="v2-cp-econ-row header">
                  <span>Scenario</span>
                  <span>Patreon (12 mo)</span>
                  <span>Content Pass</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>You keep watching</span>
                  <span className="muted">$120 spent, nothing to keep</span>
                  <span className="green">Lifetime access you own</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>Creator quits</span>
                  <span className="muted">–$120, gone forever</span>
                  <span className="yellow">Access you can still transfer</span>
                </div>
                <div className="v2-cp-econ-row">
                  <span>You change your mind</span>
                  <span className="muted">–$120, gone forever</span>
                  <span className="green">Hand your pass to another fan</span>
                </div>
                <div className="v2-cp-econ-row highlight">
                  <span>You stop paying</span>
                  <span className="muted">Access switched off</span>
                  <span className="green">Still yours — no monthly bill</span>
                </div>
              </div>
              <div className="v2-cp-econ-callout">
                You own it. You&apos;re never locked in.
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
                    Later, a holder transfers their pass to another fan. The creator earns a
                    <strong> 5% royalty</strong> automatically — ongoing income with no extra work,
                    written into the smart contract.
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
