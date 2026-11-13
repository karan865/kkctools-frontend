import React from 'react';
import Link from 'next/link';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  eyebrow: string;
  categoryHue?: 'concrete' | 'gravel' | 'earthwork' | 'framing' | 'finishes' | 'business';
  title: string;
  subtitle: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  eyebrow,
  categoryHue,
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View all →',
}: SectionHeaderProps) {
  const dotClass = categoryHue ? styles[`dot-${categoryHue}`] : '';

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.eyebrowGroup}>
          {categoryHue && <span className={`${styles.dot} ${dotClass}`} />}
          <span className={styles.eyebrow}>{eyebrow}</span>
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {viewAllLink && (
        <Link href={viewAllLink} className={styles.viewAll}>
          <span>{viewAllText}</span>
          <span className={styles.arrow}>→</span>
        </Link>
      )}
    </div>
  );
}

