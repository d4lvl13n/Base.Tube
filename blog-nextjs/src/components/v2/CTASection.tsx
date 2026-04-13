import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function CTASection() {
  return (
    <section className="v2-cta">
      <div className="v2-cta-glow" aria-hidden />

      <div className="v2-container">
        <ScrollReveal>
        <div className="v2-cta-content">
          <h2>
            Ready to own<br />your audience?
          </h2>
          <p>
            Stop renting fans. Build an audience that grows with you —
            and earns with you.
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
            <Link href="/blog" className="v2-btn v2-btn-ghost">
              Read the blog →
            </Link>
          </div>

          <p className="v2-cta-fine">Free to join beta. No credit card required.</p>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
