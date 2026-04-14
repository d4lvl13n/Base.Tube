import Link from 'next/link';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';

function Sep() {
  return <div className="v2-sep" aria-hidden />;
}

const tools = [
  {
    slug: 'ctr-optimizer',
    color: 'orange' as const,
    accent: '#ff801f',
    accentSoft: 'rgba(255,128,31,0.10)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    name: 'CTR Optimizer',
    tag: 'No signup required',
    desc: 'Upload any YouTube thumbnail and get an instant CTR score with a breakdown of exactly what\'s working and what to fix.',
    features: [
      'Face & text detection with prominence scoring',
      'Contrast and legibility analysis',
      'Benchmarked against 300k+ real thumbnails',
    ],
    cta: 'Try it free →',
    href: '/tools/ctr-optimizer',
  },
  {
    slug: 'thumbnail-generator',
    color: 'blue' as const,
    accent: '#3b9eff',
    accentSoft: 'rgba(59,158,255,0.10)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    name: 'Thumbnail Generator',
    tag: 'Free tier: 3/day',
    desc: 'Describe your video, get 4 AI-generated thumbnail variants ranked by projected CTR. Optimized for click, not for pretty.',
    features: [
      '4 variants per generation, each with CTR projection',
      'Trained on high-performing thumbnail patterns',
      'Optional reference image for style matching',
    ],
    cta: 'Generate free →',
    href: '/tools/thumbnail-generator',
  },
];

export default function ToolsPage() {
  return (
    <div className="v2-root">
      <div className="v2-grain" aria-hidden />
      <NavBar />

      <main style={{ paddingTop: 56 }}>

        {/* ── HEADER ───────────────────────────────────────── */}
        <section className="v2-tools-hero">
          <div className="v2-container">
            <ScrollReveal>
              <span className="v2-label">Creator Toolkit</span>
              <h1 className="v2-cp-h1">
                Free tools for creators.<br />
                <em>Built in-house.</em>
              </h1>
              <p className="v2-cp-sub">
                Every tool is free, requires no account for basic use, and is built
                on models we train ourselves — not generic wrappers.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Sep />

        {/* ── TOOL CARDS ───────────────────────────────────── */}
        <section className="v2-tools-cards-section">
          <div className="v2-container">
            <div className="v2-tool-cards">
              {tools.map((tool, i) => (
                <ScrollReveal key={tool.slug} delay={i * 120}>
                  <div
                    className="v2-tool-card"
                    style={{ '--tool-accent': tool.accent, '--tool-accent-soft': tool.accentSoft } as React.CSSProperties}
                  >
                    <div className="v2-tool-card-top">
                      <div className="v2-tool-card-icon" style={{ color: tool.accent }}>
                        {tool.icon}
                      </div>
                      <span className="v2-tool-card-tag">{tool.tag}</span>
                    </div>
                    <h3 className="v2-tool-card-name">{tool.name}</h3>
                    <p className="v2-tool-card-desc">{tool.desc}</p>
                    <ul className="v2-tool-card-features">
                      {tool.features.map((f) => (
                        <li key={f}>
                          <span className="v2-tool-card-check" style={{ color: tool.accent }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={tool.href} className="v2-tool-card-cta" style={{ background: tool.accent }}>
                      {tool.cta}
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Sep />

        {/* ── WHY WE BUILD TOOLS ───────────────────────────── */}
        <section className="v2-cp-section">
          <div className="v2-container v2-tools-why">
            <ScrollReveal>
              <span className="v2-label">Why these exist</span>
              <h2 className="v2-cp-section-h2" style={{ maxWidth: 600 }}>
                We invest in your growth before asking for anything.
              </h2>
            </ScrollReveal>
            <div className="v2-cp-prose" style={{ maxWidth: 680 }}>
              <ScrollReveal delay={80}>
                <p>
                  Base.Tube makes money when creators successfully monetize their audience —
                  not when they pay a SaaS subscription. The tools are free because better
                  thumbnails mean more views, more fans, and higher Content Pass value.
                  That flywheel benefits everyone, whether or not you ever use our
                  monetization platform.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <p>
                  We built these tools to understand what creators actually need to grow.
                  The CTR Optimizer was trained on 300k+ thumbnails across categories and
                  audience sizes. The Generator was built because we kept seeing creators
                  spend hours on Canva for thumbnails that underperformed simpler alternatives.
                  These are not side projects — they&apos;re core to what Base.Tube is building.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={220}>
                <Link href="/content-pass" className="v2-tools-why-link">
                  Learn about Content Pass →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <Sep />

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="v2-cta">
          <div className="v2-cta-glow" aria-hidden />
          <div className="v2-container">
            <ScrollReveal>
              <div className="v2-cta-content">
                <h2>Grow first.<br />Monetize when you&apos;re ready.</h2>
                <p>Start with a free tool. No account, no commitment.</p>
                <div className="v2-cta-actions">
                  <Link href="/tools/ctr-optimizer" className="v2-btn v2-btn-primary">
                    Try CTR Optimizer
                  </Link>
                  <Link href="/content-pass" className="v2-btn v2-btn-ghost">
                    How monetization works →
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
