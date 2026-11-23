import React from 'react';
import Icon, { IconName } from '@/components/icons/Icons';
import { CATEGORIES, getToolsByCategory, type CategoryId } from '@/lib/tools-catalog';
import styles from './CategoryTiles.module.css';

export const CATEGORY_ICONS: Record<CategoryId, IconName> = {
  concrete: 'slab',
  gravel: 'stonePile',
  earthwork: 'road',
  framing: 'roofTruss',
  finishes: 'paintRoller',
  business: 'clipboard',
  engineering: 'printer3d',
  math: 'mathSymbols',
};

const ORDER: CategoryId[] = ['concrete', 'gravel', 'earthwork', 'framing', 'finishes', 'business', 'engineering', 'math'];

/** Colourful jump links to each category section on the home page. */
export default function CategoryTiles() {
  return (
    <section className={styles.section} aria-labelledby="browse-categories">
      <div className={styles.container}>
        <h2 id="browse-categories" className={styles.heading}>
          Pick a trade <span className={styles.headingSoft}>and jump straight to its tools</span>
        </h2>
        <ul className={styles.grid}>
          {ORDER.map((id) => {
            const count = getToolsByCategory(id).length;
            return (
              <li key={id}>
                <a href={`#${id}`} className={`${styles.tile} ${styles[id]}`}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon name={CATEGORY_ICONS[id]} size={24} strokeWidth={1.9} />
                  </span>
                  <span className={styles.name}>{CATEGORIES[id].name}</span>
                  <span className={styles.meta}>
                    {count} {count === 1 ? 'tool' : 'tools'}
                    <span className={styles.arrow} aria-hidden="true">
                      ↓
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
