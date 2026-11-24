import React from 'react';
import styles from './WordCountInputGuide.module.css';

interface WordCountInputGuideProps {
  activeTab: 'count' | 'essay' | 'frequency' | 'reading';
  hyphenJoin?: boolean;
  countNumbers?: boolean;
  totalWords?: number;
  totalChars?: number;
  essayTarget?: number;
  wordsLeft?: number;
}

export default function WordCountInputGuide({
  activeTab,
  hyphenJoin = true,
  countNumbers = true,
  totalWords = 10,
  totalChars = 61,
  essayTarget = 500,
  wordsLeft = 120,
}: WordCountInputGuideProps) {
  // Count for the sample phrase based on toggles:
  // "It’s a well-known fact — numbers like 2,500 and e-mail count."
  // Baseline (both on): 10 words.
  // hyphenJoin off: well-known (2), e-mail (2) => +2 words = 12.
  // countNumbers off: 2,500 omitted => -1 word.
  let sampleWords = 10;
  if (!hyphenJoin) sampleWords += 2;
  if (!countNumbers) sampleWords -= 1;

  const renderContent = () => (
    <svg
      className={styles.svg}
      viewBox="0 0 640 160"
      role="img"
      aria-label="Interactive guide explaining word counting rules, contractions, hyphens, and numbers"
    >
      <title>Word Counting Rules Guide</title>
      <desc>
        Visual breakdown of how contractions, hyphenated compounds, numbers, and dashes are segmented into words.
      </desc>

      {/* Card Background */}
      <rect className={styles.cardBg} x="4" y="4" width="632" height="152" rx="10" />

      {activeTab === 'essay' ? (
        // Essay Tab Guide
        <g transform="translate(18, 14)">
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Current: </tspan>
            {totalWords.toLocaleString('en-US')} words
          </text>
          <text className={styles.calloutText} x="240" y="18">
            <tspan className={styles.calloutNum}>2 Target: </tspan>
            {essayTarget.toLocaleString('en-US')} words
          </text>
          <text className={styles.calloutText} x="440" y="18">
            <tspan className={styles.calloutNum}>3 Status: </tspan>
            {wordsLeft >= 0 ? `${wordsLeft.toLocaleString('en-US')} words to go` : `${Math.abs(wordsLeft).toLocaleString('en-US')} words over`}
          </text>

          {/* Progress Bar Frame */}
          <rect className={styles.wordPill} x="15" y="40" width="580" height="34" rx="8" />
          <rect
            x="17"
            y="42"
            width={Math.min(576, Math.max(0, essayTarget > 0 ? (totalWords / essayTarget) * 576 : 0))}
            height="30"
            rx="6"
            fill="var(--cat-writing)"
            opacity={0.85}
          />
          <text x="305" y="62" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="800">
            {totalWords.toLocaleString('en-US')} / {essayTarget.toLocaleString('en-US')} words ({Math.round(essayTarget > 0 ? (totalWords / essayTarget) * 100 : 0)}%)
          </text>

          <text className={styles.calloutText} x="15" y="125">
            Progress bar monitors your draft against minimum, target, and maximum length requirements.
          </text>
        </g>
      ) : activeTab === 'frequency' ? (
        // Frequency Tab Guide
        <g transform="translate(18, 14)">
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 N-grams: </tspan>
            1, 2, and 3-word phrase density
          </text>
          <text className={styles.calloutText} x="240" y="18">
            <tspan className={styles.calloutNum}>2 Ignore List: </tspan>
            Filter common English stop words
          </text>
          <text className={styles.calloutText} x="460" y="18">
            <tspan className={styles.calloutNum}>3 Boundary: </tspan>
            Never crosses sentences
          </text>

          <g transform="translate(15, 34)">
            <rect className={styles.wordPill} width="180" height="52" />
            <text className={styles.wordText} x="90" y="24">
              Single Words (1-gram)
            </text>
            <text fill="var(--ink-soft)" fontSize="11" x="90" y="42" textAnchor="middle">
              Frequency &amp; Density %
            </text>
          </g>

          <g transform="translate(205, 34)">
            <rect className={styles.wordPill} width="180" height="52" />
            <text className={styles.wordText} x="90" y="24">
              Phrases (2 &amp; 3-grams)
            </text>
            <text fill="var(--ink-soft)" fontSize="11" x="90" y="42" textAnchor="middle">
              Repeated expressions
            </text>
          </g>

          <g transform="translate(395, 34)">
            <rect className={styles.badgeBg} width="210" height="52" rx="6" />
            <text className={styles.badgeTitle} x="12" y="24">
              Stop Words Filter
            </text>
            <text className={styles.badgeVal} x="12" y="42">
              Editable curated ignore list
            </text>
          </g>

          <text className={styles.calloutText} x="15" y="125">
            Stop words toggle filters noise without altering your total word or character counts.
          </text>
        </g>
      ) : activeTab === 'reading' ? (
        // Reading Tab Guide
        <g transform="translate(18, 14)">
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Silent Reading: </tspan>
            238 words per minute
          </text>
          <text className={styles.calloutText} x="240" y="18">
            <tspan className={styles.calloutNum}>2 Speaking Pace: </tspan>
            130 words per minute
          </text>
          <text className={styles.calloutText} x="440" y="18">
            <tspan className={styles.calloutNum}>3 Keynote Speech: </tspan>
            100 words per minute
          </text>

          <g transform="translate(15, 34)">
            <rect className={styles.wordPill} width="180" height="52" />
            <text className={styles.wordText} x="90" y="24">
              Silent Reading
            </text>
            <text fill="var(--ink-soft)" fontSize="11" x="90" y="42" textAnchor="middle">
              Brysbaert baseline
            </text>
          </g>

          <g transform="translate(205, 34)">
            <rect className={styles.wordPill} width="180" height="52" />
            <text className={styles.wordText} x="90" y="24">
              Speaking Aloud
            </text>
            <text fill="var(--ink-soft)" fontSize="11" x="90" y="42" textAnchor="middle">
              Standard podcast / radio pace
            </text>
          </g>

          <g transform="translate(395, 34)">
            <rect className={styles.badgeBg} width="210" height="52" rx="6" />
            <text className={styles.badgeTitle} x="12" y="24">
              Speech Timer
            </text>
            <text className={styles.badgeVal} x="12" y="42">
              Minutes &amp; seconds breakdown
            </text>
          </g>

          <text className={styles.calloutText} x="15" y="125">
            Reading and speaking speeds are customizable to match your natural presentation tempo.
          </text>
        </g>
      ) : (
        // Default Tab: Word Rules
        <g transform="translate(18, 14)">
          {/* Callouts */}
          <text className={styles.calloutText} x="15" y="18">
            <tspan className={styles.calloutNum}>1 Contractions: </tspan>
            &quot;It’s&quot; = 1 word
          </text>
          <text className={styles.calloutText} x="180" y="18">
            <tspan className={styles.calloutNum}>2 Hyphens: </tspan>
            {hyphenJoin ? 'Joined (= 1)' : 'Split (= 2)'}
          </text>
          <text className={styles.calloutText} x="340" y="18">
            <tspan className={styles.calloutNum}>3 Numbers: </tspan>
            {countNumbers ? 'Counted' : 'Excluded'}
          </text>
          <text className={styles.calloutText} x="470" y="18">
            <tspan className={styles.calloutNum}>4 Dashes: </tspan>
            Not counted (0)
          </text>

          {/* Sample breakdown */}
          {/* 1. It's */}
          <g transform="translate(15, 34)">
            <rect className={styles.wordPillActive} width="46" height="36" />
            <text className={styles.wordText} x="23" y="23">
              It’s
            </text>
          </g>

          {/* 2. a */}
          <g transform="translate(67, 34)">
            <rect className={styles.wordPill} width="26" height="36" />
            <text className={styles.wordText} x="13" y="23">
              a
            </text>
          </g>

          {/* 3. well-known */}
          <g transform="translate(99, 34)">
            <rect className={hyphenJoin ? styles.wordPillActive : styles.wordPill} width="84" height="36" />
            <text className={styles.wordText} x="42" y="23">
              well-known
            </text>
          </g>

          {/* 4. fact */}
          <g transform="translate(189, 34)">
            <rect className={styles.wordPill} width="48" height="36" />
            <text className={styles.wordText} x="24" y="23">
              fact
            </text>
          </g>

          {/* Dash: — */}
          <g transform="translate(243, 34)">
            <rect className={styles.dashToken} width="22" height="36" />
            <text fill="var(--ink-soft)" fontSize="13" fontWeight="700" x="11" y="23" textAnchor="middle">
              —
            </text>
          </g>

          {/* 5. numbers */}
          <g transform="translate(271, 34)">
            <rect className={styles.wordPill} width="66" height="36" />
            <text className={styles.wordText} x="33" y="23">
              numbers
            </text>
          </g>

          {/* 6. 2,500 */}
          <g transform="translate(343, 34)">
            <rect className={countNumbers ? styles.wordPillActive : styles.dashToken} width="52" height="36" />
            <text className={styles.wordText} x="26" y="23" fill={countNumbers ? 'var(--ink)' : 'var(--ink-soft)'}>
              2,500
            </text>
          </g>

          {/* 7. and */}
          <g transform="translate(401, 34)">
            <rect className={styles.wordPill} width="36" height="36" />
            <text className={styles.wordText} x="18" y="23">
              and
            </text>
          </g>

          {/* 8. e-mail */}
          <g transform="translate(443, 34)">
            <rect className={hyphenJoin ? styles.wordPillActive : styles.wordPill} width="56" height="36" />
            <text className={styles.wordText} x="28" y="23">
              e-mail
            </text>
          </g>

          {/* Total Badge */}
          <g transform="translate(508, 30)">
            <rect className={styles.badgeBg} width="105" height="52" rx="6" />
            <text className={styles.badgeTitle} x="52" y="20" textAnchor="middle">
              Sample Total
            </text>
            <text className={styles.badgeVal} x="52" y="42" textAnchor="middle">
              {sampleWords} words
            </text>
          </g>

          {/* Bottom rule explanation */}
          <text className={styles.calloutText} x="15" y="125">
            Rule: Contractions count as 1 word. Hyphenated compounds count as 1 word by default. Numbers count as words.
          </text>
        </g>
      )}
    </svg>
  );

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>📝</span>
        <span>Interactive Diagram: How words, hyphens, and contractions are segmented</span>
      </div>

      <div className={`${styles.diagramCard} ${styles.desktopOnly}`}>{renderContent()}</div>

      <details className={`${styles.diagramCard} ${styles.mobileDetails}`}>
        <summary>View word counting rules &amp; token segmentation</summary>
        <div style={{ marginTop: '12px' }}>{renderContent()}</div>
      </details>
    </div>
  );
}
