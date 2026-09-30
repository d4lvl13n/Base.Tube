'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DOCS_URL = 'https://base-tube.gitbook.io/base.tube-documentation';

const LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: '/content-pass', label: 'Content Pass' },
  { href: '/ai-thumbnails', label: 'AI Thumbnails' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: DOCS_URL, label: 'Docs', external: true },
];

/**
 * The site's top bar: clear over the page, dark glass once it scrolls. On phones the links fold into
 * a menu button; the "Start creating" button (the platform's sign-up) stays visible on every screen size.
 */
export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the phone menu on navigation and with Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const links = LINKS.map(({ href, label, external }) => (
    <li key={href}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link
          href={href}
          className={isActive(href) ? 'active' : ''}
          aria-current={isActive(href) ? 'page' : undefined}
          onClick={() => setOpen(false)}
        >
          {label}
        </Link>
      )}
    </li>
  ));

  return (
    <nav className={`v2-nav${scrolled || open ? ' v2-nav--scrolled' : ''}`} aria-label="Main">
      <div className="v2-nav-inner">
        <Link href="/" className="v2-nav-logo">
          <Image
            src="/images/basetube-logo.png"
            alt="Base.Tube"
            width={120}
            height={40}
            priority
            className="v2-nav-logo-img"
          />
        </Link>

        <ul className="v2-nav-links">{links}</ul>

        <div className="v2-nav-actions">
          <a href="https://beta.base.tube/sign-up" target="_blank" rel="noopener noreferrer" className="v2-nav-cta">
            Start creating
          </a>
          <button
            type="button"
            className="v2-nav-menu"
            aria-expanded={open}
            aria-controls="v2-nav-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className={`v2-nav-menu-icon${open ? ' is-open' : ''}`} />
          </button>
        </div>
      </div>

      <ul id="v2-nav-panel" className={`v2-nav-panel${open ? ' is-open' : ''}`} hidden={!open}>
        {links}
      </ul>
    </nav>
  );
}
