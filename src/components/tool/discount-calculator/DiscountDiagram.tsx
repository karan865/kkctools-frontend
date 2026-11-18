'use client';

import React, { useState } from 'react';
import styles from './DiscountDiagram.module.css';

interface DiscountDiagramProps {
  originalPrice: number;
  salePrice: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
  percentSavingsOnly: number;
  couponSavingsOnly: number;
  stackedSavingsOnly: number;
  taxAmount: number;
  finalPriceWithTax: number;
}

export default function DiscountDiagram({
  originalPrice,
  salePrice,
  totalSavings,
  effectiveDiscountPercent,
  percentSavingsOnly,
  couponSavingsOnly,
  stackedSavingsOnly,
  taxAmount,
  finalPriceWithTax,
}: DiscountDiagramProps) {
  const [viewMode, setViewMode] = useState<'split' | 'waterfall'>('split');

  const orig = Math.max(0.01, originalPrice);
  const payRatio = Math.max(0, Math.min(1, salePrice / orig));
  const saveRatio = Math.max(0, Math.min(1, totalSavings / orig));

  // Geometry constants
  const svgW = 560;
  const svgH = 220;

  // Colors
  const colPay = '#0284c7'; // Blue for amount paid
  const colSave = '#16a34a'; // Green for savings
  const colCoupon = '#f59e0b'; // Amber for coupon
  const colTax = '#dc2626'; // Red for tax addition

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>Visual Discount &amp; Savings Breakdown</h3>
          <p className={styles.subtitle}>
            {viewMode === 'split'
              ? 'Proportional comparison between what you pay and what you save'
              : 'Step-by-step price deduction waterfall from original price to checkout'}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'split' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('split')}
          >
            Price Split
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${viewMode === 'waterfall' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('waterfall')}
          >
            Deduction Flow
          </button>
        </div>
      </div>

      <div className={styles.svgWrap}>
        {viewMode === 'split' ? (
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className={styles.svg} width={svgW} height={svgH} aria-label="Discount breakdown bar diagram">
            {/* Background container bar */}
            <rect x="40" y="55" width="480" height="48" rx="8" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* What you pay segment */}
            <rect
              x="40"
              y="55"
              width={Math.max(4, payRatio * 480)}
              height="48"
              rx="8"
              fill={colPay}
            />

            {/* Overlap fix for rounded corners when split */}
            {payRatio > 0.05 && payRatio < 0.95 && (
              <rect
                x={40 + payRatio * 480 - 8}
                y="55"
                width="8"
                height="48"
                fill={colPay}
              />
            )}

            {/* What you save segment */}
            {saveRatio > 0 && (
              <rect
                x={40 + payRatio * 480}
                y="55"
                width={Math.max(4, saveRatio * 480)}
                height="48"
                rx="8"
                fill={colSave}
              />
            )}

            {/* Top labels */}
            <text x="40" y="42" fill="#475569" fontSize="12" fontWeight="700">
              Original MSRP: ${originalPrice.toFixed(2)}
            </text>
            <text x="520" y="42" textAnchor="end" fill={colSave} fontSize="12" fontWeight="700">
              Save {effectiveDiscountPercent.toFixed(1)}% (${totalSavings.toFixed(2)})
            </text>

            {/* In-bar labels */}
            {payRatio > 0.22 && (
              <text
                x={40 + (payRatio * 480) / 2}
                y="85"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="700"
              >
                You Pay: ${salePrice.toFixed(2)} ({((salePrice / orig) * 100).toFixed(0)}%)
              </text>
            )}

            {saveRatio > 0.22 && (
              <text
                x={40 + payRatio * 480 + (saveRatio * 480) / 2}
                y="85"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="700"
              >
                Saved: ${totalSavings.toFixed(2)} ({effectiveDiscountPercent.toFixed(0)}%)
              </text>
            )}

            {/* Optional Tax indicator */}
            {taxAmount > 0 && (
              <g transform="translate(40, 130)">
                <rect x="0" y="0" width="480" height="34" rx="6" fill="#fef2f2" stroke="#fecaca" strokeWidth="1" />
                <circle cx="20" cy="17" r="6" fill={colTax} />
                <text x="36" y="21" fill="#991b1b" fontSize="12" fontWeight="600">
                  + Sales Tax (${taxAmount.toFixed(2)}) → Total at Register: ${finalPriceWithTax.toFixed(2)}
                </text>
              </g>
            )}

            {/* Bottom summary guide */}
            <g transform="translate(40, 185)">
              <text x="0" y="0" fill="#64748b" fontSize="11">
                Base Price = ${(originalPrice).toFixed(2)}
              </text>
              <text x="240" y="0" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="600">
                Net Sale Price: ${salePrice.toFixed(2)}
              </text>
              <text x="480" y="0" textAnchor="end" fill="#16a34a" fontSize="11" fontWeight="600">
                Kept in Your Wallet: ${totalSavings.toFixed(2)}
              </text>
            </g>
          </svg>
        ) : (
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className={styles.svg} width={svgW} height={svgH} aria-label="Waterfall discount progression diagram">
            {/* Step 1: Original */}
            <g transform="translate(40, 30)">
              <rect x="0" y="0" width="100" height="42" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="50" y="17" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">ORIGINAL</text>
              <text x="50" y="33" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">${originalPrice.toFixed(2)}</text>
            </g>

            {/* Arrow 1 */}
            <path d="M 148 51 L 175 51" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Step 2: Primary discount deduction */}
            <g transform="translate(180, 30)">
              <rect x="0" y="0" width="100" height="42" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
              <text x="50" y="17" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="600">DISCOUNT</text>
              <text x="50" y="33" textAnchor="middle" fill="#16a34a" fontSize="13" fontWeight="700">−${percentSavingsOnly.toFixed(2)}</text>
            </g>

            {/* Arrow 2 */}
            <path d="M 288 51 L 315 51" stroke="#94a3b8" strokeWidth="2" />

            {/* Step 3: Stacked / Coupon deduction */}
            <g transform="translate(320, 30)">
              <rect x="0" y="0" width="100" height="42" rx="6" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
              <text x="50" y="17" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="600">
                {couponSavingsOnly > 0 ? 'COUPON' : stackedSavingsOnly > 0 ? 'EXTRA %' : 'DEDUCTIONS'}
              </text>
              <text x="50" y="33" textAnchor="middle" fill="#d97706" fontSize="13" fontWeight="700">
                −${(couponSavingsOnly + stackedSavingsOnly).toFixed(2)}
              </text>
            </g>

            {/* Arrow 3 */}
            <path d="M 428 51 L 455 51" stroke="#94a3b8" strokeWidth="2" />

            {/* Step 4: Final Sale */}
            <g transform="translate(460, 30)">
              <rect x="0" y="0" width="90" height="42" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
              <text x="45" y="17" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="700">FINAL SALE</text>
              <text x="45" y="33" textAnchor="middle" fill="#0284c7" fontSize="13" fontWeight="800">${salePrice.toFixed(2)}</text>
            </g>

            {/* Waterfall connector line & explanation box */}
            <g transform="translate(40, 105)">
              <rect x="0" y="0" width="480" height="80" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
              <text x="18" y="24" fill="#0f172a" fontSize="12" fontWeight="700">
                Cumulative Savings: ${totalSavings.toFixed(2)} ({effectiveDiscountPercent.toFixed(1)}% total reduction)
              </text>
              <text x="18" y="44" fill="#475569" fontSize="11">
                • Primary Percentage Savings: ${percentSavingsOnly.toFixed(2)}
              </text>
              <text x="18" y="62" fill="#475569" fontSize="11">
                • Additional Promotional Savings (Coupon / Stacked): ${(couponSavingsOnly + stackedSavingsOnly).toFixed(2)}
                {taxAmount > 0 && ` | Sales Tax Added: +$${taxAmount.toFixed(2)}`}
              </text>
            </g>
          </svg>
        )}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: colPay }} />
          <span>Amount You Pay</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: colSave }} />
          <span>Primary Savings</span>
        </div>
        {(couponSavingsOnly > 0 || stackedSavingsOnly > 0) && (
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: colCoupon }} />
            <span>Coupon / Stacked Extra</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: colTax }} />
            <span>Sales Tax</span>
          </div>
        )}
      </div>
    </div>
  );
}
