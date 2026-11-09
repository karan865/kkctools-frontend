import React from 'react';
import styles from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  variant?: 'default' | 'surface' | 'hero';
  style?: React.CSSProperties;
}

export default function Section({ children, id, className = '', variant = 'default', style }: SectionProps) {
  const variantClass = variant === 'surface' ? styles.surface : variant === 'hero' ? styles.hero : styles.default;
  return (
    <section id={id} className={`${styles.section} ${variantClass} ${className}`} style={style}>
      {children}
    </section>
  );
}

