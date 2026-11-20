'use client';

import React from 'react';
import styles from './EquipmentInputGuide.module.css';

interface EquipmentInputGuideProps {
  activeTab: 'loan' | 'lease' | 'loc' | 'mca';
  price: number;
  taxAmount: number;
  fees: number;
  down: number;
  tradeIn: number;
  amountFinanced: number;
  termMonths: number;
  balloon: number;
}

export function EquipmentInputGuide({
  activeTab,
  price,
  taxAmount,
  fees,
  down,
  tradeIn,
  amountFinanced,
  termMonths,
  balloon,
}: EquipmentInputGuideProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className={styles.guideContainer} aria-hidden="true">
      <div className={styles.guideHeader}>
        <div className={styles.guideTitle}>
          <span>Financing Structure Flow</span>
          <span className={styles.guidePill}>
            {activeTab === 'loan' && 'Equipment Loan & Balloon'}
            {activeTab === 'lease' && 'Lease vs Loan vs Cash'}
            {activeTab === 'loc' && 'Line of Credit Draw'}
            {activeTab === 'mca' && 'MCA Factor Rate Flow'}
          </span>
        </div>
      </div>

      <div className={styles.svgWrapper}>
        {activeTab === 'loan' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Panel */}
            <rect x="0" y="0" width="680" height="140" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            {/* Excavator Silhouette / Icon on Left */}
            <g transform="translate(16, 25)">
              <rect x="0" y="45" width="55" height="16" rx="8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Tracks */}
              <circle cx="10" cy="53" r="5" fill="#475569" />
              <circle cx="27" cy="53" r="5" fill="#475569" />
              <circle cx="45" cy="53" r="5" fill="#475569" />
              {/* Cab */}
              <rect x="8" y="20" width="30" height="26" rx="4" fill="#f59e0b" />
              <rect x="22" y="23" width="13" height="12" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
              {/* Boom & Arm */}
              <path d="M35 34 L62 10 L82 25 L88 38" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {/* Bucket */}
              <path d="M88 38 L95 48 L84 52 Z" fill="#475569" />
              {/* Price Tag badge */}
              <rect x="2" y="0" width="68" height="18" rx="4" fill="#0284c7" />
              <text x="36" y="13" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                {fmt(price)}
              </text>
            </g>

            {/* Step 1: Net Amount Financed Formula Bar */}
            <g transform="translate(130, 20)">
              <rect x="0" y="0" width="530" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

              {/* Elements */}
              <text x="14" y="16" className={styles.diagramSubtext}>Equipment Price</text>
              <text x="14" y="32" className={styles.diagramText}>{fmt(price)}</text>

              <text x="96" y="26" fill="#94a3b8" fontSize="14" fontWeight="700">+</text>

              <text x="114" y="16" className={styles.diagramSubtext}>Tax &amp; Fees</text>
              <text x="114" y="32" className={styles.diagramText}>{fmt(taxAmount + fees)}</text>

              <text x="186" y="26" fill="#94a3b8" fontSize="14" fontWeight="700">−</text>

              <text x="204" y="16" className={styles.diagramSubtext}>Down &amp; Trade-In</text>
              <text x="204" y="32" className={styles.diagramText}>{fmt(down + tradeIn)}</text>

              <text x="306" y="26" fill="#0284c7" fontSize="16" fontWeight="700">=</text>

              {/* Amount Financed Box */}
              <rect x="330" y="5" width="186" height="32" rx="5" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="340" y="18" fill="#1e40af" fontSize="9" fontWeight="600">AMOUNT FINANCED</text>
              <text x="340" y="31" fill="#1e3a8a" fontSize="13" fontWeight="800">{fmt(amountFinanced)}</text>
            </g>

            {/* Step 2: Amortization Timeline with Term & Balloon Marker */}
            <g transform="translate(130, 75)">
              <text x="0" y="12" className={styles.diagramSubtext}>
                Term Amortization ({termMonths} Months)
              </text>

              {/* Timeline Track */}
              <rect x="0" y="20" width="530" height="14" rx="7" fill="#e2e8f0" />
              {/* Active Amortization Bar */}
              <rect x="0" y="20" width="460" height="14" rx="7" fill="url(#termGrad)" />

              {/* Month Markers */}
              <circle cx="0" cy="27" r="4" fill="#0284c7" />
              <text x="0" y="46" textAnchor="start" className={styles.diagramSubtext}>Mo 1</text>

              <circle cx="230" cy="27" r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <text x="230" y="46" textAnchor="middle" className={styles.diagramSubtext}>Mo {Math.round(termMonths / 2)}</text>

              <circle cx="460" cy="27" r="5" fill="#0284c7" />
              <text x="460" y="46" textAnchor="middle" className={styles.diagramHighlight}>Mo {termMonths}</text>

              {/* Balloon Flag if balloon exists */}
              {balloon > 0 && (
                <g transform="translate(460, -2)">
                  <line x1="0" y1="0" x2="0" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
                  <rect x="-35" y="-14" width="70" height="18" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="-1" textAnchor="middle" fill="#991b1b" fontSize="9" fontWeight="700">
                    Balloon {fmt(balloon)}
                  </text>
                </g>
              )}
            </g>

            <defs>
              <linearGradient id="termGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {activeTab === 'lease' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="120" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            {/* 3 Columns: Cash, Loan, Lease */}
            {/* Column 1: Cash */}
            <g transform="translate(25, 18)">
              <rect x="0" y="0" width="190" height="84" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
              <rect x="12" y="12" width="28" height="28" rx="6" fill="#dcfce7" />
              <text x="26" y="30" textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="700">$</text>
              <text x="48" y="24" className={styles.diagramText}>Cash Purchase</text>
              <text x="48" y="36" className={styles.diagramSubtext}>100% Upfront Capital</text>
              <text x="12" y="62" fill="#166534" fontSize="10" fontWeight="600">✓ Zero Interest Paid</text>
              <text x="12" y="76" fill="#166534" fontSize="10" fontWeight="600">✓ Keep 100% Resale Equity</text>
            </g>

            {/* Column 2: Equipment Loan */}
            <g transform="translate(245, 18)">
              <rect x="0" y="0" width="190" height="84" rx="6" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
              <rect x="12" y="12" width="28" height="28" rx="6" fill="#e0f2fe" />
              <text x="26" y="30" textAnchor="middle" fill="#0284c7" fontSize="13" fontWeight="700">📅</text>
              <text x="48" y="24" className={styles.diagramText}>Equipment Loan</text>
              <text x="48" y="36" className={styles.diagramSubtext}>Down + Monthly Amortization</text>
              <text x="12" y="62" fill="#0369a1" fontSize="10" fontWeight="600">✓ Own Title at Payoff</text>
              <text x="12" y="76" fill="#0369a1" fontSize="10" fontWeight="600">✓ Sec 179 Depreciation</text>
            </g>

            {/* Column 3: Equipment Lease */}
            <g transform="translate(465, 18)">
              <rect x="0" y="0" width="190" height="84" rx="6" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1" />
              <rect x="12" y="12" width="28" height="28" rx="6" fill="#f3e8ff" />
              <text x="26" y="30" textAnchor="middle" fill="#7e22ce" fontSize="13" fontWeight="700">📄</text>
              <text x="48" y="24" className={styles.diagramText}>Equipment Lease</text>
              <text x="48" y="36" className={styles.diagramSubtext}>Lowest Upfront Cash Outflow</text>
              <text x="12" y="62" fill="#6b21a8" fontSize="10" fontWeight="600">✓ $1 Buyout or Return FMV</text>
              <text x="12" y="76" fill="#6b21a8" fontSize="10" fontWeight="600">✓ 100% Tax Deductible Payment</text>
            </g>
          </svg>
        )}

        {activeTab === 'loc' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="120" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            <g transform="translate(30, 25)">
              <text x="0" y="14" className={styles.diagramText}>Credit Limit &amp; Active Draw Capacity</text>
              <text x="0" y="28" className={styles.diagramSubtext}>
                Revolving facility: pay interest only on funds actually drawn, with immediate redraw availability.
              </text>

              {/* Draw Bar */}
              <rect x="0" y="42" width="620" height="24" rx="6" fill="#e2e8f0" />
              <rect x="0" y="42" width="260" height="24" rx="6" fill="#3b82f6" />

              <text x="10" y="58" fill="#ffffff" fontSize="11" fontWeight="700">Drawn: Active Interest</text>
              <text x="280" y="58" fill="#475569" fontSize="11" fontWeight="600">Available Undrawn Credit ($0 Interest)</text>
            </g>
          </svg>
        )}

        {activeTab === 'mca' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="120" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            <g transform="translate(40, 25)">
              <rect x="0" y="10" width="150" height="60" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="75" y="32" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="700">ADVANCE CASH</text>
              <text x="75" y="52" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="800">Lump Sum</text>

              <text x="180" y="46" fill="#64748b" fontSize="20" fontWeight="700">×</text>

              <rect x="210" y="10" width="140" height="60" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="280" y="32" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="700">FACTOR RATE</text>
              <text x="280" y="52" textAnchor="middle" fill="#92400e" fontSize="15" fontWeight="800">1.25 – 1.45</text>

              <text x="375" y="46" fill="#64748b" fontSize="20" fontWeight="700">=</text>

              <rect x="405" y="10" width="200" height="60" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="505" y="32" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="700">TOTAL PAYBACK REVENUE</text>
              <text x="505" y="52" textAnchor="middle" fill="#991b1b" fontSize="14" fontWeight="800">Daily / Weekly ACH</text>
            </g>
          </svg>
        )}
      </div>

      <div className={styles.statusRow}>
        <div className={styles.statusItem}>
          <span>Equipment Price:</span>
          <span className={styles.statusVal}>{fmt(price)}</span>
        </div>
        <div className={styles.statusItem}>
          <span>Amount Financed:</span>
          <span className={styles.statusVal}>{fmt(amountFinanced)}</span>
        </div>
        <div className={styles.statusItem}>
          <span>Term:</span>
          <span className={styles.statusVal}>{termMonths} months</span>
        </div>
        {balloon > 0 && (
          <div className={styles.statusItem}>
            <span>Balloon:</span>
            <span className={styles.statusVal}>{fmt(balloon)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
