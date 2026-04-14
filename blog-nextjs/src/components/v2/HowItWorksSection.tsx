'use client';

import ContentPassDemo from './ContentPassDemo';
import FanDemo from './FanDemo';
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

        <div className="v2-hiw-demos">
          <ScrollReveal delay={100}>
            <div className="v2-hiw-demo-col">
              <div className="v2-hiw-demo-label orange">For Creators</div>
              <ContentPassDemo />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <div className="v2-hiw-demo-col">
              <div className="v2-hiw-demo-label orange">For Fans</div>
              <FanDemo />
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
