import React from 'react';
import styles from './CardPayoffInputGuide.module.css';

interface CardPayoffInputGuideProps {
  mode: 'payoff' | 'minimum' | 'multi-card' | 'transfer' | 'converter';
  activeField?: string;
  balance?: number;
  aprPct?: number;
  monthlyPayment?: number;
  months?: number;
  totalInterest?: number;
  debtFreeDateText?: string;
}

export default function CardPayoffInputGuide({
  mode,
  activeField,
  balance = 5000,
  aprPct = 22,
  monthlyPayment = 200,
  months = 34,
  totalInterest = 1750,
  debtFreeDateText = '34 Months',
}: CardPayoffInputGuideProps) {
  const formatMoney = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Model:</strong>{' '}
            {mode === 'payoff' && 'Balance Amortization & Principal vs. Interest Split'}
            {mode === 'minimum' && 'The Minimum Payment Trap: Shrinking Principal Reduction'}
            {mode === 'multi-card' && 'Multi-Card Payoff Priority: Avalanche vs. Snowball'}
            {mode === 'transfer' && '0% Intro Balance Transfer Bridge & Fee Breakeven'}
            {mode === 'converter' && 'APR to Daily & Monthly Periodic Rate Translation'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'payoff' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Credit Card Payoff Amortization Diagram"
            >
              {/* Credit Card Graphic (Left) */}
              <g transform="translate(30, 20)">
                <rect
                  x="0"
                  y="0"
                  width="150"
                  height="95"
                  rx="8"
                  fill={activeField === 'balance' || activeField === 'apr' ? '#1e293b' : '#0f172a'}
                  stroke={activeField === 'balance' ? '#f59e0b' : '#334155'}
                  strokeWidth="2"
                />
                {/* Chip */}
                <rect x="18" y="18" width="22" height="16" rx="3" fill="#fbbf24" />
                <line x1="18" y1="26" x2="40" y2="26" stroke="#d97706" strokeWidth="1" />
                {/* Balance & APR text */}
                <text x="18" y="56" fontSize="9" fontWeight="600" fill="#94a3b8">
                  1 Balance
                </text>
                <text x="18" y="72" fontSize="14" fontWeight="800" fill="#ffffff">
                  {formatMoney(balance)}
                </text>
                <text x="132" y="72" textAnchor="end" fontSize="11" fontWeight="700" fill="#38bdf8">
                  2 {aprPct}% APR
                </text>
              </g>

              {/* Connecting Payment Arc */}
              <path d="M 190 68 Q 230 40, 260 55" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              <polygon points="260,55 252,50 254,58" fill="#94a3b8" />

              {/* Monthly Payment Split Bar (Center) */}
              <g transform="translate(265, 25)">
                <rect x="0" y="0" width="230" height="85" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
                  3 Monthly Payment: {formatMoney(monthlyPayment)}
                </text>

                {/* Progress bar representing interest vs principal split */}
                {(() => {
                  const monthlyInterest = (balance * (aprPct / 100)) / 12;
                  const intPct = Math.min(90, Math.max(10, (monthlyInterest / Math.max(1, monthlyPayment)) * 100));
                  const wTotal = 190;
                  const wInt = (intPct / 100) * wTotal;
                  const wPrin = wTotal - wInt;

                  return (
                    <g transform="translate(20, 32)">
                      {/* Red interest segment */}
                      <rect x="0" y="0" width={wInt} height="20" rx="3" fill="#ef4444" />
                      {/* Green principal segment */}
                      <rect x={wInt} y="0" width={wPrin} height="20" rx="3" fill="#10b981" />
                      <text x={wInt / 2} y="13" textAnchor="middle" fontSize="8" fontWeight="800" fill="#ffffff">
                        Interest ~{formatMoney(monthlyInterest)}
                      </text>
                      <text x={wInt + wPrin / 2} y="13" textAnchor="middle" fontSize="8" fontWeight="800" fill="#ffffff">
                        Principal ~{formatMoney(monthlyPayment - monthlyInterest)}
                      </text>
                    </g>
                  );
                })()}

                <text x="115" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
                  Total interest cost: ~{formatMoney(totalInterest)}
                </text>
              </g>

              {/* Connecting Arrow to Debt Free */}
              <line x1="505" y1="68" x2="535" y2="68" stroke="#10b981" strokeWidth="2.5" />
              <polygon points="535,68 527,64 527,72" fill="#10b981" />

              {/* Debt Free Flag Card (Right) */}
              <g transform="translate(545, 20)">
                <rect x="0" y="0" width="105" height="95" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
                <text x="52" y="28" textAnchor="middle" fontSize="16">
                  🏁
                </text>
                <text x="52" y="48" textAnchor="middle" fontSize="9" fontWeight="800" fill="#065f46">
                  DEBT-FREE
                </text>
                <text x="52" y="66" textAnchor="middle" fontSize="13" fontWeight="900" fill="#047857">
                  {months} mos
                </text>
                <text x="52" y="80" textAnchor="middle" fontSize="8" fontWeight="600" fill="#059669">
                  {debtFreeDateText}
                </text>
              </g>
            </svg>
          )}

          {mode === 'minimum' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Minimum Payment Trap Visual Diagram"
            >
              {/* Year 1 vs Year 10 vs Year 19 payment bars */}
              <g transform="translate(40, 20)">
                <rect x="0" y="0" width="180" height="95" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="90" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e40af">
                  Month 1 (Balance {formatMoney(balance)})
                </text>
                <rect x="20" y="38" width="140" height="20" rx="3" fill="#fee2e2" />
                <rect x="20" y="38" width="50" height="20" rx="3" fill="#10b981" />
                <text x="45" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">+$50 Prin</text>
                <text x="110" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#b91c1c">-$92 Int</text>
                <text x="90" y="78" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
                  Payment: ~$142
                </text>
              </g>

              <line x1="230" y1="68" x2="260" y2="68" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="260,68 252,64 252,72" fill="#94a3b8" />

              <g transform="translate(270, 20)">
                <rect x="0" y="0" width="180" height="95" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                <text x="90" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e">
                  Year 10 (Balance ~$1,500)
                </text>
                <rect x="20" y="38" width="140" height="20" rx="3" fill="#fee2e2" />
                <rect x="20" y="38" width="30" height="20" rx="3" fill="#10b981" />
                <text x="35" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">$15</text>
                <text x="100" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#b91c1c">-$28 Int</text>
                <text x="90" y="78" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
                  Payment drops to ~$43
                </text>
              </g>

              <line x1="460" y1="68" x2="490" y2="68" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="490,68 482,64 482,72" fill="#94a3b8" />

              <g transform="translate(500, 20)">
                <rect x="0" y="0" width="140" height="95" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                <text x="70" y="26" textAnchor="middle" fontSize="16">⚠️</text>
                <text x="70" y="44" textAnchor="middle" fontSize="10" fontWeight="800" fill="#991b1b">
                  230 MONTHS
                </text>
                <text x="70" y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b91c1c">
                  ~19.2 Years
                </text>
                <text x="70" y="80" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7f1d1d">
                  $8,100+ Interest
                </text>
              </g>
            </svg>
          )}

          {mode === 'multi-card' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Avalanche vs Snowball Payoff Strategy Diagram"
            >
              {/* Card 1 */}
              <g transform="translate(30, 25)">
                <rect x="0" y="0" width="170" height="85" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="15" y="24" fontSize="10" fontWeight="700" fill="#1e40af">Card A: Store Card</text>
                <text x="15" y="44" fontSize="12" fontWeight="800" fill="#0f172a">$1,500 Balance</text>
                <rect x="15" y="52" width="70" height="18" rx="3" fill="#fee2e2" />
                <text x="50" y="65" textAnchor="middle" fontSize="9" fontWeight="800" fill="#dc2626">28% APR</text>
              </g>

              {/* Card 2 */}
              <g transform="translate(220, 25)">
                <rect x="0" y="0" width="170" height="85" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="15" y="24" fontSize="10" fontWeight="700" fill="#334155">Card B: Bank Card</text>
                <text x="15" y="44" fontSize="12" fontWeight="800" fill="#0f172a">$6,000 Balance</text>
                <rect x="15" y="52" width="70" height="18" rx="3" fill="#fef3c7" />
                <text x="50" y="65" textAnchor="middle" fontSize="9" fontWeight="800" fill="#d97706">24% APR</text>
              </g>

              {/* Strategy Verdict */}
              <g transform="translate(410, 20)">
                <rect x="0" y="0" width="240" height="95" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
                <text x="120" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46">
                  Avalanche vs. Snowball
                </text>
                <text x="15" y="48" fontSize="10" fontWeight="600" fill="#0f172a">
                  • <strong>Avalanche:</strong> Pay 28% APR card first
                </text>
                <text x="15" y="64" fontSize="9" fill="#047857">
                  → Saves the most money in mathematical interest
                </text>
                <text x="15" y="82" fontSize="10" fontWeight="600" fill="#0f172a">
                  • <strong>Snowball:</strong> Pay smallest balance first
                </text>
              </g>
            </svg>
          )}

          {mode === 'transfer' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="0% Balance Transfer Cost Flow Diagram"
            >
              {/* Existing Card */}
              <g transform="translate(40, 25)">
                <rect x="0" y="0" width="180" height="85" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
                <text x="90" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#991b1b">
                  Current High-Interest Card
                </text>
                <text x="90" y="46" textAnchor="middle" fontSize="15" fontWeight="800" fill="#7f1d1d">
                  {formatMoney(balance)} @ {aprPct}% APR
                </text>
                <text x="90" y="68" textAnchor="middle" fontSize="9" fill="#b91c1c">
                  Costs ~$1,280+ in interest
                </text>
              </g>

              {/* Transfer Arrow with Fee */}
              <g transform="translate(235, 45)">
                <line x1="0" y1="20" x2="80" y2="20" stroke="#2563eb" strokeWidth="3" />
                <polygon points="80,20 72,15 72,25" fill="#2563eb" />
                <rect x="10" y="0" width="60" height="18" rx="4" fill="#eff6ff" stroke="#3b82f6" />
                <text x="40" y="12" textAnchor="middle" fontSize="8" fontWeight="800" fill="#1d4ed8">
                  3% Fee ($150)
                </text>
              </g>

              {/* 0% Promo Card */}
              <g transform="translate(330, 25)">
                <rect x="0" y="0" width="180" height="85" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
                <text x="90" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">
                  0% APR Balance Transfer
                </text>
                <text x="90" y="46" textAnchor="middle" fontSize="15" fontWeight="800" fill="#047857">
                  {formatMoney(balance + balance * 0.03)} @ 0%
                </text>
                <text x="90" y="68" textAnchor="middle" fontSize="9" fontWeight="700" fill="#059669">
                  18 Months 0% Interest Window
                </text>
              </g>

              {/* Net Savings Badge */}
              <g transform="translate(530, 30)">
                <circle cx="50" cy="38" r="36" fill="#10b981" />
                <text x="50" y="32" textAnchor="middle" fontSize="9" fontWeight="800" fill="#ffffff">
                  NET SAVES
                </text>
                <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ffffff">
                  $800+
                </text>
              </g>
            </svg>
          )}

          {mode === 'converter' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="APR to Periodic Rates Translation Diagram"
            >
              {/* Stated APR Box */}
              <g transform="translate(40, 25)">
                <rect x="0" y="0" width="160" height="85" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <text x="80" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8">
                  Contract Nominal APR
                </text>
                <text x="80" y="56" textAnchor="middle" fontSize="20" fontWeight="800" fill="#ffffff">
                  {aprPct}%
                </text>
                <text x="80" y="74" textAnchor="middle" fontSize="9" fill="#38bdf8">
                  Annualized stated rate
                </text>
              </g>

              {/* Arrows */}
              <line x1="210" y1="50" x2="250" y2="40" stroke="#94a3b8" strokeWidth="2" />
              <line x1="210" y1="85" x2="250" y2="95" stroke="#94a3b8" strokeWidth="2" />

              {/* Daily and Monthly Periodic Rates */}
              <g transform="translate(260, 15)">
                <rect x="0" y="0" width="200" height="45" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="15" y="18" fontSize="9" fontWeight="700" fill="#1e40af">Daily Periodic Rate (DPR)</text>
                <text x="15" y="34" fontSize="11" fontWeight="800" fill="#1e3a8a">
                  {aprPct}% ÷ 365 = {(aprPct / 365).toFixed(4)}% / day
                </text>
              </g>

              <g transform="translate(260, 75)">
                <rect x="0" y="0" width="200" height="45" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="15" y="18" fontSize="9" fontWeight="700" fill="#334155">Monthly Periodic Rate</text>
                <text x="15" y="34" fontSize="11" fontWeight="800" fill="#0f172a">
                  {aprPct}% ÷ 12 = {(aprPct / 12).toFixed(4)}% / month
                </text>
              </g>

              {/* Effective APY */}
              <g transform="translate(480, 25)">
                <rect x="0" y="0" width="160" height="85" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
                <text x="80" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">
                  Compounded APY
                </text>
                <text x="80" y="56" textAnchor="middle" fontSize="18" fontWeight="800" fill="#047857">
                  {((Math.pow(1 + aprPct / 100 / 365, 365) - 1) * 100).toFixed(2)}%
                </text>
                <text x="80" y="74" textAnchor="middle" fontSize="9" fill="#059669">
                  True annual yield with daily
                </text>
              </g>
            </svg>
          )}
        </div>
      </details>
    </div>
  );
}
