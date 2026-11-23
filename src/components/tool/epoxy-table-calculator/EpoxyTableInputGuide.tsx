'use client';

import React from 'react';
import styles from './EpoxyTableInputGuide.module.css';

interface EpoxyTableInputGuideProps {
  tab: 'river' | 'flood' | 'full';
  unit: 'in' | 'cm';
  riverLength: number;
  riverAvgWidth: number;
  riverDepth: number;
  seepageGap: number;
  tableLength: number;
  tableWidth: number;
  floodThickness: number;
  edgeHeight: number;
  maxLayerDepth: number;
  focusedField?: string | null;
}

export default function EpoxyTableInputGuide({
  tab,
  unit,
  riverLength,
  riverAvgWidth,
  riverDepth,
  seepageGap,
  tableLength,
  tableWidth,
  floodThickness,
  edgeHeight,
  maxLayerDepth,
  focusedField,
}: EpoxyTableInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> River Table Anatomy &amp; Pour Inset
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 760 270"
          role="img"
          aria-label="Epoxy river table anatomy diagram with width readings and depth insets"
        >
          {/* Main Top View: Table slab with river channel in center */}
          <g transform="translate(30, 25)">
            {/* Table outer contour */}
            <rect x="0" y="20" width="460" height="150" rx="6" className={styles.tableOuter} />

            {/* Left live edge slab with natural curve */}
            <path
              d="M 0,20 L 170,20 Q 195,50 165,80 Q 145,110 180,140 Q 195,155 175,170 L 0,170 Z"
              className={styles.woodSlabLeft}
            />

            {/* Right live edge slab with natural curve */}
            <path
              d="M 460,20 L 290,20 Q 265,50 295,80 Q 315,110 280,140 Q 265,155 285,170 L 460,170 Z"
              className={styles.woodSlabRight}
            />

            {/* River Epoxy Canyon flowing between slabs */}
            <path
              d="M 170,20 Q 195,50 165,80 Q 145,110 180,140 Q 195,155 175,170 L 285,170 Q 265,155 280,140 Q 315,110 295,80 Q 265,50 290,20 Z"
              className={styles.riverResin}
            />

            {/* Width reading indicator arrows across the river */}
            <g className={styles.widthArrows}>
              <line x1="178" y1="50" x2="282" y2="50" className={styles.widthArrow} />
              <polyline points="183,47 178,50 183,53" stroke="#fff" fill="none" strokeWidth="1.2" />
              <polyline points="277,47 282,50 277,53" stroke="#fff" fill="none" strokeWidth="1.2" />

              <line x1="165" y1="95" x2="295" y2="95" className={styles.widthArrow} />
              <polyline points="170,92 165,95 170,98" stroke="#fff" fill="none" strokeWidth="1.2" />
              <polyline points="290,92 295,95 290,98" stroke="#fff" fill="none" strokeWidth="1.2" />

              <line x1="177" y1="140" x2="283" y2="140" className={styles.widthArrow} />
              <polyline points="182,137 177,140 182,143" stroke="#fff" fill="none" strokeWidth="1.2" />
              <polyline points="278,137 283,140 278,143" stroke="#fff" fill="none" strokeWidth="1.2" />
            </g>

            {/* Flood coat overlay dashed outline if full or flood tab */}
            {(tab === 'flood' || tab === 'full') && (
              <rect x="2" y="22" width="456" height="146" rx="5" className={styles.floodCoatOverlay} />
            )}

            {/* Callout 1: River Length */}
            <g className={`${styles.callout} ${isFocused('riverLength') ? styles.activeCallout : ''}`}>
              <line x1="0" y1="8" x2="460" y2="8" className={styles.dimLine} />
              <circle cx="0" cy="8" r="3" className={styles.dimDot} />
              <circle cx="460" cy="8" r="3" className={styles.dimDot} />
              <rect x="180" y="-3" width="105" height="20" rx="4" className={styles.badgeBg} />
              <text x="232" y="11" textAnchor="middle" className={styles.badgeText}>
                1 River Length: {riverLength} {unit}
              </text>
            </g>

            {/* Callout 2: River Width readings */}
            <g className={`${styles.callout} ${isFocused('riverAvgWidth') ? styles.activeCallout : ''}`}>
              <rect x="175" y="85" width="115" height="20" rx="4" className={styles.badgeBg} />
              <text x="232" y="99" textAnchor="middle" className={styles.badgeText}>
                2 Avg Width: {riverAvgWidth} {unit}
              </text>
            </g>

            {/* Callout for Table Width */}
            <g className={styles.callout}>
              <line x1="-12" y1="20" x2="-12" y2="170" className={styles.dimLine} />
              <circle cx="-12" cy="20" r="3" className={styles.dimDot} />
              <circle cx="-12" cy="170" r="3" className={styles.dimDot} />
              <rect x="-85" y="85" width="70" height="20" rx="4" className={styles.badgeBg} />
              <text x="-50" y="99" textAnchor="middle" className={styles.badgeText}>
                {tableWidth} {unit} wide
              </text>
            </g>
          </g>

          {/* Right Side: Cross-Section Inset Diagram */}
          <g transform="translate(530, 35)">
            <rect x="0" y="10" width="190" height="180" rx="8" className={styles.badgeBg} />
            <text x="95" y="30" textAnchor="middle" className={styles.pillText} fontSize="11">
              Cross-Section &amp; Pours
            </text>

            {/* Slab cross section blocks */}
            <rect x="15" y="80" width="45" height="60" rx="2" className={styles.woodSlabLeft} />
            <rect x="130" y="80" width="45" height="60" rx="2" className={styles.woodSlabRight} />

            {/* River cavity between */}
            <rect x="60" y="80" width="70" height="60" rx="1" className={styles.riverResin} />

            {/* Max depth layer line */}
            {maxLayerDepth > 0 && (
              <line x1="60" y1="110" x2="130" y2="110" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 2" />
            )}

            {/* Flood coat top layer */}
            {(tab === 'flood' || tab === 'full') && (
              <rect x="15" y="70" width="160" height="10" rx="1" className={styles.floodCoatOverlay} />
            )}

            {/* Callout 3: River Depth */}
            <g className={`${styles.callout} ${isFocused('riverDepth') ? styles.activeCallout : ''}`}>
              <line x1="140" y1="80" x2="140" y2="140" className={styles.dimLine} />
              <rect x="145" y="100" width="75" height="18" rx="3" className={styles.badgeBg} />
              <text x="182" y="113" textAnchor="middle" className={styles.badgeText}>
                3 Depth: {riverDepth} {unit}
              </text>
            </g>

            {/* Callout 7: Max Depth per Pour */}
            <g className={styles.callout}>
              <text x="95" y="125" textAnchor="middle" fill="#fff" fontSize="8.5" fontWeight="700">
                7 Max {maxLayerDepth}&quot;/layer
              </text>
            </g>

            {/* Under-slab Seepage gap */}
            {seepageGap > 0 && (
              <g className={styles.callout}>
                <line x1="15" y1="145" x2="175" y2="145" stroke="#D97706" strokeWidth="2" />
                <text x="95" y="160" textAnchor="middle" fill="#B45309" fontSize="8.5" fontWeight="600">
                  4 Seepage: {seepageGap} {unit}
                </text>
              </g>
            )}

            {/* Top flood coat label */}
            {(tab === 'flood' || tab === 'full') && (
              <g className={styles.callout}>
                <text x="95" y="62" textAnchor="middle" fill="var(--cat-engineering-deep)" fontSize="9" fontWeight="700">
                  5 Flood coat: {floodThickness} {unit}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
    </details>
  );
}
