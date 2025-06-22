'use client';

import Link from 'next/link';

interface MegaMenuProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function MegaMenu({ isMenuOpen, onToggleMenu }: MegaMenuProps) {
  return (
    <>
      {/* Mega Menu */}
      <div id="mega-menu" className={`mega-menu ${isMenuOpen ? 'active' : ''}`}>
        <nav>
          <ul>
            <li style={{'--i': 1} as React.CSSProperties}>
              <Link href="/" onClick={onToggleMenu}>Home</Link>
            </li>
            <li style={{'--i': 2} as React.CSSProperties}>
              <Link href="https://base-tube.gitbook.io" onClick={onToggleMenu}>Learn More</Link>
            </li>
            <li style={{'--i': 3} as React.CSSProperties}>
              <Link href="https://base-tube.gitbook.io/base.tube-documentation/tokenomics" onClick={onToggleMenu}>Tokenomics</Link>
            </li>
            <li style={{'--i': 4} as React.CSSProperties}>
              <Link href="/#investors" onClick={onToggleMenu}>Investors</Link>
            </li>
            <li style={{'--i': 5} as React.CSSProperties}>
              <Link href="/blog" onClick={onToggleMenu}>Blog</Link>
            </li>
            <li style={{'--i': 6} as React.CSSProperties}>
              <Link href="/roadmap" onClick={onToggleMenu}>Roadmap</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-overlay"
          onClick={onToggleMenu}
        />
      )}
    </>
  );
} 