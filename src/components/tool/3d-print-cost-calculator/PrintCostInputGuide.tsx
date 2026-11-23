'use client';

import React from 'react';
import styles from './PrintCostInputGuide.module.css';

interface PrintCostInputGuideProps {
  materialType: 'filament' | 'resin';
  materialAmount: number;
  materialPrice: number;
  watts: number;
  hours: number;
  kwhRate: number;
  wearPerHour: number;
  laborCost: number;
  failurePct: number;
  markupPct: number;
  focusedField?: string | null;
}

export default function PrintCostInputGuide({
  materialType,
  materialAmount,
  materialPrice,
  watts,
  hours,
  kwhRate,
  wearPerHour,
  laborCost,
  failurePct,
  markupPct,
  focusedField,
}: PrintCostInputGuideProps) {
  const isFocused = (f: string) => focusedField === f;

  return (
    <details className={styles.guideWrapper} open>
      <summary className={styles.guideSummary}>
        <span className={styles.summaryTitle}>
          <span className={styles.summaryBadge}>Diagram</span> Cost Buildup Anatomy
        </span>
        <span className={styles.summaryHint}>Click to collapse</span>
      </summary>

      <div className={styles.svgContainer}>
        <svg
          className={styles.diagramSvg}
          viewBox="0 0 760 250"
          role="img"
          aria-label="3D printer cost buildup diagram showing material, power, wear, labor, failure and markup"
        >
          {/* Left: 3D Printer Diagram */}
          <g transform="translate(30, 20)">
            {/* Outer Gantry Frame */}
            <path d="M 40,210 L 40,50 Q 40,40 50,40 L 230,40 Q 240,40 240,50 L 240,210" className={styles.printerFrame} />
            <line x1="30" y1="210" x2="250" y2="210" className={styles.printerFrame} />

            {/* Heated Bed */}
            <rect x="60" y="180" width="160" height="14" rx="2" className={styles.printerBed} />

            {/* X-Gantry Beam & Toolhead */}
            <line x1="40" y1="120" x2="240" y2="120" stroke="var(--ink)" strokeWidth="2" />
            <rect x="125" y="105" width="30" height="25" rx="3" className={styles.toolhead} />
            <polygon points="135,130 145,130 140,137" fill="var(--cat-engineering-deep)" />

            {/* Printed Benchy/Cube Part */}
            <polygon points="120,180 160,180 152,142 128,142" className={styles.printedPart} />

            {materialType === 'filament' ? (
              /* Spool on top */
              <g className={`${styles.callout} ${isFocused('material') ? styles.activeCallout : ''}`}>
                <circle cx="90" cy="30" r="18" className={styles.spool} />
                <circle cx="90" cy="30" r="6" fill="var(--surface)" />
                <path d="M 90,48 Q 110,80 135,105" className={styles.filamentLine} />
                <rect x="15" y="0" width="145" height="20" rx="4" className={styles.badgeBg} />
                <text x="87" y="14" textAnchor="middle" className={styles.badgeText}>
                  1 {materialAmount} g (${materialPrice}/spool)
                </text>
              </g>
            ) : (
              /* Resin bottle */
              <g className={`${styles.callout} ${isFocused('material') ? styles.activeCallout : ''}`}>
                <rect x="75" y="10" width="30" height="30" rx="4" className={styles.spool} />
                <rect x="83" y="4" width="14" height="6" rx="1" fill="var(--ink-soft)" />
                <rect x="15" y="-5" width="145" height="20" rx="4" className={styles.badgeBg} />
                <text x="87" y="9" textAnchor="middle" className={styles.badgeText}>
                  1 {materialAmount} mL (${materialPrice}/bottle)
                </text>
              </g>
            )}

            {/* Power cable & plug callout */}
            <g className={`${styles.callout} ${isFocused('power') ? styles.activeCallout : ''}`}>
              <path d="M 240,195 Q 270,205 285,185" stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
              <rect x="235" y="150" width="145" height="22" rx="4" className={styles.badgeBg} />
              <text x="307" y="165" textAnchor="middle" className={styles.badgeText}>
                3 Power: {watts} W · {hours}h (${kwhRate}/kWh)
              </text>
            </g>
          </g>

          {/* Right: Sequential Cost Stack Waterfall */}
          <g transform="translate(420, 25)">
            <text x="0" y="16" fill="var(--ink)" fontSize="13" fontWeight="800">
              The 6 Cost Layers
            </text>

            {/* Step 1: Material */}
            <g transform="translate(0, 30)">
              <rect x="0" y="0" width="300" height="24" rx="5" fill="color-mix(in srgb, #6366F1 20%, var(--surface))" stroke="#6366F1" strokeWidth="1" />
              <text x="12" y="16" fill="var(--ink)" fontSize="11" fontWeight="700">1. Material Consumed</text>
              <text x="288" y="16" textAnchor="end" fill="var(--ink)" fontSize="11" fontWeight="700">Filament / Resin</text>
            </g>

            {/* Step 2: Power */}
            <g transform="translate(0, 60)">
              <rect x="0" y="0" width="300" height="24" rx="5" fill="color-mix(in srgb, #F59E0B 18%, var(--surface))" stroke="#F59E0B" strokeWidth="1" />
              <text x="12" y="16" fill="var(--ink)" fontSize="11" fontWeight="700">2. Electricity</text>
              <text x="288" y="16" textAnchor="end" fill="var(--ink)" fontSize="11" fontWeight="700">{watts} W × {hours} hrs</text>
            </g>

            {/* Step 3: Wear & Deprec */}
            <g transform="translate(0, 90)">
              <rect x="0" y="0" width="300" height="24" rx="5" fill="color-mix(in srgb, #0284C7 20%, var(--surface))" stroke="#0284C7" strokeWidth="1" />
              <text x="12" y="16" fill="var(--ink)" fontSize="11" fontWeight="700">3. Machine Wear</text>
              <text x="288" y="16" textAnchor="end" fill="var(--ink)" fontSize="11" fontWeight="700">${wearPerHour.toFixed(2)} / hour</text>
            </g>

            {/* Step 4: Failure rate */}
            <g transform="translate(0, 120)">
              <rect x="0" y="0" width="300" height="24" rx="5" fill="color-mix(in srgb, #EF4444 18%, var(--surface))" stroke="#EF4444" strokeWidth="1" />
              <text x="12" y="16" fill="var(--ink)" fontSize="11" fontWeight="700">4. Failure Contingency</text>
              <text x="288" y="16" textAnchor="end" fill="var(--ink)" fontSize="11" fontWeight="700">+{failurePct}% Allowance</text>
            </g>

            {/* Step 5: Labor */}
            <g transform="translate(0, 150)">
              <rect x="0" y="0" width="300" height="24" rx="5" fill="color-mix(in srgb, var(--cat-engineering) 25%, var(--surface))" stroke="var(--cat-engineering)" strokeWidth="1" />
              <text x="12" y="16" fill="var(--ink)" fontSize="11" fontWeight="700">5. Hands-on Labor</text>
              <text x="288" y="16" textAnchor="end" fill="var(--ink)" fontSize="11" fontWeight="700">${laborCost.toFixed(2)} Prep &amp; Post</text>
            </g>

            {/* Step 6: Markup / Selling Price */}
            <g transform="translate(0, 180)">
              <rect x="0" y="0" width="300" height="26" rx="6" fill="var(--cat-engineering)" />
              <text x="12" y="18" fill="#ffffff" fontSize="12" fontWeight="800">6. Profit &amp; Quote Price</text>
              <text x="288" y="18" textAnchor="end" fill="#ffffff" fontSize="12" fontWeight="800">+{markupPct}% Markup</text>
            </g>
          </g>
        </svg>
      </div>
    </details>
  );
}
