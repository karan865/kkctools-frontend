'use client';

import React, { useState } from 'react';
import styles from './CommercialMortgageInputGuide.module.css';

export type CommercialMortgageFieldId =
  | 'propertyValue'
  | 'loanAmount'
  | 'ltvPct'
  | 'ratePct'
  | 'termYears'
  | 'amortizationYears'
  | 'interestOnlyMonths'
  | 'pointsPct'
  | 'annualNoi';

interface CommercialMortgageInputGuideProps {
  mode: 'payment' | 'sizing' | 'refinance';
  activeField?: CommercialMortgageFieldId | null;
  propertyValue: number;
  loanAmount: number;
  ltvPct: number;
  ratePct: number;
  termYears: number;
  amortizationYears: number;
  interestOnlyMonths: number;
  balloonBalance: number;
  monthlyPayment: number;
  bindingConstraint?: string;
  maxLoanLtv?: number;
  maxLoanDscr?: number;
  maxLoanDy?: number;
}

export default function CommercialMortgageInputGuide({
  mode,
  activeField,
  propertyValue,
  loanAmount,
  ltvPct,
  ratePct,
  termYears,
  amortizationYears,
  interestOnlyMonths,
  balloonBalance,
  monthlyPayment,
  bindingConstraint = 'ltv',
  maxLoanLtv = 1500000,
  maxLoanDscr = 1509194,
  maxLoanDy = 1777778,
}: CommercialMortgageInputGuideProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Timeline bar proportions
  const amortSafe = Math.max(1, amortizationYears);
  const termSafe = Math.min(amortSafe, Math.max(1, termYears));
  const termFraction = termSafe / amortSafe;
  const ioYears = Math.min(termSafe, (interestOnlyMonths || 0) / 12);
  const ioFraction = ioYears / amortSafe;

  const totalBarW = 600;
  const termBarW = Math.round(totalBarW * termFraction);
  const ioBarW = Math.round(totalBarW * ioFraction);
  const remainingAmortW = totalBarW - termBarW;

  const isValueActive = activeField === 'propertyValue';
  const isLoanActive = activeField === 'loanAmount' || activeField === 'ltvPct';
  const isRateActive = activeField === 'ratePct';
  const isTermActive = activeField === 'termYears';
  const isAmortActive = activeField === 'amortizationYears';
  const isIoActive = activeField === 'interestOnlyMonths';

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitleGroup}>
          <span className={styles.guideBadge}>Commercial Mortgage Guide</span>
          <span className={styles.guideTitle}>
            {mode === 'payment'
              ? 'Loan Term vs. Amortization Timeline & Balloon Mechanics'
              : mode === 'sizing'
                ? 'Underwriting Triad: LTV vs. DSCR vs. Debt Yield Limits'
                : 'Balloon Refinancing & Capital Rollover'}
          </span>
        </div>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
        >
          {collapsed ? 'Show Diagram ▲' : 'Hide Diagram ▼'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.diagramWrap}>
          {mode === 'payment' ? (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 740 220"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <pattern id="ioHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="2.5" />
                </pattern>
                <linearGradient id="termGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* TOP SUMMARY STRIP: Value, Loan, LTV, Rate */}
              <g transform="translate(30, 20)">
                <rect
                  x="0"
                  y="0"
                  width="160"
                  height="45"
                  rx="6"
                  fill="#f8fafc"
                  stroke={isValueActive ? '#2563eb' : '#cbd5e1'}
                  strokeWidth={isValueActive ? '2' : '1'}
                />
                <text x="12" y="18" fill="#64748b" fontSize="10" fontWeight="600">
                  PROPERTY VALUE
                </text>
                <text x="12" y="36" fill="#0f172a" fontSize="14" fontWeight="800">
                  ${Math.round(propertyValue).toLocaleString()}
                </text>

                <rect
                  x="175"
                  y="0"
                  width="180"
                  height="45"
                  rx="6"
                  fill="#eff6ff"
                  stroke={isLoanActive ? '#2563eb' : '#bfdbfe'}
                  strokeWidth={isLoanActive ? '2' : '1'}
                />
                <text x="187" y="18" fill="#1e40af" fontSize="10" fontWeight="600">
                  LOAN AMOUNT ({ltvPct.toFixed(1)}% LTV)
                </text>
                <text x="187" y="36" fill="#1e3a8a" fontSize="14" fontWeight="800">
                  ${Math.round(loanAmount).toLocaleString()}
                </text>

                <rect
                  x="370"
                  y="0"
                  width="140"
                  height="45"
                  rx="6"
                  fill="#f8fafc"
                  stroke={isRateActive ? '#2563eb' : '#cbd5e1'}
                  strokeWidth={isRateActive ? '2' : '1'}
                />
                <text x="382" y="18" fill="#64748b" fontSize="10" fontWeight="600">
                  INTEREST RATE
                </text>
                <text x="382" y="36" fill="#0f172a" fontSize="14" fontWeight="800">
                  {ratePct.toFixed(2)}% APR
                </text>

                <rect x="525" y="0" width="155" height="45" rx="6" fill="#ecfdf5" stroke="#a7f3d0" />
                <text x="537" y="18" fill="#065f46" fontSize="10" fontWeight="600">
                  MONTHLY PAYMENT
                </text>
                <text x="537" y="36" fill="#047857" fontSize="14" fontWeight="800">
                  ${Math.round(monthlyPayment).toLocaleString()}/mo
                </text>
              </g>

              {/* TIMELINE VISUAL: Full Amortization vs Term */}
              <g transform="translate(70, 95)">
                {/* Full Amortization Frame */}
                <rect
                  x="0"
                  y="15"
                  width={totalBarW}
                  height="40"
                  rx="6"
                  fill="#f1f5f9"
                  stroke={isAmortActive ? '#2563eb' : '#cbd5e1'}
                  strokeWidth={isAmortActive ? '2.5' : '1.5'}
                />

                {/* Term Period Bar */}
                <rect
                  x="0"
                  y="15"
                  width={termBarW}
                  height="40"
                  rx="6"
                  fill="url(#termGrad)"
                  stroke={isTermActive ? '#1d4ed8' : 'none'}
                  strokeWidth="2"
                />

                {/* Optional IO Period Hatched */}
                {ioBarW > 0 && (
                  <rect
                    x="0"
                    y="15"
                    width={ioBarW}
                    height="40"
                    rx="6"
                    fill="url(#ioHatch)"
                    stroke={isIoActive ? '#d97706' : 'none'}
                    strokeWidth="2"
                  />
                )}

                {/* Term label */}
                <text x={termBarW / 2} y="40" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
                  Active Term: {termYears} Years ({monthlyPayment > 0 ? `$${Math.round(monthlyPayment).toLocaleString()}/mo` : ''})
                </text>

                {/* Unamortized period label */}
                {remainingAmortW > 60 && (
                  <text
                    x={termBarW + remainingAmortW / 2}
                    y="40"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="11"
                    fontWeight="600"
                  >
                    +{amortizationYears - termYears} yrs amort schedule
                  </text>
                )}

                {/* Balloon marker at maturity */}
                <line x1={termBarW} y1="5" x2={termBarW} y2="65" stroke="#ef4444" strokeWidth="3" />
                <polygon points={`${termBarW - 6},0 ${termBarW + 6},0 ${termBarW},10`} fill="#ef4444" />
                <rect
                  x={termBarW - 90}
                  y="70"
                  width="180"
                  height="26"
                  rx="4"
                  fill="#fef2f2"
                  stroke="#f87171"
                  strokeWidth="1.5"
                />
                <text x={termBarW} y="87" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="800">
                  Balloon: ${Math.round(balloonBalance).toLocaleString()}
                </text>

                {/* Top timeline ticks */}
                <text x="0" y="8" fill="#64748b" fontSize="10" fontWeight="600">
                  Year 0
                </text>
                <text x={termBarW} y="-4" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="700">
                  Maturity: Year {termYears}
                </text>
                <text x={totalBarW} y="8" textAnchor="end" fill="#64748b" fontSize="10" fontWeight="600">
                  Amort: Year {amortizationYears}
                </text>
              </g>
            </svg>
          ) : mode === 'sizing' ? (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 740 180"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <g transform="translate(20, 20)">
                <text x="0" y="15" fill="#1e293b" fontSize="13" fontWeight="700">
                  Underwriting Triad: Three Limits Determine Your Max Loan
                </text>
                <text x="0" y="32" fill="#64748b" fontSize="11">
                  Lenders calculate all three and lend whichever amount is lowest (the binding constraint).
                </text>

                {/* 3 Gauges Side by Side */}
                <g transform="translate(0, 48)">
                  {/* Gauge 1: LTV */}
                  <rect
                    x="0"
                    y="0"
                    width="220"
                    height="85"
                    rx="8"
                    fill={bindingConstraint === 'ltv' ? '#eff6ff' : '#f8fafc'}
                    stroke={bindingConstraint === 'ltv' ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={bindingConstraint === 'ltv' ? '2.5' : '1'}
                  />
                  <text x="16" y="24" fill="#1e40af" fontSize="11" fontWeight="700">
                    1. Loan-to-Value (LTV) Limit
                  </text>
                  <text x="16" y="52" fill="#0f172a" fontSize="18" fontWeight="800">
                    ${Math.round(maxLoanLtv).toLocaleString()}
                  </text>
                  <text x="16" y="72" fill="#64748b" fontSize="10">
                    Cap based on asset market value
                  </text>
                  {bindingConstraint === 'ltv' && (
                    <text x="204" y="24" textAnchor="end" fill="#2563eb" fontSize="10" fontWeight="800">
                      ★ BINDS
                    </text>
                  )}

                  {/* Gauge 2: DSCR */}
                  <rect
                    x="240"
                    y="0"
                    width="220"
                    height="85"
                    rx="8"
                    fill={bindingConstraint === 'dscr' ? '#eff6ff' : '#f8fafc'}
                    stroke={bindingConstraint === 'dscr' ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={bindingConstraint === 'dscr' ? '2.5' : '1'}
                  />
                  <text x="256" y="24" fill="#1e40af" fontSize="11" fontWeight="700">
                    2. Debt Coverage (DSCR)
                  </text>
                  <text x="256" y="52" fill="#0f172a" fontSize="18" fontWeight="800">
                    ${Math.round(maxLoanDscr).toLocaleString()}
                  </text>
                  <text x="256" y="72" fill="#64748b" fontSize="10">
                    Cap based on property NOI
                  </text>
                  {bindingConstraint === 'dscr' && (
                    <text x="444" y="24" textAnchor="end" fill="#2563eb" fontSize="10" fontWeight="800">
                      ★ BINDS
                    </text>
                  )}

                  {/* Gauge 3: Debt Yield */}
                  <rect
                    x="480"
                    y="0"
                    width="220"
                    height="85"
                    rx="8"
                    fill={bindingConstraint === 'debtYield' ? '#eff6ff' : '#f8fafc'}
                    stroke={bindingConstraint === 'debtYield' ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={bindingConstraint === 'debtYield' ? '2.5' : '1'}
                  />
                  <text x="496" y="24" fill="#1e40af" fontSize="11" fontWeight="700">
                    3. Min Debt Yield Limit
                  </text>
                  <text x="496" y="52" fill="#0f172a" fontSize="18" fontWeight="800">
                    ${Math.round(maxLoanDy).toLocaleString()}
                  </text>
                  <text x="496" y="72" fill="#64748b" fontSize="10">
                    Direct cash flow return to lender
                  </text>
                  {bindingConstraint === 'debtYield' && (
                    <text x="684" y="24" textAnchor="end" fill="#2563eb" fontSize="10" fontWeight="800">
                      ★ BINDS
                    </text>
                  )}
                </g>
              </g>
            </svg>
          ) : (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 740 180"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <g transform="translate(20, 20)">
                <text x="0" y="15" fill="#1e293b" fontSize="13" fontWeight="700">
                  Balloon Refinancing &amp; Extension Cycle
                </text>
                <text x="0" y="32" fill="#64748b" fontSize="11">
                  At maturity, remaining balance is refinanced into a new commercial facility with updated market terms.
                </text>

                <g transform="translate(0, 50)">
                  <rect x="0" y="0" width="320" height="70" rx="8" fill="#fef2f2" stroke="#fca5a5" />
                  <text x="20" y="26" fill="#991b1b" fontSize="11" fontWeight="700">
                    Original Loan Balloon
                  </text>
                  <text x="20" y="52" fill="#7f1d1d" fontSize="16" fontWeight="800">
                    ${Math.round(balloonBalance).toLocaleString()}
                  </text>

                  <path d="M 335 35 L 375 35" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="355" y="25" textAnchor="middle" fill="#2563eb" fontSize="10" fontWeight="700">
                    Refinance
                  </text>

                  <rect x="390" y="0" width="310" height="70" rx="8" fill="#ecfdf5" stroke="#86efac" />
                  <text x="410" y="26" fill="#166534" fontSize="11" fontWeight="700">
                    New Commercial Facility
                  </text>
                  <text x="410" y="52" fill="#14532d" fontSize="16" fontWeight="800">
                    New Rate &amp; Amortization Terms
                  </text>
                </g>
              </g>
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
