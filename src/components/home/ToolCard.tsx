import React from 'react';
import Link from 'next/link';
import Icon, { IconName } from '@/components/icons/Icons';
import { CategoryId } from '@/lib/tools-catalog';
import { OWNER_EMAIL } from '@/config/site';
import ToolArt from './ToolArt';
import styles from './ToolCard.module.css';

interface ToolCardProps {
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  tags?: [string, (string | undefined)?];
  icon: IconName;
  isNew?: boolean;
  isUpdated?: boolean;
  variant?: 'default' | 'action' | 'suggest';
}

/** Short category labels for the chip on the illustration. */
const CATEGORY_LABEL: Record<CategoryId, string> = {
  concrete: 'Concrete & Masonry',
  gravel: 'Gravel & Pavers',
  earthwork: 'Earthwork & Paving',
  framing: 'Framing & Roofing',
  finishes: 'Floors & Paint',
  business: 'Business & Creative',
  engineering: '3D Printing & CNC',
};

export default function ToolCard({
  slug,
  name,
  category,
  description,
  tags,
  icon,
  isNew,
  isUpdated,
  variant = 'default',
}: ToolCardProps) {
  const isSuggest = variant === 'suggest';
  const catClass = styles[`cat-${category}`] || '';

  if (isSuggest) {
    return (
      <a
        href={`mailto:${OWNER_EMAIL}?subject=Tool%20Suggestion%20for%20KKC%20Tools`}
        className={`${styles.card} ${styles.cardSuggest} ${catClass}`}
      >
        <div className={styles.art} aria-hidden="true">
          <ToolArt name="plus" />
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.footer}>
          <span className={styles.cta}>
            Send a suggestion
            <span className={styles.ctaArrow} aria-hidden="true">
              <Icon name="arrowRight" size={15} strokeWidth={2.2} />
            </span>
          </span>
        </div>
      </a>
    );
  }

  return (
    <Link href={slug} className={`${styles.card} ${catClass}`}>
      <div className={styles.art}>
        <span className={styles.catChip}>{CATEGORY_LABEL[category]}</span>
        {isNew && <span className={styles.badgeNew}>NEW</span>}
        {!isNew && isUpdated && <span className={styles.badgeUpdated}>UPDATED</span>}
        <div className={styles.artInner} aria-hidden="true">
          <ToolArt name={icon} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.iconTile} aria-hidden="true">
            <Icon name={icon} size={20} strokeWidth={1.9} />
          </span>
          <h3 className={styles.title}>{name}</h3>
        </div>
        <p className={styles.description}>{description}</p>
        {tags && tags[0] && (
          <div className={styles.tagsGroup}>
            <span className={styles.tag}>{tags[0]}</span>
            {tags[1] && <span className={styles.tag}>{tags[1]}</span>}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.cta}>
          Open tool
          <span className={styles.ctaArrow} aria-hidden="true">
            <Icon name="arrowRight" size={15} strokeWidth={2.2} />
          </span>
        </span>
        <span className={styles.meta}>Free · No sign-up</span>
      </div>
    </Link>
  );
}
