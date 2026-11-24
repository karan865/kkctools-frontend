import React from 'react';
import styles from './CharsToWordsInputGuide.module.css';

interface CharsToWordsInputGuideProps {
  activeTab: 'charsToWords' | 'wordsToChars' | 'checkText';
  chars?: number;
  words?: number;
  avgLetters?: number;
  countSpaces?: boolean;
  focusedField?: string | null;
  limit?: number;
  charsLeft?: number;
}

export default function CharsToWordsInputGuide({
  activeTab,
  chars = 1000,
  words = 175,
  avgLetters = 4.7,
  countSpaces = true,
  focusedField,
  limit = 1000,
  charsLeft = 0,
}: CharsToWordsInputGuideProps) {
  const isAvgFocused = focusedField === 'avgLetters';
  const isSpacesFocused = focusedField === 'countSpaces';
  const isCharsFocused = focusedField === 'chars';
  const isLimitFocused = focusedField === 'limit';

  const renderContent = () => (
    <svg
      className={styles.svg}
      viewBox="0 0 640 160"
      role="img"
      aria-label="Interactive guide showing characters to words breakdown, spaces, and average word length"
    >
      <title>Characters to Words Calculation Guide</title>
      <desc>
        Visual diagram explaining how characters and spaces convert into word counts with a sample sentence and live values.
      </desc>

      {/* Card Background */}
      <rect className={styles.cardBg} x="4" y="4" width="632" height="152" rx="10" />

      {activeTab === 'checkText' ? (
        // Check Text Tab: Limit Bar and Buffer
        <g transform="translate(20, 20)">
          <text className={styles.calloutText} x="10" y="20">
            <tspan className={styles.calloutNum}>1 Text Count: </tspan>
            Live Grapheme Segmentation
          </text>
          <text className={styles.calloutText} x="260" y="20">
            <tspan className={styles.calloutNum}>2 Limit: </tspan>
            Target Threshold ({limit.toLocaleString('en-US')})
          </text>
          <text className={styles.calloutText} x="470" y="20">
            <tspan className={styles.calloutNum}>3 Buffer: </tspan>
            Remaining Space
          </text>

          {/* Progress Bar Frame */}
          <rect
            className={styles.wordBox}
            x="10"
            y="42"
            width="580"
            height="32"
            rx="6"
            style={{ stroke: isLimitFocused ? 'var(--cat-writing)' : undefined }}
          />
          {/* Progress Fill */}
          <rect
            x="12"
            y="44"
            width={Math.min(576, Math.max(0, limit > 0 ? (chars / limit) * 576 : 0))}
            height="28"
            rx="4"
            fill="var(--cat-writing)"
            opacity={0.85}
          />

          <text x="300" y="64" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="800">
            {chars.toLocaleString('en-US')} / {limit.toLocaleString('en-US')} chars ({charsLeft >= 0 ? `${charsLeft.toLocaleString('en-US')} left` : `${Math.abs(charsLeft).toLocaleString('en-US')} over`})
          </text>

          <rect className={styles.badgeBg} x="10" y="90" width="580" height="26" rx="6" />
          <text x="300" y="108" textAnchor="middle" className={styles.badgeVal}>
            {chars.toLocaleString('en-US')} characters ≈ {words.toLocaleString('en-US')} words ({countSpaces ? 'with spaces' : 'no spaces'})
          </text>
        </g>
      ) : (
        // Standard Characters ↔ Words Diagram
        <g transform="translate(18, 14)">
          {/* Callouts */}
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Average: </tspan>
            {avgLetters} letters/word
          </text>
          <text className={styles.calloutText} x="235" y="18">
            <tspan className={styles.calloutNum}>2 Spaces: </tspan>
            {countSpaces ? 'Counted (+1)' : 'Excluded'}
          </text>
          <text className={styles.calloutText} x="440" y="18">
            <tspan className={styles.calloutNum}>3 Direction: </tspan>
            {activeTab === 'wordsToChars' ? 'Words → Chars' : 'Chars → Words'}
          </text>

          {/* Words visualization for: Write clear, short answers. */}
          {/* Word 1: Write */}
          <g transform="translate(15, 34)">
            <rect className={isCharsFocused ? styles.wordBoxActive : styles.wordBox} width="84" height="42" />
            <text className={styles.wordText} x="42" y="26">
              Write
            </text>
            <text className={styles.countText} x="42" y="54">
              5 letters
            </text>
          </g>

          {/* Space 1 */}
          <circle
            className={styles.spaceDot}
            cx="112"
            cy="55"
            r="4"
            opacity={countSpaces ? 1 : 0.25}
            style={{ stroke: isSpacesFocused ? 'var(--cat-writing-deep)' : undefined }}
          />

          {/* Word 2: clear, */}
          <g transform="translate(126, 34)">
            <rect className={isAvgFocused ? styles.wordBoxActive : styles.wordBox} width="88" height="42" />
            <text className={styles.wordText} x="44" y="26">
              clear,
            </text>
            <text className={styles.countText} x="44" y="54">
              5 ltr + punct
            </text>
          </g>

          {/* Space 2 */}
          <circle
            className={styles.spaceDot}
            cx="227"
            cy="55"
            r="4"
            opacity={countSpaces ? 1 : 0.25}
            style={{ stroke: isSpacesFocused ? 'var(--cat-writing-deep)' : undefined }}
          />

          {/* Word 3: short */}
          <g transform="translate(241, 34)">
            <rect className={styles.wordBox} width="84" height="42" />
            <text className={styles.wordText} x="42" y="26">
              short
            </text>
            <text className={styles.countText} x="42" y="54">
              5 letters
            </text>
          </g>

          {/* Space 3 */}
          <circle
            className={styles.spaceDot}
            cx="338"
            cy="55"
            r="4"
            opacity={countSpaces ? 1 : 0.25}
            style={{ stroke: isSpacesFocused ? 'var(--cat-writing-deep)' : undefined }}
          />

          {/* Word 4: answers. */}
          <g transform="translate(352, 34)">
            <rect className={styles.wordBox} width="96" height="42" />
            <text className={styles.wordText} x="48" y="26">
              answers.
            </text>
            <text className={styles.countText} x="48" y="54">
              7 ltr + punct
            </text>
          </g>

          {/* Conversion Indicator Badge on the right */}
          <g transform="translate(460, 32)">
            <rect className={styles.badgeBg} width="138" height="64" rx="8" />
            <text className={styles.badgeTitle} x="69" y="22" textAnchor="middle">
              {activeTab === 'wordsToChars' ? 'Estimated Chars' : 'Estimated Words'}
            </text>
            <text className={styles.badgeVal} x="69" y="46" textAnchor="middle">
              {activeTab === 'wordsToChars' ? `≈ ${chars.toLocaleString('en-US')} chars` : `≈ ${words.toLocaleString('en-US')} words`}
            </text>
          </g>

          {/* Formula Line at bottom */}
          <text className={styles.calloutText} x="15" y="125">
            Formula: {activeTab === 'wordsToChars'
              ? `${words.toLocaleString('en-US')} words × (${avgLetters} + ${countSpaces ? '1' : '0'}) = ≈ ${chars.toLocaleString('en-US')} chars`
              : `${chars.toLocaleString('en-US')} chars ÷ (${avgLetters} + ${countSpaces ? '1' : '0'}) = ≈ ${words.toLocaleString('en-US')} words`}
          </text>
        </g>
      )}
    </svg>
  );

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>💡</span>
        <span>Interactive Diagram: How characters convert to words</span>
      </div>

      <div className={`${styles.diagramCard} ${styles.desktopOnly}`}>{renderContent()}</div>

      <details className={`${styles.diagramCard} ${styles.mobileDetails}`}>
        <summary>View conversion diagram &amp; character breakdown</summary>
        <div style={{ marginTop: '12px' }}>{renderContent()}</div>
      </details>
    </div>
  );
}
