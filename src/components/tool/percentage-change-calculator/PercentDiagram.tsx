'use client';

import React, { useState } from 'react';
import styles from './PercentDiagram.module.css';
import { formatNumber, formatPct } from '@/lib/percent-engine';

interface PercentDiagramProps {
  valOld: number;
  valNew: number;
  labelOld?: string;
  labelNew?: string;
  pct?: number | null;
  unit?: string;
  modeLabel?: string;
}

export default function PercentDiagram({
  valOld,
  valNew,
  labelOld = 'Initial (Old)',
  labelNew = 'Final (New)',
  pct,
  unit = '',
  modeLabel,
}: PercentDiagramProps) {
  const [viewMode, setViewMode] = useState<'bars' | 'waterfall'>('bars');

  const delta = valNew - valOld;
  const isIncrease = delta > 0;
  const isDecrease = delta < 0;

  const colorOld = '#64748b'; // Slate neutral
  const colorNew = isIncrease ? '#10b981' : isDecrease ? '#ef4444' : '#0284c7';
  const colorDeltaBg = isIncrease ? '#dcfce7' : isDecrease ? '#fee2e2' : '#e0f2fe';
  const colorDeltaBorder = isIncrease ? '#16a34a' : isDecrease ? '#dc2626' : '#0284c7';

  // SVG Geometry Constants
  const svgW = 540;
  const svgH = 260;
  const groundY = 210;
  const maxBarH = 150;

  const maxVal = Math.max(Math.abs(valOld), Math.abs(valNew), 1);
  const hOld = Math.max(6, (Math.abs(valOld) / maxVal) * maxBarH);
  const hNew = Math.max(6, (Math.abs(valNew) / maxVal) * maxBarH);

  const yOld = groundY - hOld;
  const yNew = groundY - hNew;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Visual Growth &amp; Shift Diagram</h3>
          <p className={styles.subtitle}>
            {modeLabel || (viewMode === 'bars' ? 'Side-by-side proportional scaling & delta bracket' : 'Waterfall flow: baseline → change step → final')}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'bars' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('bars')}
          >
            Bar Comparison
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'waterfall' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('waterfall')}
          >
            Waterfall Flow
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className={styles.svg}
          role="img"
          aria-label="Visual percentage change comparison diagram"
        >
          {/* Background grid lines */}
          <line x1="30" y1="60" x2="510" y2="60" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="30" y1="110" x2="510" y2="110" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="30" y1="160" x2="510" y2="160" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />

          {/* Baseline Ground Line */}
          <line x1="30" y1={groundY} x2="510" y2={groundY} stroke="#94a3b8" strokeWidth="2" />

          {viewMode === 'bars' ? (
            /* MODE 1: COMPARISON BARS WITH DELTA BRACKET */
            <g>
              {/* Old / Initial Bar */}
              <rect
                x="120"
                y={yOld}
                width="80"
                height={hOld}
                rx="6"
                fill={colorOld}
                opacity="0.9"
              />
              <text x="160" y={yOld - 10} fill="#334155" fontSize="13" fontWeight="700" textAnchor="middle">
                {formatNumber(valOld)}
                {unit}
              </text>
              <text x="160" y={groundY + 20} fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">
                {labelOld}
              </text>

              {/* New / Final Bar */}
              <rect
                x="340"
                y={yNew}
                width="80"
                height={hNew}
                rx="6"
                fill={colorNew}
                opacity="0.95"
              />
              <text x="380" y={yNew - 10} fill={colorNew} fontSize="14" fontWeight="800" textAnchor="middle">
                {formatNumber(valNew)}
                {unit}
              </text>
              <text x="380" y={groundY + 20} fill="#475569" fontSize="12" fontWeight="600" textAnchor="middle">
                {labelNew}
              </text>

              {/* Connecting Measurement Bracket */}
              <path
                d={`M 205 ${yOld} L 245 ${yOld} L 245 ${yNew} L 335 ${yNew}`}
                fill="none"
                stroke={colorDeltaBorder}
                strokeWidth="2"
                strokeDasharray="4 3"
              />

              {/* Delta Callout Badge */}
              <rect
                x="235"
                y={Math.min(yOld, yNew) + Math.abs(yOld - yNew) / 2 - 16}
                width="70"
                height="32"
                rx="8"
                fill={colorDeltaBg}
                stroke={colorDeltaBorder}
                strokeWidth="1.5"
              />
              <text
                x="270"
                y={Math.min(yOld, yNew) + Math.abs(yOld - yNew) / 2 + 5}
                fill={colorDeltaBorder}
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
              >
                {pct !== undefined && pct !== null ? formatPct(pct) : delta >= 0 ? `+${formatNumber(delta)}` : formatNumber(delta)}
              </text>
            </g>
          ) : (
            /* MODE 2: WATERFALL FLOW (Start -> Delta -> End) */
            <g>
              {/* Step 1: Baseline */}
              <rect
                x="60"
                y={yOld}
                width="70"
                height={hOld}
                rx="6"
                fill={colorOld}
              />
              <text x="95" y={yOld - 10} fill="#334155" fontSize="12" fontWeight="700" textAnchor="middle">
                {formatNumber(valOld)}
                {unit}
              </text>
              <text x="95" y={groundY + 20} fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
                1. Initial
              </text>

              {/* Dotted connector from top of Step 1 to Step 2 */}
              <line
                x1="130"
                y1={yOld}
                x2="235"
                y2={yOld}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Step 2: Floating Delta Block */}
              <rect
                x="235"
                y={Math.min(yOld, yNew)}
                width="70"
                height={Math.max(6, Math.abs(yOld - yNew))}
                rx="6"
                fill={colorDeltaBg}
                stroke={colorDeltaBorder}
                strokeWidth="1.5"
              />
              <text
                x="270"
                y={Math.min(yOld, yNew) - 10}
                fill={colorDeltaBorder}
                fontSize="12"
                fontWeight="800"
                textAnchor="middle"
              >
                {delta >= 0 ? `+${formatNumber(delta)}` : formatNumber(delta)}
              </text>
              <text x="270" y={groundY + 20} fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
                2. Shift ({pct !== undefined && pct !== null ? formatPct(pct) : 'Delta'})
              </text>

              {/* Dotted connector from Step 2 to Step 3 */}
              <line
                x1="305"
                y1={yNew}
                x2="410"
                y2={yNew}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Step 3: Resulting Final Bar */}
              <rect
                x="410"
                y={yNew}
                width="70"
                height={hNew}
                rx="6"
                fill={colorNew}
              />
              <text x="445" y={yNew - 10} fill={colorNew} fontSize="13" fontWeight="800" textAnchor="middle">
                {formatNumber(valNew)}
                {unit}
              </text>
              <text x="445" y={groundY + 20} fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
                3. Final
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: colorOld }} />
          <span>{labelOld}: {formatNumber(valOld)}{unit}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: colorNew }} />
          <span>{labelNew}: {formatNumber(valNew)}{unit}</span>
        </div>
        <div className={styles.legendItem}>
          <span
            className={styles.legendColor}
            style={{ background: colorDeltaBg, border: `1px solid ${colorDeltaBorder}` }}
          />
          <span>
            Net Delta: {delta >= 0 ? `+${formatNumber(delta)}` : formatNumber(delta)}{unit}
            {pct !== undefined && pct !== null ? ` (${formatPct(pct)})` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
