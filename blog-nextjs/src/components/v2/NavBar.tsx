'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className={`v2-nav${scrolled ? ' v2-nav--scrolled' : ''}`}>
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

        <ul className="v2-nav-links">
          <li>
            <Link href="/content-pass" className={isActive('/content-pass') ? 'active' : ''}>
              Content Pass
            </Link>
          </li>
          <li>
            <Link href="/tools" className={isActive('/tools') ? 'active' : ''}>
              Tools
            </Link>
          </li>
          <li>
            <Link href="/blog" className={isActive('/blog') ? 'active' : ''}>
              Blog
            </Link>
          </li>
          <li>
            <a
              href="https://base-tube.gitbook.io/base.tube-documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
          </li>
        </ul>

        <a
          href="https://beta.base.tube/sign-up"
          target="_blank"
          rel="noopener noreferrer"
          className="v2-nav-cta"
        >
          Join Beta →
        </a>
      </div>
    </nav>
  );
}
