'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  minHeight?: string;
}

export default function LazySection({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  minHeight = '100vh'
}: LazySectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsInView(true);
            // Small delay to ensure smooth loading
            setTimeout(() => {
              setIsLoaded(true);
            }, 100);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoaded, threshold, rootMargin]);

  return (
    <div
      ref={sectionRef}
      className={`lazy-section ${className} ${isLoaded ? 'loaded' : ''}`}
      style={{ minHeight: !isLoaded ? minHeight : 'auto' }}
    >
      {!isLoaded && fallback}
      {isInView && children}
    </div>
  );
} 