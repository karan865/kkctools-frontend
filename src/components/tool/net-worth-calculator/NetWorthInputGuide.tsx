import React from 'react';
import styles from './NetWorthInputGuide.module.css';

interface NetWorthInputGuideProps {
  mode: 'personal' | 'household' | 'tracker';
  activeField?: string;
  totalAssets?: number;
  totalLiabilities?: number;
  netWorth?: number;
  liquidNetWorth?: number;
}

export default function NetWorthInputGuide({
  mode,
  activeField,
  totalAssets = 550000,
  totalLiabilities = 294000,
  netWorth = 256000,
  liquidNetWorth = 31000,
}: NetWorthInputGuideProps) {
  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  // Tilt angle of balance beam: clamp between -8 and +8 degrees
  const diff = totalAssets - totalLiabilities;
  const maxSpan = Math.max(10000, totalAssets + totalLiabilities);
  const rawAngle = -(diff / maxSpan) * 16;
  const tiltAngle = Math.max(-8, Math.min(8, rawAngle));

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Balance Sheet:</strong>{' '}
            {mode === 'personal' && 'What You Own vs. What You Owe (The Net Worth Equation)'}
            {mode === 'household' && 'Dual-Earner Household & Joint Balance Sheet Model'}
            {mode === 'tracker' && 'Historical Net Worth Progression & Wealth Accumulation'}
          </span>
          <span className={styles.summaryHint}>Interactive Scale</span>
        </summary>

        <div className={styles.diagramWrap}>
          <svg
            className={styles.svg}
            viewBox="0 0 720 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Net Worth Balance Scale Diagram"
          >
            {/* Center Fulcrum Base */}
            <polygon points="360,65 335,140 385,140" fill="#475569" />
            <circle cx="360" cy="65" r="7" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="315" y="140" width="90" height="12" rx="3" fill="#334155" />

            {/* Tilting Balance Beam */}
            <g transform={`rotate(${tiltAngle}, 360, 65)`}>
              <line x1="80" y1="65" x2="640" y2="65" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

              {/* Left Pan Chains (Assets) */}
              <line x1="120" y1="65" x2="80" y2="105" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="120" y1="65" x2="160" y2="105" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 60 105 Q 120 120 180 105" stroke="#0f172a" strokeWidth="3" fill="none" />

              {/* Right Pan Chains (Liabilities) */}
              <line x1="600" y1="65" x2="560" y2="105" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="600" y1="65" x2="640" y2="105" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 540 105 Q 600 120 660 105" stroke="#0f172a" strokeWidth="3" fill="none" />
            </g>

            {/* Left Pan Contents (Assets Card) */}
            <g transform="translate(45, 12)">
              <rect
                x="0"
                y="0"
                width="165"
                height="80"
                rx="6"
                fill="#f0fdf4"
                stroke={activeField?.includes('asset') || activeField === 'cash' ? '#10b981' : '#86efac'}
                strokeWidth="1.5"
              />
              <text x="12" y="18" fontSize="10" fontWeight="700" fill="#166534">
                WHAT YOU OWN (ASSETS)
              </text>
              <text x="12" y="36" fontSize="15" fontWeight="800" fill="#14532d">
                {formatMoney(totalAssets)}
              </text>

              {/* Liquid sub-label */}
              <rect x="10" y="44" width="145" height="26" rx="4" fill="#dcfce7" stroke="#86efac" strokeDasharray="2 2" />
              <text x="16" y="56" fontSize="8" fontWeight="600" fill="#15803d">
                1-3 Liquid Assets (Cash+Invest)
              </text>
              <text x="16" y="66" fontSize="9" fontWeight="700" fill="#166534">
                Liquid Net: {formatMoney(liquidNetWorth)}
              </text>
            </g>

            {/* Center Net Worth Result Badge */}
            <g transform="translate(270, 10)">
              <rect
                x="0"
                y="0"
                width="180"
                height="45"
                rx="8"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="90" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">
                NET WORTH = ASSETS − LIABILITIES
              </text>
              <text
                x="90"
                y="35"
                textAnchor="middle"
                fontSize="16"
                fontWeight="900"
                fill={netWorth >= 0 ? '#38bdf8' : '#f87171'}
              >
                {formatMoney(netWorth)}
              </text>
            </g>

            {/* Right Pan Contents (Liabilities Card) */}
            <g transform="translate(510, 12)">
              <rect
                x="0"
                y="0"
                width="165"
                height="80"
                rx="6"
                fill="#fef2f2"
                stroke={activeField?.includes('debt') || activeField === 'mortgage' ? '#ef4444' : '#fca5a5'}
                strokeWidth="1.5"
              />
              <text x="12" y="18" fontSize="10" fontWeight="700" fill="#991b1b">
                WHAT YOU OWE (DEBT)
              </text>
              <text x="12" y="36" fontSize="15" fontWeight="800" fill="#7f1d1d">
                {formatMoney(totalLiabilities)}
              </text>

              {/* Debt sub-label */}
              <rect x="10" y="44" width="145" height="26" rx="4" fill="#fee2e2" stroke="#fca5a5" />
              <text x="16" y="56" fontSize="8" fontWeight="600" fill="#b91c1c">
                6-8 Mortgages, Loans &amp; Cards
              </text>
              <text x="16" y="66" fontSize="9" fontWeight="700" fill="#991b1b">
                Debt-to-Asset: {totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : 0}%
              </text>
            </g>
          </svg>

          <div className={styles.captionRow}>
            <div className={styles.captionCol}>
              <span className={styles.dotGreen} />
              <span>
                <strong>Assets (Own):</strong> Cash, investments, retirement accounts, home value &amp; vehicles
              </span>
            </div>
            <div className={styles.captionCol}>
              <span className={styles.dotRed} />
              <span>
                <strong>Liabilities (Owe):</strong> Mortgages, auto loans, student loans &amp; credit card debt
              </span>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
