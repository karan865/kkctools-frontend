import React from 'react';
import Link from 'next/link';
import Icon, { IconName } from '@/components/icons/Icons';
import { CategoryId } from '@/lib/tools-catalog';
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
        href="mailto:contact@kkctools.com?subject=Tool%20Suggestion%20for%20KKC%20Tools"
        className={`${styles.card} ${styles.cardSuggest}`}
        aria-label="Suggest a new tool or calculator"
      >
        <div className={styles.tileWrapper}>
          <div className={`${styles.iconTile} ${styles.suggestTile}`}>
            <Icon name="plus" size={22} strokeWidth={2} />
          </div>
        </div>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.bottomBar}>
          <span className={styles.suggestPrompt}>Send feedback</span>
          <div className={styles.arrowCircle}>
            <Icon name="arrowRight" size={14} strokeWidth={2.2} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <Link
      href={slug}
      className={`${styles.card} ${catClass}`}
      aria-label={`${name} – ${description}`}
    >
      <div className={styles.tileWrapper}>
        <div className={styles.iconTile}>
          <Icon name={icon} size={22} strokeWidth={1.8} />
        </div>
        {isNew && <span className={styles.badgeNew}>NEW</span>}
        {!isNew && isUpdated && <span className={styles.badgeUpdated}>UPDATED</span>}
      </div>

      <h3 className={styles.title}>{name}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.bottomBar}>
        <div className={styles.tagsGroup}>
          {tags && tags[0] && <span className={styles.tag}>{tags[0]}</span>}
          {tags && tags[1] && <span className={styles.tag}>{tags[1]}</span>}
        </div>
        <div className={styles.arrowCircle}>
          <Icon name="arrowRight" size={14} strokeWidth={2.2} />
        </div>
      </div>
    </Link>
  );
}

