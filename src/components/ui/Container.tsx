import React from 'react';
import styles from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'normal' | 'prose' | 'narrow';
}

export default function Container({ children, className = '', size = 'normal' }: ContainerProps) {
  const sizeClass = size === 'prose' ? styles.prose : size === 'narrow' ? styles.narrow : styles.normal;
  return <div className={`${styles.container} ${sizeClass} ${className}`}>{children}</div>;
}

