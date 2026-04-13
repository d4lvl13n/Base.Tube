'use client'

import { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercentage = Math.min((scrolled / maxHeight) * 100, 100);
      
      setProgress(progressPercentage);
      setIsVisible(scrolled > 100); // Show after scrolling 100px
    };

    const throttledUpdate = throttle(updateProgress, 16); // ~60fps
    window.addEventListener('scroll', throttledUpdate);
    
    // Initial calculation
    updateProgress();
    
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  return (
    <div className={`reading-progress-container ${isVisible ? 'visible' : ''}`}>
      <div className="reading-progress-bar">
        <div 
          className="reading-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="reading-progress-text">
        {Math.round(progress)}% read
      </div>
    </div>
  );
}

// Throttle function to improve performance
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