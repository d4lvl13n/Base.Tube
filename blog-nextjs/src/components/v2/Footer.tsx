import Link from 'next/link';

const socials = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/base_tube',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/SDdDCjGZHw',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/basetubeofficial/',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

/** The free tools, in the order of the /tools page. */
const tools = [
  { href: '/youtube-thumbnail-size', label: 'Thumbnail size checker' },
  { href: '/tools/youtube-thumbnail-resizer', label: 'Thumbnail resizer' },
  { href: '/tools/youtube-thumbnail-preview', label: 'Thumbnail preview' },
  { href: '/tools/youtube-thumbnail-tester', label: 'Thumbnail tester' },
  { href: '/tools/youtube-title-checker', label: 'Title checker' },
  { href: '/tools/video-to-thumbnail', label: 'Video to thumbnail' },
];

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-grid">
        {/* Brand */}
        <div>
          <div className="v2-footer-brand-name">
            Base<em>.</em>Tube
          </div>
          <p className="v2-footer-brand-tag">
            The creator hub.
            <br />
            Publish, sell to your fans, grow.
          </p>
          <div className="v2-footer-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-footer-social-link"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Product */}
        <nav aria-label="Product">
          <div className="v2-footer-col-title">Product</div>
          <ul className="v2-footer-links">
            <li><Link href="/ai-thumbnails">AI Thumbnails</Link></li>
            <li><Link href="/content-pass">Content Pass</Link></li>
            <li>
              <a href="https://beta.base.tube/ai-thumbnails/audit" {...external}>
                Channel Audit <span className="v2-footer-tag">beta</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Free tools */}
        <nav aria-label="Free tools">
          <div className="v2-footer-col-title">
            <Link href="/tools">Free tools</Link>
          </div>
          <ul className="v2-footer-links">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href}>{tool.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company */}
        <nav aria-label="Company">
          <div className="v2-footer-col-title">Company</div>
          <ul className="v2-footer-links">
            <li><Link href="/blog">Blog</Link></li>
            <li>
              <a href="https://base-tube.gitbook.io/base.tube-documentation" {...external}>
                Docs
              </a>
            </li>
            <li>
              <a href="https://discord.gg/SDdDCjGZHw" {...external}>
                Community
              </a>
            </li>
            <li><a href="mailto:support@base.tube">Contact</a></li>
          </ul>
        </nav>
      </div>

      <div className="v2-footer-bottom">
        <span className="v2-footer-copy">© 2026 Base.Tube</span>
        <div className="v2-footer-legal">
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-and-conditions">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
