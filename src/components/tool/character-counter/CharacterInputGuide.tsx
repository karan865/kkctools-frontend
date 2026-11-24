'use client';

import React from 'react';
import { charsNoSpaces, countGraphemes, countUtf8Bytes } from '@/lib/text-engine';
import styles from './CharacterInputGuide.module.css';

interface CharacterInputGuideProps {
  focusedField: string | null;
  activeTab: 'count' | 'limit' | 'details';
  userText?: string;
  limit?: number;
}

export default function CharacterInputGuide({
  focusedField,
  activeTab,
  userText = '',
  limit = 500,
}: CharacterInputGuideProps) {
  // Use user's first line if available, otherwise default sample
  const firstLine = userText.trim().split(/\r?\n/)[0] || '';
  const displaySample = firstLine.length > 0 && firstLine.length <= 40 ? firstLine : 'Hi 👋🏽 café.';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>📏</span>
        <span>Interactive Diagram: How Unicode &amp; Characters are Measured</span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 180"
          className={styles.svg}
          role="img"
          aria-labelledby="guide-title guide-desc"
        >
          <title id="guide-title">Character and Byte Counting Visual Diagram</title>
          <desc id="guide-desc">
            Visual breakdown illustrating how user-perceived characters, spaces, and UTF-8 bytes are
            counted.
          </desc>

          {/* Background card */}
          <rect
            x="10"
            y="10"
            width="660"
            height="160"
            rx="14"
            className={styles.cardBg}
          />

          {/* Sample text display container */}
          <rect
            x="30"
            y="26"
            width="620"
            height="46"
            rx="8"
            className={styles.sampleBg}
          />

          <text x="50" y="56" className={styles.sampleText}>
            {displaySample}
          </text>

          {/* Callout Brackets and Annotations */}
          {activeTab !== 'limit' ? (
            <>
              {/* Callout 1: Total Characters (Graphemes) */}
              <g className={`${styles.calloutGroup} ${focusedField === 'characters' ? styles.focused : ''}`}>
                <path d="M 46 80 L 46 95 L 210 95 L 210 80" className={styles.bracketLine} />
                <line x1="128" y1="95" x2="128" y2="120" className={styles.pointerLine} />
                <circle cx="128" cy="128" r="9" className={styles.badgeCircle} />
                <text x="128" y="132" className={styles.badgeNum}>1</text>
                <text x="144" y="132" className={styles.calloutText}>
                  Characters: {countGraphemes(displaySample)}
                </text>
              </g>

              {/* Callout 2: Characters Without Spaces */}
              <g className={`${styles.calloutGroup} ${focusedField === 'noSpaces' ? styles.focused : ''}`}>
                <path d="M 230 80 L 230 95 L 430 95 L 430 80" className={styles.bracketLine} />
                <line x1="330" y1="95" x2="330" y2="120" className={styles.pointerLine} />
                <circle cx="330" cy="128" r="9" className={styles.badgeCircle} />
                <text x="330" y="132" className={styles.badgeNum}>2</text>
                <text x="346" y="132" className={styles.calloutText}>
                  Without spaces: {charsNoSpaces(displaySample)}
                </text>
              </g>

              {/* Callout 3: UTF-8 Bytes */}
              <g className={`${styles.calloutGroup} ${focusedField === 'bytes' ? styles.focused : ''}`}>
                <path d="M 450 80 L 450 95 L 630 95 L 630 80" className={styles.bracketLine} />
                <line x1="540" y1="95" x2="540" y2="120" className={styles.pointerLine} />
                <circle cx="540" cy="128" r="9" className={styles.badgeCircle} />
                <text x="540" y="132" className={styles.badgeNum}>3</text>
                <text x="556" y="132" className={styles.calloutText}>
                  UTF-8 bytes: {countUtf8Bytes(displaySample)}
                </text>
              </g>
            </>
          ) : (
            <>
              {/* Limit Mode Callouts */}
              <g className={styles.calloutGroup}>
                <line x1="50" y1="95" x2="450" y2="95" className={styles.limitBarTrack} />
                <line x1="50" y1="95" x2="150" y2="95" className={styles.limitBarProgress} />
                <circle cx="50" cy="95" r="5" className={styles.limitPoint} />
                <circle cx="150" cy="95" r="5" className={styles.limitPoint} />
                <circle cx="450" cy="95" r="5" className={styles.limitPointEnd} />

                <circle cx="150" cy="128" r="9" className={styles.badgeCircle} />
                <text x="150" y="132" className={styles.badgeNum}>4</text>
                <text x="166" y="132" className={styles.calloutText}>
                  Target Limit: {limit} characters
                </text>

                <circle cx="450" cy="128" r="9" className={styles.badgeCircle} />
                <text x="450" y="132" className={styles.badgeNum}>5</text>
                <text x="466" y="132" className={styles.calloutText}>
                  Remaining buffer calculated live
                </text>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
