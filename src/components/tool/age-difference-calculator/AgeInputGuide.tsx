'use client';

import React from 'react';
import styles from './AgeInputGuide.module.css';

interface AgeInputGuideProps {
  tab: 'two' | 'family' | 'born' | 'quick';
  dateA?: string;
  dateB?: string;
  nameA?: string;
  nameB?: string;
  asOfDate?: string;
  targetAge?: number;
  bornResult?: string;
  gapText?: string;
  focusedField?: string | null;
}

export default function AgeInputGuide({
  tab,
  dateA = '1990-03-15',
  dateB = '1994-07-02',
  nameA = 'Alex',
  nameB = 'Sam',
  asOfDate = '2026-11-23',
  targetAge = 21,
  bornResult = '2005-11-23',
  gapText = '4 y · 3 m · 17 d',
  focusedField,
}: AgeInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Timeline</span> Visual Calendar Age Timeline
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 720 180"
          role="img"
          aria-label="Horizontal timeline of birth dates and calculated age differences"
        >
          {tab === 'born' ? (
            /* Born on or before tab: backwards from As-of */
            <g transform="translate(40, 30)">
              {/* Timeline axis */}
              <line x1="40" y1="90" x2="600" y2="90" className={styles.axisLine} />
              <polygon points="600,85 615,90 600,95" fill="var(--line)" />

              {/* Latest DOB marker (Result) */}
              <g transform="translate(140, 45)" className={styles.highlight}>
                <circle cx="20" cy="20" r="10" className={styles.badgeCircle} />
                <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>★</text>
                <text x="20" y="-10" textAnchor="middle" fontWeight="bold" fill="#4F46E5" className={styles.labelText}>
                  Born On or Before
                </text>
                <text x="20" y="6" textAnchor="middle" className={styles.labelText}>
                  {bornResult}
                </text>
                <line x1="20" y1="20" x2="20" y2="45" stroke="#4F46E5" strokeWidth="2.5" />
                <circle cx="20" cy="45" r="4" fill="#4F46E5" />
              </g>

              {/* Bracket: Target age span */}
              <path d="M 160 30 Q 340 0 520 30" fill="none" stroke="#EA580C" strokeWidth="2" strokeDasharray="5 3" />
              <text x="340" y="15" textAnchor="middle" fill="#EA580C" fontWeight="bold" className={styles.labelText}>
                &larr; Subtract {targetAge} Years &larr;
              </text>

              {/* As of Date marker */}
              <g transform="translate(500, 45)" className={isFocused('asOf') ? styles.highlight : ''}>
                <circle cx="20" cy="20" r="10" className={styles.badgeCircle} />
                <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>3</text>
                <text x="20" y="-10" textAnchor="middle" className={styles.labelText}>
                  As-Of Date
                </text>
                <text x="20" y="6" textAnchor="middle" className={styles.labelMuted}>
                  {asOfDate}
                </text>
                <line x1="20" y1="20" x2="20" y2="45" stroke="var(--ink)" strokeWidth="2" />
                <circle cx="20" cy="45" r="4" fill="var(--ink)" />
              </g>

              <text x="340" y="135" textAnchor="middle" className={styles.labelMuted}>
                Exact calendar date needed to reach at least age {targetAge} as of {asOfDate}
              </text>
            </g>
          ) : (
            /* Two people / Family tab: chronological DOB markers */
            <g transform="translate(40, 25)">
              {/* Timeline axis */}
              <line x1="30" y1="100" x2="620" y2="100" className={styles.axisLine} />
              <polygon points="620,95 635,100 620,105" fill="var(--line)" />

              {/* Person A marker */}
              <g transform="translate(100, 50)" className={isFocused('dobA') ? styles.highlight : ''}>
                <circle cx="20" cy="20" r="10" className={styles.badgeCircle} />
                <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>1</text>
                <text x="20" y="-10" textAnchor="middle" fontWeight="bold" className={styles.labelText}>
                  {nameA || 'Person A'}
                </text>
                <text x="20" y="5" textAnchor="middle" className={styles.labelMuted}>
                  {dateA}
                </text>
                <line x1="20" y1="20" x2="20" y2="50" stroke="#4F46E5" strokeWidth="2.5" />
                <circle cx="20" cy="50" r="5" fill="#4F46E5" />
              </g>

              {/* Bracket: Age Gap */}
              <path d="M 120 40 Q 240 10 360 40" className={styles.bracketLine} />
              <rect x="180" y="10" width="120" height="24" rx="6" fill="var(--surface)" stroke="#4F46E5" />
              <text x="240" y="26" textAnchor="middle" fill="#4F46E5" fontWeight="bold" fontSize="12">
                {gapText}
              </text>

              {/* Person B marker */}
              <g transform="translate(340, 50)" className={isFocused('dobB') ? styles.highlight : ''}>
                <circle cx="20" cy="20" r="10" className={styles.badgeCircle} />
                <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>2</text>
                <text x="20" y="-10" textAnchor="middle" fontWeight="bold" className={styles.labelText}>
                  {nameB || 'Person B'}
                </text>
                <text x="20" y="5" textAnchor="middle" className={styles.labelMuted}>
                  {dateB}
                </text>
                <line x1="20" y1="20" x2="20" y2="50" stroke="#0D9488" strokeWidth="2.5" />
                <circle cx="20" cy="50" r="5" fill="#0D9488" />
              </g>

              {/* As-Of Date marker */}
              <g transform="translate(540, 50)" className={isFocused('asOf') ? styles.highlight : ''}>
                <circle cx="20" cy="20" r="10" className={styles.badgeCircle} />
                <text x="20" y="24" textAnchor="middle" className={styles.labelNumber}>3</text>
                <text x="20" y="-10" textAnchor="middle" className={styles.labelText}>
                  As-Of Date
                </text>
                <text x="20" y="5" textAnchor="middle" className={styles.labelMuted}>
                  {asOfDate}
                </text>
                <line x1="20" y1="20" x2="20" y2="50" stroke="var(--ink)" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="20" cy="50" r="4" fill="var(--ink)" />
              </g>

              <text x="320" y="140" textAnchor="middle" className={styles.labelMuted}>
                Month-stepping calendar difference: full years, remaining full months, and exact days
              </text>
            </g>
          )}
        </svg>
      </div>
    </details>
  );
}
