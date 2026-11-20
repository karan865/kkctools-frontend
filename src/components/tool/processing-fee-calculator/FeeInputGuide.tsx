import React from 'react';
import styles from './FeeInputGuide.module.css';

interface FeeInputGuideProps {
  mode: 'fee' | 'gross-up' | 'compare' | 'monthly';
  activeField?: string;
  saleAmount?: number;
  ratePct?: number;
  fixedFee?: number;
  feeAmount?: number;
  netAmount?: number;
  grossUpAmount?: number;
  monthlyVolume?: number;
  txCount?: number;
}

export default function FeeInputGuide({
  mode,
  activeField,
  saleAmount = 100,
  ratePct = 2.9,
  fixedFee = 0.30,
  feeAmount = 3.20,
  netAmount = 96.80,
  grossUpAmount = 103.30,
  monthlyVolume = 20000,
  txCount = 200,
}: FeeInputGuideProps) {
  const formatMoney = (val: number) => `$${val.toFixed(2)}`;

  return (
    <div className={styles.container}>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>
            <span className={styles.iconPulse}>ℹ</span>
            <strong>Visual Model:</strong>{' '}
            {mode === 'fee' && 'Payment Gateway Transaction Flow'}
            {mode === 'gross-up' && 'Reverse Pricing (Charge-to-Receive) Formula'}
            {mode === 'compare' && 'Processor Rate Spread & Net Proceeds'}
            {mode === 'monthly' && 'Monthly Volume & Merchant Account Overhead'}
          </span>
          <span className={styles.summaryHint}>Interactive Guide</span>
        </summary>

        <div className={styles.diagramWrap}>
          {mode === 'fee' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Payment Gateway Processing Flow Diagram"
            >
              {/* Box 1: Customer Card Swipe */}
              <rect
                x="30"
                y="30"
                width="140"
                height="68"
                rx="8"
                fill={activeField === 'saleAmount' ? '#fef3c7' : '#eff6ff'}
                stroke={activeField === 'saleAmount' ? '#d97706' : '#2563eb'}
                strokeWidth="2"
              />
              <text x="100" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e3a8a">
                1 Customer Pays
              </text>
              <text x="100" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1e40af">
                {formatMoney(saleAmount)}
              </text>

              {/* Connecting Arrow */}
              <line x1="175" y1="64" x2="225" y2="64" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="225,64 217,60 217,68" fill="#94a3b8" />

              {/* Box 2: Payment Processor Cut */}
              <rect
                x="235"
                y="20"
                width="210"
                height="88"
                rx="8"
                fill={activeField === 'rate' || activeField === 'fixed' ? '#fee2e2' : '#f8fafc'}
                stroke={activeField === 'rate' || activeField === 'fixed' ? '#dc2626' : '#cbd5e1'}
                strokeWidth="2"
              />
              <text x="340" y="42" textAnchor="middle" fontSize="10" fontWeight="700" fill="#991b1b">
                2 Processor Fees (−{formatMoney(feeAmount)})
              </text>
              <text x="340" y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                {ratePct}% + ${fixedFee.toFixed(2)} fixed
              </text>
              <rect x="250" y="74" width="180" height="20" rx="4" fill="#fee2e2" />
              <text x="340" y="88" textAnchor="middle" fontSize="9" fontWeight="700" fill="#b91c1c">
                Effective Rate: {saleAmount > 0 ? ((feeAmount / saleAmount) * 100).toFixed(2) : '0'}%
              </text>

              {/* Connecting Arrow */}
              <line x1="450" y1="64" x2="500" y2="64" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="500,64 492,60 492,68" fill="#94a3b8" />

              {/* Box 3: Merchant Bank Account Net */}
              <rect
                x="510"
                y="30"
                width="140"
                height="68"
                rx="8"
                fill="#f0fdf4"
                stroke="#10b981"
                strokeWidth="2"
              />
              <text x="580" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">
                3 Merchant Receives
              </text>
              <text x="580" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill="#047857">
                {formatMoney(netAmount)}
              </text>
            </svg>
          )}

          {mode === 'gross-up' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Gross-Up Reverse Calculation Diagram"
            >
              {/* Target Net Box (Left) */}
              <rect
                x="30"
                y="30"
                width="150"
                height="68"
                rx="8"
                fill={activeField === 'targetNet' ? '#fef3c7' : '#eff6ff'}
                stroke={activeField === 'targetNet' ? '#d97706' : '#2563eb'}
                strokeWidth="2"
              />
              <text x="105" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e3a8a">
                1 Desired Net Payout
              </text>
              <text x="105" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1e40af">
                {formatMoney(saleAmount)}
              </text>

              {/* Reverse Arrow */}
              <line x1="185" y1="64" x2="235" y2="64" stroke="#94a3b8" strokeWidth="2" />
              <polygon points="235,64 227,60 227,68" fill="#94a3b8" />

              {/* Formula Bridge Box */}
              <rect x="245" y="24" width="200" height="80" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="345" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                2 Gross-Up Equation
              </text>
              <text x="345" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
                (Target + Fixed) ÷ (1 − Pct)
              </text>
              <text x="345" y="86" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
                ({formatMoney(saleAmount)} + ${fixedFee.toFixed(2)}) ÷ (1 − {(ratePct / 100).toFixed(3)})
              </text>

              {/* Reverse Arrow */}
              <line x1="450" y1="64" x2="500" y2="64" stroke="#94a3b8" strokeWidth="2" />
              <polygon points="500,64 492,60 492,68" fill="#94a3b8" />

              {/* Charge Customer Box (Right) */}
              <rect x="510" y="30" width="140" height="68" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
              <text x="580" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">
                3 Charge Customer
              </text>
              <text x="580" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill="#047857">
                {formatMoney(grossUpAmount)}
              </text>
            </svg>
          )}

          {mode === 'compare' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Provider Comparison Diagram"
            >
              {/* Sale Reference */}
              <rect x="20" y="35" width="120" height="60" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="80" y="58" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                Sale: {formatMoney(saleAmount)}
              </text>
              <text x="80" y="74" textAnchor="middle" fontSize="9" fill="#64748b">
                200 tx / mo
              </text>

              {/* Processor Comparison Bars */}
              <g transform="translate(160, 20)">
                {/* Square */}
                <rect x="0" y="10" width="115" height="75" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="57" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e40af">Square Free</text>
                <text x="57" y="48" textAnchor="middle" fontSize="9" fill="#475569">2.6% + $0.15</text>
                <text x="57" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e3a8a">$2.75 fee</text>

                {/* Stripe */}
                <rect x="125" y="10" width="115" height="75" rx="6" fill="#f0fdf4" stroke="#10b981" strokeWidth="1.5" />
                <text x="182" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46">Stripe</text>
                <text x="182" y="48" textAnchor="middle" fontSize="9" fill="#475569">2.9% + $0.30</text>
                <text x="182" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">$3.20 fee</text>

                {/* PayPal */}
                <rect x="250" y="10" width="115" height="75" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                <text x="307" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400e">PayPal Online</text>
                <text x="307" y="48" textAnchor="middle" fontSize="9" fill="#475569">3.49% + $0.49</text>
                <text x="307" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b45309">$3.98 fee</text>

                {/* Custom */}
                <rect x="375" y="10" width="115" height="75" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
                <text x="432" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">Custom Rate</text>
                <text x="432" y="48" textAnchor="middle" fontSize="9" fill="#475569">{ratePct}% + ${fixedFee.toFixed(2)}</text>
                <text x="432" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">{formatMoney(feeAmount)} fee</text>
              </g>
            </svg>
          )}

          {mode === 'monthly' && (
            <svg
              className={styles.svg}
              viewBox="0 0 680 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Monthly Sales Volume Diagram"
            >
              {/* Stack of Receipts */}
              <rect x="30" y="32" width="150" height="66" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="105" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e3a8a">
                1 Monthly Volume
              </text>
              <text x="105" y="74" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1d4ed8">
                {formatMoney(monthlyVolume)}
              </text>
              <text x="105" y="90" textAnchor="middle" fontSize="9" fill="#475569">
                {txCount} transactions @ {formatMoney(saleAmount)}
              </text>

              {/* Minus arrow */}
              <line x1="185" y1="65" x2="235" y2="65" stroke="#94a3b8" strokeWidth="2" />
              <polygon points="235,65 227,61 227,69" fill="#94a3b8" />

              {/* Total Monthly Fees */}
              <rect x="245" y="24" width="200" height="82" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="345" y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="#991b1b">
                2 Total Monthly Fees
              </text>
              <text x="345" y="70" textAnchor="middle" fontSize="16" fontWeight="800" fill="#b91c1c">
                −{formatMoney(feeAmount * txCount)}
              </text>
              <text x="345" y="90" textAnchor="middle" fontSize="9" fill="#7f1d1d">
                {formatMoney((feeAmount * txCount) * 12)} / year
              </text>

              {/* Equal arrow */}
              <line x1="450" y1="65" x2="500" y2="65" stroke="#94a3b8" strokeWidth="2" />
              <polygon points="500,65 492,61 492,69" fill="#94a3b8" />

              {/* Net Merchant Bank Deposit */}
              <rect x="510" y="32" width="140" height="66" rx="6" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
              <text x="580" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">
                3 Net Deposited
              </text>
              <text x="580" y="74" textAnchor="middle" fontSize="16" fontWeight="800" fill="#047857">
                {formatMoney(monthlyVolume - (feeAmount * txCount))}
              </text>
            </svg>
          )}
        </div>
      </details>
    </div>
  );
}
