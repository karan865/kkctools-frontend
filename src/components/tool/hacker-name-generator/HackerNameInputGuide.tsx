'use client';

import React from 'react';
import type { HackerStyle, LeetLevel } from '@/lib/hacker-name-engine';
import styles from './HackerNameInputGuide.module.css';

interface HackerNameInputGuideProps {
  activeTab: 'generate' | 'favourites';
  styleChoice: HackerStyle;
  seedWord: string;
  leetLevel: LeetLevel;
  minLength: number;
  maxLength: number;
  allowUnderscore: boolean;
  allowSpaces: boolean;
  favouritesCount: number;
  focusedField?: string | null;
}

export default function HackerNameInputGuide({
  activeTab,
  styleChoice,
  seedWord,
  leetLevel,
  minLength,
  maxLength,
  allowUnderscore,
  allowSpaces,
  favouritesCount,
  focusedField,
}: HackerNameInputGuideProps) {
  const cleanSeed = seedWord.trim() || 'ghost';
  const rulesText = `${minLength}–${maxLength} chars · ${
    allowSpaces ? 'spaces on' : 'no spaces'
  }${allowUnderscore ? ' · _' : ''}`;

  const renderDiagram = () => {
    if (activeTab === 'favourites') {
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 640 120"
          role="img"
          aria-label="Favourites saved locally in browser"
        >
          <rect x="12" y="12" width="616" height="96" rx="8" className={styles.terminalBg} />
          <text x="28" y="44" className={styles.monoLabel}>
            ☆ Saved handles ({favouritesCount} stored on this device)
          </text>
          <text x="28" y="68" className={styles.subLabel}>
            Stored only in your browser localStorage. Copy individually or remove anytime.
          </text>
        </svg>
      );
    }

    return (
      <svg
        className={styles.svg}
        viewBox="0 0 640 138"
        role="img"
        aria-label="Terminal guide showing style, seed word, leet level, and username rules"
      >
        <rect x="12" y="10" width="616" height="118" rx="8" className={styles.terminalBg} />
        <rect x="12" y="10" width="616" height="24" rx="8" className={styles.terminalHeader} />
        <text x="24" y="26" className={styles.subLabel}>
          terminal — handle generator
        </text>

        <text x="24" y="54" className={styles.monoLabel}>
          {`> generate --style ${styleChoice} --seed ${cleanSeed} --leet ${leetLevel}`}
        </text>

        {/* Callouts */}
        <rect
          x="24"
          y="66"
          width="118"
          height="26"
          rx="5"
          className={focusedField === 'style' ? styles.boxAccent : styles.box}
        />
        <text x="32" y="83" className={styles.subLabel}>
          1. Style: {styleChoice}
        </text>

        <rect
          x="150"
          y="66"
          width="140"
          height="26"
          rx="5"
          className={focusedField === 'seed' ? styles.boxAccent : styles.box}
        />
        <text x="158" y="83" className={styles.subLabel}>
          2. Word: {seedWord.trim() ? cleanSeed : '(optional)'}
        </text>

        <rect
          x="298"
          y="66"
          width="112"
          height="26"
          rx="5"
          className={focusedField === 'leet' ? styles.boxAccent : styles.box}
        />
        <text x="306" y="83" className={styles.subLabel}>
          3. Leet: {leetLevel}
        </text>

        <rect
          x="418"
          y="66"
          width="196"
          height="26"
          rx="5"
          className={focusedField === 'rules' ? styles.boxAccent : styles.box}
        />
        <text x="426" y="83" className={styles.subLabel}>
          4. {rulesText}
        </text>

        <text x="24" y="114" className={styles.monoLabel}>
          → gh0st_runner   ·   Gh057Vector
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopOnly}>{renderDiagram()}</div>
      <details className={styles.mobileDetails}>
        <summary className={styles.mobileSummary}>
          Terminal guide (--style {styleChoice}, --leet {leetLevel})
        </summary>
        {renderDiagram()}
      </details>
    </div>
  );
}
