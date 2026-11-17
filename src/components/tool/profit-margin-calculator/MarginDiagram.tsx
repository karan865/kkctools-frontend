'use client';

import React, { useState } from 'react';
import styles from './MarginDiagram.module.css';
import { formatCurrency, formatPercent } from '@/lib/pricing-engine';

interface MarginDiagramProps {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPercent: number | null;
  opex?: number;
  operatingProfit?: number;
  operatingMarginPercent?: number | null;
  netProfit?: number;
  netMarginPercent?: number | null;
  currencySymbol?: string;
}

export default function MarginDiagram({
  revenue,
  cogs,
  grossProfit,
  grossMarginPercent,
  opex = 0,
  operatingMarginPercent,
  netProfit,
  netMarginPercent,
  currencySymbol = '$',
}: MarginDiagramProps) {
  const [viewMode, setViewMode] = useState<'waterfall' | 'comparison'>('waterfall');

  // SVG Geometry
  const svgW = 560;
  const svgH = 260;
  const groundY = 210;

  // Safe clamping
  const safeRev = Math.max(revenue, 1);
  const safeCogs = Math.max(cogs, 0);
  const safeGross = Math.max(grossProfit, 0);
  const safeOpex = Math.max(opex, 0);
  const safeNet = Math.max(netProfit !== undefined ? netProfit : grossProfit, 0);

  // Colors
  const colRev = '#1e293b'; // Slate dark for top line
  const colCost = '#ef4444'; // Red/coral for deduction
  const colGross = '#10b981'; // Emerald for gross profit
  const colOpex = '#f59e0b'; // Amber for opex deduction
  const colOperating = '#0284c7'; // Sky blue for operating profit
  const colNet = '#8b5cf6'; // Violet for net profit

  // Comparative percentages
  const gPct = grossMarginPercent !== null ? Math.max(0, Math.min(100, grossMarginPercent)) : 0;
  const opPct = operatingMarginPercent !== undefined && operatingMarginPercent !== null ? Math.max(0, Math.min(100, operatingMarginPercent)) : null;
  const netPct = netMarginPercent !== undefined && netMarginPercent !== null ? Math.max(0, Math.min(100, netMarginPercent)) : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Visual Profit &amp; Margin Breakdown</h3>
          <p className={styles.subtitle}>
            {viewMode === 'waterfall'
              ? 'Sequential Profit Waterfall: Revenue → COGS → Gross → OPEX → Net Profit'
              : 'Comparative Margin Compression: Gross Margin % vs Operating % vs Net %'}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'waterfall' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('waterfall')}
          >
            P&amp;L Waterfall
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'comparison' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('comparison')}
          >
            Margin Tiers
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className={styles.svg}
          role="img"
          aria-label="Visual profit margin diagram"
        >
          {/* Background grid lines */}
          <line x1="30" y1="50" x2="530" y2="50" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="30" y1="100" x2="530" y2="100" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="30" y1="150" x2="530" y2="150" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />

          {/* Baseline Ground Line */}
          <line x1="30" y1={groundY} x2="530" y2={groundY} stroke="#94a3b8" strokeWidth="2" />

          {viewMode === 'waterfall' ? (
            /* VIEW 1: WATERFALL STEP DIAGRAM */
            <g>
              {/* Step 1: Revenue (Total Bar) */}
              <rect x="50" y="60" width="75" height="150" fill={colRev} rx="5" />
              <text x="87" y="52" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="middle">
                {formatCurrency(revenue, currencySymbol)}
              </text>
              <text x="87" y="225" fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle">
                Revenue
              </text>

              {/* Step 2: COGS Deduction (Floating Drop) */}
              {(() => {
                const cogsH = Math.min(130, Math.max(12, (safeCogs / safeRev) * 150));
                return (
                  <>
                    <rect x="145" y="60" width="75" height={cogsH} fill={colCost} rx="5" />
                    <text x="182" y="52" fill="#dc2626" fontSize="11" fontWeight="700" textAnchor="middle">
                      −{formatCurrency(cogs, currencySymbol)}
                    </text>
                    <text x="182" y="225" fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle">
                      COGS
                    </text>
                  </>
                );
              })()}

              {/* Step 3: Gross Profit */}
              {(() => {
                const grossH = Math.min(150, Math.max(12, (safeGross / safeRev) * 150));
                const grossY = groundY - grossH;
                return (
                  <>
                    <rect x="240" y={grossY} width="75" height={grossH} fill={colGross} rx="5" />
                    <text x="277" y={grossY - 8} fill="#059669" fontSize="11" fontWeight="700" textAnchor="middle">
                      {formatCurrency(grossProfit, currencySymbol)}
                    </text>
                    <text x="277" y="225" fill="#065f46" fontSize="10" fontWeight="700" textAnchor="middle">
                      Gross Profit
                    </text>
                    <text x="277" y="238" fill="#059669" fontSize="9" fontWeight="800" textAnchor="middle">
                      ({formatPercent(grossMarginPercent)})
                    </text>
                  </>
                );
              })()}

              {/* Step 4: OPEX Deduction (if specified) */}
              {safeOpex > 0 ? (
                (() => {
                  const opexH = Math.min(100, Math.max(10, (safeOpex / safeRev) * 150));
                  return (
                    <>
                      <rect x="335" y="100" width="75" height={opexH} fill={colOpex} rx="5" />
                      <text x="372" y="92" fill="#d97706" fontSize="11" fontWeight="700" textAnchor="middle">
                        −{formatCurrency(opex, currencySymbol)}
                      </text>
                      <text x="372" y="225" fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle">
                        OPEX
                      </text>
                    </>
                  );
                })()
              ) : (
                /* Or Simple Net indicator if no OPEX */
                <g transform="translate(335, 100)">
                  <rect x="0" y="0" width="75" height="110" fill="#f1f5f9" stroke="#cbd5e1" strokeDasharray="3 3" rx="5" />
                  <text x="37" y="55" fill="#94a3b8" fontSize="10" textAnchor="middle">No OPEX</text>
                  <text x="37" y="70" fill="#94a3b8" fontSize="9" textAnchor="middle">Reported</text>
                </g>
              )}

              {/* Step 5: Net Profit */}
              {(() => {
                const netH = Math.min(150, Math.max(10, (safeNet / safeRev) * 150));
                const netY = groundY - netH;
                return (
                  <>
                    <rect x="430" y={netY} width="80" height={netH} fill={colNet} rx="5" />
                    <text x="470" y={netY - 8} fill="#7c3aed" fontSize="11" fontWeight="800" textAnchor="middle">
                      {formatCurrency(netProfit !== undefined ? netProfit : grossProfit, currencySymbol)}
                    </text>
                    <text x="470" y="225" fill="#5b21b6" fontSize="10" fontWeight="700" textAnchor="middle">
                      Net Profit
                    </text>
                    <text x="470" y="238" fill="#7c3aed" fontSize="9" fontWeight="800" textAnchor="middle">
                      ({formatPercent(netMarginPercent !== undefined && netMarginPercent !== null ? netMarginPercent : grossMarginPercent)})
                    </text>
                  </>
                );
              })()}
            </g>
          ) : (
            /* VIEW 2: 3-TIER MARGIN RETENTION BARS */
            <g>
              {/* Bar 1: Gross Margin % */}
              <g transform="translate(60, 45)">
                <text x="60" y="-12" fill="#047857" fontSize="12" fontWeight="700" textAnchor="middle">
                  1. Gross Margin
                </text>
                {/* Background 100% Track */}
                <rect x="0" y="0" width="120" height="140" fill="#f1f5f9" stroke="#e2e8f0" rx="6" />
                {/* Fill Percentage */}
                <rect
                  x="0"
                  y={140 - (gPct / 100) * 140}
                  width="120"
                  height={(gPct / 100) * 140}
                  fill={colGross}
                  rx="6"
                />
                <text x="60" y="70" fill={gPct > 30 ? '#ffffff' : '#065f46'} fontSize="18" fontWeight="800" textAnchor="middle">
                  {formatPercent(grossMarginPercent)}
                </text>
                <text x="60" y="158" fill="#334155" fontSize="10" fontWeight="600" textAnchor="middle">
                  After COGS
                </text>
              </g>

              {/* Bar 2: Operating Margin % */}
              <g transform="translate(220, 45)">
                <text x="60" y="-12" fill="#0369a1" fontSize="12" fontWeight="700" textAnchor="middle">
                  2. Operating Margin
                </text>
                <rect x="0" y="0" width="120" height="140" fill="#f1f5f9" stroke="#e2e8f0" rx="6" />
                {opPct !== null && (
                  <rect
                    x="0"
                    y={140 - (opPct / 100) * 140}
                    width="120"
                    height={(opPct / 100) * 140}
                    fill={colOperating}
                    rx="6"
                  />
                )}
                <text x="60" y="70" fill={opPct && opPct > 30 ? '#ffffff' : '#0c4a6e'} fontSize="18" fontWeight="800" textAnchor="middle">
                  {opPct !== null ? formatPercent(opPct) : '—'}
                </text>
                <text x="60" y="158" fill="#334155" fontSize="10" fontWeight="600" textAnchor="middle">
                  After Overheads (EBIT)
                </text>
              </g>

              {/* Bar 3: Net Profit Margin % */}
              <g transform="translate(380, 45)">
                <text x="60" y="-12" fill="#6d28d9" fontSize="12" fontWeight="700" textAnchor="middle">
                  3. Net Profit Margin
                </text>
                <rect x="0" y="0" width="120" height="140" fill="#f1f5f9" stroke="#e2e8f0" rx="6" />
                {netPct !== null && (
                  <rect
                    x="0"
                    y={140 - (netPct / 100) * 140}
                    width="120"
                    height={(netPct / 100) * 140}
                    fill={colNet}
                    rx="6"
                  />
                )}
                <text x="60" y="70" fill={netPct && netPct > 30 ? '#ffffff' : '#4c1d95'} fontSize="18" fontWeight="800" textAnchor="middle">
                  {netPct !== null ? formatPercent(netPct) : '—'}
                </text>
                <text x="60" y="158" fill="#334155" fontSize="10" fontWeight="600" textAnchor="middle">
                  Bottom Line (After Tax)
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colRev }} />
          <span>Net Revenue (100% Base)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colCost }} />
          <span>COGS (Direct Costs)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colGross }} />
          <span>Gross Margin</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: colNet }} />
          <span>Net Margin</span>
        </div>
      </div>
    </div>
  );
}
