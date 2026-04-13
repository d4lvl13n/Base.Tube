'use client';

import Link from 'next/link';

interface MegaMenuProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function MegaMenu({ isMenuOpen, onToggleMenu }: MegaMenuProps) {
  return (
    <>
      {/* Glass Morphism Mega Menu */}
      <div className={`mega-menu-floating ${isMenuOpen ? 'active' : ''}`}>
        <div className="mega-menu-container">
          <div className="mega-menu-glass-card">
            {/* Morph Background Effects */}
            <div className="menu-morph-gradient morph-1"></div>
            <div className="menu-morph-gradient morph-2"></div>
            <div className="menu-morph-gradient morph-3"></div>
            
            <div className="mega-menu-content">
              <nav className="mega-menu-nav">
                <Link href="/" className="mega-menu-link" onClick={onToggleMenu}>
                  <span className="menu-link-text">Home</span>
                  <span className="menu-link-underline"></span>
                </Link>
                
                <a 
                  href="https://base-tube.gitbook.io" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mega-menu-link" 
                  onClick={onToggleMenu}
                >
                  <span className="menu-link-text">Learn More</span>
                  <span className="menu-link-underline"></span>
                </a>
                
                <a 
                  href="https://base-tube.gitbook.io/base.tube-documentation/tokenomics" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mega-menu-link" 
                  onClick={onToggleMenu}
                >
                  <span className="menu-link-text">Tokenomics</span>
                  <span className="menu-link-underline"></span>
                </a>
                
                <Link href="/blog" className="mega-menu-link" onClick={onToggleMenu}>
                  <span className="menu-link-text">Blog</span>
                  <span className="menu-link-underline"></span>
                </Link>
                
                <a
                  href="https://beta.base.tube/sign-up" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mega-menu-link mega-menu-cta" 
                  onClick={onToggleMenu}
                >
                  <span className="menu-link-text">Join Beta</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for menu */}
      <div 
        className={`menu-overlay-glass ${isMenuOpen ? 'active' : ''}`}
        onClick={onToggleMenu}
      />
    </>
  );
} 