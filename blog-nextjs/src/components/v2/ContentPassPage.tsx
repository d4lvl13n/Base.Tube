import Link from 'next/link';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const creatorStepsExpanded = [
  {
    n: '01',
    title: 'Connect your YouTube channel',
    detail:
      'Verify channel ownership via OAuth in seconds. You keep uploading to YouTube exactly as you do today — no migration, no re-encoding, no new CMS to learn. Base.Tube reads your unlisted video list and nothing else.',
  },
  {
    n: '02',
    title: 'Set your price and supply',
    detail:
      'Choose a fixed supply (e.g. 500 passes) and a launch price (e.g. $20). Our algorithm surfaces comparable channels as benchmarks, but the decision is yours. You can raise or lower the price for new pass issuances later — existing pass holders are never affected. You cannot issue more passes beyond your declared supply without explicitly relaunching.',
  },
  {
    n: '03',
    title: 'Gate your best content',
    detail:
      'Mark any unlisted YouTube video as exclusive in the dashboard. Your public videos stay free and publicly indexed — gating is opt-in per video. If you delete a gated video, pass holders lose access to that specific video, but their pass remains valid for all other gated content. Deleting your channel from the platform does not invalidate passes already sold — existing holders retain their resale rights.',
  },
  {
    n: '04',
    title: 'Get paid — instantly, every week',
    detail:
      'Revenue from pass sales clears to your account immediately. Payouts are processed every Tuesday with no minimum threshold. Supported currencies: USD, EUR, GBP; crypto payouts available on request. 5% resale royalties are tracked on-chain and added to your weekly payout automatically — no manual claims.',
  },
];

const fanStepsExpanded = [
  {
    n: '01',
    title: 'Buy a Content Pass',
    detail:
      'Purchase with Visa, Mastercard, Apple Pay, or crypto. No wallet required at purchase — you get a pass that lives in your Base.Tube account. You can claim it to a self-custody wallet later if you want to trade it on external marketplaces, but that\'s optional.',
  },
  {
    n: '02',
    title: 'Access all exclusive content, forever',
    detail:
      'Watch everything the creator has gated — all past videos and everything they publish in the future, for as long as you hold the pass. There are no recurring charges and no expiry date.',
  },
  {
    n: '03',
    title: 'Sell when you\'re done',
    detail:
      'List your pass on the Base.Tube marketplace at any price you choose. The marketplace takes no cut beyond the platform\'s 5% fee (paid by the buyer). If the creator\'s channel grows and demand for passes increases, your pass may be worth more than you paid. If you simply want to leave, you recover most of your cost.',
  },
];

const faqs = [
  {
    q: 'What if a fan charges back their purchase?',
    a: 'Chargebacks are handled at the payment processor level. If a chargeback is upheld, the pass is revoked and the creator\'s next payout is adjusted accordingly. Persistent chargeback abuse results in the buyer\'s account being restricted.',
  },
  {
    q: 'Can I refund a fan directly?',
    a: 'Yes. Creators can issue a full refund within 48 hours of purchase via the dashboard. The pass is revoked upon refund. After 48 hours, the fan\'s only exit option is the secondary marketplace.',
  },
  {
    q: 'What happens if I delete gated content?',
    a: 'Pass holders lose access to that specific video. Their pass remains fully valid for all other gated content. We recommend archiving rather than deleting — you can remove a video from the gated list without deleting it.',
  },
  {
    q: 'Can I change the price of new passes after launch?',
    a: 'Yes. Price changes apply only to passes issued after the change. Existing passes are not affected and trade freely at market price on the secondary market.',
  },
  {
    q: 'What if my YouTube channel gets terminated?',
    a: 'If your YouTube channel is terminated by YouTube, gated content becomes inaccessible. Existing pass holders can still sell their passes on the secondary market. We\'re actively working on native video hosting so creators can host independently of YouTube — watch the roadmap.',
  },
  {
    q: 'Do I need a crypto wallet as a creator?',
    a: 'No. Passes are blockchain-backed but you interact entirely through a standard web interface. Payouts can be in fiat (USD/EUR/GBP) via bank transfer or card. Crypto wallets and on-chain mechanics are optional for both creators and fans.',
  },
  {
    q: 'How do fans resell passes? Is there a marketplace fee?',
    a: 'Fans list passes in the Base.Tube marketplace from their account dashboard. The platform charges the buyer a 5% fee on the secondary sale price. The creator automatically receives 5% of each secondary sale as a royalty, enforced by the smart contract — no manual action required.',
  },
  {
    q: 'What countries are supported?',
    a: 'Creators in most countries can receive payouts via Stripe Connect (currently available in 40+ countries). Fans can purchase from anywhere with a supported payment method. Country coverage is expanding — check the docs for the current list.',
  },
  {
    q: 'How are taxes handled?',
    a: 'Base.Tube issues annual 1099/transaction summaries to creators in supported jurisdictions. You\'re responsible for reporting your own income. We do not withhold tax. Consult a tax professional for your specific situation — creator income tax treatment varies by country.',
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
                The complete guide to<br />
                <em>Content Passes.</em>
              </h1>
              <p className="v2-cp-sub">
                If you came here from the landing page, you want mechanics — not pitch.
                This covers exactly how Content Passes work, what you earn, and what
                your audience gets. No fluff.
              </p>
              <div className="v2-cp-hero-actions">
                <a
                  href="https://beta.base.tube/sign-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v2-btn v2-btn-primary"
                >
                  Start Creating
                </a>
                <Link href="/" className="v2-btn v2-btn-ghost">
                  Back to overview
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── WHAT IT IS ─────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">What it is</span>
              <h2 className="v2-cp-section-h2">One pass. Lifetime access. Resellable.</h2>
            </ScrollReveal>
            <div className="v2-cp-prose">
              <ScrollReveal delay={80}>
                <p>
                  A Content Pass is a tradeable membership token. One purchase gives a fan
                  lifetime access to all of a creator&apos;s gated content — everything published
                  so far and everything they add in the future. There are no recurring charges,
                  no renewal reminders, and no expiry date.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={140}>
                <p>
                  Unlike subscriptions, a pass never auto-renews. If a fan finishes watching
                  and wants to leave, they sell their pass on the Base.Tube marketplace. The
                  next buyer gets the exact same access. The creator earns a 5% royalty on
                  that sale — enforced by the smart contract, not dependent on the creator
                  doing anything.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p>
                  Creators set a fixed supply. If you issue 500 passes at $20 each, there
                  will never be more than 500 in circulation. Scarcity is real. Secondary
                  market price is determined by fan demand — if your channel grows, so does
                  the value of existing passes.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── CREATOR SIDE ───────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">For Creators</span>
              <h2 className="v2-cp-section-h2">How it works on your end.</h2>
            </ScrollReveal>
            <div className="v2-cp-steps">
              {creatorStepsExpanded.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 80}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num">{s.n}</div>
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

        {/* ── FAN SIDE ───────────────────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">For Fans</span>
              <h2 className="v2-cp-section-h2">What your audience actually gets.</h2>
            </ScrollReveal>
            <div className="v2-cp-steps">
              {fanStepsExpanded.map((s, i) => (
                <ScrollReveal key={s.n} delay={i * 80}>
                  <div className="v2-cp-step">
                    <div className="v2-cp-step-num">{s.n}</div>
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
              <h2 className="v2-cp-section-h2">The numbers, in full.</h2>
            </ScrollReveal>

            {/* Split breakdown */}
            <ScrollReveal delay={80}>
              <div className="v2-econ-split">
                <div className="v2-econ-split-item orange">
                  <span className="v2-econ-pct">90%</span>
                  <span className="v2-econ-who">Creator</span>
                  <span className="v2-econ-note">On every primary sale</span>
                </div>
                <div className="v2-econ-split-item">
                  <span className="v2-econ-pct">5%</span>
                  <span className="v2-econ-who">Platform</span>
                  <span className="v2-econ-note">Base.Tube fee</span>
                </div>
                <div className="v2-econ-split-item">
                  <span className="v2-econ-pct">5%</span>
                  <span className="v2-econ-who">Processing</span>
                  <span className="v2-econ-note">Payment processor</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Worked example */}
            <ScrollReveal delay={160}>
              <div className="v2-econ-example">
                <div className="v2-econ-example-title">Worked example — primary sale</div>
                <div className="v2-econ-example-body">
                  <p>
                    A creator sells <strong>500 passes at $20</strong> each.
                    Gross revenue: <strong>$10,000</strong>.
                  </p>
                  <div className="v2-econ-table">
                    <div className="v2-econ-row">
                      <span>Creator receives</span>
                      <span className="orange">$9,000</span>
                    </div>
                    <div className="v2-econ-row">
                      <span>Platform fee (5%)</span>
                      <span>$500</span>
                    </div>
                    <div className="v2-econ-row">
                      <span>Payment processing (5%)</span>
                      <span>$500</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Resale example */}
            <ScrollReveal delay={240}>
              <div className="v2-econ-example">
                <div className="v2-econ-example-title">Worked example — secondary resale</div>
                <div className="v2-econ-example-body">
                  <p>
                    Six months later, a fan resells their pass for <strong>$35</strong>
                    {' '}(channel grew, demand up).
                  </p>
                  <div className="v2-econ-table">
                    <div className="v2-econ-row">
                      <span>Creator royalty (5%)</span>
                      <span className="orange">$1.75</span>
                    </div>
                    <div className="v2-econ-row">
                      <span>Seller receives</span>
                      <span className="green">$31.50</span>
                    </div>
                    <div className="v2-econ-row">
                      <span>Platform fee (5%, paid by buyer)</span>
                      <span>$1.75</span>
                    </div>
                  </div>
                  <p className="v2-econ-note-text">
                    The creator earns $1.75 passively. The original seller made a $15.50 profit on a $20 investment. The new buyer pays $35 + $1.75 fee = $36.75 total — for the same lifetime access the first fan had.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Payout schedule */}
            <ScrollReveal delay={300}>
              <div className="v2-econ-payout">
                <span className="v2-feature-tag green" style={{ marginBottom: 16 }}>Payouts</span>
                <p>
                  <strong>Every Tuesday.</strong> No minimum threshold. Revenue from both primary
                  sales and secondary royalties is batched and paid weekly. Supported currencies:
                  USD, EUR, GBP via bank transfer (Stripe Connect). Crypto payouts available on
                  request through the dashboard.
                </p>
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
              <h2 className="v2-cp-section-h2">The questions worth asking.</h2>
            </ScrollReveal>
            <div className="v2-faq">
              {faqs.map((item, i) => (
                <ScrollReveal key={i} delay={i * 40}>
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
                <h2>Ready to launch<br />your pass?</h2>
                <p>
                  Connect your YouTube channel, set your supply and price, and start
                  earning — in under five minutes.
                </p>
                <div className="v2-cta-actions">
                  <a
                    href="https://beta.base.tube/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-btn v2-btn-primary"
                  >
                    Start Creating
                  </a>
                  <Link href="/" className="v2-btn v2-btn-ghost">
                    Back to overview
                  </Link>
                </div>
                <p className="v2-cta-fine">Free to join beta. No credit card required.</p>
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
