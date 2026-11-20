import React from 'react';
import styles from './HelocInputGuide.module.css';

interface HelocInputGuideProps {
  mode: 'borrow' | 'payment' | 'compare';
  activeField?: string;
  homeValue?: number;
  mortgageBalance?: number;
  maxCreditLine?: number;
  drawnAmount?: number;
  aprPct?: number;
  drawPayment?: number;
  repayPayment?: number;
  shockPct?: number;
}

export default function HelocInputGuide({
  mode,
  activeField,
  homeValue = 400000,
  mortgageBalance = 250000,
  maxCreditLine = 90000,
  drawPayment = 333,
  repayPayment = 418,
  shockPct = 25.5,
}: HelocInputGuideProps) {
  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Model:</strong>{' '}
            {mode === 'borrow' && 'Combined Loan-to-Value (CLTV) & Maximum Borrowing Capacity'}
            {mode === 'payment' && 'Two-Phase Lifecycle: Draw Period to Repayment Payment Shock'}
            {mode === 'compare' && 'Home Equity Options: HELOC vs. Fixed Loan vs. Cash-Out Refinance'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'borrow' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="CLTV and Maximum HELOC Borrowing Limit Diagram"
            >
              {/* House graphic outline on the left */}
              <g transform="translate(40, 20)">
                <polygon points="45,5 5,45 85,45" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                <rect x="15" y="45" width="60" height="65" rx="3" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                <rect x="35" y="70" width="20" height="40" fill="#94a3b8" />
                <text x="45" y="125" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                  1 Home Value: {formatMoney(homeValue)}
                </text>
              </g>

              {/* Horizontal Equity Stack Bar */}
              <g transform="translate(170, 35)">
                <text x="0" y="-10" fontSize="11" fontWeight="700" fill="#1e293b">
                  Home Equity &amp; Combined Loan-to-Value (85% CLTV Cap)
                </text>

                {/* Background track (Total Home Value) */}
                <rect x="0" y="5" width="480" height="45" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />

                {(() => {
                  const safeHome = Math.max(1, homeValue);
                  const mortPct = Math.min(100, (mortgageBalance / safeHome) * 100);
                  const helocPct = Math.min(100 - mortPct, (maxCreditLine / safeHome) * 100);
                  const equityPct = Math.max(0, 100 - mortPct - helocPct);

                  const wMort = (mortPct / 100) * 480;
                  const wHeloc = (helocPct / 100) * 480;
                  const wEquity = (equityPct / 100) * 480;

                  return (
                    <>
                      {/* Mortgage slice */}
                      <rect
                        x="0"
                        y="5"
                        width={wMort}
                        height="45"
                        rx="6"
                        fill="#64748b"
                        stroke={activeField === 'mortgage' ? '#f59e0b' : 'none'}
                        strokeWidth="2"
                      />
                      <text x={wMort / 2} y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff">
                        2 Mortgage: {formatMoney(mortgageBalance)}
                      </text>

                      {/* HELOC Line slice */}
                      <rect
                        x={wMort}
                        y="5"
                        width={wHeloc}
                        height="45"
                        fill="#2563eb"
                        stroke={activeField === 'cltv' ? '#f59e0b' : 'none'}
                        strokeWidth="2"
                      />
                      <text
                        x={wMort + wHeloc / 2}
                        y="32"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill="#ffffff"
                      >
                        Max HELOC: {formatMoney(maxCreditLine)}
                      </text>

                      {/* Retained Equity slice */}
                      <rect x={wMort + wHeloc} y="5" width={wEquity} height="45" rx="6" fill="#10b981" />
                      <text
                        x={wMort + wHeloc + wEquity / 2}
                        y="32"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#ffffff"
                      >
                        Keep 15%
                      </text>

                      {/* 85% CLTV Marker line */}
                      <line
                        x1={wMort + wHeloc}
                        y1="-2"
                        x2={wMort + wHeloc}
                        y2="58"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={wMort + wHeloc}
                        y="72"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#dc2626"
                      >
                        ▲ 85% Max CLTV Ceiling
                      </text>
                    </>
                  );
                })()}
              </g>
            </svg>
          )}

          {mode === 'payment' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="HELOC Draw to Repayment Payment Shock Timeline Diagram"
            >
              {/* Draw Period Block (Left) */}
              <g transform="translate(50, 20)">
                <rect x="0" y="0" width="260" height="80" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="130" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">
                  Phase 1: Draw Period (Years 1–10)
                </text>
                <text x="130" y="44" textAnchor="middle" fontSize="10" fill="#3b82f6">
                  Interest-Only Payments:
                </text>
                <text x="130" y="68" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1d4ed8">
                  {formatMoney(drawPayment)}/mo
                </text>
              </g>

              {/* Payment Shock Transition Connector */}
              <g transform="translate(325, 30)">
                <path d="M 0 30 Q 25 5, 50 30" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                <polygon points="50,30 42,22 42,32" fill="#ef4444" />
                <text x="25" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#dc2626">
                  +{shockPct}% SHOCK
                </text>
                <text x="25" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ef4444">
                  Draw Ends
                </text>
              </g>

              {/* Repayment Period Block (Right) */}
              <g transform="translate(390, 20)">
                <rect x="0" y="0" width="260" height="80" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
                <text x="130" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#991b1b">
                  Phase 2: Repayment Period (Years 11–30)
                </text>
                <text x="130" y="44" textAnchor="middle" fontSize="10" fill="#ef4444">
                  Principal + Interest Payments:
                </text>
                <text x="130" y="68" textAnchor="middle" fontSize="18" fontWeight="900" fill="#b91c1c">
                  {formatMoney(repayPayment)}/mo
                </text>
              </g>
            </svg>
          )}

          {mode === 'compare' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Home Equity Options Comparison Diagram"
            >
              {/* Option 1: HELOC */}
              <g transform="translate(40, 15)">
                <rect x="0" y="0" width="180" height="85" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
                <text x="90" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#166534">
                  1. HELOC
                </text>
                <text x="90" y="40" textAnchor="middle" fontSize="9" fill="#15803d">
                  Revolving Credit Line
                </text>
                <text x="90" y="56" textAnchor="middle" fontSize="9" fill="#475569">
                  Variable APR · Pay as you go
                </text>
                <text x="90" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#14532d">
                  Best for: Ongoing Projects
                </text>
              </g>

              {/* Option 2: Home Equity Loan */}
              <g transform="translate(260, 15)">
                <rect x="0" y="0" width="180" height="85" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="90" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">
                  2. Home Equity Loan
                </text>
                <text x="90" y="40" textAnchor="middle" fontSize="9" fill="#2563eb">
                  Fixed Second Mortgage
                </text>
                <text x="90" y="56" textAnchor="middle" fontSize="9" fill="#475569">
                  Fixed Rate · Predictable P&amp;I
                </text>
                <text x="90" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
                  Best for: Fixed Large Cost
                </text>
              </g>

              {/* Option 3: Cash-Out Refinance */}
              <g transform="translate(480, 15)">
                <rect x="0" y="0" width="180" height="85" rx="8" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.5" />
                <text x="90" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6b21a8">
                  3. Cash-Out Refinance
                </text>
                <text x="90" y="40" textAnchor="middle" fontSize="9" fill="#9333ea">
                  New Primary Mortgage
                </text>
                <text x="90" y="56" textAnchor="middle" fontSize="9" fill="#475569">
                  Replaces entire loan
                </text>
                <text x="90" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#581c87">
                  Best if rates dropped
                </text>
              </g>
            </svg>
          )}

          <div className={styles.captionRow}>
            <div className={styles.captionCol}>
              <span className={styles.dotBlue} />
              <span>
                <strong>Draw Period:</strong> Borrow flexibly and pay interest only on what you withdraw
              </span>
            </div>
            <div className={styles.captionCol}>
              <span className={styles.dotRed} />
              <span>
                <strong>Repayment Period:</strong> Full principal and interest amortization begins
              </span>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
