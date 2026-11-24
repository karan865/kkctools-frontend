'use client';

import React from 'react';
import styles from './SentenceInputGuide.module.css';

interface SentenceInputGuideProps {
  focusedField: string | null;
  activeTab: 'count' | 'sentences' | 'paragraphs' | 'rules';
  sentenceCount?: number;
  paragraphCount?: number;
}

export default function SentenceInputGuide({
  focusedField,
  activeTab,
  sentenceCount = 5,
  paragraphCount = 1,
}: SentenceInputGuideProps) {
  const isParas = activeTab === 'paragraphs';
  const isRules = activeTab === 'rules';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>🔍</span>
        <span>
          {isParas
            ? 'Paragraph Guide: Blank Lines Define Blocks (>150 Words Flagged)'
            : isRules
            ? 'Abbreviation Rules: Protected Abbreviations & Decimals that Don’t Split'
            : 'Sentence Boundary Guide: Intelligent Merge for Titles, Decimals & Initials'}
        </span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 180"
          className={styles.svg}
          role="img"
          aria-labelledby="sentence-guide-title sentence-guide-desc"
        >
          <title id="sentence-guide-title">Sentence Boundary Detection Diagram</title>
          <desc id="sentence-guide-desc">
            Visual analysis showing how abbreviations like Dr., decimals like 3.14, and initials like J. K. are preserved as single sentences.
          </desc>

          <rect x="10" y="10" width="660" height="160" rx="12" className={styles.cardBg} />

          {!isParas && !isRules ? (
            <>
              {/* Sentence 1 Box */}
              <g>
                <rect
                  x="30"
                  y="25"
                  width="280"
                  height="65"
                  rx="6"
                  className={focusedField === 'text' ? styles.sentenceBoxActive : styles.sentenceBox}
                />
                <circle cx="45" cy="38" r="7" className={styles.calloutCircle} />
                <text x="45" y="38" className={styles.calloutText}>1</text>
                <text x="58" y="42" className={styles.textPrimary}>Sentence 1 (8 words)</text>
                <text x="45" y="62" className={styles.textSecondary}>
                  &quot;Dr. Smith arrived at 3.30 p.m. on Monday.&quot;
                </text>
                <text x="45" y="78" className={styles.textAccent}>
                  • &quot;Dr.&quot; and &quot;p.m.&quot; don’t end it
                </text>
              </g>

              {/* Sentence 2 Box */}
              <g>
                <rect x="330" y="25" width="320" height="65" rx="6" className={styles.sentenceBox} />
                <circle cx="345" cy="38" r="7" className={styles.calloutCircle} />
                <text x="345" y="38" className={styles.calloutText}>2</text>
                <text x="358" y="42" className={styles.textPrimary}>Sentence 2 (5 words)</text>
                <text x="345" y="62" className={styles.textSecondary}>
                  &quot;He paid $4.50 for coffee!&quot;
                </text>
                <text x="345" y="78" className={styles.textAccent}>
                  • &quot;$4.50&quot; is currency/decimal, not a full stop
                </text>
              </g>

              {/* Sentence 3 Box */}
              <g>
                <rect x="30" y="98" width="280" height="62" rx="6" className={styles.sentenceBox} />
                <circle cx="45" cy="112" r="7" className={styles.calloutCircle} />
                <text x="45" y="112" className={styles.calloutText}>3</text>
                <text x="58" y="116" className={styles.textPrimary}>Sentence 3 (4 words)</text>
                <text x="45" y="136" className={styles.textSecondary}>
                  &quot;Was it worth it?&quot;
                </text>
                <text x="45" y="150" className={styles.textAccent}>
                  • Terminal question mark (?) splits cleanly
                </text>
              </g>

              {/* Sentence 4 & 5 Summary */}
              <g>
                <rect x="330" y="98" width="320" height="62" rx="6" className={styles.sentenceBox} />
                <text x="345" y="120" className={styles.textPrimary}>
                  Sentences 4 &amp; 5: Initials &amp; Web URLs
                </text>
                <text x="345" y="138" className={styles.textSecondary}>
                  &quot;J. K. Rowling&quot; initials stay united • &quot;example.com/a.b&quot; = 1 word
                </text>
                <text x="345" y="152" className={styles.textAccent}>
                  Current total: {sentenceCount} sentences in {paragraphCount} {paragraphCount === 1 ? 'paragraph' : 'paragraphs'}
                </text>
              </g>
            </>
          ) : isParas ? (
            <>
              {/* Paragraphs Architecture */}
              <g>
                <rect x="40" y="30" width="280" height="110" rx="8" className={styles.sentenceBoxActive} />
                <circle cx="58" cy="48" r="8" className={styles.calloutCircle} />
                <text x="58" y="48" className={styles.calloutText}>1</text>
                <text x="74" y="52" className={styles.textPrimary}>¶1: Paragraph Block</text>
                <text x="55" y="75" className={styles.textSecondary}>• Standard blocks delimited by blank line</text>
                <text x="55" y="95" className={styles.textSecondary}>• digital.gov guideline: &lt; 150 words</text>
                <text x="55" y="115" className={styles.textAccent}>• 3 to 8 sentences recommended</text>
              </g>

              <g>
                <rect x="360" y="30" width="280" height="110" rx="8" className={styles.sentenceBox} />
                <circle cx="378" cy="48" r="8" className={styles.calloutCircle} />
                <text x="378" y="48" className={styles.calloutText}>2</text>
                <text x="394" y="52" className={styles.textPrimary}>¶2: Length Warning Thresholds</text>
                <text x="375" y="75" className={styles.textSecondary}>• &gt; 150 words: flagged for review</text>
                <text x="375" y="95" className={styles.textSecondary}>• &gt; 250 words: &quot;Never longer&quot; rule</text>
                <text x="375" y="115" className={styles.textAccent}>• Prevents reader fatigue on mobile</text>
              </g>
            </>
          ) : (
            <>
              {/* Rules Architecture */}
              <g>
                <rect x="40" y="30" width="600" height="110" rx="8" className={styles.sentenceBoxActive} />
                <text x="60" y="56" className={styles.textPrimary}>Supported Protected Abbreviations</text>
                <text x="60" y="80" className={styles.textSecondary}>
                  Titles: Dr. · Mr. · Mrs. · Ms. · Prof. · Rev. · Hon. · St. · Jr. · Sr.
                </text>
                <text x="60" y="100" className={styles.textSecondary}>
                  Common &amp; Latin: e.g. · i.e. · vs. · etc. · Inc. · Ltd. · Co. · a.m. · p.m. · U.S.
                </text>
                <text x="60" y="122" className={styles.textAccent}>
                  Decimals, dates (Jan. 15), initials (J. K.), and web domains are never split.
                </text>
              </g>
            </>
          )}
        </svg>
      </div>

      <details className={styles.mobileDetails}>
        <summary>Sentence &amp; Paragraph Boundary Rules</summary>
        <ul className={styles.mobileList}>
          <li><strong>1. Abbreviations:</strong> Dr., Mr., p.m., e.g., and vs. do not end sentences.</li>
          <li><strong>2. Numbers &amp; URLs:</strong> Currency ($4.50), decimals (3.14), and URLs are protected.</li>
          <li><strong>3. Paragraph Guidelines:</strong> digital.gov recommends 3–8 sentences (&lt; 150 words).</li>
          <li><strong>4. Long Sentences:</strong> Sentences over your threshold (default 25w) are highlighted.</li>
        </ul>
      </details>
    </div>
  );
}
