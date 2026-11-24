'use client';

import React from 'react';
import styles from './NumberWordsInputGuide.module.css';

interface NumberWordsInputGuideProps {
  focusedField: string | null;
  activeTab: 'words' | 'check' | 'cheque' | 'ordinal' | 'reverse';
  system?: 'intl' | 'indian';
  numberStr?: string;
}

export default function NumberWordsInputGuide({
  focusedField,
  activeTab,
  system = 'intl',
  numberStr = '1234567',
}: NumberWordsInputGuideProps) {
  const isCheck = activeTab === 'check';
  const isCheque = activeTab === 'cheque';
  const isReverse = activeTab === 'reverse';
  const isOrdinal = activeTab === 'ordinal';

  return (
    <div className={styles.guideWrapper}>
      <div className={styles.summaryBadge}>
        <span className={styles.icon}>✍️</span>
        <span>
          {isCheck
            ? 'Check Layout: Exact Cents as /100 & Filled Line'
            : isCheque
            ? 'Cheque Format: Indian Place Value (Lakh/Crore) & Rupees...Only'
            : isReverse
            ? 'Reverse Flow: English Number Words → Numeric Digits'
            : isOrdinal
            ? 'Ordinal Guide: Sequence Order & Numeral Suffixes (-st, -nd, -rd, -th)'
            : system === 'indian'
            ? 'Place Value Periods: Lakhs | Thousands | Ones (Indian Grouping)'
            : 'Place Value Periods: Millions | Thousands | Ones (International Grouping)'}
        </span>
      </div>

      <div className={styles.diagramCard}>
        <svg
          viewBox="0 0 680 180"
          className={styles.svg}
          role="img"
          aria-labelledby="num-words-title num-words-desc"
        >
          <title id="num-words-title">Number to Words Structure &amp; Layout Diagram</title>
          <desc id="num-words-desc">
            Visual period grouping separating digit clusters into verbal powers, and standard check writing layout.
          </desc>

          <rect x="10" y="10" width="660" height="160" rx="12" className={styles.cardBg} />

          {/* Standard Words & Grouping View */}
          {!isCheck && !isCheque && !isReverse && !isOrdinal && (
            <>
              {system === 'intl' ? (
                <>
                  {/* Millions Period */}
                  <g>
                    <rect
                      x="40"
                      y="30"
                      width="180"
                      height="115"
                      rx="8"
                      className={focusedField === 'number' ? styles.periodBoxActive : styles.periodBox}
                    />
                    <circle cx="58" cy="48" r="8" className={styles.calloutCircle} />
                    <text x="58" y="48" className={styles.calloutText}>1</text>
                    <text x="74" y="52" className={styles.textPrimary}>Millions Period</text>
                    <text x="130" y="85" textAnchor="middle" className={styles.textAccent}>
                      {numberStr.length > 6 ? numberStr.slice(0, -6) || '1' : '1'}
                    </text>
                    <text x="130" y="105" textAnchor="middle" className={styles.textSecondary}>
                      &quot;One million&quot;
                    </text>
                  </g>

                  {/* Thousands Period */}
                  <g>
                    <rect
                      x="250"
                      y="30"
                      width="180"
                      height="115"
                      rx="8"
                      className={styles.periodBox}
                    />
                    <circle cx="268" cy="48" r="8" className={styles.calloutCircle} />
                    <text x="268" y="48" className={styles.calloutText}>2</text>
                    <text x="284" y="52" className={styles.textPrimary}>Thousands Period</text>
                    <text x="340" y="85" textAnchor="middle" className={styles.textAccent}>234</text>
                    <text x="340" y="105" textAnchor="middle" className={styles.textSecondary}>
                      &quot;Two hundred thirty-four thousand&quot;
                    </text>
                  </g>

                  {/* Ones Period */}
                  <g>
                    <rect
                      x="460"
                      y="30"
                      width="180"
                      height="115"
                      rx="8"
                      className={styles.periodBox}
                    />
                    <circle cx="478" cy="48" r="8" className={styles.calloutCircle} />
                    <text x="478" y="48" className={styles.calloutText}>3</text>
                    <text x="494" y="52" className={styles.textPrimary}>Ones Period</text>
                    <text x="550" y="85" textAnchor="middle" className={styles.textAccent}>567</text>
                    <text x="550" y="105" textAnchor="middle" className={styles.textSecondary}>
                      &quot;Five hundred sixty-seven&quot;
                    </text>
                  </g>
                </>
              ) : (
                <>
                  {/* Indian System: Lakhs | Thousands | Ones */}
                  <g>
                    <rect x="40" y="30" width="180" height="115" rx="8" className={styles.periodBoxActive} />
                    <circle cx="58" cy="48" r="8" className={styles.calloutCircle} />
                    <text x="58" y="48" className={styles.calloutText}>1</text>
                    <text x="74" y="52" className={styles.textPrimary}>Lakh Period</text>
                    <text x="130" y="85" textAnchor="middle" className={styles.textAccent}>12</text>
                    <text x="130" y="105" textAnchor="middle" className={styles.textSecondary}>&quot;Twelve lakh&quot;</text>
                  </g>
                  <g>
                    <rect x="250" y="30" width="180" height="115" rx="8" className={styles.periodBox} />
                    <circle cx="268" cy="48" r="8" className={styles.calloutCircle} />
                    <text x="268" y="48" className={styles.calloutText}>2</text>
                    <text x="284" y="52" className={styles.textPrimary}>Thousand Period</text>
                    <text x="340" y="85" textAnchor="middle" className={styles.textAccent}>34</text>
                    <text x="340" y="105" textAnchor="middle" className={styles.textSecondary}>&quot;Thirty-four thousand&quot;</text>
                  </g>
                  <g>
                    <rect x="460" y="30" width="180" height="115" rx="8" className={styles.periodBox} />
                    <circle cx="478" cy="48" r="8" className={styles.calloutCircle} />
                    <text x="478" y="48" className={styles.calloutText}>3</text>
                    <text x="494" y="52" className={styles.textPrimary}>Hundreds &amp; Ones</text>
                    <text x="550" y="85" textAnchor="middle" className={styles.textAccent}>567</text>
                    <text x="550" y="105" textAnchor="middle" className={styles.textSecondary}>&quot;Five hundred sixty-seven&quot;</text>
                  </g>
                </>
              )}
            </>
          )}

          {/* US Check View */}
          {isCheck && (
            <g>
              <rect x="35" y="25" width="610" height="130" rx="8" className={styles.checkBg} />
              <text x="340" y="98" className={styles.watermark}>SAMPLE</text>

              {/* Payee Line */}
              <text x="55" y="52" className={styles.textSecondary}>PAY TO THE ORDER OF</text>
              <line x1="185" y1="52" x2="490" y2="52" className={styles.checkLine} />
              
              {/* Numeric Amount Box */}
              <rect x="505" y="34" width="125" height="26" rx="4" fill="var(--surface-2)" stroke="var(--line)" />
              <circle cx="515" cy="47" r="7" className={styles.calloutCircle} />
              <text x="515" y="47" className={styles.calloutText}>1</text>
              <text x="575" y="51" textAnchor="middle" className={styles.textPrimary}>$ 5,075.62</text>

              {/* Words Amount Line */}
              <circle cx="65" cy="85" r="7" className={styles.calloutCircle} />
              <text x="65" y="85" className={styles.calloutText}>2</text>
              <text x="80" y="88" className={styles.textPrimary}>Five thousand seventy-five and 62/100</text>
              
              {/* Trail dash */}
              <line x1="320" y1="85" x2="570" y2="85" className={styles.trailDash} />
              <text x="585" y="88" className={styles.textPrimary}>DOLLARS</text>

              {/* Memo & Sign Lines */}
              <text x="55" y="128" className={styles.textSecondary}>MEMO</text>
              <line x1="95" y1="128" x2="250" y2="128" className={styles.checkLine} />
              <line x1="420" y1="128" x2="620" y2="128" className={styles.checkLine} />
              <text x="520" y="142" textAnchor="middle" className={styles.textSecondary}>AUTHORIZED SIGNATURE</text>
            </g>
          )}

          {/* Indian Cheque View */}
          {isCheque && (
            <g>
              <rect x="35" y="25" width="610" height="130" rx="8" className={styles.checkBg} />
              <text x="340" y="98" className={styles.watermark}>SAMPLE</text>

              <text x="55" y="52" className={styles.textSecondary}>PAY</text>
              <line x1="85" y1="52" x2="490" y2="52" className={styles.checkLine} />
              
              {/* ₹ Box */}
              <rect x="505" y="34" width="125" height="26" rx="4" fill="var(--surface-2)" stroke="var(--line)" />
              <text x="575" y="51" textAnchor="middle" className={styles.textPrimary}>₹ 12,34,567.50</text>

              {/* Words Line */}
              <text x="55" y="88" className={styles.textSecondary}>RUPEES</text>
              <text x="110" y="88" className={styles.textPrimary}>
                Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven...
              </text>
              <line x1="480" y1="85" x2="620" y2="85" className={styles.trailDash} />

              <line x1="420" y1="128" x2="620" y2="128" className={styles.checkLine} />
              <text x="520" y="142" textAnchor="middle" className={styles.textSecondary}>SIGNATURE</text>
            </g>
          )}

          {/* Reverse View */}
          {isReverse && (
            <g>
              <rect x="40" y="35" width="270" height="110" rx="8" className={styles.periodBoxActive} />
              <text x="55" y="60" className={styles.textSecondary}>ENGLISH WORDS</text>
              <text x="55" y="90" className={styles.textPrimary}>&quot;Three hundred fifty&quot;</text>
              <text x="55" y="112" className={styles.textSecondary}>&quot;Twelve lakh thirty-four thousand&quot;</text>

              <path d="M 325 90 L 355 90" stroke="var(--cat-writing)" strokeWidth="3" markerEnd="url(#arrow)" />

              <rect x="370" y="35" width="270" height="110" rx="8" className={styles.periodBox} />
              <text x="385" y="60" className={styles.textSecondary}>DIGIT CONVERSION</text>
              <text x="385" y="90" className={styles.textAccent}>350</text>
              <text x="385" y="112" className={styles.textAccent}>12,34,000</text>
            </g>
          )}

          {/* Ordinal View */}
          {isOrdinal && (
            <g>
              <rect x="40" y="35" width="280" height="110" rx="8" className={styles.periodBoxActive} />
              <text x="58" y="62" className={styles.textSecondary}>CARDINAL NUMBER</text>
              <text x="58" y="90" className={styles.textPrimary}>21 (Twenty-one)</text>
              <text x="58" y="115" className={styles.textSecondary}>Base counting quantity</text>

              <rect x="360" y="35" width="280" height="110" rx="8" className={styles.periodBox} />
              <text x="378" y="62" className={styles.textSecondary}>ORDINAL RANK</text>
              <text x="378" y="90" className={styles.textAccent}>21st (Twenty-first)</text>
              <text x="378" y="115" className={styles.textSecondary}>Sequence or position in order</text>
            </g>
          )}
        </svg>
      </div>

      <details className={styles.mobileDetails}>
        <summary>Check &amp; Place Value Writing Guide</summary>
        <ul className={styles.mobileList}>
          <li><strong>1. Numeric Amount Box:</strong> Digits written with commas and decimals.</li>
          <li><strong>2. Amount in Words:</strong> Spelled dollars with cents written as a fraction over 100.</li>
          <li><strong>3. Fill Trailing Space:</strong> Draw a line to the end of the line to prevent tampering.</li>
          <li><strong>4. UCC § 3-114:</strong> Words prevail over numbers.</li>
        </ul>
      </details>
    </div>
  );
}
