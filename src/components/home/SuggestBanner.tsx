import React from 'react';
import Icon from '@/components/icons/Icons';
import styles from './SuggestBanner.module.css';

export default function SuggestBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.textCol}>
            <span className={styles.eyebrow}>HAVE A PROJECT IN MIND?</span>
            <h2 className={styles.title}>Can&apos;t find the exact calculator you need?</h2>
            <p className={styles.lead}>
              Tell us what trade, construction material, or estimate problem you&apos;re tackling. We build and release new tools regularly.
            </p>
          </div>

          <div className={styles.actionCol}>
            <a
              href="mailto:contact@kkctools.com?subject=New%20Tool%20Suggestion%20for%20KKC%20Tools"
              className={styles.ctaButton}
            >
              <span>Suggest a Tool</span>
              <Icon name="arrowRight" size={16} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
