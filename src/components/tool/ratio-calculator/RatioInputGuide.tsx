'use client';

import React from 'react';
import styles from './RatioInputGuide.module.css';

interface RatioInputGuideProps {
  tab: 'simplify' | 'solve' | 'split' | 'equivalent' | 'fraction';
  terms: number[];
  solveRatio1?: (number | null)[];
  solveRatio2?: (number | null)[];
  total?: number;
  unit?: string;
  focusedField?: string | null;
}

export default function RatioInputGuide({
  tab,
  terms,
  solveRatio1 = [2, 3],
  solveRatio2 = [10, null],
  total = 60,
  unit = 'kg',
  focusedField,
}: RatioInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  // Safe terms fallback
  const validTerms = terms.length >= 2 ? terms.map((t) => (t > 0 && isFinite(t) ? t : 1)) : [2, 3];
  const sumTerms = validTerms.reduce((a, b) => a + b, 0);

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Visual Ratio &amp; Proportion Guide
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 720 180"
          role="img"
          aria-label="Visual representation of ratio parts and proportions"
        >
          {tab === 'solve' ? (
            /* Solve Proportion Tab: Two rows of comparative bars */
            <g transform="translate(40, 20)">
              {/* Row 1: Ratio 1 (A : B) */}
              <text x="0" y="22" className={styles.labelText}>Ratio 1</text>
              <g transform="translate(80, 0)">
                {/* Term A */}
                <g className={isFocused('solveA') ? styles.highlight : ''}>
                  <rect x="0" y="5" width="120" height="30" rx="6" className={styles.barTermA} />
                  <circle cx="20" cy="20" r="9" className={styles.badgeCircle} />
                  <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>1</text>
                  <text x="70" y="24" textAnchor="middle" fill="#FFFFFF" className={styles.labelText}>
                    A = {solveRatio1[0] ?? '?'}
                  </text>
                </g>
                <text x="135" y="25" className={styles.labelText}>:</text>
                {/* Term B */}
                <g className={isFocused('solveB') ? styles.highlight : ''} transform="translate(150, 0)">
                  <rect x="0" y="5" width="180" height="30" rx="6" className={styles.barTermB} />
                  <circle cx="20" cy="20" r="9" className={styles.badgeCircle} />
                  <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>2</text>
                  <text x="100" y="24" textAnchor="middle" fill="#FFFFFF" className={styles.labelText}>
                    B = {solveRatio1[1] ?? '?'}
                  </text>
                </g>
              </g>

              {/* Equivalence sign */}
              <text x="440" y="55" fontSize="26" textAnchor="middle" className={styles.labelText}>=</text>

              {/* Row 2: Ratio 2 (C : D/x) */}
              <text x="0" y="85" className={styles.labelText}>Ratio 2</text>
              <g transform="translate(80, 65)">
                {/* Term C */}
                <g className={isFocused('solveC') ? styles.highlight : ''}>
                  <rect x="0" y="5" width="120" height="30" rx="6" className={styles.barTermA} />
                  <circle cx="20" cy="20" r="9" className={styles.badgeCircle} />
                  <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>3</text>
                  <text x="70" y="24" textAnchor="middle" fill="#FFFFFF" className={styles.labelText}>
                    C = {solveRatio2[0] ?? 'x'}
                  </text>
                </g>
                <text x="135" y="25" className={styles.labelText}>:</text>
                {/* Term D (x) */}
                <g className={isFocused('solveD') ? styles.highlight : ''} transform="translate(150, 0)">
                  <rect
                    x="0"
                    y="5"
                    width="180"
                    height="30"
                    rx="6"
                    className={solveRatio2[1] === null ? styles.barUnknown : styles.barTermB}
                  />
                  <circle cx="20" cy="20" r="9" className={styles.badgeCircle} />
                  <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>4</text>
                  <text
                    x="100"
                    y="24"
                    textAnchor="middle"
                    fill={solveRatio2[1] === null ? '#4F46E5' : '#FFFFFF'}
                    className={styles.labelText}
                  >
                    D = {solveRatio2[1] ?? 'x (unknown)'}
                  </text>
                </g>
              </g>

              <text x="280" y="130" textAnchor="middle" className={styles.labelMuted}>
                Cross-multiplication rule: A × D = B × C
              </text>
            </g>
          ) : tab === 'split' ? (
            /* Split Tab: Proportional total allocation */
            <g transform="translate(40, 20)">
              {/* Bracket showing total */}
              <text x="320" y="20" textAnchor="middle" className={styles.labelText}>
                Total Allocation: {total} {unit} (Sum of parts = {sumTerms})
              </text>

              {/* Sliced Total Bar */}
              <g transform="translate(50, 35)">
                {validTerms.map((term, i) => {
                  const barWidth = Math.max(70, Math.min(300, (term / sumTerms) * 540));
                  let prevWidth = 0;
                  for (let j = 0; j < i; j++) {
                    prevWidth += Math.max(70, Math.min(300, (validTerms[j] / sumTerms) * 540));
                  }
                  const colors = [styles.barTermA, styles.barTermB, styles.barTermC];
                  const shareAmount = ((term / sumTerms) * total).toFixed(1).replace(/\.0$/, '');

                  return (
                    <g key={i} transform={`translate(${prevWidth}, 0)`} className={isFocused(`term${i}`) ? styles.highlight : ''}>
                      <rect x="0" y="0" width={barWidth} height="44" rx="6" className={colors[i % 3]} />
                      <circle cx="20" cy="22" r="9" className={styles.badgeCircle} />
                      <text x="20" y="26" textAnchor="middle" className={styles.labelNumber}>{i + 1}</text>
                      <text x={barWidth / 2 + 10} y="22" textAnchor="middle" fill="#FFFFFF" className={styles.labelText}>
                        Part {i + 1} ({term})
                      </text>
                      <text x={barWidth / 2 + 10} y="36" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="11">
                        {shareAmount} {unit}
                      </text>
                    </g>
                  );
                })}
              </g>

              <text x="320" y="120" textAnchor="middle" className={styles.labelMuted}>
                Formula: Each share = Total × (Term Part ÷ Total Parts)
              </text>
            </g>
          ) : (
            /* Simplify / Equivalent / Fraction Tab: Side-by-side relative bars */
            <g transform="translate(50, 25)">
              <text x="310" y="20" textAnchor="middle" className={styles.labelText}>
                Proportional Bar Comparison (Total Parts = {sumTerms})
              </text>

              <g transform="translate(40, 45)">
                {validTerms.map((term, i) => {
                  const width = Math.max(90, Math.min(260, (term / sumTerms) * 500));
                  let xOffset = 0;
                  for (let j = 0; j < i; j++) {
                    xOffset += Math.max(90, Math.min(260, (validTerms[j] / sumTerms) * 500)) + 30;
                  }
                  const colors = [styles.barTermA, styles.barTermB, styles.barTermC];

                  return (
                    <g key={i} transform={`translate(${xOffset}, 0)`} className={isFocused(`term${i}`) ? styles.highlight : ''}>
                      <rect x="0" y="0" width={width} height="40" rx="8" className={colors[i % 3]} />
                      <circle cx="20" cy="20" r="9" className={styles.badgeCircle} />
                      <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>{i + 1}</text>
                      <text x={width / 2 + 10} y="25" textAnchor="middle" fill="#FFFFFF" className={styles.labelText}>
                        Term {i + 1}: {term}
                      </text>
                    </g>
                  );
                })}
              </g>

              <text x="310" y="125" textAnchor="middle" className={styles.labelMuted}>
                Ratio: {validTerms.join(' : ')} &bull; Scale each term by dividing by the greatest common divisor (GCD)
              </text>
            </g>
          )}
        </svg>
      </div>
    </details>
  );
}
