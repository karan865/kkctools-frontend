'use client';

import React, { useState, useMemo, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import TabSlider from '@/components/tool/shared/TabSlider';
import FeeInputGuide from './FeeInputGuide';
import {
  calculateSaleFee,
  calculateGrossUp,
  calculateMonthlyFees,
  calculatePlanBreakEven,
  calculateSurcharge,
  comparePresets,
} from '@/lib/processing-fee-engine';
import { VERIFIED_PROCESSOR_PRESETS, ProcessorPreset } from '@/content/processing-fee-presets';
import styles from './ProcessingFeeCalculator.module.css';

type Mode = 'fee' | 'gross-up' | 'compare' | 'monthly';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'fee', label: 'Fee on a Sale' },
  { id: 'gross-up', label: 'Charge to Receive' },
  { id: 'compare', label: 'Compare Processors' },
  { id: 'monthly', label: 'Monthly Volume & Plans' },
];

export default function ProcessingFeeCalculator() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Mode) || 'fee';
  const activeTab: Mode = ['fee', 'gross-up', 'compare', 'monthly'].includes(initialTab)
    ? initialTab
    : 'fee';

  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  // Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('custom');

  // Transaction Inputs
  const [saleAmount, setSaleAmount] = useState<number>(100);
  const [ratePct, setRatePct] = useState<number>(2.9);
  const [fixedFee, setFixedFee] = useState<number>(0.30);
  const [isInternational, setIsInternational] = useState<boolean>(false);
  const [isCurrencyConversion, setIsCurrencyConversion] = useState<boolean>(false);

  // Gross-Up Tab Target Net
  const [targetNet, setTargetNet] = useState<number>(100);

  // Monthly Volume Inputs
  const [txPerMonth, setTxPerMonth] = useState<number>(200);
  const [avgTicket, setAvgTicket] = useState<number>(100);
  const [monthlySubscriptionFee, setMonthlySubscriptionFee] = useState<number>(0);

  // Plan Comparison Inputs
  const [planDiscountPct, setPlanDiscountPct] = useState<number>(2.5);
  const [planDiscountFixed, setPlanDiscountFixed] = useState<number>(0.15);
  const [planMonthlyCost, setPlanMonthlyCost] = useState<number>(49);

  const baseId = useId();

  // Tab change handler with URL sync
  const handleTabChange = (tabId: Mode) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Preset Change Handler
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') {
      // keep current or reset to custom standard
      return;
    }
    const found = VERIFIED_PROCESSOR_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setRatePct(found.pct);
      setFixedFee(found.fixed);
      setMonthlySubscriptionFee(found.monthlyFee);
    }
  };

  const intlRate = isInternational ? 1.5 : 0;
  const fxRate = isCurrencyConversion ? 1.0 : 0;

  // 1. Fee Calculation on Sale
  const saleResult = useMemo(() => {
    return calculateSaleFee(saleAmount, ratePct, fixedFee, intlRate, fxRate);
  }, [saleAmount, ratePct, fixedFee, intlRate, fxRate]);

  // 2. Gross-up Calculation
  const grossUpResult = useMemo(() => {
    return calculateGrossUp(targetNet, ratePct, fixedFee, intlRate, fxRate);
  }, [targetNet, ratePct, fixedFee, intlRate, fxRate]);

  const grossUpFee = useMemo(() => {
    if (grossUpResult === null || grossUpResult <= 0) {
      return calculateSaleFee(0, ratePct, fixedFee, intlRate, fxRate);
    }
    return calculateSaleFee(grossUpResult, ratePct, fixedFee, intlRate, fxRate);
  }, [grossUpResult, ratePct, fixedFee, intlRate, fxRate]);

  // Surcharge helper
  const surchargeResult = useMemo(() => {
    return calculateSurcharge(saleAmount, ratePct, fixedFee);
  }, [saleAmount, ratePct, fixedFee]);

  // 3. Monthly Volume Calculation
  const monthlyResult = useMemo(() => {
    return calculateMonthlyFees(
      avgTicket,
      txPerMonth,
      ratePct,
      fixedFee,
      monthlySubscriptionFee,
      intlRate,
      fxRate
    );
  }, [avgTicket, txPerMonth, ratePct, fixedFee, monthlySubscriptionFee, intlRate, fxRate]);

  // Plan break-even calculation
  const planBreakEven = useMemo(() => {
    return calculatePlanBreakEven(
      ratePct,
      fixedFee,
      planDiscountPct,
      planDiscountFixed,
      planMonthlyCost,
      avgTicket
    );
  }, [ratePct, fixedFee, planDiscountPct, planDiscountFixed, planMonthlyCost, avgTicket]);

  // 4. Comparison rows across all verified presets + Custom
  const comparisonRows = useMemo(() => {
    const customPreset: ProcessorPreset = {
      id: 'custom-active',
      provider: 'Current Inputs',
      planName: 'Custom Rate',
      type: 'Your Entered Rate',
      pct: ratePct,
      fixed: fixedFee,
      monthlyFee: monthlySubscriptionFee,
      currency: 'USD',
      sourceUrl: '',
      checked: '2026-11-20',
      notes: 'User custom entered rates',
    };
    return comparePresets([customPreset, ...VERIFIED_PROCESSOR_PRESETS], saleAmount, txPerMonth, avgTicket);
  }, [saleAmount, txPerMonth, avgTicket, ratePct, fixedFee, monthlySubscriptionFee]);

  // Helpers
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleCopySummary = () => {
    let summary = '';
    if (activeTab === 'fee') {
      summary = `At ${ratePct}% + $${fixedFee.toFixed(2)}, a ${formatMoney(saleAmount)} card sale costs ${formatMoney(saleResult.fee)} in fees (${saleResult.effectivePct}% effective), so you receive ${formatMoney(saleResult.net)}.`;
    } else if (activeTab === 'gross-up') {
      summary = `To receive a net payout of ${formatMoney(targetNet)} after ${ratePct}% + $${fixedFee.toFixed(2)} card fees, charge the customer ${formatMoney(grossUpResult || 0)}.`;
    } else if (activeTab === 'compare') {
      const cheapest = comparisonRows.find((r) => r.isCheapest);
      summary = `For a ${formatMoney(saleAmount)} sale with ${txPerMonth} monthly transactions, ${cheapest?.provider} (${cheapest?.type}) has the lowest estimated cost at ${formatMoney(cheapest?.monthlyCost || 0)}/mo.`;
    } else {
      summary = `At ${txPerMonth} transactions/mo averaging ${formatMoney(avgTicket)}, total volume is ${formatMoney(monthlyResult.monthlyVolume)}. Processing fees total ${formatMoney(monthlyResult.totalMonthlyFees)}/mo (${formatMoney(monthlyResult.annualFees)}/yr).`;
    }

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.wrap}>
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={handleTabChange}
        ariaLabel="Card processing fee calculation modes"
      />

      <FeeInputGuide
        mode={activeTab}
        activeField={activeField}
        saleAmount={activeTab === 'gross-up' ? targetNet : saleAmount}
        ratePct={ratePct}
        fixedFee={fixedFee}
        feeAmount={saleResult.fee}
        netAmount={saleResult.net}
        grossUpAmount={grossUpResult || 0}
        monthlyVolume={monthlyResult.monthlyVolume}
        txCount={txPerMonth}
      />

      {/* TAB 1: FEE ON A SALE */}
      {activeTab === 'fee' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Sale & Rate Settings</h3>
                  <p className={styles.cardSubtitle}>Choose an official processor preset or enter custom rates</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-sale`} className={styles.label}>
                    Sale Amount
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-sale`}
                      type="number"
                      min="0.01"
                      step="5"
                      value={saleAmount || ''}
                      onChange={(e) => setSaleAmount(Number(e.target.value))}
                      onFocus={() => setActiveField('saleAmount')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-preset`} className={styles.label}>
                    Processor Preset
                  </label>
                  <select
                    id={`${baseId}-preset`}
                    value={selectedPresetId}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className={styles.select}
                  >
                    <option value="custom">Custom Rate (% + fixed fee)</option>
                    {VERIFIED_PROCESSOR_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.provider} — {p.type} ({p.pct}% + ${p.fixed.toFixed(2)}{p.monthlyFee ? `, $${p.monthlyFee}/mo` : ''})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-pct`} className={styles.label}>
                    Percentage Fee (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-pct`}
                      type="number"
                      min="0"
                      step="0.05"
                      value={ratePct || ''}
                      onChange={(e) => {
                        setSelectedPresetId('custom');
                        setRatePct(Number(e.target.value));
                      }}
                      onFocus={() => setActiveField('rate')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-fixed`} className={styles.label}>
                    Fixed Fee per Transaction ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-fixed`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={fixedFee || ''}
                      onChange={(e) => {
                        setSelectedPresetId('custom');
                        setFixedFee(Number(e.target.value));
                      }}
                      onFocus={() => setActiveField('fixed')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={isInternational}
                    onChange={(e) => setIsInternational(e.target.checked)}
                  />
                  <span>International card fee (+1.5% cross-border assessment)</span>
                </label>
                <label className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={isCurrencyConversion}
                    onChange={(e) => setIsCurrencyConversion(e.target.checked)}
                  />
                  <span>Currency conversion fee (+1.0% foreign exchange spread)</span>
                </label>
              </div>
            </div>

            {/* Freshness box */}
            <div className={styles.freshnessBox}>
              <div>
                <strong>Official Pricing Notice:</strong> Presets reflect verified standard US pricing as of November 2026.
              </div>
              <div>
                Always confirm your contract tier directly on{' '}
                <a href="https://squareup.com/us/en/pricing" target="_blank" rel="noopener noreferrer" className={styles.freshnessLink}>
                  Square Pricing
                </a>
                ,{' '}
                <a href="https://stripe.com/pricing" target="_blank" rel="noopener noreferrer" className={styles.freshnessLink}>
                  Stripe Pricing
                </a>
                , or{' '}
                <a href="https://www.paypal.com/us/business/pricing" target="_blank" rel="noopener noreferrer" className={styles.freshnessLink}>
                  PayPal Merchant Fees
                </a>
                .
              </div>
            </div>
          </div>

          <div className={styles.results}>
            {/* Hero Result Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Net Amount Received</span>
              <p className={styles.heroValue}>{formatMoney(saleResult.net)}</p>
              <p className={styles.heroSub}>
                Fee deducted: {formatMoney(saleResult.fee)} ({saleResult.effectivePct}% effective rate)
              </p>
            </div>

            {/* High Contrast Light Mint Summary Banner */}
            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                At {ratePct}% + ${fixedFee.toFixed(2)}, a <strong>{formatMoney(saleAmount)}</strong> card sale costs{' '}
                <strong>{formatMoney(saleResult.fee)}</strong> in fees, so you receive{' '}
                <strong>{formatMoney(saleResult.net)}</strong>. To receive a full {formatMoney(saleAmount)}, you would
                need to charge {formatMoney(calculateGrossUp(saleAmount, ratePct, fixedFee, intlRate, fxRate) || 0)}.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Total Fee</span>
                <span className={styles.metricValue} style={{ color: '#dc2626' }}>
                  {formatMoney(saleResult.fee)}
                </span>
                <span className={styles.metricSub}>Deducted at settlement</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Percentage Cut</span>
                <span className={styles.metricValue}>{formatMoney(saleResult.percentageCut)}</span>
                <span className={styles.metricSub}>{ratePct}% of sale</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Fixed Fee</span>
                <span className={styles.metricValue}>${fixedFee.toFixed(2)}</span>
                <span className={styles.metricSub}>Per transaction</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Effective Rate</span>
                <span className={styles.metricValue}>{saleResult.effectivePct}%</span>
                <span className={styles.metricSub}>Fee ÷ Sale Amount</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>International / FX</span>
                <span className={styles.metricValue}>{formatMoney(saleResult.intlCut)}</span>
                <span className={styles.metricSub}>
                  {intlRate + fxRate > 0 ? `+${(intlRate + fxRate).toFixed(1)}%` : 'None applied'}
                </span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Net Retention</span>
                <span className={styles.metricValue} style={{ color: '#10b981' }}>
                  {saleAmount > 0 ? ((saleResult.net / saleAmount) * 100).toFixed(1) : 0}%
                </span>
                <span className={styles.metricSub}>Of customer charge</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHARGE TO RECEIVE (GROSS-UP) */}
      {activeTab === 'gross-up' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>🔄</span>
                <div>
                  <h3 className={styles.cardTitle}>Target Net Amount</h3>
                  <p className={styles.cardSubtitle}>How much do you want deposited in your bank account?</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-target-net`} className={styles.label}>
                    Target Net Amount Desired
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-target-net`}
                      type="number"
                      min="1"
                      step="5"
                      value={targetNet || ''}
                      onChange={(e) => setTargetNet(Number(e.target.value))}
                      onFocus={() => setActiveField('targetNet')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-preset-gu`} className={styles.label}>
                    Processor Preset
                  </label>
                  <select
                    id={`${baseId}-preset-gu`}
                    value={selectedPresetId}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className={styles.select}
                  >
                    <option value="custom">Custom Rate (% + fixed fee)</option>
                    {VERIFIED_PROCESSOR_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.provider} — {p.type} ({p.pct}% + ${p.fixed.toFixed(2)}{p.monthlyFee ? `, $${p.monthlyFee}/mo` : ''})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-pct-gu`} className={styles.label}>
                    Percentage Fee (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-pct-gu`}
                      type="number"
                      min="0"
                      step="0.05"
                      value={ratePct || ''}
                      onChange={(e) => {
                        setSelectedPresetId('custom');
                        setRatePct(Number(e.target.value));
                      }}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-fixed-gu`} className={styles.label}>
                    Fixed Fee ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-fixed-gu`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={fixedFee || ''}
                      onChange={(e) => {
                        setSelectedPresetId('custom');
                        setFixedFee(Number(e.target.value));
                      }}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Surcharge Notice Card */}
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Surcharge to cover the fee</h4>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.375rem', lineHeight: '1.5' }}>
                On this ticket, a surcharge of <strong>{surchargeResult.appliedSurchargePct}% ({formatMoney(surchargeResult.surchargeAmount)})</strong>{' '}
                would offset the processing fee. Whether you may surcharge, how much, and on which cards depends on card-network
                rules, your processor&rsquo;s terms and local law, so check them before adding one.
              </p>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Total Amount to Charge</span>
              <p className={styles.heroValue}>{formatMoney(grossUpResult || 0)}</p>
              <p className={styles.heroSub}>
                After {formatMoney(grossUpFee.fee)} in fees is deducted, exactly {formatMoney(targetNet)} remains in your
                account.
              </p>
            </div>

            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                To receive a net payout of <strong>{formatMoney(targetNet)}</strong> after paying a {ratePct}% + $
                {fixedFee.toFixed(2)} processing fee, you must invoice or bill the customer{' '}
                <strong>{formatMoney(grossUpResult || 0)}</strong>. The processor will collect {formatMoney(grossUpFee.fee)},
                leaving you with exactly {formatMoney(targetNet)}.
              </p>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>You Want Net</span>
                <span className={styles.metricValue} style={{ color: '#10b981' }}>
                  {formatMoney(targetNet)}
                </span>
                <span className={styles.metricSub}>Your take-home</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>You Must Bill</span>
                <span className={styles.metricValue}>{formatMoney(grossUpResult || 0)}</span>
                <span className={styles.metricSub}>Customer invoice</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Processor Deducts</span>
                <span className={styles.metricValue} style={{ color: '#dc2626' }}>
                  {formatMoney(grossUpFee.fee)}
                </span>
                <span className={styles.metricSub}>{grossUpFee.effectivePct}% effective</span>
              </div>
            </div>

            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPARE PROCESSORS */}
      {activeTab === 'compare' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>⚖️</span>
                <div>
                  <h3 className={styles.cardTitle}>Comparison Benchmark</h3>
                  <p className={styles.cardSubtitle}>Compare transaction costs across providers for the same sale</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-cmp-sale`} className={styles.label}>
                    Single Transaction Size
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-cmp-sale`}
                      type="number"
                      min="1"
                      step="10"
                      value={saleAmount || ''}
                      onChange={(e) => setSaleAmount(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-cmp-tx`} className={styles.label}>
                    Monthly Transaction Count
                  </label>
                  <input
                    id={`${baseId}-cmp-tx`}
                    type="number"
                    min="1"
                    step="50"
                    value={txPerMonth || ''}
                    onChange={(e) => setTxPerMonth(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.freshnessBox}>
              <div>
                <strong>Independent Rate Verification:</strong> Presets reflect published standard rates verified directly
                from official provider documentation.
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>
                Side-by-Side Comparison for {formatMoney(saleAmount)} Sale ({txPerMonth} tx/mo)
              </h4>
              <p className={styles.cardSubtitle} style={{ marginTop: '0.25rem' }}>
                Sorted by lowest total monthly cost. Green highlight indicates the most economical option for this volume.
              </p>

              <div className={styles.tableWrap} style={{ marginTop: '0.875rem' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Provider & Type</th>
                      <th>Contract Rate</th>
                      <th className={styles.numCell}>Fee on {formatMoney(saleAmount)}</th>
                      <th className={styles.numCell}>Net Received</th>
                      <th className={styles.numCell}>Monthly Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.id} className={row.isCheapest ? styles.cheapestRow : ''}>
                        <td>
                          <strong>{row.provider}</strong>
                          {row.isCheapest && <span className={styles.cheapestBadge}>Lowest Cost</span>}
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted, #64748b)' }}>{row.type}</div>
                        </td>
                        <td>{row.rateLabel}</td>
                        <td className={styles.numCell} style={{ color: '#dc2626' }}>
                          {formatMoney(row.saleFee)}
                        </td>
                        <td className={styles.numCell} style={{ color: '#10b981' }}>
                          {formatMoney(row.saleNet)}
                        </td>
                        <td className={styles.numCell}>
                          <strong>{formatMoney(row.monthlyCost)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MONTHLY VOLUME & PLANS */}
      {activeTab === 'monthly' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>📈</span>
                <div>
                  <h3 className={styles.cardTitle}>Monthly Volume Profile</h3>
                  <p className={styles.cardSubtitle}>Model your business transaction volume and overhead</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-mo-avg`} className={styles.label}>
                    Average Ticket Size
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-mo-avg`}
                      type="number"
                      min="1"
                      step="5"
                      value={avgTicket || ''}
                      onChange={(e) => setAvgTicket(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-mo-tx`} className={styles.label}>
                    Transactions per Month
                  </label>
                  <input
                    id={`${baseId}-mo-tx`}
                    type="number"
                    min="1"
                    step="50"
                    value={txPerMonth || ''}
                    onChange={(e) => setTxPerMonth(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-mo-fee`} className={styles.label}>
                    Monthly Software / POS Fee ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-mo-fee`}
                      type="number"
                      min="0"
                      step="5"
                      value={monthlySubscriptionFee || ''}
                      onChange={(e) => setMonthlySubscriptionFee(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-mo-rate`} className={styles.label}>
                    Standard Processing Rate
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-mo-rate`}
                      type="number"
                      min="0"
                      step="0.05"
                      value={ratePct || ''}
                      onChange={(e) => setRatePct(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Break-Even Evaluation Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>💡</span>
                <div>
                  <h3 className={styles.cardTitle}>Paid Plan Break-Even Analyzer</h3>
                  <p className={styles.cardSubtitle}>e.g., Square Plus ($49/mo, 2.5% vs 2.6%)</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-plan-cost`} className={styles.label}>
                    Plan Monthly Subscription
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-plan-cost`}
                      type="number"
                      min="0"
                      step="5"
                      value={planMonthlyCost || ''}
                      onChange={(e) => setPlanMonthlyCost(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-plan-pct`} className={styles.label}>
                    Discounted Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-plan-pct`}
                      type="number"
                      min="0"
                      step="0.05"
                      value={planDiscountPct || ''}
                      onChange={(e) => setPlanDiscountPct(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-plan-fixed`} className={styles.label}>
                    Plan Fixed Fee ($)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-plan-fixed`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={planDiscountFixed || ''}
                      onChange={(e) => setPlanDiscountFixed(Number(e.target.value))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroLabel}>Total Monthly Processing Fees</span>
              <p className={styles.heroValue}>{formatMoney(monthlyResult.totalMonthlyFees)}</p>
              <p className={styles.heroSub}>
                Annual fees: {formatMoney(monthlyResult.annualFees)} ({monthlyResult.effectiveRatePct}% of sales)
              </p>
            </div>

            <div className={styles.summaryBanner}>
              <div className={styles.summaryIcon}>✓</div>
              <p className={styles.summaryText}>
                Processing <strong>{txPerMonth} transactions</strong> per month averaging{' '}
                <strong>{formatMoney(avgTicket)}</strong> generates <strong>{formatMoney(monthlyResult.monthlyVolume)}</strong>{' '}
                in gross sales. Card processing fees consume <strong>{formatMoney(monthlyResult.totalMonthlyFees)}</strong>{' '}
                monthly, leaving a net bank settlement of <strong>{formatMoney(monthlyResult.netMonthly)}</strong>.
              </p>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Monthly Volume</span>
                <span className={styles.metricValue}>{formatMoney(monthlyResult.monthlyVolume)}</span>
                <span className={styles.metricSub}>Gross customer sales</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Net Deposited</span>
                <span className={styles.metricValue} style={{ color: '#10b981' }}>
                  {formatMoney(monthlyResult.netMonthly)}
                </span>
                <span className={styles.metricSub}>After fees</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Per Transaction Fee</span>
                <span className={styles.metricValue}>{formatMoney(monthlyResult.transactionFees / Math.max(1, txPerMonth))}</span>
                <span className={styles.metricSub}>Average fee</span>
              </div>
            </div>

            {/* Plan Break-Even Result Box */}
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Plan Upgrade Decision</h4>
              {planBreakEven.isViable ? (
                <p className={styles.cardSubtitle} style={{ marginTop: '0.375rem', lineHeight: '1.5' }}>
                  The upgraded plan saves <strong>${planBreakEven.savingsPerTx.toFixed(2)}</strong> per ticket. To recoup the{' '}
                  <strong>${planMonthlyCost}/month</strong> software fee, you need at least{' '}
                  <strong>{planBreakEven.breakEvenTx} transactions</strong> ({formatMoney(planBreakEven.breakEvenVolume || 0)} monthly
                  sales). At your current volume of {txPerMonth} transactions, the paid plan is{' '}
                  <strong>{txPerMonth >= (planBreakEven.breakEvenTx || 0) ? 'cost-effective ✅' : 'not yet worth it ❌'}</strong>.
                </p>
              ) : (
                <p className={styles.cardSubtitle} style={{ marginTop: '0.375rem', lineHeight: '1.5' }}>
                  The discounted rate does not offer savings over your current rate structure for this ticket size.
                </p>
              )}
            </div>

            <div className={styles.actionBar}>
              <button type="button" onClick={handleCopySummary} className={`${styles.btn} ${styles.btnSecondary}`}>
                {copied ? '✓ Copied Summary' : '📋 Copy Summary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
