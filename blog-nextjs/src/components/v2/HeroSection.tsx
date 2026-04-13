export default function HeroSection() {
  return (
    <section className="v2-hero">
      <div className="v2-hero-content">

        {/* Badge — animates in first */}
        <div className="v2-hero-badge v2-anim-1">
          <span className="v2-hero-badge-dot" aria-hidden />
          Genesis Pass — only 500 ever issued
        </div>

        {/* Display serif headline — the Resend moment */}
        <h1 className="v2-hero-headline v2-anim-2">
          Stop renting fans.<br />
          <em>Own</em> your audience.
        </h1>

        <p className="v2-hero-sub v2-anim-3">
          Content Passes your fans buy once, hold forever, and resell when
          they leave. You keep 90% upfront — and earn from every resale.
        </p>

        <div className="v2-hero-actions v2-anim-4">
          <a
            href="https://beta.base.tube/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="v2-btn v2-btn-primary"
          >
            Start Creating
          </a>
          <a href="#how-it-works" className="v2-btn v2-btn-ghost">
            How it works →
          </a>
        </div>

        <p className="v2-hero-fine v2-anim-5">
          Free to join beta · No credit card required
        </p>

        {/* Stats strip — last to appear */}
        <div className="v2-hero-stats v2-anim-6">
          <div className="v2-hero-stat">
            <div className="v2-hero-stat-value">90%</div>
            <div className="v2-hero-stat-label">Revenue to creator</div>
          </div>
          <div className="v2-hero-stat">
            <div className="v2-hero-stat-value">+5%</div>
            <div className="v2-hero-stat-label">Royalty on every resale</div>
          </div>
          <div className="v2-hero-stat">
            <div className="v2-hero-stat-value">$0</div>
            <div className="v2-hero-stat-label">Wallet needed to buy</div>
          </div>
          <div className="v2-hero-stat">
            <div className="v2-hero-stat-value">Instant</div>
            <div className="v2-hero-stat-label">Payouts, every Tuesday</div>
          </div>
        </div>

      </div>
    </section>
  );
}
