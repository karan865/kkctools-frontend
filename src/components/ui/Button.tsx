import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const vClass = styles[variant];
  const sClass = styles[size];
  const fwClass = fullWidth ? styles.fullWidth : '';

  return (
    <button
      className={`${styles.button} ${vClass} ${sClass} ${fwClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

