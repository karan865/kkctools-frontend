'use client';

import React from 'react';
import styles from './PassphraseInputGuide.module.css';

interface PassphraseInputGuideProps {
  activeTab: 'passphrase' | 'options' | 'bulk';
  wordCount: number;
  separatorLabel: string;
  capitalsLabel: string;
  addNumber: boolean;
  addSymbol: boolean;
  listSize: number;
  perWordBits: number;
  totalBits: number;
  wordsBits: number;
  extrasBits: number;
  bulkCount: number;
  focusedField?: string | null;
}

export default function PassphraseInputGuide({
  activeTab,
  wordCount,
  separatorLabel,
  capitalsLabel,
  addNumber,
  addSymbol,
  listSize,
  perWordBits,
  totalBits,
  wordsBits,
  extrasBits,
  bulkCount,
  focusedField,
}: PassphraseInputGuideProps) {
  const renderDiagram = () => {
    if (activeTab === 'options') {
      const total = Math.max(1, totalBits);
      const wordW = Math.round((wordsBits / total) * 420);
      const extraW = Math.max(8, 420 - wordW);
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 640 128"
          role="img"
          aria-label="Diagram of passphrase entropy breakdown by source"
        >
          <text x="16" y="24" className={styles.label}>
            Entropy breakdown by source ({totalBits.toFixed(1)} bits total)
          </text>
          <rect x="16" y="40" width={wordW} height="28" rx="5" className={styles.boxAccent} />
          <rect x={16 + wordW + 4} y="40" width={extraW} height="28" rx="5" className={styles.box} />
          <text x="24" y="58" className={styles.label}>
            Words: {wordsBits.toFixed(1)} b
          </text>
          <text x="16" y="88" className={styles.subLabel}>
            {wordCount} words × {perWordBits.toFixed(2)} bits/word ({listSize.toLocaleString('en-US')}-word list) + extras: {extrasBits.toFixed(1)} bits
          </text>
          <rect x="485" y="38" width="139" height="32" rx="6" className={styles.badgeBg} />
          <text x="554" y="58" textAnchor="middle" className={styles.badgeText}>
            {totalBits.toFixed(1)} bits total
          </text>
        </svg>
      );
    }

    if (activeTab === 'bulk') {
      return (
        <svg
          className={styles.svg}
          viewBox="0 0 640 128"
          role="img"
          aria-label="Diagram of bulk passphrase generation"
        >
          <rect x="28" y="34" width="240" height="58" rx="8" className={styles.box} />
          <rect x="22" y="28" width="240" height="58" rx="8" className={styles.box} />
          <rect x="16" y="22" width="240" height="58" rx="8" className={styles.boxAccent} />
          <text x="30" y="48" className={styles.label}>
            × {bulkCount} independent passphrases
          </text>
          <text x="30" y="66" className={styles.subLabel}>
            word · word · word ({wordCount} words each)
          </text>
          <rect x="290" y="30" width="334" height="54" rx="8" className={styles.box} />
          <text x="306" y="52" className={styles.label}>
            Web Crypto rejection sampling per word
          </text>
          <text x="306" y="70" className={styles.subLabel}>
            {totalBits.toFixed(1)} bits each · copy all at once
          </text>
        </svg>
      );
    }

    return (
      <svg
        className={styles.svg}
        viewBox="0 0 640 138"
        role="img"
        aria-label="Visual guide to passphrase structure: word count, separator, capitals, extras, and word list size"
      >
        {/* 1 Number of words */}
        <text x="16" y="18" className={styles.subLabel}>
          1. Words ({wordCount})
        </text>
        <rect
          x="16"
          y="26"
          width="74"
          height="32"
          rx="6"
          className={focusedField === 'wordCount' ? styles.boxAccent : styles.box}
        />
        <text x="53" y="46" textAnchor="middle" className={styles.label}>
          word
        </text>
        <text x="102" y="46" textAnchor="middle" className={styles.label}>
          ·
        </text>
        <rect
          x="114"
          y="26"
          width="74"
          height="32"
          rx="6"
          className={focusedField === 'capitals' ? styles.boxAccent : styles.box}
        />
        <text x="151" y="46" textAnchor="middle" className={styles.label}>
          Word
        </text>
        <text x="200" y="46" textAnchor="middle" className={styles.label}>
          ·
        </text>
        <rect x="212" y="26" width="74" height="32" rx="6" className={styles.box} />
        <text x="249" y="46" textAnchor="middle" className={styles.label}>
          word
        </text>
        <text x="298" y="46" textAnchor="middle" className={styles.subLabel}>
          … ({wordCount})
        </text>

        {/* 2 Separator */}
        <text x="102" y="76" textAnchor="middle" className={styles.subLabel}>
          2. Sep: {separatorLabel}
        </text>

        {/* 3 Capitals */}
        <text x="196" y="76" className={styles.subLabel}>
          3. Cap: {capitalsLabel}
        </text>

        {/* 4 Add number / symbol */}
        <rect
          x="355"
          y="26"
          width="136"
          height="32"
          rx="6"
          className={addNumber || addSymbol ? styles.boxAccent : styles.box}
        />
        <text x="423" y="46" textAnchor="middle" className={styles.label}>
          4. {addNumber ? '+0–99 ' : ''}{addSymbol ? '+sym' : !addNumber ? 'No extras' : ''}
        </text>

        {/* 5 Word list */}
        <rect x="16" y="92" width="475" height="34" rx="6" className={styles.box} />
        <text x="28" y="113" className={styles.subLabel}>
          5. Word list: {listSize.toLocaleString('en-US')} words = {perWordBits.toFixed(1)} bits per word
        </text>

        {/* Total badge */}
        <rect x="506" y="26" width="118" height="34" rx="8" className={styles.badgeBg} />
        <text x="565" y="47" textAnchor="middle" className={styles.badgeText}>
          {totalBits.toFixed(1)} bits
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopOnly}>{renderDiagram()}</div>
      <details className={styles.mobileDetails}>
        <summary className={styles.mobileSummary}>
          Passphrase structure ({wordCount} words · {totalBits.toFixed(1)} bits)
        </summary>
        {renderDiagram()}
      </details>
    </div>
  );
}
