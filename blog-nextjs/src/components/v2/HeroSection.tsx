export default function HeroSection() {
  return (
    <section className="v2-hero">
      <div className="v2-hero-content">

        {/* Badge — animates in first */}
        <div className="v2-hero-badge v2-anim-1">
          <span className="v2-hero-badge-dot" aria-hidden />
          Beta is live
        </div>

        {/* Display serif headline — the Resend moment */}
        <h1 className="v2-hero-headline v2-anim-2">
          Stop renting fans.<br />
          <em>Own</em> your audience.
        </h1>

        <p className="v2-hero-sub v2-anim-3">
          Your audience has always been your greatest asset.
          We built the infrastructure to make it theirs too.
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



      </div>
    </section>
  );
}
