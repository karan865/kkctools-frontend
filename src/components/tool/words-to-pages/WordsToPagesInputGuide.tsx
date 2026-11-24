'use client';

import React from 'react';
import { PaperSize, LineSpacing, BookTrimSize, BOOK_TRIM_PRESETS } from '@/lib/page-estimate-engine';
import styles from './WordsToPagesInputGuide.module.css';

interface WordsToPagesInputGuideProps {
  focusedField: string | null;
  activeTab: 'wordsToPages' | 'pagesToWords' | 'pasteText' | 'bookPages';
  paper?: PaperSize;
  spacing?: LineSpacing;
  fontSize?: number;
  marginInches?: number;
  trim?: BookTrimSize;
  wordsPerPage?: number;
}

export default function WordsToPagesInputGuide({
  focusedField,
  activeTab,
  paper = 'letter',
  spacing = 'single',
  fontSize = 12,
  marginInches = 1.0,
  trim = '6x9',
  wordsPerPage = 500,
}: WordsToPagesInputGuideProps) {
  const isBook = activeTab === 'bookPages';
  const isDouble = spacing === 'double';
  const isOnePointFive = spacing === '1.5';

  // Number of rendered text lines to visually represent spacing
  const lineCount = isDouble ? 6 : isOnePointFive ? 9 : 12;

  const trimInfo = BOOK_TRIM_PRESETS[trim] || BOOK_TRIM_PRESETS['6x9'];

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>📄</span>
        <span>Visual Guide: How Layout &amp; Spacing Form a Printed Page</span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 200"
          className={styles.svg}
          role="img"
          aria-labelledby="page-guide-title page-guide-desc"
        >
          <title id="page-guide-title">Words to Pages Typographical Layout Diagram</title>
          <desc id="page-guide-desc">
            Visual page representation showing margin boundaries, line spacing density, and
            words-per-page yield.
          </desc>

          {/* Background container */}
          <rect x="10" y="10" width="660" height="180" rx="14" className={styles.cardBg} />

          {!isBook ? (
            <>
              {/* Sheet Outline (Letter or A4) */}
              <rect
                x="60"
                y="22"
                width={paper === 'a4' ? 145 : 155}
                height="156"
                rx="6"
                className={styles.pageSheet}
              />

              {/* Margins: Dashed inner box */}
              <rect
                x={60 + marginInches * 14}
                y={22 + marginInches * 14}
                width={Math.max(40, (paper === 'a4' ? 145 : 155) - marginInches * 28)}
                height={Math.max(40, 156 - marginInches * 28)}
                rx="3"
                className={`${styles.marginBox} ${focusedField === 'margins' ? styles.focusedLine : ''}`}
              />

              {/* Text lines inside margin box */}
              {Array.from({ length: lineCount }).map((_, i) => {
                const yPos = 22 + marginInches * 14 + 10 + i * (isDouble ? 16 : isOnePointFive ? 11 : 8.5);
                if (yPos > 22 + 156 - marginInches * 14 - 8) return null;
                return (
                  <line
                    key={i}
                    x1={60 + marginInches * 14 + 8}
                    y1={yPos}
                    x2={60 + (paper === 'a4' ? 145 : 155) - marginInches * 14 - 8}
                    y2={yPos}
                    className={styles.textLine}
                  />
                );
              })}

              {/* Callouts and Labels */}
              {/* Callout 1: Font Size */}
              <g className={`${styles.calloutGroup} ${focusedField === 'fontSize' ? styles.focused : ''}`}>
                <circle cx="260" cy="45" r="9" className={styles.badgeCircle} />
                <text x="260" y="49" className={styles.badgeNum}>1</text>
                <text x="278" y="49" className={styles.calloutText}>
                  Font size: {fontSize} pt (scales line capacity)
                </text>
              </g>

              {/* Callout 2: Line Spacing */}
              <g className={`${styles.calloutGroup} ${focusedField === 'spacing' ? styles.focused : ''}`}>
                <circle cx="260" cy="80" r="9" className={styles.badgeCircle} />
                <text x="260" y="84" className={styles.badgeNum}>2</text>
                <text x="278" y="84" className={styles.calloutText}>
                  Line spacing: {spacing === 'double' ? 'Double (2.0)' : spacing === '1.5' ? '1.5 Spacing' : 'Single (1.0)'}
                </text>
              </g>

              {/* Callout 3: Margins */}
              <g className={`${styles.calloutGroup} ${focusedField === 'margins' ? styles.focused : ''}`}>
                <circle cx="260" cy="115" r="9" className={styles.badgeCircle} />
                <text x="260" y="119" className={styles.badgeNum}>3</text>
                <text x="278" y="119" className={styles.calloutText}>
                  Margins: {marginInches} in (defines printable area)
                </text>
              </g>

              {/* Callout 4: Paper Size */}
              <g className={`${styles.calloutGroup} ${focusedField === 'paper' ? styles.focused : ''}`}>
                <circle cx="260" cy="150" r="9" className={styles.badgeCircle} />
                <text x="260" y="154" className={styles.badgeNum}>4</text>
                <text x="278" y="154" className={styles.calloutText}>
                  Paper: {paper === 'a4' ? 'A4 (8.27 × 11.69 in)' : 'Letter (8.5 × 11 in)'}
                </text>
              </g>

              {/* Yield Badge */}
              <g className={styles.yieldBadge}>
                <rect x="500" y="70" width="150" height="56" rx="10" className={styles.yieldBg} />
                <text x="575" y="93" className={styles.yieldTitle}>Estimated Yield</text>
                <text x="575" y="113" className={styles.yieldValue}>≈ {wordsPerPage} w/page</text>
              </g>
            </>
          ) : (
            <>
              {/* Book Trim Mode */}
              <rect x="80" y="22" width="120" height="156" rx="4" className={styles.pageSheet} />
              <rect x="94" y="32" width="92" height="136" rx="2" className={styles.marginBox} />

              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={i}
                  x1="102"
                  y1={46 + i * 13}
                  x2="178"
                  y2={46 + i * 13}
                  className={styles.textLine}
                />
              ))}

              <g className={styles.calloutGroup}>
                <circle cx="260" cy="65" r="9" className={styles.badgeCircle} />
                <text x="260" y="69" className={styles.badgeNum}>1</text>
                <text x="278" y="69" className={styles.calloutText}>
                  Trim Size: {trimInfo.label}
                </text>

                <circle cx="260" cy="115" r="9" className={styles.badgeCircle} />
                <text x="260" y="119" className={styles.badgeNum}>2</text>
                <text x="278" y="119" className={styles.calloutText}>
                  Typeset Density: {wordsPerPage} words per book page (editable)
                </text>
              </g>

              <g className={styles.yieldBadge}>
                <rect x="500" y="70" width="150" height="56" rx="10" className={styles.yieldBg} />
                <text x="575" y="93" className={styles.yieldTitle}>Book Model</text>
                <text x="575" y="113" className={styles.yieldValue}>≈ {wordsPerPage} w/page</text>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
