'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  showArrow?: boolean;
  glowColor?: 'orange' | 'white' | 'blue';
  size?: 'small' | 'medium' | 'large';
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(({ 
  children, 
  showArrow = true,
  glowColor = 'orange',
  size = 'medium',
  className = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    small: 'px-5 py-2.5 text-sm gap-2',
    medium: 'px-7 py-3.5 text-base gap-3',
    large: 'px-9 py-4.5 text-lg gap-4'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <button 
      ref={ref}
      className={`glow-btn glow-${glowColor} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="btn-text">{children}</span>
      
      {showArrow && (
        <span className="btn-icon">
          <svg 
            className={iconSizes[size]}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      )}
      
      <div className="btn-glow-effect" />
      <div className="btn-pulse" />
    </button>
  );
});

GlowButton.displayName = 'GlowButton';

export default GlowButton; 