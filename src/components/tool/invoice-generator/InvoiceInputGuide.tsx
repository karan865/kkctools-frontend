'use client';

import React from 'react';
import styles from './InvoiceInputGuide.module.css';

interface InvoiceInputGuideProps {
  activeTab: 'invoice' | 'timesheet' | 'details';
  invoiceNumber: string;
  senderName: string;
  clientName: string;
  itemCount: number;
  totalHours: number;
  subtotal: number;
  balanceDue: number;
  currencySymbol: string;
  roundingIncrement: number;
  roundingMode: string;
}

export default function InvoiceInputGuide({
  activeTab,
  invoiceNumber,
  senderName,
  clientName,
  itemCount,
  totalHours,
  subtotal,
  balanceDue,
  currencySymbol,
  roundingIncrement,
  roundingMode,
}: InvoiceInputGuideProps) {
  const sym = currencySymbol || '$';

  return (
    <div className={styles.guideContainer} aria-label="Visual invoice structure guide">
      <div className={styles.headerRow}>
        <span className={styles.guideTitle}>
          <span>Visual Architecture &amp; Anatomy Guide</span>
          <span className={activeTab === 'timesheet' ? styles.badgeTimesheet : styles.badge}>
            {activeTab === 'timesheet' ? 'Timesheet Flow' : 'Invoice Structure'}
          </span>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--ink-3, #64748b)' }}>
          {activeTab === 'timesheet'
            ? `${roundingIncrement > 0 ? `${roundingIncrement}-min ${roundingMode}` : 'Exact hours'}`
            : `#${invoiceNumber || 'INV-001'} · ${itemCount} items`}
        </span>
      </div>

      <div className={styles.svgWrap}>
        {activeTab === 'timesheet' ? (
          /* Timesheet Diagram */
          <svg
            className={styles.svg}
            viewBox="0 0 460 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Background container */}
            <rect x="5" y="5" width="450" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Step 1: Clock / Time Log */}
            <rect x="20" y="20" width="115" height="80" rx="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
            <circle cx="45" cy="45" r="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <path d="M45 37v8l6 3" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
            <text x="70" y="42" className={styles.zoneValue}>Start → End</text>
            <text x="70" y="54" className={styles.zoneLabel}>or h:mm entry</text>
            <text x="77" y="85" textAnchor="middle" className={styles.zoneNum}>1. Log Time</text>

            {/* Arrow 1 */}
            <path d="M140 60h20m-5-4l5 4-5 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Step 2: Rounding Rules */}
            <rect x="165" y="20" width="125" height="80" rx="6" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
            <rect x="180" y="32" width="95" height="22" rx="4" fill="#f0fdf4" stroke="#86efac" />
            <text x="227" y="47" textAnchor="middle" className={styles.zoneAccent}>
              {roundingIncrement > 0 ? `${roundingIncrement}m ${roundingMode}` : 'Exact (none)'}
            </text>
            <text x="227" y="70" textAnchor="middle" className={styles.zoneLabel}>Decimal Conversion</text>
            <text x="227" y="85" textAnchor="middle" className={styles.zoneNum}>2. Round &amp; Convert</text>

            {/* Arrow 2 */}
            <path d="M295 60h20m-5-4l5 4-5 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Step 3: Rollover to Invoice */}
            <rect x="320" y="20" width="120" height="80" rx="6" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.5" />
            <text x="380" y="42" textAnchor="middle" className={styles.zoneValue}>
              {totalHours.toFixed(2)} Total Hours
            </text>
            <text x="380" y="58" textAnchor="middle" className={styles.zoneAccent}>
              {sym}{subtotal.toFixed(2)}
            </text>
            <text x="380" y="72" textAnchor="middle" className={styles.zoneLabel}>Direct to Invoice</text>
            <text x="380" y="85" textAnchor="middle" className={styles.zoneNum}>3. Invoice Line</text>
          </svg>
        ) : (
          /* Invoice Mini Architecture Paper */
          <svg
            className={styles.svg}
            viewBox="0 0 520 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Sheet outline */}
            <rect x="10" y="5" width="500" height="180" rx="6" className={styles.zonePaper} />

            {/* 1. From (Business details) */}
            <rect x="25" y="15" width="150" height="42" className={styles.zoneBox} />
            <circle cx="37" cy="27" r="7" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="37" y="30" textAnchor="middle" className={styles.zoneNum}>1</text>
            <text x="50" y="27" className={styles.zoneValue}>{senderName || 'Your Business'}</text>
            <text x="50" y="38" className={styles.zoneLabel}>Contact &amp; Tax ID (Local)</text>
            <text x="50" y="49" className={styles.zoneLabel}>Optional Local Logo</text>

            {/* 2. Bill To (Client details) */}
            <rect x="185" y="15" width="140" height="42" className={styles.zoneBox} />
            <circle cx="197" cy="27" r="7" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="197" y="30" textAnchor="middle" className={styles.zoneNum}>2</text>
            <text x="210" y="27" className={styles.zoneValue}>{clientName || 'Bill To Client'}</text>
            <text x="210" y="38" className={styles.zoneLabel}>Name &amp; Company</text>
            <text x="210" y="49" className={styles.zoneLabel}>Address &amp; Email</text>

            {/* 3. Invoice Meta (Dates / Terms) */}
            <rect x="335" y="15" width="160" height="42" className={styles.zoneBox} />
            <circle cx="347" cy="27" r="7" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="347" y="30" textAnchor="middle" className={styles.zoneNum}>3</text>
            <text x="360" y="27" className={styles.zoneValue}>#{invoiceNumber || 'INV-001'}</text>
            <text x="360" y="38" className={styles.zoneLabel}>Issue Date · Due Date</text>
            <text x="360" y="49" className={styles.zoneLabel}>Terms (Net 30) · PO #</text>

            {/* 4. Line Items Table */}
            <rect x="25" y="65" width="470" height="48" className={styles.zoneBoxActive} />
            <circle cx="37" cy="77" r="7" fill="#bbf7d0" stroke="#22c55e" />
            <text x="37" y="80" textAnchor="middle" className={styles.zoneNum}>4</text>
            <text x="50" y="78" className={styles.zoneValue}>Billable Line Items ({itemCount} active)</text>
            <text x="480" y="78" textAnchor="end" className={styles.zoneLabel}>
              {totalHours > 0 ? `${totalHours.toFixed(1)} billable hrs` : 'Hours & Fixed'}
            </text>
            {/* Header row */}
            <line x1="30" y1="84" x2="490" y2="84" stroke="#cbd5e1" strokeWidth="0.8" />
            <text x="35" y="94" className={styles.zoneLabel}>Date · Task Description</text>
            <text x="320" y="94" className={styles.zoneLabel}>Hours/Qty</text>
            <text x="410" y="94" className={styles.zoneLabel}>Rate</text>
            <text x="480" y="94" textAnchor="end" className={styles.zoneValue}>Amount</text>
            {/* Sample row preview */}
            <text x="35" y="106" className={styles.zoneLabel}>Consulting &amp; development</text>
            <text x="320" y="106" className={styles.zoneLabel}>h:mm / dec</text>
            <text x="410" y="106" className={styles.zoneLabel}>$/hr</text>
            <text x="480" y="106" textAnchor="end" className={styles.zoneAccent}>{sym}{subtotal.toFixed(2)}</text>

            {/* 5-7. Totals & Balance Due */}
            <rect x="270" y="120" width="225" height="55" className={styles.zoneBox} />
            <circle cx="282" cy="132" r="7" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="282" y="135" textAnchor="middle" className={styles.zoneNum}>5-7</text>
            <text x="295" y="133" className={styles.zoneLabel}>Subtotal</text>
            <text x="485" y="133" textAnchor="end" className={styles.zoneValue}>{sym}{subtotal.toFixed(2)}</text>
            <text x="295" y="145" className={styles.zoneLabel}>5 Discount · 6 Tax · Shipping</text>
            <line x1="280" y1="151" x2="485" y2="151" stroke="#cbd5e1" strokeWidth="0.8" />
            <text x="285" y="165" className={styles.zoneValue}>7 Balance Due:</text>
            <text x="485" y="165" textAnchor="end" className={styles.zoneAccent} style={{ fontSize: '10px' }}>
              {sym}{balanceDue.toFixed(2)}
            </text>

            {/* 8. Footer Notes & Payment instructions */}
            <rect x="25" y="120" width="235" height="55" className={styles.zoneBox} />
            <circle cx="37" cy="132" r="7" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="37" y="135" textAnchor="middle" className={styles.zoneNum}>8</text>
            <text x="50" y="133" className={styles.zoneValue}>Payment Details &amp; Notes</text>
            <text x="50" y="145" className={styles.zoneLabel}>Bank ACH, Wire, PayPal or Stripe link</text>
            <text x="50" y="157" className={styles.zoneLabel}>Payment terms &amp; late fee policy</text>
            <text x="50" y="167" className={styles.zoneLabel}>Thank you note / instructions</text>
          </svg>
        )}
      </div>

      <div className={styles.legendList}>
        <div className={styles.legendItem}>
          <span className={styles.legendNum}>1</span>
          <span>Your Business Info</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendNum}>2</span>
          <span>Client Details</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendNum}>3</span>
          <span>Dates &amp; Terms</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendNum}>4</span>
          <span>Hours &amp; Rates</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendNum}>5-7</span>
          <span>Tax, Discount &amp; Total</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendNum}>8</span>
          <span>Payment Instructions</span>
        </div>
      </div>
    </div>
  );
}
