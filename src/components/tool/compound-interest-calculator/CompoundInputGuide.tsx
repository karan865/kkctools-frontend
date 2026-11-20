import React from 'react';
import styles from './CompoundInputGuide.module.css';

interface CompoundInputGuideProps {
  mode: 'growth' | 'goal' | 'simple-vs-compound' | 'apr-vs-apy';
  activeField?: string;
  principal?: number;
  ratePct?: number;
  years?: number;
  monthlyDeposit?: number;
  compounding?: string;
  depositTiming?: 'start' | 'end';
  futureValue?: number;
  interestEarned?: number;
}

export default function CompoundInputGuide({
  mode,
  activeField,
  principal = 10000,
  ratePct = 5,
  years = 10,
  monthlyDeposit = 200,
  compounding = 'monthly',
  depositTiming = 'end',
  futureValue = 47526.55,
  interestEarned = 13526.55,
}: CompoundInputGuideProps) {
  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Model:</strong>{' '}
            {mode === 'growth' && 'The Compound Interest Snowball Effect'}
            {mode === 'goal' && 'Reverse Target Savings Trajectory'}
            {mode === 'simple-vs-compound' && 'Simple Interest Flat Line vs Compound Curve'}
            {mode === 'apr-vs-apy' && 'Nominal APR vs Effective APY Compounding Jump'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'growth' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Compound Interest Snowball Diagram"
            >
              {/* Gentle Slope Hillside */}
              <path d="M 60 45 Q 320 85, 620 120" stroke="#cbd5e1" strokeWidth="3" fill="none" />

              {/* Starting Snowball (Top Left) */}
              <circle
                cx="90"
                cy="40"
                r="18"
                fill={activeField === 'principal' ? '#fef3c7' : '#eff6ff'}
                stroke={activeField === 'principal' ? '#d97706' : '#2563eb'}
                strokeWidth="2.5"
              />
              <text x="90" y="44" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1e3a8a">
                {formatMoney(principal)}
              </text>
              <text x="90" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                1 Starting Principal
              </text>

              {/* Monthly Deposit Snow Additions on Slope */}
              {[1, 2, 3].map((mark) => {
                const cx = 175 + mark * 85;
                const cy = 60 + mark * 16;
                return (
                  <g key={mark}>
                    <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 6} stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                    <circle cx={cx} cy={cy - 18} r="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                    <text x={cx} y={cy - 14} textAnchor="middle" fontSize="8" fontWeight="700" fill="#047857">
                      +{formatMoney(monthlyDeposit)}
                    </text>
                  </g>
                );
              })}

              <rect x="220" y="12" width="180" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="310" y="28" textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155">
                2 +${monthlyDeposit}/mo ({depositTiming}) @ {ratePct}% ({compounding})
              </text>

              {/* Giant Snowball at Bottom (Future Value) */}
              <circle
                cx="580"
                cy="90"
                r="36"
                fill="#f0fdf4"
                stroke="#10b981"
                strokeWidth="3.5"
              />
              <text x="580" y="86" textAnchor="middle" fontSize="13" fontWeight="900" fill="#065f46">
                {formatMoney(futureValue)}
              </text>
              <text x="580" y="102" textAnchor="middle" fontSize="9" fontWeight="700" fill="#047857">
                +{formatMoney(interestEarned)} Interest
              </text>
              <text x="580" y="138" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                Year {years} Future Value
              </text>
            </svg>
          )}

          {mode === 'simple-vs-compound' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Simple vs Compound Interest Comparison Curve"
            >
              {/* Axes */}
              <line x1="70" y1="125" x2="620" y2="125" stroke="#94a3b8" strokeWidth="2" />
              <line x1="70" y1="20" x2="70" y2="125" stroke="#94a3b8" strokeWidth="2" />

              <text x="70" y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">
                Year 0
              </text>
              <text x="620" y="140" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">
                Year {years}
              </text>

              {/* Simple Interest Linear Line (Amber) */}
              <line x1="70" y1="110" x2="620" y2="70" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 3" />
              <text x="540" y="62" fontSize="11" fontWeight="700" fill="#d97706">
                Simple Interest (Linear)
              </text>

              {/* Compound Interest Exponential Curve (Blue) */}
              <path d="M 70 110 Q 380 90, 620 28" fill="none" stroke="#2563eb" strokeWidth="3.5" />
              <text x="540" y="22" fontSize="11" fontWeight="800" fill="#1e40af">
                Compound Interest (Exponential)
              </text>

              {/* Green Shaded Gap (The Compound Advantage) */}
              <path
                d="M 280 96 Q 450 78, 620 28 L 620 70 Q 450 85, 280 96 Z"
                fill="rgba(16, 185, 129, 0.15)"
              />
              <text x="430" y="80" textAnchor="middle" fontSize="10" fontWeight="800" fill="#047857">
                Compound Advantage
              </text>
            </svg>
          )}

          {mode === 'goal' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Target Savings Goal Trajectory"
            >
              <line x1="80" y1="120" x2="600" y2="120" stroke="#cbd5e1" strokeWidth="3" />

              {/* Flag Pole at Target */}
              <line x1="580" y1="30" x2="580" y2="120" stroke="#2563eb" strokeWidth="3" />
              <polygon points="580,30 625,45 580,60" fill="#2563eb" />
              <text x="600" y="48" fontSize="10" fontWeight="800" fill="#ffffff">
                GOAL
              </text>
              <text x="580" y="80" textAnchor="end" fontSize="12" fontWeight="800" fill="#0f172a">
                Target: {formatMoney(futureValue)}
              </text>

              {/* Rising Trajectory Path */}
              <path d="M 90 110 Q 340 95, 580 30" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="5 3" />

              {/* Solver Callout Box */}
              <rect x="230" y="35" width="220" height="42" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
              <text x="340" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">
                Required Monthly Deposit
              </text>
              <text x="340" y="68" textAnchor="middle" fontSize="13" fontWeight="900" fill="#15803d">
                {formatMoney(monthlyDeposit)} / month
              </text>
            </svg>
          )}

          {mode === 'apr-vs-apy' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="APR vs APY Compounding Difference"
            >
              <rect x="90" y="30" width="200" height="75" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="190" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="#64748b">
                Nominal Rate (APR)
              </text>
              <text x="190" y="82" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">
                {ratePct.toFixed(2)}%
              </text>

              {/* Arrow to APY */}
              <path d="M 310 68 L 370 68" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrow)" />
              <polygon points="370,68 360,62 360,74" fill="#2563eb" />
              <text x="340" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">
                + Compounding
              </text>

              <rect x="390" y="30" width="200" height="75" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
              <text x="490" y="55" textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857">
                Effective Yield (APY)
              </text>
              <text x="490" y="82" textAnchor="middle" fontSize="18" fontWeight="900" fill="#065f46">
                {(ratePct * 1.023).toFixed(3)}%
              </text>
            </svg>
          )}
        </div>
      </details>
    </div>
  );
}
