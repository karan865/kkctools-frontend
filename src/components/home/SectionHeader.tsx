import React from 'react';
import Link from 'next/link';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  eyebrow: string;
  categoryHue?: 'concrete' | 'gravel' | 'earthwork' | 'framing' | 'finishes' | 'business';
  title: string;
  titleId?: string;
  subtitle: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  eyebrow,
  categoryHue,
  title,
  titleId,
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
        <h2 id={titleId} className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {viewAllLink && (
        <Link href={viewAllLink} className={styles.viewAll}>
          <span>{viewAllText.replace(/\s*→\s*$/, '')}</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

