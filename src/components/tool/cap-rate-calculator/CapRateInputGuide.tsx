'use client';

import React from 'react';
import styles from './CapRateInputGuide.module.css';
import { CapRateMode } from '@/lib/cap-rate-engine';

export type CapRateFieldId =
  | 'income' // 1: rent roll
  | 'otherIncome' // 2: other income
  | 'vacancy' // 3: vacancy loss
  | 'expenses' // 4: operating expenses
  | 'price' // 5: purchase price
  | 'capRate'; // 6: market cap rate

interface CapRateInputGuideProps {
  mode: CapRateMode;
  activeField: CapRateFieldId | null;
  grossRent: number;
  otherIncome: number;
  vacancyLoss: number;
  totalExpenses: number;
  noi: number;
  price: number;
  capRatePercent: number | null;
  propertyValue: number | null;
  requiredNoi: number | null;
}

function formatCompactMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function CapRateInputGuide({
  mode,
  activeField,
  grossRent,
  otherIncome,
  vacancyLoss,
  totalExpenses,
  noi,
  price,
  capRatePercent,
  propertyValue,
  requiredNoi,
}: CapRateInputGuideProps) {
  const isDimmed = (field: CapRateFieldId) => {
    if (!activeField) return false;
    return activeField !== field;
  };

  const isActive = (field: CapRateFieldId) => activeField === field;

  // ViewBox: 800 x 200
  return (
    <div className={styles.wrapper}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span>What do these inputs mean?</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Diagram</span>
        </summary>

        <div className={styles.svgContainer}>
          <svg
            viewBox="0 0 820 185"
            className={styles.svg}
            role="img"
            aria-label="Cap Rate and NOI Calculation Flow Diagram"
            focusable="false"
          >

            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--line, #94a3b8)" />
              </marker>
            </defs>

            {/* BLOCK 1: Rent Roll */}
            <g
              className={`${styles.guideBlock} ${
                isActive('income') ? styles.guideBlockActive : isDimmed('income') ? styles.guideBlockDimmed : ''
              }`}
            >
              <rect x="15" y="25" width="115" height="62" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
              <circle cx="28" cy="38" r="9" fill="var(--accent, #2563eb)" />
              <text x="28" y="42" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">1</text>
              <text x="44" y="42" fill="var(--ink, #0f172a)" fontSize="12" fontWeight="600">Rent Roll</text>
              <text x="72" y="70" fill="var(--ink, #0f172a)" fontSize="13" fontWeight="700" textAnchor="middle">
                {formatCompactMoney(grossRent)}
              </text>
            </g>

            {/* BLOCK 2: Other Income (positioned below Block 1 with arrow up) */}
            <g
              className={`${styles.guideBlock} ${
                isActive('otherIncome') ? styles.guideBlockActive : isDimmed('otherIncome') ? styles.guideBlockDimmed : ''
              }`}
            >
              <rect x="15" y="105" width="115" height="52" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
              <circle cx="28" cy="118" r="9" fill="#10b981" />
              <text x="28" y="122" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">2</text>
              <text x="44" y="122" fill="var(--ink, #0f172a)" fontSize="11" fontWeight="600">+ Other Inc</text>
              <text x="72" y="146" fill="#10b981" fontSize="12" fontWeight="700" textAnchor="middle">
                +{formatCompactMoney(otherIncome)}
              </text>
              {/* Connector arrow up into rent roll */}
              <path d="M 72 105 L 72 93" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
            </g>

            {/* Arrow: 1 -> 3 */}
            <path d="M 130 56 L 155 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* BLOCK 3: Vacancy Loss */}
            <g
              className={`${styles.guideBlock} ${
                isActive('vacancy') ? styles.guideBlockActive : isDimmed('vacancy') ? styles.guideBlockDimmed : ''
              }`}
            >
              <rect x="162" y="25" width="110" height="62" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
              <circle cx="175" cy="38" r="9" fill="#f59e0b" />
              <text x="175" y="42" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">3</text>
              <text x="191" y="42" fill="var(--ink, #0f172a)" fontSize="12" fontWeight="600">− Vacancy</text>
              <text x="217" y="70" fill="#e11d48" fontSize="13" fontWeight="700" textAnchor="middle">
                −{formatCompactMoney(vacancyLoss)}
              </text>
            </g>

            {/* Arrow: 3 -> 4 */}
            <path d="M 272 56 L 297 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* BLOCK 4: Operating Expenses */}
            <g
              className={`${styles.guideBlock} ${
                isActive('expenses') ? styles.guideBlockActive : isDimmed('expenses') ? styles.guideBlockDimmed : ''
              }`}
            >
              <rect x="304" y="25" width="126" height="62" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
              <circle cx="317" cy="38" r="9" fill="#ef4444" />
              <text x="317" y="42" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">4</text>
              <text x="333" y="42" fill="var(--ink, #0f172a)" fontSize="12" fontWeight="600">− Op Expenses</text>
              <text x="367" y="70" fill="#e11d48" fontSize="13" fontWeight="700" textAnchor="middle">
                −{formatCompactMoney(totalExpenses)}
              </text>

              {/* Dashed Excluded Box under Expenses */}
              <rect
                x="294"
                y="95"
                width="146"
                height="44"
                rx="4"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                className={styles.excludedBox}
              />
              <text x="367" y="112" fill="#64748b" fontSize="9.5" fontWeight="600" textAnchor="middle">
                NOT INCLUDED IN NOI:
              </text>
              <text x="367" y="128" fill="#64748b" fontSize="8.5" textAnchor="middle">
                mortgage, capex, depreciation
              </text>
            </g>

            {/* Arrow: 4 -> NOI */}
            <path d="M 430 56 L 455 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />

            {/* EQUALS NOI BLOCK */}
            <g className={styles.guideBlock}>
              <rect x="462" y="20" width="112" height="72" rx="6" fill="#f8fafc" stroke="var(--accent, #2563eb)" strokeWidth="1.8" />
              <text x="518" y="40" fill="var(--accent, #2563eb)" fontSize="11.5" fontWeight="700" textAnchor="middle">
                = NET OP INCOME
              </text>
              <text x="518" y="70" fill="var(--ink, #0f172a)" fontSize="15" fontWeight="800" textAnchor="middle">
                {formatCompactMoney(noi)}
              </text>
            </g>

            {/* STEP 5 & FINAL MODE BLOCK */}
            {mode === 'cap-rate' && (
              <>
                {/* Arrow with division symbol */}
                <path d="M 574 56 L 620 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="597" y="48" fill="#64748b" fontSize="14" fontWeight="700" textAnchor="middle">÷</text>

                {/* BLOCK 5: Price */}
                <g
                  className={`${styles.guideBlock} ${
                    isActive('price') ? styles.guideBlockActive : isDimmed('price') ? styles.guideBlockDimmed : ''
                  }`}
                >
                  <rect x="626" y="25" width="82" height="62" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
                  <circle cx="637" cy="38" r="8" fill="#8b5cf6" />
                  <text x="637" y="42" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">5</text>
                  <text x="650" y="42" fill="var(--ink, #0f172a)" fontSize="11" fontWeight="600">Price</text>
                  <text x="667" y="70" fill="var(--ink, #0f172a)" fontSize="12" fontWeight="700" textAnchor="middle">
                    {formatCompactMoney(price)}
                  </text>
                </g>

                {/* Arrow to Cap Rate Result */}
                <path d="M 708 56 L 728 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="718" y="48" fill="var(--accent, #2563eb)" fontSize="14" fontWeight="800" textAnchor="middle">=</text>

                {/* RESULT: Cap Rate */}
                <g className={styles.guideBlock}>
                  <rect x="732" y="20" width="76" height="72" rx="6" fill="var(--accent, #2563eb)" />
                  <text x="770" y="42" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    CAP RATE
                  </text>
                  <text x="770" y="72" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle">
                    {capRatePercent !== null ? `${capRatePercent.toFixed(2)}%` : '—'}
                  </text>
                </g>
              </>
            )}

            {mode === 'property-value' && (
              <>
                <path d="M 574 56 L 620 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="597" y="48" fill="#64748b" fontSize="14" fontWeight="700" textAnchor="middle">÷</text>

                {/* BLOCK 6: Target Cap Rate */}
                <g
                  className={`${styles.guideBlock} ${
                    isActive('capRate') ? styles.guideBlockActive : isDimmed('capRate') ? styles.guideBlockDimmed : ''
                  }`}
                >
                  <rect x="626" y="25" width="82" height="62" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
                  <circle cx="637" cy="38" r="8" fill="#8b5cf6" />
                  <text x="637" y="42" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">6</text>
                  <text x="650" y="42" fill="var(--ink, #0f172a)" fontSize="11" fontWeight="600">Cap %</text>
                  <text x="667" y="70" fill="var(--ink, #0f172a)" fontSize="12" fontWeight="700" textAnchor="middle">
                    {capRatePercent !== null ? `${capRatePercent}%` : '—'}
                  </text>
                </g>

                <path d="M 708 56 L 728 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="718" y="48" fill="var(--accent, #2563eb)" fontSize="14" fontWeight="800" textAnchor="middle">=</text>

                {/* RESULT: Valuation */}
                <g className={styles.guideBlock}>
                  <rect x="732" y="20" width="76" height="72" rx="6" fill="#10b981" />
                  <text x="770" y="42" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                    VALUE
                  </text>
                  <text x="770" y="72" fill="#ffffff" fontSize="13.5" fontWeight="900" textAnchor="middle">
                    {propertyValue !== null ? formatCompactMoney(propertyValue) : '—'}
                  </text>
                </g>
              </>
            )}

            {mode === 'required-noi' && (
              <>
                <path d="M 574 56 L 620 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="597" y="48" fill="#64748b" fontSize="14" fontWeight="700" textAnchor="middle">×</text>

                {/* BLOCK 6: Cap Rate Multiplier */}
                <g
                  className={`${styles.guideBlock} ${
                    isActive('capRate') ? styles.guideBlockActive : isDimmed('capRate') ? styles.guideBlockDimmed : ''
                  }`}
                >
                  <rect x="626" y="25" width="82" height="62" rx="6" fill="var(--surface, #ffffff)" stroke="var(--line, #cbd5e1)" strokeWidth="1.5" />
                  <circle cx="637" cy="38" r="8" fill="#8b5cf6" />
                  <text x="637" y="42" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">6</text>
                  <text x="650" y="42" fill="var(--ink, #0f172a)" fontSize="11" fontWeight="600">Target %</text>
                  <text x="667" y="70" fill="var(--ink, #0f172a)" fontSize="12" fontWeight="700" textAnchor="middle">
                    {capRatePercent !== null ? `${capRatePercent}%` : '—'}
                  </text>
                </g>

                <path d="M 708 56 L 728 56" stroke="var(--line, #94a3b8)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="718" y="48" fill="var(--accent, #2563eb)" fontSize="14" fontWeight="800" textAnchor="middle">=</text>

                {/* RESULT: Target Required NOI */}
                <g className={styles.guideBlock}>
                  <rect x="732" y="20" width="76" height="72" rx="6" fill="#8b5cf6" />
                  <text x="770" y="42" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">
                    REQ NOI
                  </text>
                  <text x="770" y="72" fill="#ffffff" fontSize="13.5" fontWeight="900" textAnchor="middle">
                    {requiredNoi !== null ? formatCompactMoney(requiredNoi) : '—'}
                  </text>
                </g>
              </>
            )}
          </svg>
        </div>
      </details>
    </div>
  );
}
