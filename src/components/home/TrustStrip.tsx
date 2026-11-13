import React from 'react';
import Icon from '@/components/icons/Icons';
import { TOOLS_CATALOG } from '@/lib/tools-catalog';
import styles from './TrustStrip.module.css';

export default function TrustStrip() {
  const toolCount = TOOLS_CATALOG.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.item}>
          <div className={styles.iconCircle}>
            <Icon name="gridSearch" size={18} />
          </div>
          <div className={styles.textGroup}>
            <span className={styles.label}>{toolCount} Free Tools</span>
            <span className={styles.subtext}>Construction &amp; creative</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.item}>
          <div className={styles.iconCircle}>
            <Icon name="check" size={18} />
          </div>
          <div className={styles.textGroup}>
            <span className={styles.label}>No Sign-Up</span>
            <span className={styles.subtext}>No accounts, zero paywalls</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.item}>
          <div className={styles.iconCircle}>
            <Icon name="shield" size={18} />
          </div>
          <div className={styles.textGroup}>
            <span className={styles.label}>Private by Design</span>
            <span className={styles.subtext}>100% runs in your browser</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.item}>
          <div className={styles.iconCircle}>
            <Icon name="bookOpen" size={18} />
          </div>
          <div className={styles.textGroup}>
            <span className={styles.label}>Formulas Shown</span>
            <span className={styles.subtext}>Worked examples on every page</span>
          </div>
        </div>
      </div>
    </div>
  );
}

