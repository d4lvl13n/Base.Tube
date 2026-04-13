import ScrollReveal from './ScrollReveal';

export default function FeaturesSection() {
  return (
    <section className="v2-features">
      <div className="v2-container">
        <ScrollReveal>
          <span className="v2-label">Why Base.Tube</span>
          <h2 className="v2-features-headline">
            Built for creators who think long-term.
          </h2>
          <p className="v2-features-sub">
            We built what should have existed from the start — monetization
            that works equally well for creators and fans.
          </p>
        </ScrollReveal>

        <div className="v2-bento">
          {/* Primary card — Content Pass (tall, left) */}
          <ScrollReveal className="v2-bento-primary-wrap">
            <div className="v2-bento-card primary">
              <span className="v2-feature-tag orange">Content Pass</span>
              <h3>Own your access,<br />not rent it.</h3>
              <p>
                Fans buy once and hold forever. When they leave, they sell —
                they never lose money. When the creator grows, their pass
                grows with them.
              </p>

              {/* Visual: pass lifecycle */}
              <div className="v2-bento-visual">
                <div className="v2-bento-lifecycle">
                  <div className="v2-bento-lifecycle-step">
                    <span className="v2-bento-lifecycle-num orange">01</span>
                    <span className="v2-bento-lifecycle-text">Fan buys pass once</span>
                  </div>
                  <div className="v2-bento-lifecycle-line" />
                  <div className="v2-bento-lifecycle-step">
                    <span className="v2-bento-lifecycle-num orange">02</span>
                    <span className="v2-bento-lifecycle-text">Accesses all content forever</span>
                  </div>
                  <div className="v2-bento-lifecycle-line" />
                  <div className="v2-bento-lifecycle-step">
                    <span className="v2-bento-lifecycle-num orange">03</span>
                    <span className="v2-bento-lifecycle-text">Resells if they leave</span>
                  </div>
                  <div className="v2-bento-lifecycle-line" />
                  <div className="v2-bento-lifecycle-step">
                    <span className="v2-bento-lifecycle-num orange">04</span>
                    <span className="v2-bento-lifecycle-text">Creator earns 5% on resale</span>
                  </div>
                </div>
              </div>

              <div className="v2-bento-quote">
                &ldquo;A fundamentally different relationship between creator and audience.&rdquo;
              </div>
            </div>
          </ScrollReveal>

          {/* Right column — 2 stacked cards */}
          <div className="v2-bento-stack">
            {/* Payments */}
            <ScrollReveal delay={150}>
              <div className="v2-bento-card">
                <span className="v2-feature-tag blue">Payments</span>
                <h3>Credit card simple.<br />Blockchain powered.</h3>
                <p>
                  No wallet required to buy a pass. Fans pay with a card like
                  any other product. Claim to a wallet later if they want.
                  Ownership first — web3 complexity optional.
                </p>
                <div className="v2-bento-payment-row">
                  <div className="v2-bento-payment-chip">Visa</div>
                  <div className="v2-bento-payment-chip">Mastercard</div>
                  <div className="v2-bento-payment-chip">Apple Pay</div>
                  <div className="v2-bento-payment-chip muted">+ Crypto</div>
                </div>
              </div>
            </ScrollReveal>

            {/* Economics */}
            <ScrollReveal delay={250}>
              <div className="v2-bento-card economics">
                <span className="v2-feature-tag green">Economics</span>
                <h3>You keep 90%.<br />Earn from resales forever.</h3>
                <p>
                  Not 55–70% like other platforms. 90% on every sale, plus
                  5% royalty on every resale — written into the smart contract.
                </p>
                <div className="v2-bento-stat-row">
                  <div className="v2-bento-mini-stat">
                    <span className="v2-bento-mini-val orange">90%</span>
                    <span className="v2-bento-mini-label">to creator</span>
                  </div>
                  <div className="v2-bento-mini-sep" />
                  <div className="v2-bento-mini-stat">
                    <span className="v2-bento-mini-val green">+5%</span>
                    <span className="v2-bento-mini-label">on every resale</span>
                  </div>
                  <div className="v2-bento-mini-sep" />
                  <div className="v2-bento-mini-stat">
                    <span className="v2-bento-mini-val">5%</span>
                    <span className="v2-bento-mini-label">platform fee</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
