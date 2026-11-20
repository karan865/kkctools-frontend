import React from 'react';
import styles from './PvInputGuide.module.css';

interface PvInputGuideProps {
  mode: 'lump-sum' | 'annuity' | 'cash-flows' | 'npv' | 'pv-table';
  activeField?: string;
  fv?: number;
  ratePct?: number;
  years?: number;
  compounding?: string;
  payment?: number;
  timing?: 'ordinary' | 'due';
  initialInvestment?: number;
  pvResult?: number;
  npvResult?: number;
  irrResult?: number | null;
}

export default function PvInputGuide({
  mode,
  activeField,
  fv = 10000,
  ratePct = 6,
  years = 10,
  compounding = 'annually',
  payment = 1000,
  timing = 'ordinary',
  initialInvestment = 10000,
  pvResult = 5583.95,
  npvResult = 1978.13,
  irrResult = 15.24,
}: PvInputGuideProps) {
  const formatMoney = (val: number) =>
    `$${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Flow:</strong>{' '}
            {mode === 'lump-sum' && 'Future Value Discounting Timeline'}
            {mode === 'annuity' && 'Periodic Annuity Cash Flow Stream'}
            {mode === 'cash-flows' && 'Uneven Multi-Year Cash Flow Discounting'}
            {mode === 'npv' && 'Capital Budgeting: Net Inflows vs Initial Outflow'}
            {mode === 'pv-table' && 'Present Value Discount Factor Table'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'lump-sum' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Present Value Lump Sum Timeline Diagram"
            >
              {/* Background Timeline Rail */}
              <line x1="80" y1="75" x2="600" y2="75" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="6 4" />

              {/* Today Node (Period 0) */}
              <circle cx="80" cy="75" r="28" fill="#ecfdf5" stroke="#10b981" strokeWidth="3" />
              <text x="80" y="70" textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857">
                TODAY
              </text>
              <text x="80" y="86" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46">
                {formatMoney(pvResult)}
              </text>
              <text x="80" y="120" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                Present Value (PV)
              </text>

              {/* Curved Discounting Arrow */}
              <path
                d="M 570 52 C 450 15, 210 15, 110 52"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <polygon points="105,55 116,46 116,56" fill="#2563eb" />

              {/* Middle Formula Callout */}
              <rect x="235" y="10" width="210" height="30" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
              <text x="340" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">
                ÷ (1 + {ratePct}% ÷ m)^{years}y ({compounding})
              </text>

              {/* Future Node (Period N) */}
              <circle
                cx="600"
                cy="75"
                r="32"
                fill={activeField === 'fv' ? '#fef3c7' : '#f8fafc'}
                stroke={activeField === 'fv' ? '#d97706' : '#2563eb'}
                strokeWidth="3"
              />
              <text x="600" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                YEAR {years}
              </text>
              <text x="600" y="86" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e3a8a">
                {formatMoney(fv)}
              </text>
              <text x="600" y="122" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                Future Value (FV)
              </text>
            </svg>
          )}

          {mode === 'annuity' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Present Value Annuity Stream Diagram"
            >
              <line x1="80" y1="75" x2="600" y2="75" stroke="#cbd5e1" strokeWidth="3" />

              {/* Today Node */}
              <circle cx="80" cy="75" r="28" fill="#ecfdf5" stroke="#10b981" strokeWidth="3" />
              <text x="80" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">
                TODAY
              </text>
              <text x="80" y="86" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46">
                {formatMoney(pvResult)}
              </text>
              <text x="80" y="120" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                PV of Annuity
              </text>

              {/* Periodic Cash Flows */}
              {[1, 2, 3, 4, 5].map((period, idx) => {
                const cx = 180 + idx * 95;
                return (
                  <g key={period}>
                    <line x1={cx} y1="65" x2={cx} y2="85" stroke="#64748b" strokeWidth="2" />
                    <circle cx={cx} cy="45" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                    <text x={cx} y="49" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d">
                      {formatMoney(payment)}
                    </text>
                    <text x={cx} y="98" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                      Yr {period}
                    </text>
                    {/* Faint Discounting Arc */}
                    <path
                      d={`M ${cx} 30 C ${(cx + 80) / 2} 10, 110 10, 85 48`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </g>
                );
              })}

              <rect x="580" y="32" width="85" height="26" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="622" y="49" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
                {timing === 'due' ? 'Annuity Due' : 'Ordinary'}
              </text>
            </svg>
          )}

          {mode === 'cash-flows' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Uneven Cash Flows Diagram"
            >
              <line x1="80" y1="80" x2="600" y2="80" stroke="#cbd5e1" strokeWidth="3" />
              <circle cx="80" cy="80" r="28" fill="#ecfdf5" stroke="#10b981" strokeWidth="3" />
              <text x="80" y="75" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">
                SUM PV
              </text>
              <text x="80" y="91" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46">
                {formatMoney(pvResult)}
              </text>

              {[
                { yr: 1, x: 200, cf: 2000, h: 30 },
                { yr: 2, x: 330, cf: 4500, h: 50 },
                { yr: 3, x: 460, cf: 3200, h: 40 },
                { yr: 4, x: 570, cf: 6000, h: 60 },
              ].map((item) => (
                <g key={item.yr}>
                  <rect
                    x={item.x - 18}
                    y={80 - item.h}
                    width="36"
                    height={item.h}
                    rx="4"
                    fill="#dbeafe"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                  />
                  <text x={item.x} y={75 - item.h} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e40af">
                    ${item.cf}
                  </text>
                  <text x={item.x} y="98" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                    Year {item.yr}
                  </text>
                  <path
                    d={`M ${item.x} ${75 - item.h} C ${(item.x + 80) / 2} 15, 120 15, 90 55`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                </g>
              ))}
            </svg>
          )}

          {mode === 'npv' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="NPV and IRR Capital Budgeting Diagram"
            >
              {/* Baseline Zero Rail */}
              <line x1="80" y1="75" x2="600" y2="75" stroke="#cbd5e1" strokeWidth="3" />

              {/* Initial Outflow (Red Down Arrow) */}
              <rect x="70" y="75" width="40" height="45" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
              <text x="90" y="103" textAnchor="middle" fontSize="10" fontWeight="800" fill="#991b1b">
                -{formatMoney(initialInvestment)}
              </text>
              <text x="90" y="132" textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">
                Yr 0 Outlay
              </text>

              {/* Inflow Bars */}
              {[
                { yr: 1, x: 200, cf: 3000, h: 35 },
                { yr: 2, x: 290, cf: 3000, h: 35 },
                { yr: 3, x: 380, cf: 3000, h: 35 },
                { yr: 4, x: 470, cf: 3000, h: 35 },
                { yr: 5, x: 560, cf: 3000, h: 35 },
              ].map((item) => (
                <g key={item.yr}>
                  <rect
                    x={item.x - 16}
                    y={75 - item.h}
                    width="32"
                    height={item.h}
                    rx="4"
                    fill="#dcfce7"
                    stroke="#16a34a"
                    strokeWidth="1.5"
                  />
                  <text x={item.x} y={70 - item.h} textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d">
                    +{formatMoney(item.cf)}
                  </text>
                  <text x={item.x} y="92" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                    Yr {item.yr}
                  </text>
                </g>
              ))}

              {/* Badge: Net Result */}
              <rect x="250" y="10" width="220" height="26" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="360" y="27" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e3a8a">
                NPV: {formatMoney(npvResult)} | IRR: {irrResult !== null ? `${irrResult.toFixed(2)}%` : 'N/A'}
              </text>
            </svg>
          )}

          {mode === 'pv-table' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Present Value Table Matrix Diagram"
            >
              <rect x="90" y="15" width="500" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="90" y1="45" x2="590" y2="45" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="160" y1="15" x2="160" y2="125" stroke="#e2e8f0" strokeWidth="1.5" />

              <text x="125" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
                Period \ Rate
              </text>
              <text x="220" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">
                4%
              </text>
              <text x="310" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">
                6%
              </text>
              <text x="400" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">
                8%
              </text>
              <text x="490" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">
                10%
              </text>

              <text x="125" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                Period 1
              </text>
              <text x="220" y="68" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.9615
              </text>
              <text x="310" y="68" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.9434
              </text>
              <text x="400" y="68" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.9259
              </text>
              <text x="490" y="68" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.9091
              </text>

              <text x="125" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                Period 5
              </text>
              <text x="220" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.8219
              </text>
              <text x="310" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.7473
              </text>
              <text x="400" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.6806
              </text>
              <text x="490" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">
                0.6209
              </text>
            </svg>
          )}
        </div>
      </details>
    </div>
  );
}
