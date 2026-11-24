'use client';

import React from 'react';
import styles from './KeywordDensityInputGuide.module.css';

interface KeywordDensityInputGuideProps {
  focusedField: string | null;
  activeTab: 'all' | 'target' | 'settings';
  targetPhrase?: string;
  totalWords?: number;
  targetCount?: number;
}

export default function KeywordDensityInputGuide({
  focusedField,
  activeTab,
  targetPhrase = 'word counter',
  totalWords = 17,
  targetCount = 3,
}: KeywordDensityInputGuideProps) {
  const isTarget = activeTab === 'target';
  const isSettings = activeTab === 'settings';

  const densityPercent = totalWords > 0 ? ((targetCount / totalWords) * 100).toFixed(1) : '0.0';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>🔍</span>
        <span>
          {isTarget
            ? `Target Analysis: "${targetPhrase}" (${targetCount} hits · ${densityPercent}% density)`
            : isSettings
            ? 'Stop Words & Filters: Clean N-Grams Without Obscuring Total Word Counts'
            : 'Phrase Detection: Sliding N-Gram Window Bounded Inside Sentences'}
        </span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 180"
          className={styles.svg}
          role="img"
          aria-labelledby="kw-guide-title kw-guide-desc"
        >
          <title id="kw-guide-title">Keyword Density & N-Gram Detection Diagram</title>
          <desc id="kw-guide-desc">
            Visual analysis showing 1-, 2-, and 3-word phrase extraction, stop word filtering, and target keyword frequency.
          </desc>

          <rect x="10" y="10" width="660" height="160" rx="12" className={styles.cardBg} />

          {!isTarget && !isSettings ? (
            <>
              {/* Sample Passage Group */}
              <g>
                {/* Sentence 1 */}
                <rect x="25" y="25" width="280" height="65" rx="6" className={styles.phraseBox} />
                <text x="35" y="44" className={styles.textSoft}>Sentence 1:</text>
                <text x="35" y="62" className={styles.textPrimary}>
                  Our <tspan className={styles.textEmphasized}>[word counter]</tspan> counts words fast.
                </text>
                <text x="35" y="80" className={styles.textSoft}>6 words · 1 hit</text>
              </g>

              {/* Cross boundary indicator */}
              <g>
                <text x="312" y="60" className={styles.crossBoundary} textAnchor="middle">✕</text>
                <text x="312" y="78" className={styles.textSoft} textAnchor="middle">No cross</text>
              </g>

              {/* Sentence 2 */}
              <g>
                <rect x="335" y="25" width="320" height="65" rx="6" className={styles.phraseBox} />
                <text x="345" y="44" className={styles.textSoft}>Sentence 2:</text>
                <text x="345" y="62" className={styles.textPrimary}>
                  A <tspan className={styles.textEmphasized}>[word counter]</tspan> also counts characters.
                </text>
                <text x="345" y="80" className={styles.textSoft}>6 words · 1 hit</text>
              </g>

              {/* Callouts below */}
              <g>
                <rect x="25" y="105" width="150" height="50" rx="6" className={styles.calloutBadge} />
                <text x="35" y="125" className={styles.calloutText}>① Target Phrase</text>
                <text x="35" y="142" className={styles.textEmphasized}>{targetPhrase} ({targetCount} hits)</text>
              </g>

              <g>
                <rect x="185" y="105" width="145" height="50" rx="6" className={styles.calloutBadge} />
                <text x="195" y="125" className={styles.calloutText}>② Total Words</text>
                <text x="195" y="142" className={styles.textEmphasized}>{totalWords} words</text>
              </g>

              <g>
                <rect x="340" y="105" width="155" height="50" rx="6" className={styles.calloutBadge} />
                <text x="350" y="125" className={styles.calloutText}>③ Density Formula</text>
                <text x="350" y="142" className={styles.textEmphasized}>{targetCount} ÷ {totalWords} = {densityPercent}%</text>
              </g>

              <g>
                <rect x="505" y="105" width="150" height="50" rx="6" className={styles.calloutBadge} />
                <text x="515" y="125" className={styles.calloutText}>④ Sentence Bounded</text>
                <text x="515" y="142" className={styles.textSoft}>No cross-sentence phrases</text>
              </g>
            </>
          ) : isTarget ? (
            <>
              {/* Target Tab View: Heatmap Bar */}
              <text x="30" y="38" className={styles.textPrimary}>
                Keyword Distribution Across Document Deciles (10 Segments):
              </text>

              {/* 10 Decile blocks */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((decile) => {
                const isHit = decile === 0 || decile === 4 || decile === 8;
                return (
                  <g key={decile}>
                    <rect
                      x={30 + decile * 62}
                      y="52"
                      width="58"
                      height="38"
                      rx="4"
                      className={isHit ? styles.phraseBoxActive : styles.phraseBox}
                      style={{ fill: isHit ? 'var(--cat-writing-soft)' : 'var(--surface)' }}
                    />
                    <text
                      x={30 + decile * 62 + 29}
                      y="75"
                      className={isHit ? styles.textEmphasized : styles.textSoft}
                      textAnchor="middle"
                    >
                      {isHit ? '● Hit' : '—'}
                    </text>
                    <text
                      x={30 + decile * 62 + 29}
                      y="104"
                      className={styles.textSoft}
                      textAnchor="middle"
                    >
                      {(decile + 1) * 10}%
                    </text>
                  </g>
                );
              })}

              <rect x="30" y="120" width="620" height="38" rx="6" className={styles.calloutBadge} />
              <text x="45" y="144" className={styles.calloutText}>
                Keyword in Context (KWIC): Displays ±5 words surrounding every occurrence in your text.
              </text>
            </>
          ) : (
            <>
              {/* Settings Tab View: Stop Words Chip Explanation */}
              <text x="30" y="38" className={styles.textPrimary}>
                Stop Word Filtering &amp; Variant Grouping Rules:
              </text>

              <g>
                <rect x="30" y="55" width="295" height="90" rx="6" className={styles.phraseBox} />
                <text x="45" y="78" className={styles.calloutText}>Stop Words Filter (Tables Only):</text>
                <text x="45" y="98" className={styles.textSoft}>
                  • 1-Grams: filters out common articles &amp; prepositions
                </text>
                <text x="45" y="116" className={styles.textSoft}>
                  • 2 &amp; 3-Grams: keeps phrases like &ldquo;call to action&rdquo;
                </text>
                <text x="45" y="134" className={styles.textEmphasized}>
                  Total word count ({totalWords}) is NEVER altered.
                </text>
              </g>

              <g>
                <rect x="345" y="55" width="305" height="90" rx="6" className={styles.phraseBox} />
                <text x="360" y="78" className={styles.calloutText}>Variant Grouping (Plurals):</text>
                <text x="360" y="98" className={styles.textSoft}>
                  • Groups &ldquo;keyword&rdquo; and &ldquo;keywords&rdquo; together
                </text>
                <text x="360" y="116" className={styles.textSoft}>
                  • Preserves protected stems: &ldquo;glass&rdquo;, &ldquo;bus&rdquo;, &ldquo;analysis&rdquo;
                </text>
                <text x="360" y="134" className={styles.textSoft}>
                  • Toggle on or off at any time.
                </text>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
