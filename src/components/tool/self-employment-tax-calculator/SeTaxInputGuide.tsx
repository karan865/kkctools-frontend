'use client';

import React from 'react';
import styles from './SeTaxInputGuide.module.css';

export type SeTaxFieldId =
  | 'grossIncome'
  | 'expenses'
  | 'milesH1'
  | 'milesH2'
  | 'w2Wages'
  | 'filingStatus'
  | 'fedTaxRatePct'
  | 'stateTaxRatePct'
  | 'priorYearTotalTax'
  | 'extraDeduction';

interface SeTaxInputGuideProps {
  mode: 'estimate' | 'quarterly' | 'what-if';
  activeField?: SeTaxFieldId | null;
  grossIncome: number;
  expenses: number;
  netSE: number;
  totalSeTax: number;
  halfDeduction: number;
  quarterlyPayment: number;
}

export default function SeTaxInputGuide({
  mode,
  activeField,
  grossIncome,
  expenses,
  netSE,
  totalSeTax,
  halfDeduction,
  quarterlyPayment,
}: SeTaxInputGuideProps) {
  const isField = (id: SeTaxFieldId) => activeField === id;

  return (
    <div className={styles.guideContainer}>
      <details open className={styles.detailsHeader}>
        <summary>
          <span>Visual Tax Flow: How 1099 &amp; Self-Employment Tax Works</span>
          <span className={styles.toggleIcon} aria-hidden="true">▼</span>
        </summary>

        <div className={styles.diagramWrapper}>
          {mode !== 'quarterly' ? (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 720 180"
              role="img"
              aria-label="Self-employment 1099 tax flow diagram from gross receipts to net earnings, SE tax, half deduction, and quarterly set-aside"
            >
              {/* Row 1: Net Earnings Funnel */}
              <g>
                <rect
                  x="30"
                  y="15"
                  width="180"
                  height="38"
                  rx="6"
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  className={isField('grossIncome') ? styles.highlighted : undefined}
                />
                <circle cx="46" cy="34" r="9" fill="#0284c7" />
                <text x="46" y="38" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                  ①
                </text>
                <text x="62" y="31" fill="#0f172a" fontSize="11" fontWeight="700">
                  Gross 1099 Income
                </text>
                <text x="62" y="44" fill="#64748b" fontSize="10">
                  ${grossIncome.toLocaleString()}
                </text>
              </g>

              <text x="220" y="38" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="700">
                −
              </text>

              <g>
                <rect
                  x="235"
                  y="15"
                  width="180"
                  height="38"
                  rx="6"
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  className={isField('expenses') || isField('milesH1') || isField('milesH2') ? styles.highlighted : undefined}
                />
                <circle cx="251" cy="34" r="9" fill="#0284c7" />
                <text x="251" y="38" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                  ②
                </text>
                <text x="267" y="31" fill="#0f172a" fontSize="11" fontWeight="700">
                  Expenses &amp; Miles
                </text>
                <text x="267" y="44" fill="#64748b" fontSize="10">
                  ${expenses.toLocaleString()} deductions
                </text>
              </g>

              <text x="425" y="38" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="700">
                =
              </text>

              <g>
                <rect x="440" y="15" width="250" height="38" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                <text x="455" y="31" fill="#14532d" fontSize="11" fontWeight="700">
                  Net 1099 Profit: ${netSE.toLocaleString()}
                </text>
                <text x="455" y="44" fill="#16a34a" fontSize="10">
                  × 92.35% statutory Schedule SE factor
                </text>
              </g>

              {/* Connecting Funnel Down */}
              <path d="M 565 53 L 565 72 L 360 72 L 360 85" fill="none" stroke="#64748b" strokeWidth="2" />
              <polygon points="355,83 360,90 365,83" fill="#64748b" />

              {/* Row 2: SE Tax Split */}
              <g>
                <rect x="120" y="90" width="480" height="42" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                <circle cx="138" cy="111" r="9" fill="#10b981" />
                <text x="138" y="115" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                  ③
                </text>
                <text x="154" y="106" fill="#065f46" fontSize="11" fontWeight="700">
                  15.3% SE Tax (FICA): ${totalSeTax.toLocaleString()}
                </text>
                <text x="154" y="122" fill="#047857" fontSize="10">
                  12.4% Social Security (to $184.5k cap) + 2.9% Medicare (+0.9% surtax)
                </text>
              </g>

              {/* Row 3: Deduction & Final Split */}
              <path d="M 360 132 L 360 148" fill="none" stroke="#64748b" strokeWidth="2" />
              <polygon points="355,146 360,152 365,146" fill="#64748b" />

              <g>
                <rect x="120" y="152" width="480" height="24" rx="4" fill="#e0f2fe" stroke="#38bdf8" />
                <text x="360" y="168" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="700">
                  50% SE Tax Deduction (${halfDeduction.toLocaleString()}) lowers Income Tax base → Quarterly: ${quarterlyPayment.toLocaleString()}/qtr
                </text>
              </g>
            </svg>
          ) : (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 720 140"
              role="img"
              aria-label="IRS 1040-ES Quarterly Estimated Tax Payment Schedule Calendar"
            >
              {/* 4 Calendar Tiles */}
              {[
                { q: 'Q1', date: 'April 15, 2026', period: 'Jan 1 – Mar 31' },
                { q: 'Q2', date: 'June 15, 2026', period: 'Apr 1 – May 31' },
                { q: 'Q3', date: 'September 15, 2026', period: 'Jun 1 – Aug 31' },
                { q: 'Q4', date: 'January 15, 2027', period: 'Sep 1 – Dec 31' },
              ].map((tile, i) => (
                <g key={i}>
                  <rect
                    x={40 + i * 165}
                    y="20"
                    width="145"
                    height="95"
                    rx="8"
                    fill="#f8fafc"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                  <rect x={40 + i * 165} y="20" width="145" height="26" rx="6" fill="#0284c7" />
                  <text x={112 + i * 165} y="38" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="800">
                    {tile.q} Payment
                  </text>
                  <text x={112 + i * 165} y="62" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                    ${quarterlyPayment.toLocaleString()}
                  </text>
                  <text x={112 + i * 165} y="80" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="600">
                    Due {tile.date}
                  </text>
                  <text x={112 + i * 165} y="98" textAnchor="middle" fill="#64748b" fontSize="9">
                    {tile.period}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>

        <div className={styles.legendList}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${isField('grossIncome') ? styles.legendBadgeActive : ''}`}>①</span>
            Gross 1099 Receipts
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${isField('expenses') || isField('milesH1') ? styles.legendBadgeActive : ''}`}>②</span>
            Ordinary Deductions &amp; Mileage
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${isField('fedTaxRatePct') ? styles.legendBadgeActive : ''}`}>③</span>
            15.3% Self-Employment Tax &amp; Income Tax
          </span>
        </div>
      </details>
    </div>
  );
}
