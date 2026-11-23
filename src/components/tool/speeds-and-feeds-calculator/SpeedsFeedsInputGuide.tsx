'use client';

import React from 'react';
import styles from './SpeedsFeedsInputGuide.module.css';

interface SpeedsFeedsInputGuideProps {
  tab: 'milling' | 'routing' | 'drilling' | 'tapping';
  unit: 'inch' | 'metric';
  dia: number;
  flutes: number;
  sfmOrVc: number;
  chipLoad: number;
  woc: number;
  doc: number;
  calculatedRpm: number | null;
  calculatedFeed: number | null;
  focusedField?: string | null;
}

export default function SpeedsFeedsInputGuide({
  tab,
  unit,
  dia,
  flutes,
  sfmOrVc,
  chipLoad,
  woc,
  doc,
  calculatedRpm,
  calculatedFeed,
  focusedField,
}: SpeedsFeedsInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;
  const unitSuffix = unit === 'metric' ? 'mm' : 'in';
  const speedUnit = unit === 'metric' ? 'm/min' : 'SFM';
  const feedUnit = unit === 'metric' ? 'mm/min' : 'IPM';

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Cutting Mechanics &amp; Vector Guide
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 760 250"
          role="img"
          aria-label="CNC end mill spindle diagram with RPM rotation, advance feed rate, and chip load dimensions"
        >
          {/* Left: Spinning End Mill Diagram */}
          <g transform="translate(40, 20)">
            {/* Collet / Toolholder */}
            <rect x="70" y="10" width="80" height="35" rx="3" className={styles.colletBody} />
            <polygon points="76,45 144,45 132,60 88,60" className={styles.colletBody} />

            {/* Cutter Shank */}
            <rect x="94" y="60" width="32" height="40" className={styles.toolShank} />

            {/* Cutter Fluted Body */}
            <rect x="94" y="100" width="32" height="75" className={styles.fluteBlade} />
            {/* Spiral flute lines */}
            <path d="M 94,115 Q 110,125 126,115 M 94,140 Q 110,150 126,140 M 94,165 Q 110,175 126,165" stroke="var(--cat-engineering-deep)" strokeWidth="1.5" fill="none" />

            {/* Diameter Callout */}
            <g className={`${styles.callout} ${isFocused('dia') ? styles.activeCallout : ''}`}>
              <line x1="94" y1="90" x2="126" y2="90" className={styles.dimLine} />
              <circle cx="94" cy="90" r="3" className={styles.dimDot} />
              <circle cx="126" cy="90" r="3" className={styles.dimDot} />
              <rect x="75" y="72" width="70" height="18" rx="3" className={styles.badgeBg} />
              <text x="110" y="85" textAnchor="middle" className={styles.badgeText}>
                1 D: {dia} {unitSuffix}
              </text>
            </g>

            {/* Rotation Arrow (SFM & Spindle RPM) */}
            <g className={`${styles.callout} ${isFocused('sfm') ? styles.activeCallout : ''}`}>
              <path d="M 50,55 A 35,16 0 1,1 42,70" stroke="var(--cat-engineering)" strokeWidth="2.5" fill="none" />
              <polyline points="38,65 42,72 49,67" stroke="var(--cat-engineering)" strokeWidth="2.5" fill="none" />
              <rect x="-10" y="25" width="135" height="22" rx="4" className={styles.badgeBg} />
              <text x="57" y="40" textAnchor="middle" className={styles.badgeText}>
                3 {sfmOrVc} {speedUnit} ({calculatedRpm ? Math.round(calculatedRpm) : '—'} RPM)
              </text>
            </g>

            {/* Advance Feed Arrow */}
            <g className={`${styles.callout} ${isFocused('feed') ? styles.activeCallout : ''}`}>
              <line x1="140" y1="165" x2="210" y2="165" stroke="var(--ink)" strokeWidth="3" />
              <polyline points="198,158 210,165 198,172" stroke="var(--ink)" strokeWidth="3" fill="none" />
              <rect x="145" y="135" width="135" height="22" rx="4" className={styles.badgeBg} />
              <text x="212" y="150" textAnchor="middle" className={styles.badgeText}>
                4 Feed: {calculatedFeed ? calculatedFeed.toFixed(1) : '—'} {feedUnit}
              </text>
            </g>

            {/* Stock material block */}
            <rect x="120" y="145" width="120" height="65" rx="3" className={styles.stockBlock} />
            <rect x="94" y="145" width="26" height="30" className={styles.cutSlot} />
          </g>

          {/* Right: Chip Load & Radial Stepover Inset */}
          <g transform="translate(420, 25)">
            <rect x="0" y="5" width="300" height="195" rx="8" className={styles.badgeBg} />
            <text x="150" y="28" textAnchor="middle" className={styles.pillText} fontSize="11">
              Chip Formation &amp; Stepover Inset
            </text>

            {/* Chip Load formula badge */}
            <g transform="translate(20, 45)">
              <rect x="0" y="0" width="260" height="30" rx="6" className={styles.pillBg} />
              <text x="130" y="20" textAnchor="middle" className={styles.pillText}>
                Feed = RPM × {flutes} Flutes × {chipLoad} {unitSuffix}/tooth
              </text>
            </g>

            {/* Radial Stepover (WOC) & Axial Depth (DOC) diagram */}
            <g transform="translate(30, 95)">
              <rect x="0" y="20" width="140" height="70" rx="3" className={styles.stockBlock} />
              <rect x="0" y="20" width="40" height="35" className={styles.cutSlot} />

              {/* WOC arrow */}
              <line x1="0" y1="10" x2="40" y2="10" className={styles.dimLine} />
              <circle cx="0" cy="10" r="2.5" className={styles.dimDot} />
              <circle cx="40" cy="10" r="2.5" className={styles.dimDot} />
              <text x="20" y="5" textAnchor="middle" className={styles.badgeText}>
                WOC: {woc} {unitSuffix}
              </text>

              {/* DOC arrow */}
              <line x1="150" y1="20" x2="150" y2="55" className={styles.dimLine} />
              <circle cx="150" cy="20" r="2.5" className={styles.dimDot} />
              <circle cx="150" cy="55" r="2.5" className={styles.dimDot} />
              <text x="158" y="42" className={styles.badgeText}>
                DOC: {doc} {unitSuffix}
              </text>
            </g>

            {/* High speed machining chip thinning notice */}
            <text x="150" y="188" textAnchor="middle" fill="var(--ink-soft)" fontSize="9.5">
              Radial Chip Thinning triggers when WOC &lt; 50% tool diameter
            </text>
          </g>
        </svg>
      </div>
    </details>
  );
}
