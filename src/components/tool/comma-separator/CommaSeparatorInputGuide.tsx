'use client';

import React from 'react';
import styles from './CommaSeparatorInputGuide.module.css';

interface CommaSeparatorInputGuideProps {
  focusedField: string | null;
  activeTab: 'linesToList' | 'listToLines' | 'presets';
  firstItems?: string[];
  delimiterLabel?: string;
}

export default function CommaSeparatorInputGuide({
  focusedField,
  activeTab,
  firstItems = ['apple', 'Smith, John', 'say "hi"', 'apple'],
  delimiterLabel = ', ',
}: CommaSeparatorInputGuideProps) {
  const isReverse = activeTab === 'listToLines';
  const isPresets = activeTab === 'presets';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>📋</span>
        <span>
          {isReverse
            ? 'Reverse Pipeline: Delimited Text (RFC 4180) → Vertical Lines'
            : isPresets
            ? 'Preset Formats: SQL IN (...), JSON Array, Python / JS, Excel Matrix'
            : 'List Pipeline: Input Column → Clean & Dedupe → Delimited Row'}
        </span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 180"
          className={styles.svg}
          role="img"
          aria-labelledby="comma-guide-title comma-guide-desc"
        >
          <title id="comma-guide-title">Comma Separator Processing Architecture</title>
          <desc id="comma-guide-desc">
            Visual pipeline transforming vertical list lines into delimited text with CSV quoting and SQL presets.
          </desc>

          <rect x="10" y="10" width="660" height="160" rx="12" className={styles.cardBg} />

          {/* Left Column Box */}
          <g>
            <rect
              x="30"
              y="25"
              width="170"
              height="130"
              rx="8"
              className={focusedField === 'input' ? styles.columnBoxActive : styles.columnBox}
            />
            <circle cx="48" cy="42" r="8" className={styles.calloutCircle} />
            <text x="48" y="42" className={styles.calloutText}>1</text>
            <text x="64" y="46" className={styles.textPrimary}>Input Column</text>

            {firstItems.slice(0, 4).map((it, idx) => (
              <text key={idx} x="45" y={70 + idx * 20} className={styles.textSecondary}>
                • {it.length > 18 ? it.slice(0, 18) + '...' : it}
              </text>
            ))}
          </g>

          {/* Flow Arrow */}
          {!isReverse ? (
            <path d="M 210 90 L 235 90" className={styles.arrow} markerEnd="url(#arrow)" />
          ) : (
            <path d="M 235 90 L 210 90" className={styles.arrow} />
          )}

          {/* Middle Transformation Chips */}
          <g>
            <rect
              x="245"
              y="28"
              width="180"
              height="36"
              rx="6"
              className={focusedField === 'clean' ? styles.chipBgActive : styles.chipBg}
            />
            <circle cx="260" cy="46" r="7" className={styles.calloutCircle} />
            <text x="260" y="46" className={styles.calloutText}>2</text>
            <text x="274" y="49" className={styles.textPrimary}>Trim, Dedupe &amp; Sort</text>

            <rect
              x="245"
              y="72"
              width="180"
              height="36"
              rx="6"
              className={focusedField === 'quote' ? styles.chipBgActive : styles.chipBg}
            />
            <circle cx="260" cy="90" r="7" className={styles.calloutCircle} />
            <text x="260" y="90" className={styles.calloutText}>3</text>
            <text x="274" y="93" className={styles.textPrimary}>RFC 4180 CSV Quoting</text>

            <rect
              x="245"
              y="116"
              width="180"
              height="36"
              rx="6"
              className={focusedField === 'delim' ? styles.chipBgActive : styles.chipBg}
            />
            <circle cx="260" cy="134" r="7" className={styles.calloutCircle} />
            <text x="260" y="134" className={styles.calloutText}>4</text>
            <text x="274" y="137" className={styles.textPrimary}>Delimiter ({delimiterLabel})</text>
          </g>

          {/* Flow Arrow to Output */}
          <path d="M 435 90 L 460 90" className={styles.arrow} />

          {/* Right Result Output Box */}
          <g>
            <rect x="470" y="25" width="180" height="130" rx="8" className={styles.resultBox} />
            <text x="488" y="46" className={styles.textAccent}>Output Result</text>

            {!isPresets ? (
              <>
                <text x="485" y="75" className={styles.textPrimary}>apple,</text>
                <text x="485" y="95" className={styles.textAccent}>&quot;Smith, John&quot;,</text>
                <text x="485" y="115" className={styles.textAccent}>&quot;say &quot;&quot;hi&quot;&quot;&quot;</text>
                <text x="485" y="140" className={styles.textSecondary}>Commas/quotes auto-quoted</text>
              </>
            ) : (
              <>
                <text x="485" y="75" className={styles.textPrimary}>SQL IN List:</text>
                <text x="485" y="95" className={styles.textAccent}>(&apos;apple&apos;, &apos;O&apos;&apos;Brien&apos;)</text>
                <text x="485" y="125" className={styles.textSecondary}>Single quotes doubled</text>
              </>
            )}
          </g>
        </svg>
      </div>

      <details className={styles.mobileDetails}>
        <summary>List Formatting &amp; Delimiter Guide</summary>
        <ul className={styles.mobileList}>
          <li><strong>1. Clean Up:</strong> Trims excess spaces and safely deletes blank rows.</li>
          <li><strong>2. Deduplicate:</strong> Removes repeat entries (keeping original order).</li>
          <li><strong>3. CSV Quoting Rule:</strong> Values with commas or quotes are wrapped in quotes.</li>
          <li><strong>4. Presets:</strong> Instant SQL <code>IN (...)</code>, JSON, and Python arrays.</li>
        </ul>
      </details>
    </div>
  );
}
