import React from 'react';
import styles from './DrawdownInputGuide.module.css';

interface DrawdownInputGuideProps {
  mode: 'years' | 'spend' | 'four-percent';
  activeField?: string;
  initialSavings?: number;
  currentAge?: number;
  spendingAnnual?: number;
  expectedReturnPct?: number;
  inflationPct?: number;
  feesPct?: number;
  yearsLasted?: number;
  depletedAge?: number;
  isIndefinite?: boolean;
  targetAge?: number;
  solvedSpending?: number;
}

export default function DrawdownInputGuide({
  mode,
  activeField,
  initialSavings = 500000,
  currentAge = 65,
  spendingAnnual = 40000,
  expectedReturnPct = 5.0,
  inflationPct = 3.0,
  feesPct = 0.0,
  yearsLasted = 15.2,
  depletedAge = 80.2,
  isIndefinite = false,
  targetAge = 95,
  solvedSpending = 22811,
}: DrawdownInputGuideProps) {
  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Model:</strong>{' '}
            {mode === 'years' && 'Capital Depletion Water Tank: Inflows, Outflows & Longevity'}
            {mode === 'spend' && 'Growing Annuity Solver: Maximum Safe Annual Withdrawal'}
            {mode === 'four-percent' && 'The 4% Rule Baseline: William Bengen (1994) Rule of Thumb'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'years' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Retirement Savings Drawdown Tank Diagram"
            >
              {/* Water Tank */}
              <g transform="translate(140, 15)">
                {/* Tank body */}
                <rect x="0" y="10" width="130" height="90" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
                {/* Water level */}
                <rect
                  x="2"
                  y="30"
                  width="126"
                  height="68"
                  rx="4"
                  fill={activeField === 'initialSavings' ? '#bae6fd' : '#e0f2fe'}
                />
                <line x1="2" y1="30" x2="128" y2="30" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                <text x="65" y="65" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0369a1">
                  {formatMoney(initialSavings)}
                </text>
                <text x="65" y="80" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0284c7">
                  1 Savings Pot
                </text>
              </g>

              {/* Inflow Pipe at Top (Return %) */}
              <g transform="translate(40, 10)">
                <path d="M 10 20 L 70 20 L 70 35 L 100 35" stroke="#16a34a" strokeWidth="3" fill="none" />
                <polyline points="95,30 102,35 95,40" fill="none" stroke="#16a34a" strokeWidth="3" />
                <text x="40" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d">
                  2 Return +{expectedReturnPct}%
                </text>
                {/* Fee Leak */}
                {feesPct > 0 && (
                  <g transform="translate(50, 22)">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#dc2626" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="5" y="8" fontSize="8" fontWeight="600" fill="#b91c1c">
                      3 Fee -{feesPct}%
                    </text>
                  </g>
                )}
              </g>

              {/* Side Inflow (Social Security / Pension) */}
              <g transform="translate(20, 60)">
                <line x1="30" y1="20" x2="135" y2="20" stroke="#2563eb" strokeWidth="2.5" />
                <polyline points="128,15 136,20 128,25" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <text x="75" y="14" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#1d4ed8">
                  6 Other Income
                </text>
                <text x="75" y="32" textAnchor="middle" fontSize="8" fill="#64748b">
                  7 Social Security
                </text>
              </g>

              {/* Outflow Tap at Bottom (Yearly Spending) */}
              <g transform="translate(275, 75)">
                <path d="M 0 15 L 45 15 L 45 35" stroke="#dc2626" strokeWidth="3" fill="none" />
                <polyline points="40,30 45,37 50,30" fill="none" stroke="#dc2626" strokeWidth="3" />
                <text x="55" y="20" fontSize="9.5" fontWeight="800" fill="#b91c1c">
                  4 Spending: -{formatMoney(spendingAnnual)}/yr
                </text>
                <text x="55" y="34" fontSize="8.5" fontWeight="600" fill="#dc2626">
                  5 Rises with Inflation (+{inflationPct}%)
                </text>
              </g>

              {/* Age Ruler Below Tank */}
              <g transform="translate(360, 20)">
                <rect x="0" y="0" width="300" height="90" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
                <text x="15" y="24" fontSize="10" fontWeight="700" fill="#166534">
                  8 Longevity Projection
                </text>
                {isIndefinite ? (
                  <g transform="translate(15, 45)">
                    <text x="0" y="0" fontSize="16" fontWeight="900" fill="#15803d">
                      Lasts Indefinitely ✨
                    </text>
                    <text x="0" y="18" fontSize="9" fill="#166534">
                      Annual growth exceeds withdrawals
                    </text>
                  </g>
                ) : (
                  <g transform="translate(15, 42)">
                    <text x="0" y="0" fontSize="15" fontWeight="900" fill="#166534">
                      Lasts ~{yearsLasted} Years (Age {Math.round(depletedAge)})
                    </text>
                    <line x1="0" y1="14" x2="270" y2="14" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="0" cy="14" r="5" fill="#16a34a" />
                    <text x="0" y="28" fontSize="9" fontWeight="700" fill="#475569">
                      Age {currentAge}
                    </text>
                    <circle cx="270" cy="14" r="5" fill="#dc2626" />
                    <text x="270" y="28" textAnchor="end" fontSize="9" fontWeight="700" fill="#b91c1c">
                      Empty at Age {Math.round(depletedAge)}
                    </text>
                  </g>
                )}
              </g>
            </svg>
          )}

          {mode === 'spend' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Maximum Spending Solver Diagram"
            >
              <g transform="translate(40, 25)">
                <rect x="0" y="0" width="180" height="95" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e40af">
                  Capital Available
                </text>
                <text x="90" y="55" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1d4ed8">
                  {formatMoney(initialSavings)}
                </text>
                <text x="90" y="75" textAnchor="middle" fontSize="9" fill="#475569">
                  From Age {currentAge} to {targetAge} ({targetAge - currentAge} Yrs)
                </text>
              </g>

              {/* Arrow */}
              <g transform="translate(235, 60)">
                <line x1="0" y1="10" x2="65" y2="10" stroke="#64748b" strokeWidth="3" />
                <polyline points="58,3 68,10 58,17" fill="none" stroke="#64748b" strokeWidth="3" />
                <text x="35" y="0" textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
                  Growing Annuity
                </text>
              </g>

              <g transform="translate(320, 20)">
                <rect x="0" y="0" width="340" height="105" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
                <text x="20" y="26" fontSize="11" fontWeight="700" fill="#166534">
                  Maximum Sustainable Year 1 Spending
                </text>
                <text x="20" y="60" fontSize="22" fontWeight="900" fill="#15803d">
                  {formatMoney(solvedSpending)}
                  <tspan fontSize="12" fontWeight="600" fill="#166534">
                    {' '}/ Year
                  </tspan>
                </text>
                <text x="20" y="85" fontSize="10" fontWeight="600" fill="#166534">
                  ≈ {formatMoney(solvedSpending / 12)} / month · Rises with {inflationPct}% annual inflation to age {targetAge}
                </text>
              </g>
            </svg>
          )}

          {mode === 'four-percent' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="The 4% Rule Bengen Guideline Diagram"
            >
              <g transform="translate(50, 20)">
                <rect x="0" y="0" width="260" height="100" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="130" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
                  William Bengen 4% Rule (1994)
                </text>
                <text x="130" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill="#2563eb">
                  {formatMoney(initialSavings * 0.04)} / Year
                </text>
                <text x="130" y="82" textAnchor="middle" fontSize="9.5" fill="#64748b">
                  Initial 4.0% withdrawal on {formatMoney(initialSavings)}
                </text>
              </g>

              <g transform="translate(340, 20)">
                <rect x="0" y="0" width="310" height="100" rx="8" fill="#fefce8" stroke="#fde047" strokeWidth="1.5" />
                <text x="20" y="26" fontSize="10.5" fontWeight="800" fill="#854d0e">
                  Trinity Study (1998) Empirical Caveats
                </text>
                <text x="20" y="48" fontSize="9.5" fill="#713f12">
                  • Designed for a 30-year horizon in a 50/50 stock-bond portfolio
                </text>
                <text x="20" y="66" fontSize="9.5" fill="#713f12">
                  • Assumes withdrawals escalate each year with official CPI inflation
                </text>
                <text x="20" y="84" fontSize="9.5" fill="#713f12">
                  • Past historical success does not guarantee future solvency
                </text>
              </g>
            </svg>
          )}
        </div>
      </details>
    </div>
  );
}
