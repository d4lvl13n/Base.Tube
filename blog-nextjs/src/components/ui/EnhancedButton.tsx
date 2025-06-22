'use client';

import React, { forwardRef } from 'react';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showShimmer?: boolean;
  showGlow?: boolean;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    icon,
    size = 'medium',
    showShimmer = true,
    showGlow = true,
    className = '',
    ...props 
  }, ref) => {
    const sizeClasses = {
      small: 'enhanced-btn-sm',
      medium: 'enhanced-btn-md',
      large: 'enhanced-btn-lg'
    };

    return (
      <button
        ref={ref}
        className={`enhanced-btn ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {showGlow && <div className="enhanced-btn-glow"></div>}
        <div className="enhanced-btn-content">
          <span className="enhanced-btn-text">{children}</span>
          {icon && (
            <div className="enhanced-btn-icon">
              {icon}
            </div>
          )}
        </div>
        {showShimmer && <div className="enhanced-btn-shimmer"></div>}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton; 