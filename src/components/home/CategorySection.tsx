import React from 'react';
import Link from 'next/link';
import Icon, { IconName } from '@/components/icons/Icons';
import { CATEGORIES, type CategoryId } from '@/lib/tools-catalog';
import styles from './CategorySection.module.css';

interface CategorySectionProps {
  id: CategoryId;
  /** 1-based position on the page, shown as a large decorative numeral. */
  index: number;
  icon: IconName;
  toolCount: number;
  viewAllText: string;
  /** "split" = heading column on the left, 2×2 cards on the right; "stack" = heading on top, 4 cards across. */
  layout: 'split' | 'stack';
  /** Split layout only: put the heading column on the right. */
  flip?: boolean;
  children: React.ReactNode;
}

/** A home-page category band with its own colour, numeral and layout, so each section reads differently. */
export default function CategorySection({ id, index, icon, toolCount, viewAllText, layout, flip = false, children }: CategorySectionProps) {
  const cat = CATEGORIES[id];
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`${styles.section} ${styles[id]} ${layout === 'split' ? styles.split : styles.stack} ${index % 2 === 0 ? styles.even : ''} ${flip ? styles.flip : ''}`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.head}>
            <div className={styles.badgeRow}>
              <span className={styles.iconBadge} aria-hidden="true">
                <Icon name={icon} size={26} strokeWidth={1.9} />
              </span>
              <span className={styles.number} aria-hidden="true">
                {String(index).padStart(2, '0')}
              </span>
            </div>
            <p className={styles.eyebrow}>
              {cat.name} <span className={styles.count}>· {toolCount} tools</span>
            </p>
            <h2 id={titleId} className={styles.title}>
              {cat.headline}
            </h2>
            <p className={styles.blurb}>{cat.blurb}</p>
            <Link href={`/tools/#${id}`} className={styles.viewAll}>
              {viewAllText}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </header>
          <div className={styles.grid}>{children}</div>
        </div>
      </div>
    </section>
  );
}
