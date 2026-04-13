'use client'

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Extract headings from content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const items: TocItem[] = Array.from(headings).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;
      
      // Add ID to the heading for navigation
      heading.id = id;
      
      return { id, text, level };
    });
    
    setTocItems(items);

    // Update the actual DOM with IDs
    setTimeout(() => {
      const actualHeadings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
      actualHeadings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
      });
    }, 100);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 300);

      // Find the currently active heading
      const headingElements = tocItems.map(item => 
        document.getElementById(item.id)
      ).filter(Boolean);

      let currentActiveId = '';
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.getBoundingClientRect().top <= 100) {
          currentActiveId = element.id;
          break;
        }
      }
      
      setActiveId(currentActiveId);
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <div className={`table-of-contents ${isVisible ? 'visible' : ''}`}>
      <div className="toc-container">
        <button 
          className="toc-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle table of contents"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span>Contents</span>
        </button>
        
        <div className={`toc-content ${isExpanded ? 'expanded' : ''}`}>
          <div className="toc-header">
            <h3>Table of Contents</h3>
            <button 
              className="toc-close"
              onClick={() => setIsExpanded(false)}
              aria-label="Close table of contents"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <nav className="toc-nav">
            <ul className="toc-list">
              {tocItems.map((item) => (
                <li 
                  key={item.id} 
                  className={`toc-item level-${item.level} ${activeId === item.id ? 'active' : ''}`}
                >
                  <button
                    onClick={() => {
                      scrollToHeading(item.id);
                      setIsExpanded(false);
                    }}
                    className="toc-link"
                  >
                    <span className="toc-bullet"></span>
                    <span className="toc-text">{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="toc-progress">
            <div className="toc-progress-text">
              Reading Progress
            </div>
            <div className="toc-progress-bar">
              <div 
                className="toc-progress-fill"
                style={{ 
                  height: `${tocItems.length > 0 ? 
                    (tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length * 100 
                    : 0}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Throttle function for performance
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;

  return function (...args: Parameters<T>): void {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
} 