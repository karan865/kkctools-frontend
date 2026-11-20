import React from 'react';
import styles from './InvestInputGuide.module.css';

interface InvestInputGuideProps {
  mode: 'projection' | 'money-market' | 'tbill' | 'compare';
  activeField?: string;
  startingAmount?: number;
  contribution?: number;
  assumedReturnPct?: number;
  years?: number;
  finalValue?: number;
  realValue?: number;
  feesPct?: number;
  balance?: number;
  apyPct?: number;
  faceValue?: number;
  pricePaid?: number;
}

export default function InvestInputGuide({
  mode,
  activeField,
  startingAmount = 10000,
  contribution = 300,
  assumedReturnPct = 7,
  years = 20,
  finalValue = 196665,
  realValue = 120000,
  feesPct = 0,
  balance = 25000,
  apyPct = 4.5,
  faceValue = 10000,
  pricePaid = 9500,
}: InvestInputGuideProps) {
  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Model:</strong>{' '}
            {mode === 'projection' && 'Compound Wealth Growth, Fee Drag & Inflation Discounting'}
            {mode === 'money-market' && 'Liquid Cash Accrual: APY Compounding & Deposit Schedule'}
            {mode === 'tbill' && 'Treasury Bill Pricing: Discount Rate vs. Coupon Equivalent Yield'}
            {mode === 'compare' && 'Growth Disparity: Long-Term Equities vs. Cash Capital Preservation'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'projection' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Investment Projection Growth Diagram"
            >
              {/* Grid / baseline */}
              <line x1="60" y1="115" x2="640" y2="115" stroke="#94a3b8" strokeWidth="2" />
              <line x1="60" y1="20" x2="60" y2="115" stroke="#94a3b8" strokeWidth="2" />

              {/* Fee drag area below curve */}
              {feesPct > 0 && (
                <path
                  d="M 60 100 Q 280 85, 450 65 T 620 40 L 620 50 Q 450 72, 280 90 T 60 100 Z"
                  fill="#fee2e2"
                  opacity="0.8"
                />
              )}

              {/* Main nominal curve */}
              <path
                d="M 60 100 Q 280 85, 450 55 T 620 30"
                stroke="#16a34a"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Real (inflation-adjusted) curve */}
              <path
                d="M 60 100 Q 280 92, 450 78 T 620 65"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="5,4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Start dot: Starting Amount */}
              <circle
                cx="60"
                cy="100"
                r="6"
                fill={activeField === 'startingAmount' ? '#ea580c' : '#16a34a'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text x="65" y="132" fontSize="10" fontWeight="700" fill="#334155">
                1 Start: {formatMoney(startingAmount)}
              </text>

              {/* Step increments: Periodic contributions */}
              <rect x="230" y="80" width="12" height="12" rx="2" fill="#dcfce7" stroke="#16a34a" />
              <text x="250" y="90" fontSize="9" fontWeight="600" fill="#15803d">
                2 Contrib: +{formatMoney(contribution)}/mo
              </text>

              {/* Slope label: Assumed return */}
              <rect x="360" y="38" width="130" height="20" rx="4" fill="#f0fdf4" stroke="#86efac" />
              <text x="425" y="52" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#166534">
                3 Assumed Return: {assumedReturnPct}%
              </text>

              {/* End dot: Final value */}
              <circle cx="620" cy="30" r="7" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
              <text x="620" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#15803d">
                {formatMoney(finalValue)}
              </text>
              <text x="620" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0284c7">
                Real: {formatMoney(realValue)}
              </text>

              {/* Timeline duration */}
              <text x="350" y="132" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                5 Time Horizon: {years} Years (End-of-Month Compounding)
              </text>
            </svg>
          )}

          {mode === 'money-market' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Money Market Account Cash Accrual Diagram"
            >
              {/* Savings jar outline */}
              <g transform="translate(70, 20)">
                <rect x="25" y="5" width="70" height="10" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                <path
                  d="M 20 20 L 100 20 L 105 100 Q 105 110 90 110 L 30 110 Q 15 110 15 100 Z"
                  fill="#f0fdf4"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                />
                <ellipse cx="60" cy="75" rx="32" ry="18" fill="#dcfce7" />
                <text x="60" y="80" textAnchor="middle" fontSize="10" fontWeight="800" fill="#15803d">
                  {formatMoney(balance)}
                </text>
                <text x="60" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
                  Liquid Principal
                </text>
              </g>

              {/* APY compounding rate indicator */}
              <g transform="translate(230, 35)">
                <circle cx="45" cy="45" r="38" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
                <text x="45" y="42" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1d4ed8">
                  {apyPct}%
                </text>
                <text x="45" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">
                  Annual APY
                </text>
                <text x="45" y="105" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                  Monthly Compounding
                </text>
              </g>

              {/* Arrow and growth */}
              <path d="M 340 75 L 430 75" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow)" />
              <polyline points="420,68 432,75 420,82" fill="none" stroke="#64748b" strokeWidth="3" />

              {/* Result card */}
              <g transform="translate(450, 25)">
                <rect x="10" y="10" width="190" height="85" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="25" y="35" fontSize="10" fontWeight="700" fill="#475569">
                  Zero Volatility Cash Return
                </text>
                <text x="25" y="58" fontSize="14" fontWeight="800" fill="#047857">
                  +{(apyPct).toFixed(2)}% Guaranteed Yield
                </text>
                <text x="25" y="80" fontSize="9.5" fill="#64748b">
                  Subject to FDIC / NCUA insurance limits
                </text>
              </g>
            </svg>
          )}

          {mode === 'tbill' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Treasury Bill Discount Pricing Diagram"
            >
              {/* Treasury Bill security note */}
              <g transform="translate(50, 18)">
                <rect x="10" y="10" width="230" height="95" rx="5" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                <rect x="15" y="15" width="220" height="85" rx="3" fill="#ffffff" stroke="#94a3b8" strokeDasharray="3 3" />
                <text x="125" y="35" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1e293b" letterSpacing="1">
                  UNITED STATES TREASURY BILL
                </text>
                <text x="35" y="62" fontSize="9" fontWeight="600" fill="#64748b">
                  Purchase Price (Discount):
                </text>
                <text x="35" y="82" fontSize="13" fontWeight="800" fill="#0369a1">
                  {formatMoney(pricePaid)}
                </text>
                <text x="125" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
                  Issued at a Discount to Par
                </text>
              </g>

              {/* Maturity arrow */}
              <g transform="translate(305, 55)">
                <path d="M 10 15 L 75 15" stroke="#0284c7" strokeWidth="3" />
                <polyline points="68,8 78,15 68,22" fill="none" stroke="#0284c7" strokeWidth="3" />
                <text x="42" y="35" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0369a1">
                  Days to Maturity
                </text>
              </g>

              {/* Full Face Value at Par */}
              <g transform="translate(410, 18)">
                <rect x="10" y="10" width="230" height="95" rx="5" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                <text x="125" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803d">
                  Maturity Redemption (Par)
                </text>
                <text x="125" y="68" textAnchor="middle" fontSize="18" fontWeight="800" fill="#166534">
                  {formatMoney(faceValue)}
                </text>
                <text x="125" y="88" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#15803d">
                  Backed by the U.S. Government
                </text>
                <text x="125" y="125" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
                  Spread = Full Interest Earned
                </text>
              </g>
            </svg>
          )}

          {mode === 'compare' && (
            <svg
              className={styles.svg}
              viewBox="0 0 700 145"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Stock Assumed Growth vs Cash Comparison Diagram"
            >
              <line x1="60" y1="115" x2="640" y2="115" stroke="#94a3b8" strokeWidth="2" />
              <line x1="60" y1="20" x2="60" y2="115" stroke="#94a3b8" strokeWidth="2" />

              {/* Stock curve (exponential) */}
              <path
                d="M 60 105 Q 260 90, 420 55 T 620 25"
                stroke="#16a34a"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Cash curve (linear slope) */}
              <path
                d="M 60 105 Q 260 98, 420 85 T 620 70"
                stroke="#0284c7"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />

              {/* Labels */}
              <circle cx="620" cy="25" r="6" fill="#16a34a" />
              <text x="615" y="18" textAnchor="end" fontSize="10.5" fontWeight="800" fill="#166534">
                Assumed Equity Growth (~7%)
              </text>

              <circle cx="620" cy="70" r="6" fill="#0284c7" />
              <text x="615" y="88" textAnchor="end" fontSize="10.5" fontWeight="800" fill="#0369a1">
                Cash / Money Market (~4.5%)
              </text>

              {/* Divergence gap banner */}
              <rect x="250" y="32" width="180" height="22" rx="4" fill="#eff6ff" stroke="#93c5fd" />
              <text x="340" y="47" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1e40af">
                Long-Term Compounding Divergence
              </text>

              <text x="350" y="132" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                Identical Deposits &amp; Horizon: Higher Assumed Growth vs. Low Risk Cash
              </text>
            </svg>
          )}
        </div>
      </details>
    </div>
  );
}
