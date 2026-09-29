'use client';

import { useEffect, useState } from 'react';

/** The header bar: clear over the hero, a dark glass bar once the page scrolls. */
export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? 'border-b border-white/[0.07] bg-[#070709]/75 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      {children}
    </header>
  );
}
