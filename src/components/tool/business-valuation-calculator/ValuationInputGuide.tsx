'use client';

import React from 'react';
import styles from './ValuationInputGuide.module.css';

interface ValuationInputGuideProps {
  activeTab: 'sde' | 'ebitda' | 'asset' | 'deal';
  netProfit: number;
  sde: number;
  adjustedEbitda: number;
  multipleLow: number;
  multipleHigh: number;
  evMid: number;
  equityMid: number;
  debt: number;
  cash: number;
}

export function ValuationInputGuide({
  activeTab,
  netProfit,
  sde,
  adjustedEbitda,
  multipleLow,
  multipleHigh,
  evMid,
  equityMid,
  debt,
  cash,
}: ValuationInputGuideProps) {
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
          <span>Valuation Bridge &amp; Flow</span>
          <span className={styles.guidePill}>
            {activeTab === 'sde' && "Seller's Discretionary Earnings (SDE)"}
            {activeTab === 'ebitda' && 'Adjusted EBITDA Multiples'}
            {activeTab === 'asset' && 'Asset-Based Floor Valuation'}
            {activeTab === 'deal' && 'Deal Capital Structure'}
          </span>
        </div>
      </div>

      <div className={styles.svgWrapper}>
        {activeTab === 'sde' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 145" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Panel */}
            <rect x="0" y="0" width="680" height="145" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            {/* SDE Add-Back Bridge Blocks (Rising Left to Right) */}
            {/* Block 1: Net Profit */}
            <g transform="translate(16, 50)">
              <rect x="0" y="30" width="80" height="50" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
              <text x="40" y="48" textAnchor="middle" className={styles.diagramSubtext}>Net Profit</text>
              <text x="40" y="66" textAnchor="middle" className={styles.diagramText}>{fmt(netProfit)}</text>
            </g>

            {/* Plus sign */}
            <text x="105" y="108" fill="#94a3b8" fontSize="16" fontWeight="700">+</text>

            {/* Block 2: Owner Comp & Perks */}
            <g transform="translate(120, 36)">
              <rect x="0" y="24" width="94" height="64" rx="4" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1" />
              <text x="47" y="44" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="600">Owner Pay</text>
              <text x="47" y="58" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="600">&amp; Perks</text>
              <text x="47" y="76" textAnchor="middle" fill="#0c4a6e" fontSize="10" fontWeight="700">Add-Backs</text>
            </g>

            {/* Plus sign */}
            <text x="223" y="108" fill="#94a3b8" fontSize="16" fontWeight="700">+</text>

            {/* Block 3: D&A + Interest */}
            <g transform="translate(238, 22)">
              <rect x="0" y="18" width="94" height="78" rx="4" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1" />
              <text x="47" y="38" textAnchor="middle" fill="#6d28d9" fontSize="9" fontWeight="600">D&amp;A + Int</text>
              <text x="47" y="52" textAnchor="middle" fill="#6d28d9" fontSize="9" fontWeight="600">&amp; One-Offs</text>
              <text x="47" y="80" textAnchor="middle" fill="#4c1d95" fontSize="10" fontWeight="700">Normalizing</text>
            </g>

            {/* Equals Arrow */}
            <text x="342" y="108" fill="#0284c7" fontSize="18" fontWeight="800">=</text>

            {/* Block 4: Total SDE */}
            <g transform="translate(362, 12)">
              <rect x="0" y="8" width="115" height="98" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
              <text x="57" y="30" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="700">TOTAL SDE</text>
              <text x="57" y="52" textAnchor="middle" fill="#14532d" fontSize="15" fontWeight="800">{fmt(sde)}</text>
              <rect x="12" y="66" width="91" height="24" rx="4" fill="#dcfce7" />
              <text x="57" y="82" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="700">
                × {multipleLow}x–{multipleHigh}x
              </text>
            </g>

            {/* Arrow to Enterprise Value */}
            <path d="M485 62 L505 62" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="505,58 513,62 505,66" fill="#0284c7" />

            {/* Block 5: Enterprise Value & Equity */}
            <g transform="translate(516, 12)">
              <rect x="0" y="8" width="148" height="98" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
              <text x="74" y="28" textAnchor="middle" fill="#1d4ed8" fontSize="9" fontWeight="700">EST. ENTERPRISE VALUE</text>
              <text x="74" y="48" textAnchor="middle" fill="#1e3a8a" fontSize="14" fontWeight="800">{fmt(evMid)}</text>
              <line x1="12" y1="58" x2="136" y2="58" stroke="#bfdbfe" strokeWidth="1" />
              <text x="74" y="74" textAnchor="middle" fill="#475569" fontSize="9">
                − Debt ({fmt(debt)}) + Cash ({fmt(cash)})
              </text>
              <text x="74" y="92" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700">
                Equity: ~{fmt(equityMid)}
              </text>
            </g>

            <text x="16" y="132" fill="#64748b" fontSize="9" fontStyle="italic">
              *The valuation multiple is a user input based on recent transaction comps. See &ldquo;Choosing a Multiple&rdquo; guide below.
            </text>
          </svg>
        )}

        {activeTab === 'ebitda' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="120" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            <g transform="translate(30, 25)">
              <rect x="0" y="10" width="150" height="60" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
              <text x="75" y="32" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="700">SELLER EARNINGS (SDE)</text>
              <text x="75" y="52" textAnchor="middle" fill="#14532d" fontSize="15" fontWeight="800">{fmt(sde)}</text>

              <text x="175" y="46" fill="#ef4444" fontSize="22" fontWeight="700">−</text>

              <rect x="205" y="10" width="180" height="60" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
              <text x="295" y="32" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="700">REPLACEMENT MANAGER SALARY</text>
              <text x="295" y="52" textAnchor="middle" fill="#991b1b" fontSize="13" fontWeight="800">Market Rate GM Cost</text>

              <text x="405" y="46" fill="#0284c7" fontSize="22" fontWeight="700">=</text>

              <rect x="435" y="10" width="190" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="530" y="32" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700">ADJUSTED EBITDA</text>
              <text x="530" y="52" textAnchor="middle" fill="#1e3a8a" fontSize="15" fontWeight="800">{fmt(adjustedEbitda)}</text>
            </g>

            <text x="30" y="104" fill="#64748b" fontSize="9" fontStyle="italic">
              *Used for businesses with $1M+ EBITDA or absentee ownership where management is fully delegated.
            </text>
          </svg>
        )}

        {activeTab === 'asset' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="120" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            <g transform="translate(40, 20)">
              {/* Left Pan: Tangible Assets */}
              <rect x="0" y="15" width="220" height="65" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="110" y="36" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700">TOTAL TANGIBLE ASSETS</text>
              <text x="110" y="54" textAnchor="middle" fill="#065f46" fontSize="10">Equipment + Inventory + AR + Cash</text>

              {/* Minus Sign */}
              <text x="250" y="55" fill="#64748b" fontSize="24" fontWeight="700">−</text>

              {/* Middle Pan: Total Liabilities */}
              <rect x="280" y="15" width="180" height="65" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="370" y="36" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="700">TOTAL LIABILITIES</text>
              <text x="370" y="54" textAnchor="middle" fill="#991b1b" fontSize="10">AP + Notes + Leases</text>

              {/* Equals */}
              <text x="485" y="55" fill="#64748b" fontSize="24" fontWeight="700">=</text>

              {/* Right Pan: Net Asset Floor */}
              <rect x="515" y="15" width="140" height="65" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
              <text x="585" y="36" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="700">NET ASSET FLOOR</text>
              <text x="585" y="54" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="800">Liquidation Value</text>
            </g>

            <text x="40" y="104" fill="#64748b" fontSize="9" fontStyle="italic">
              *If earnings are negative or break-even, the asset approach sets the baseline liquidation floor.
            </text>
          </svg>
        )}

        {activeTab === 'deal' && (
          <svg className={styles.guideSvg} viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="680" height="120" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

            <g transform="translate(30, 25)">
              <text x="0" y="12" className={styles.diagramText}>Deal Capital Structure (How Buyers Finance the Purchase)</text>

              {/* Stacked Deal Structure Bar */}
              <rect x="0" y="24" width="620" height="28" rx="6" fill="#e2e8f0" />
              {/* Cash at close: 70% */}
              <rect x="0" y="24" width="434" height="28" rx="6" fill="#10b981" />
              {/* Seller note: 20% */}
              <rect x="434" y="24" width="124" height="28" fill="#3b82f6" />
              {/* Earnout: 10% */}
              <rect x="558" y="24" width="62" height="28" rx="6" fill="#f59e0b" />

              <text x="217" y="42" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                Cash at Close (SBA / Bank / Equity) ~70%
              </text>
              <text x="496" y="42" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                Seller Note ~20%
              </text>
              <text x="589" y="42" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                Earnout
              </text>
            </g>
          </svg>
        )}
      </div>

      <div className={styles.statusRow}>
        <div className={styles.statusItem}>
          <span>SDE:</span>
          <span className={styles.statusVal}>{fmt(sde)}</span>
        </div>
        <div className={styles.statusItem}>
          <span>Multiple Range:</span>
          <span className={styles.statusVal}>{multipleLow}× – {multipleHigh}×</span>
        </div>
        <div className={styles.statusItem}>
          <span>Estimated Enterprise Value:</span>
          <span className={styles.statusVal}>{fmt(evMid)}</span>
        </div>
        <div className={styles.statusItem}>
          <span>Estimated Owner Proceeds:</span>
          <span className={styles.statusVal} style={{ color: '#047857' }}>{fmt(equityMid)}</span>
        </div>
      </div>
    </div>
  );
}
