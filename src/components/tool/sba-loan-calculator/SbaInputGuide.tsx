'use client';

import React from 'react';
import styles from './SbaInputGuide.module.css';

export type SbaFieldId =
  | 'projectCost'
  | 'bankPct'
  | 'bankRatePct'
  | 'bankTermYears'
  | 'cdcPct'
  | 'cdcRatePct'
  | 'cdcTermYears'
  | 'cdcFeePct'
  | 'loanAmount7a'
  | 'ratePct7a'
  | 'termYears7a'
  | 'guaranteeFeePct'
  | 'purchasePrice'
  | 'buyerEquityPct'
  | 'sellerNotePct'
  | 'sellerNoteRatePct'
  | 'sbaRatePct'
  | 'sbaTermYears';

interface SbaInputGuideProps {
  mode: '504' | '7a' | 'compare' | 'acquisition';
  activeField?: SbaFieldId | null;
  // 504 values
  projectCost: number;
  bankPct: number;
  bankRatePct: number;
  cdcPct: number;
  cdcRatePct: number;
  equityPct: number;
  totalMonthlyPayment504: number;
  // 7a values
  loanAmount7a: number;
  ratePct7a: number;
  monthlyPayment7a: number;
  // Acquisition values
  purchasePrice?: number;
  buyerEquityPct?: number;
  sellerNotePct?: number;
}

export default function SbaInputGuide({
  mode,
  activeField,
  projectCost,
  bankPct,
  bankRatePct,
  cdcPct,
  cdcRatePct,
  equityPct,
  totalMonthlyPayment504,
  loanAmount7a,
  ratePct7a,
  monthlyPayment7a,
  purchasePrice = 1500000,
  buyerEquityPct = 10,
  sellerNotePct = 15,
}: SbaInputGuideProps) {
  const is504Field = (field: SbaFieldId) => activeField === field;

  return (
    <div className={styles.guideContainer}>
      <details open className={styles.detailsHeader}>
        <summary>
          <span>Visual Guide &amp; Capital Structure</span>
          <span className={styles.toggleIcon} aria-hidden="true">▼</span>
        </summary>

        <div className={styles.diagramWrapper}>
          {mode === '504' && (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 720 180"
              role="img"
              aria-label="SBA 504 Two-Loan Capital Stack Diagram showing Bank first lien, CDC second lien, and borrower equity"
            >
              {/* Total Project Header */}
              <rect x="40" y="15" width="640" height="26" rx="6" fill="#e0f2fe" stroke="#38bdf8" />
              <text x="50" y="32" fill="#0369a1" fontSize="12" fontWeight="700">
                ① Total Project Cost: ${projectCost.toLocaleString()} (Land, Building, Machinery)
              </text>

              {/* Capital Stack Stacked Horizontal Bar */}
              {/* 1. Bank First Lien */}
              <g>
                <rect
                  x="40"
                  y="52"
                  width="320"
                  height="48"
                  rx="4"
                  fill="#f8fafc"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  className={is504Field('bankPct') || is504Field('bankRatePct') ? styles.highlighted : undefined}
                />
                <circle cx="56" cy="76" r="10" fill="#0284c7" />
                <text x="56" y="80" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
                  ②
                </text>
                <text x="74" y="71" fill="#0f172a" fontSize="11" fontWeight="700">
                  Bank 1st Lien: {bankPct}% (${((projectCost * bankPct) / 100).toLocaleString()})
                </text>
                <text x="74" y="86" fill="#64748b" fontSize="10">
                  Rate {bankRatePct}% · Commercial Bank
                </text>
              </g>

              {/* 2. CDC / SBA Debenture Second Lien */}
              <g>
                <rect
                  x="368"
                  y="52"
                  width="220"
                  height="48"
                  rx="4"
                  fill="#f0fdf4"
                  stroke="#86efac"
                  strokeWidth="2"
                  className={is504Field('cdcPct') || is504Field('cdcRatePct') ? styles.highlighted : undefined}
                />
                <circle cx="384" cy="76" r="10" fill="#16a34a" />
                <text x="384" y="80" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
                  ③
                </text>
                <text x="402" y="71" fill="#14532d" fontSize="11" fontWeight="700">
                  CDC / SBA 2nd Lien: {cdcPct}% (${((projectCost * cdcPct) / 100).toLocaleString()})
                </text>
                <text x="402" y="86" fill="#15803d" fontSize="10">
                  Rate {cdcRatePct}% · 10/20/25-yr Pegged to T-Bills
                </text>
              </g>

              {/* 3. Borrower Equity Injection */}
              <g>
                <rect
                  x="596"
                  y="52"
                  width="84"
                  height="48"
                  rx="4"
                  fill="#fef3c7"
                  stroke="#fcd34d"
                  strokeWidth="2"
                />
                <circle cx="612" cy="76" r="10" fill="#d97706" />
                <text x="612" y="80" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
                  ④
                </text>
                <text x="628" y="71" fill="#92400e" fontSize="10" fontWeight="700">
                  Equity: {equityPct}%
                </text>
                <text x="628" y="86" fill="#b45309" fontSize="9">
                  ${((projectCost * equityPct) / 100).toLocaleString()}
                </text>
              </g>

              {/* Merging Result Arrow to Combined Payment */}
              <path d="M 200 100 L 200 125 L 360 125 L 360 145" fill="none" stroke="#64748b" strokeWidth="2" />
              <path d="M 478 100 L 478 125 L 360 125" fill="none" stroke="#64748b" strokeWidth="2" />
              <polygon points="355,143 360,150 365,143" fill="#64748b" />

              <rect x="230" y="146" width="260" height="28" rx="6" fill="#ecfdf5" stroke="#10b981" />
              <text x="360" y="164" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="800">
                Combined Payment = ${totalMonthlyPayment504.toLocaleString()}/mo
              </text>
            </svg>
          )}

          {mode === '7a' && (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 720 160"
              role="img"
              aria-label="SBA 7(a) Single Loan Structure Diagram"
            >
              <rect x="40" y="20" width="640" height="52" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
              <text x="60" y="44" fill="#0f172a" fontSize="12" fontWeight="700">
                ① SBA 7(a) Loan Amount: ${loanAmount7a.toLocaleString()} (Up to $5M statutory cap)
              </text>
              <text x="60" y="60" fill="#64748b" fontSize="11">
                Interest Rate: {ratePct7a}% (Base Rate + Lender Spread) · Working Capital, Equipment, or Real Estate
              </text>

              <path d="M 360 72 L 360 105" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="355,103 360,112 365,103" fill="#0284c7" />

              <rect x="220" y="112" width="280" height="36" rx="6" fill="#e0f2fe" stroke="#0284c7" />
              <text x="360" y="134" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="800">
                Monthly 7(a) Payment: ${monthlyPayment7a.toLocaleString()}/mo
              </text>
            </svg>
          )}

          {mode === 'compare' && (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 720 170"
              role="img"
              aria-label="SBA 504 vs 7(a) Side-by-Side Comparison Diagram"
            >
              {/* Left Column: 504 */}
              <rect x="40" y="15" width="310" height="140" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
              <text x="60" y="38" fill="#14532d" fontSize="13" fontWeight="800">
                SBA 504 Two-Loan Package
              </text>
              <text x="60" y="60" fill="#15803d" fontSize="11">
                • Bank 50% + CDC 40% + Equity 10%
              </text>
              <text x="60" y="78" fill="#15803d" fontSize="11">
                • 10/20/25-Yr Below-Market Fixed Debenture
              </text>
              <text x="60" y="96" fill="#15803d" fontSize="11">
                • Best for Commercial Real Estate &amp; Heavy Gear
              </text>
              <rect x="55" y="112" width="280" height="30" rx="5" fill="#dcfce7" stroke="#22c55e" />
              <text x="195" y="131" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="800">
                Total: ${totalMonthlyPayment504.toLocaleString()}/mo
              </text>

              {/* Right Column: 7(a) */}
              <rect x="370" y="15" width="310" height="140" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <text x="390" y="38" fill="#0f172a" fontSize="13" fontWeight="800">
                SBA 7(a) Single Term Loan
              </text>
              <text x="390" y="60" fill="#475569" fontSize="11">
                • Single loan up to $5M maximum
              </text>
              <text x="390" y="78" fill="#475569" fontSize="11">
                • Prime + spread variable or fixed rate
              </text>
              <text x="390" y="96" fill="#475569" fontSize="11">
                • Best for Working Capital, Inventory &amp; M&amp;A
              </text>
              <rect x="385" y="112" width="280" height="30" rx="5" fill="#f1f5f9" stroke="#94a3b8" />
              <text x="525" y="131" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="800">
                Total: ${monthlyPayment7a.toLocaleString()}/mo
              </text>
            </svg>
          )}

          {mode === 'acquisition' && (
            <svg
              className={styles.svgDiagram}
              viewBox="0 0 720 160"
              role="img"
              aria-label="SBA Business Acquisition Capital Stack Diagram"
            >
              <rect x="40" y="15" width="640" height="26" rx="6" fill="#fef3c7" stroke="#fde047" />
              <text x="50" y="32" fill="#854d0e" fontSize="12" fontWeight="700">
                Business Acquisition Price: ${purchasePrice.toLocaleString()} (Goodwill &amp; Net Assets)
              </text>

              {/* 3 Blocks: Buyer Equity, Seller Note, SBA 7(a) */}
              <g>
                <rect x="40" y="52" width="130" height="50" rx="4" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2" />
                <text x="50" y="72" fill="#1e40af" fontSize="11" fontWeight="700">
                  Buyer Cash: {buyerEquityPct}%
                </text>
                <text x="50" y="88" fill="#3b82f6" fontSize="10">
                  ${((purchasePrice * buyerEquityPct) / 100).toLocaleString()}
                </text>
              </g>

              <g>
                <rect x="178" y="52" width="160" height="50" rx="4" fill="#fce7f3" stroke="#f472b6" strokeWidth="2" />
                <text x="188" y="72" fill="#9d174d" fontSize="11" fontWeight="700">
                  Seller Note: {sellerNotePct}%
                </text>
                <text x="188" y="88" fill="#db2777" fontSize="10">
                  ${((purchasePrice * sellerNotePct) / 100).toLocaleString()} Subordinated
                </text>
              </g>

              <g>
                <rect x="346" y="52" width="334" height="50" rx="4" fill="#ecfdf5" stroke="#34d399" strokeWidth="2" />
                <text x="356" y="72" fill="#065f46" fontSize="11" fontWeight="700">
                  SBA 7(a) Senior Debt: {100 - buyerEquityPct - sellerNotePct}%
                </text>
                <text x="356" y="88" fill="#059669" fontSize="10">
                  ${((purchasePrice * (100 - buyerEquityPct - sellerNotePct)) / 100).toLocaleString()} (Senior Lien)
                </text>
              </g>

              <rect x="180" y="115" width="360" height="30" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="360" y="134" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                Cash Flow (SDE / EBITDA) must service combined debt with ≥ 1.25 DSCR
              </text>
            </svg>
          )}
        </div>

        <div className={styles.legendList}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${is504Field('projectCost') ? styles.legendBadgeActive : ''}`}>①</span>
            Total Project or Loan Amount
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${is504Field('bankPct') || is504Field('bankRatePct') ? styles.legendBadgeActive : ''}`}>②</span>
            Bank First Lien (50%)
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${is504Field('cdcPct') || is504Field('cdcRatePct') ? styles.legendBadgeActive : ''}`}>③</span>
            CDC Second Lien (40%)
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendBadge} ${is504Field('bankTermYears') ? styles.legendBadgeActive : ''}`}>④</span>
            Borrower Equity Injection (10%)
          </span>
        </div>
      </details>
    </div>
  );
}
