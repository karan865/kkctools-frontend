'use client';

import React, { useState, useEffect, useMemo } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import SeTaxInputGuide, { SeTaxFieldId } from './SeTaxInputGuide';
import styles from './SelfEmploymentTaxCalculator.module.css';
import {
  calculateSeTax,
  calculateWhatIf,
  FilingStatus,
} from '@/lib/se-tax-engine';

type SeTaxTab = 'estimate' | 'quarterly' | 'what-if';

const TABS: TabItem<SeTaxTab>[] = [
  { id: 'estimate', label: 'Tax Estimate' },
  { id: 'quarterly', label: 'Quarterly Payments (1040-ES)' },
  { id: 'what-if', label: 'What If I… (Deduction Impact)' },
];

function SelfEmploymentTaxCalculatorInner() {
  const [activeTab, setActiveTab] = useState<SeTaxTab>('estimate');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as SeTaxTab;
      if (tabParam && ['estimate', 'quarterly', 'what-if'].includes(tabParam)) {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: SeTaxTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<SeTaxFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Form Inputs
  const [grossIncome, setGrossIncome] = useState<number>(70000);
  const [expenses, setExpenses] = useState<number>(10000);
  const [milesH1, setMilesH1] = useState<number>(0);
  const [milesH2, setMilesH2] = useState<number>(0);
  const [w2Wages, setW2Wages] = useState<number>(0);
  const [w2Withheld, setW2Withheld] = useState<number>(0);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [fedRatePct, setFedRatePct] = useState<number>(12);
  const [stateRatePct, setStateRatePct] = useState<number>(0);
  const [priorYearTax, setPriorYearTax] = useState<number>(0);

  // What-If input
  const [additionalDeduction, setAdditionalDeduction] = useState<number>(5000);

  // Primary Tax Calculation
  const res = useMemo(() => {
    return calculateSeTax({
      taxYear: 2026,
      grossIncome,
      expenses,
      milesH1,
      milesH2,
      w2Wages,
      w2FederalTaxWithheld: w2Withheld,
      filingStatus,
      fedTaxRatePct: fedRatePct,
      stateTaxRatePct: stateRatePct,
      priorYearTotalTax: priorYearTax,
    });
  }, [
    grossIncome,
    expenses,
    milesH1,
    milesH2,
    w2Wages,
    w2Withheld,
    filingStatus,
    fedRatePct,
    stateRatePct,
    priorYearTax,
  ]);

  // What-If Scenario Calculation
  const whatIfRes = useMemo(() => {
    return calculateWhatIf(
      {
        taxYear: 2026,
        grossIncome,
        expenses,
        milesH1,
        milesH2,
        w2Wages,
        w2FederalTaxWithheld: w2Withheld,
        filingStatus,
        fedTaxRatePct: fedRatePct,
        stateTaxRatePct: stateRatePct,
      },
      additionalDeduction
    );
  }, [
    grossIncome,
    expenses,
    milesH1,
    milesH2,
    w2Wages,
    w2Withheld,
    filingStatus,
    fedRatePct,
    stateRatePct,
    additionalDeduction,
  ]);

  // BLUF Copy Sentence
  const blufSentence = useMemo(() => {
    if (res.isBelowMinimum) {
      return `On $${res.netSelfEmploymentEarnings.toLocaleString()} of net earnings (under the $400 IRC threshold), you owe $0 in self-employment tax.`;
    }
    if (activeTab === 'estimate') {
      return `On $${res.netSelfEmploymentEarnings.toLocaleString()} of net self-employment income, self-employment tax is about $${Math.round(res.totalSeTax).toLocaleString()} (15.3% on 92.35% of your earnings). Half of it, $${Math.round(res.halfSeDeduction).toLocaleString()}, is deductible. Set aside approximately $${Math.round(res.totalTaxLiability).toLocaleString()} (${res.effectiveTaxRatePct.toFixed(1)}% of gross).`;
    }
    if (activeTab === 'quarterly') {
      return `Your estimated quarterly 1040-ES payment is $${Math.round(res.quarterlyPayment).toLocaleString()} across the four official IRS deadlines (Apr 15, Jun 15, Sep 15, Jan 15).`;
    }
    if (activeTab === 'what-if' && whatIfRes) {
      return `Adding an extra $${additionalDeduction.toLocaleString()} deductible business expense or retirement deposit saves approximately $${Math.round(whatIfRes.taxSavings).toLocaleString()} in taxes (${whatIfRes.effectiveSavingsRatePct.toFixed(1)}% effective return), reducing net out-of-pocket cost to $${Math.round(whatIfRes.netOutOfPocketCost).toLocaleString()}.`;
    }
    return '';
  }, [res, activeTab, whatIfRes, additionalDeduction]);

  const handleCopyBluf = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(blufSentence);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="1099 self-employment tax calculation modes" />

      <SeTaxInputGuide
        mode={activeTab}
        activeField={activeField}
        grossIncome={grossIncome}
        expenses={expenses + res.mileageDeduction}
        netSE={res.netSelfEmploymentEarnings}
        totalSeTax={Math.round(res.totalSeTax)}
        halfDeduction={Math.round(res.halfSeDeduction)}
        quarterlyPayment={Math.round(res.quarterlyPayment)}
      />

      {/* Summary Banner (High-contrast light mint) */}
      <div className={styles.summaryBanner}>
        <div className={styles.bannerHeadline}>
          <span>
            {activeTab === 'estimate' && 'Estimated Tax & Recommended Set-Aside:'}
            {activeTab === 'quarterly' && 'Quarterly 1040-ES Estimated Payment:'}
            {activeTab === 'what-if' && 'Tax Savings from Extra Deduction:'}
          </span>
          <span className={styles.bannerAmount}>
            {activeTab === 'estimate' && `$${Math.round(res.totalTaxLiability).toLocaleString()} (${res.effectiveTaxRatePct.toFixed(1)}%)`}
            {activeTab === 'quarterly' && `$${Math.round(res.quarterlyPayment).toLocaleString()}/qtr`}
            {activeTab === 'what-if' && `-$${Math.round(whatIfRes.taxSavings).toLocaleString()}`}
          </span>
        </div>
        <p className={styles.bannerBluf}>{blufSentence}</p>
        <div style={{ marginTop: '0.75rem' }}>
          <button type="button" onClick={handleCopyBluf} className={styles.copyButton}>
            {copiedToast ? '✓ Copied to clipboard' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Form Controls Card */}
        <div className={styles.formCard}>
          <div className={styles.sectionTitle}>
            <span>1099 Income &amp; Deductions (2026 Tax Year)</span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>① Gross 1099 / Freelance Income</span>
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>$</span>
              <input
                type="number"
                className={`${styles.input} ${styles.inputWithPrefix}`}
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value) || 0)}
                onFocus={() => setActiveField('grossIncome')}
                onBlur={() => setActiveField(null)}
                step="5000"
                min="0"
              />
            </div>
            <p className={styles.subHelp}>Total payments reported on Forms 1099-NEC, 1099-K, and freelance client invoices.</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <span>② Ordinary Business Expenses (Schedule C)</span>
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>$</span>
              <input
                type="number"
                className={`${styles.input} ${styles.inputWithPrefix}`}
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value) || 0)}
                onFocus={() => setActiveField('expenses')}
                onBlur={() => setActiveField(null)}
                step="500"
                min="0"
              />
            </div>
            <p className={styles.subHelp}>Software, supplies, advertising, equipment depreciation, home office, legal fees.</p>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Jan–Jun Miles (72.5¢)</span>
              </label>
              <input
                type="number"
                className={styles.input}
                value={milesH1}
                onChange={(e) => setMilesH1(Number(e.target.value) || 0)}
                onFocus={() => setActiveField('milesH1')}
                onBlur={() => setActiveField(null)}
                step="100"
                min="0"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Jul–Dec Miles (76.0¢)</span>
              </label>
              <input
                type="number"
                className={styles.input}
                value={milesH2}
                onChange={(e) => setMilesH2(Number(e.target.value) || 0)}
                onFocus={() => setActiveField('milesH2')}
                onBlur={() => setActiveField(null)}
                step="100"
                min="0"
              />
            </div>
          </div>
          {res.mileageDeduction > 0 && (
            <p className={styles.subHelp} style={{ color: 'var(--success)', fontWeight: 600 }}>
              ✓ Total Mileage Deduction: ${res.mileageDeduction.toLocaleString()}
            </p>
          )}

          <hr style={{ border: 'none', borderTop: '1px dashed var(--line)' }} />

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>W-2 Wages (If Any)</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  value={w2Wages}
                  onChange={(e) => setW2Wages(Number(e.target.value) || 0)}
                  onFocus={() => setActiveField('w2Wages')}
                  onBlur={() => setActiveField(null)}
                  step="5000"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>W-2 Fed Tax Withheld</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  value={w2Withheld}
                  onChange={(e) => setW2Withheld(Number(e.target.value) || 0)}
                  step="500"
                  min="0"
                />
              </div>
            </div>
          </div>
          <p className={styles.subHelp}>W-2 salary counts toward the $184,500 Social Security cap first, reducing your 1099 SE tax.</p>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Filing Status</span>
              </label>
              <select
                className={styles.input}
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
              >
                <option value="single">Single ($200k surtax limit)</option>
                <option value="mfj">Married Filing Jointly ($250k limit)</option>
                <option value="mfs">Married Filing Separately ($125k limit)</option>
                <option value="hoh">Head of Household ($200k limit)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Expected Fed Tax Rate</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithSuffix}`}
                  value={fedRatePct}
                  onChange={(e) => setFedRatePct(Number(e.target.value) || 0)}
                  onFocus={() => setActiveField('fedTaxRatePct')}
                  onBlur={() => setActiveField(null)}
                  step="1"
                  min="0"
                  max="40"
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Expected State Tax Rate</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithSuffix}`}
                  value={stateRatePct}
                  onChange={(e) => setStateRatePct(Number(e.target.value) || 0)}
                  step="0.5"
                  min="0"
                  max="15"
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <span>Prior Year Total Tax</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  value={priorYearTax}
                  onChange={(e) => setPriorYearTax(Number(e.target.value) || 0)}
                  onFocus={() => setActiveField('priorYearTotalTax')}
                  onBlur={() => setActiveField(null)}
                  step="1000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {activeTab === 'what-if' && (
            <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--surface-2, #f8fafc)', borderRadius: '8px' }}>
              <label className={styles.formLabel}>
                <strong>Extra Deduction or Retirement Contribution:</strong>
              </label>
              <div className={styles.inputWrapper} style={{ marginTop: '0.25rem' }}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  value={additionalDeduction}
                  onChange={(e) => setAdditionalDeduction(Number(e.target.value) || 0)}
                  step="500"
                  min="0"
                />
              </div>
              <p className={styles.subHelp}>E.g. purchasing work hardware, office supplies, or contributing to a SEP-IRA / Solo 401(k).</p>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className={styles.resultsCard}>
          <div className={styles.sectionTitle}>
            <span>Tax Breakdown &amp; IRS Obligations</span>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Tax Due</span>
              <span className={`${styles.metricValue} ${styles.metricValueGreen}`}>
                ${Math.round(res.totalTaxLiability).toLocaleString()}
              </span>
              <span className={styles.metricSub}>SE + Fed + State</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Set-Aside Rate</span>
              <span className={styles.metricValue}>{res.effectiveTaxRatePct.toFixed(1)}%</span>
              <span className={styles.metricSub}>Of gross 1099 pay</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Self-Employment Tax</span>
              <span className={styles.metricValue}>${Math.round(res.totalSeTax).toLocaleString()}</span>
              <span className={styles.metricSub}>15.3% FICA total</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>50% SE Deduction</span>
              <span className={styles.metricValue}>${Math.round(res.halfSeDeduction).toLocaleString()}</span>
              <span className={styles.metricSub}>Schedule 1 Line 15</span>
            </div>
          </div>

          <table className={styles.breakdownTable}>
            <thead>
              <tr>
                <th>Tax Category</th>
                <th>Formula / Basis</th>
                <th>Estimated Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Net 1099 Profit</td>
                <td>Gross − Deductions − Miles</td>
                <td>${res.netSelfEmploymentEarnings.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Taxable SE Base</td>
                <td>Net Profit × 92.35%</td>
                <td>${res.taxableSeBase.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Social Security (12.4%)</td>
                <td>Capped at $184,500 wage base</td>
                <td>${Math.round(res.socialSecurityTax).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Medicare (2.9%)</td>
                <td>Uncapped taxable base</td>
                <td>${Math.round(res.medicareTax).toLocaleString()}</td>
              </tr>
              {res.additionalMedicareTax > 0 && (
                <tr>
                  <td>Additional Medicare (0.9%)</td>
                  <td>Income above ${filingStatus === 'mfj' ? '250,000' : '200,000'}</td>
                  <td>${Math.round(res.additionalMedicareTax).toLocaleString()}</td>
                </tr>
              )}
              <tr>
                <td>Federal Income Tax</td>
                <td>Effective {fedRatePct}% on adjusted base</td>
                <td>${Math.round(res.federalIncomeTaxEstimate).toLocaleString()}</td>
              </tr>
              {stateRatePct > 0 && (
                <tr>
                  <td>State Income Tax</td>
                  <td>Effective {stateRatePct}% on adjusted base</td>
                  <td>${Math.round(res.stateIncomeTaxEstimate).toLocaleString()}</td>
                </tr>
              )}
              {w2Withheld > 0 && (
                <tr style={{ color: 'var(--success)' }}>
                  <td>Less: W-2 Withholding</td>
                  <td>Already paid via employer</td>
                  <td>-${w2Withheld.toLocaleString()}</td>
                </tr>
              )}
              <tr>
                <td><strong>Net Remaining Tax Liability</strong></td>
                <td><strong>After W-2 withholding</strong></td>
                <td><strong>${Math.round(res.remainingTaxDue).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* Quarterly Vouchers Section */}
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
              Form 1040-ES Quarterly Payment Dates (2026 Tax Year):
            </span>
            <div className={styles.voucherGrid}>
              {res.quarterlyVouchers.map((v) => (
                <div key={v.quarter} className={styles.voucherCard}>
                  <span className={styles.voucherQ}>{v.label}</span>
                  <span className={styles.voucherAmount}>${Math.round(v.amount).toLocaleString()}</span>
                  <span className={styles.voucherDue}>Due {v.dueDate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dated Sources & Rules Box */}
          <div className={styles.sourcesBox}>
            <div className={styles.sourcesTitle}>Official IRS &amp; SSA Verified Tax Figures (2026):</div>
            <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
              <li>
                <strong>Self-Employment Tax Rate:</strong> 15.3% (12.4% Social Security + 2.9% Medicare) applied to 92.35% of net profit (verified on{' '}
                <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  irs.gov/businesses/self-employment-tax
                </a>{' '}
                on 2026-10-30).
              </li>
              <li>
                <strong>Social Security Wage Base:</strong> $184,500 maximum taxable earnings in 2026 (verified on ssa.gov/oact/cola/cbb.html).
              </li>
              <li>
                <strong>Standard Mileage Rate:</strong> Jan 1 – Jun 30: 72.5¢/mile; Jul 1 – Dec 31: 76.0¢/mile (verified on{' '}
                <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                  irs.gov/standard-mileage-rates
                </a>
                ).
              </li>
              <li>
                <strong>Safe Harbor Rule:</strong> Pay at least 90% of current year tax or 100% of prior year tax in four equal installments to avoid underpayment penalties. Last reviewed: 2026-11-20.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SelfEmploymentTaxCalculator() {
  return (
    <SelfEmploymentTaxCalculatorInner />
  );
}
