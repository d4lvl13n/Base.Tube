'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(({ 
  children, 
  icon,
  size = 'medium',
  className = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    small: 'px-5 py-2.5 text-sm gap-2',
    medium: 'px-7 py-3.5 text-base gap-3',
    large: 'px-9 py-4.5 text-lg gap-4'
  };

  return (
    <button 
      ref={ref}
      className={`secondary-btn ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="btn-text">{children}</span>
      {icon && <span className="btn-icon">{icon}</span>}
      <div className="btn-border-glow" />
    </button>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton; 