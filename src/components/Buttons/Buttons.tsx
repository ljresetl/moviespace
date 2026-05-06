import React from 'react';
import './buttons.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, variant = 'primary', onClick, className = '' }: ButtonProps) => {
  const variantClass = variant === 'primary' ? 'btnPrimary' : variant === 'secondary' ? 'btnSecondary' : 'btnGhost';
  
  return (
    <button className={`btn ${variantClass} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};