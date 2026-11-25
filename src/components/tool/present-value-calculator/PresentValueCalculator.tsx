'use client';

import React, { useState, useMemo, useId } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import PvInputGuide from './PvInputGuide';
import {
  pv,
  pvAnnuity,
  pvGrowingAnnuity,
  pvPerpetuity,
  npvProject,
  irr,
  profitabilityIndex,
  discountedPayback,
  npvProfile,
  pvTable,
  annuityTable,
  generateExcelFormulas,
  CompoundingFrequency,
} from '@/lib/tvm-engine';
import styles from './PresentValueCalculator.module.css';

type Mode = 'lump-sum' | 'annuity' | 'cash-flows' | 'npv' | 'pv-table';

const TABS = [
  { id: 'lump-sum', label: 'PV Lump Sum' },
  { id: 'annuity', label: 'PV Annuity' },
  { id: 'cash-flows', label: 'Uneven Cash Flows' },
  { id: 'npv', label: 'NPV & IRR' },
  { id: 'pv-table', label: 'PV Table' },
];
const TAB_IDS: readonly Mode[] = ['lump-sum', 'annuity', 'cash-flows', 'npv', 'pv-table'];

export default function PresentValueCalculator() {
  const [activeTab, setActiveTab] = useTabParam<Mode>(TAB_IDS, 'lump-sum');

  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [formulaCopied, setFormulaCopied] = useState(false);

  // 1. Lump sum state
  const [lumpFv, setLumpFv] = useState<number>(10000);
  const [lumpRate, setLumpRate] = useState<number>(6);
  const [lumpYears, setLumpYears] = useState<number>(10);
  const [lumpCompounding, setLumpCompounding] = useState<CompoundingFrequency>('annually');

  // 2. Annuity state
  const [annuityPmt, setAnnuityPmt] = useState<number>(1000);
  const [annuityRate, setAnnuityRate] = useState<number>(6);
  const [annuityPeriods, setAnnuityPeriods] = useState<number>(10);
  const [annuityTiming, setAnnuityTiming] = useState<'ordinary' | 'due'>('ordinary');
  const [annuityGrowth, setAnnuityGrowth] = useState<number>(0);
  const [isPerpetuity, setIsPerpetuity] = useState<boolean>(false);

  // 3. Uneven cash flows state
  const [cfRate, setCfRate] = useState<number>(8);
  const [cashFlows, setCashFlows] = useState<number[]>([2000, 4500, 3200, 6000]);

  // 4. NPV & IRR state
  const [initialOutlay, setInitialOutlay] = useState<number>(10000);
  const [npvRate, setNpvRate] = useState<number>(8);
  const [projectFlows, setProjectFlows] = useState<number[]>([3000, 3000, 3000, 3000, 3000]);

  // 5. PV Table state
  const [tableStartRate, setTableStartRate] = useState<number>(1);
  const [tableEndRate, setTableEndRate] = useState<number>(15);
  const [tableStepRate, setTableStepRate] = useState<number>(1);
  const [tableMaxPeriod, setTableMaxPeriod] = useState<number>(20);
  const [tableType, setTableType] = useState<'pv' | 'annuity'>('pv');

  const baseId = useId();

  // Tab change handler with URL sync
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as Mode);
  };

  // Calculations
  const lumpSumPv = useMemo(() => {
    return pv(lumpFv, lumpRate, lumpYears, lumpCompounding) ?? 0;
  }, [lumpFv, lumpRate, lumpYears, lumpCompounding]);

  const annuityPv = useMemo(() => {
    if (isPerpetuity) {
      return pvPerpetuity(annuityPmt, annuityRate, annuityGrowth) ?? 0;
    }
    if (annuityGrowth > 0) {
      return pvGrowingAnnuity(annuityPmt, annuityRate, annuityGrowth, annuityPeriods, annuityTiming) ?? 0;
    }
    return pvAnnuity(annuityPmt, annuityRate, annuityPeriods, annuityTiming) ?? 0;
  }, [annuityPmt, annuityRate, annuityPeriods, annuityTiming, annuityGrowth, isPerpetuity]);

  const unevenPvTotal = useMemo(() => {
    const discounted = cashFlows.map((cf, idx) => pv(cf, cfRate, idx + 1, 'annually') ?? 0);
    return discounted.reduce((a, b) => a + b, 0);
  }, [cashFlows, cfRate]);

  const npvResult = useMemo(() => {
    return npvProject(initialOutlay, projectFlows, npvRate) ?? 0;
  }, [initialOutlay, projectFlows, npvRate]);

  const irrResult = useMemo(() => {
    return irr([-Math.abs(initialOutlay), ...projectFlows]);
  }, [initialOutlay, projectFlows]);

  const piResult = useMemo(() => {
    return profitabilityIndex(initialOutlay, projectFlows, npvRate);
  }, [initialOutlay, projectFlows, npvRate]);

  const paybackResult = useMemo(() => {
    return discountedPayback(initialOutlay, projectFlows, npvRate);
  }, [initialOutlay, projectFlows, npvRate]);

  const profilePoints = useMemo(() => {
    return npvProfile(initialOutlay, projectFlows, 0, 30, 2);
  }, [initialOutlay, projectFlows]);

  // Generated PV Table
  const tableRates = useMemo(() => {
    const list: number[] = [];
    const step = tableStepRate > 0 ? tableStepRate : 1;
    for (let r = tableStartRate; r <= tableEndRate + 1e-9; r += step) {
      list.push(Number(r.toFixed(2)));
    }
    return list.slice(0, 15); // limit columns for layout
  }, [tableStartRate, tableEndRate, tableStepRate]);

  const generatedTable = useMemo(() => {
    if (tableType === 'annuity') {
      return annuityTable(tableRates, tableMaxPeriod);
    }
    return pvTable(tableRates, tableMaxPeriod);
  }, [tableRates, tableMaxPeriod, tableType]);

  // Formulas
  const currentFormulas = useMemo(() => {
    switch (activeTab) {
      case 'lump-sum':
        return generateExcelFormulas('lump-sum', { fv: lumpFv, ratePct: lumpRate, periods: lumpYears });
      case 'annuity':
        return generateExcelFormulas('annuity', {
          payment: annuityPmt,
          ratePct: annuityRate,
          periods: annuityPeriods,
          timing: annuityTiming,
        });
      case 'cash-flows':
        return generateExcelFormulas('uneven', { ratePct: cfRate, cashFlows });
      case 'npv':
        return generateExcelFormulas('npv', {
          ratePct: npvRate,
          initialInvestment: initialOutlay,
          cashFlows: projectFlows,
        });
      default:
        return generateExcelFormulas('lump-sum', { fv: lumpFv, ratePct: lumpRate, periods: lumpYears });
    }
  }, [activeTab, lumpFv, lumpRate, lumpYears, annuityPmt, annuityRate, annuityPeriods, annuityTiming, cfRate, cashFlows, npvRate, initialOutlay, projectFlows]);

  // Dynamic BLUF sentence
  const blufSentence = useMemo(() => {
    if (activeTab === 'lump-sum') {
      return `A $${lumpFv.toLocaleString('en-US')} future payment received in ${lumpYears} years discounted at ${lumpRate}% is worth $${lumpSumPv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in present value today.`;
    }
    if (activeTab === 'annuity') {
      return `An annuity of $${annuityPmt.toLocaleString('en-US')}${isPerpetuity ? ' paid forever' : ` per period for ${annuityPeriods} periods`} at ${annuityRate}% has a present value of $${annuityPv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
    }
    if (activeTab === 'cash-flows') {
      return `The cumulative present value of these ${cashFlows.length} future cash flows discounted at ${cfRate}% is $${unevenPvTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
    }
    if (activeTab === 'npv') {
      const decision = npvResult > 0 ? 'generates positive economic value (Accept)' : 'does not meet required hurdle (Reject)';
      return `At an ${npvRate}% discount rate, this project delivers an NPV of $${npvResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and an IRR of ${irrResult !== null ? `${irrResult.toFixed(2)}%` : 'N/A'}, which ${decision}.`;
    }
    return `Generated discount factor table for ${tableRates.length} discount rates across ${tableMaxPeriod} periods. Copy as CSV or print.`;
  }, [activeTab, lumpFv, lumpYears, lumpRate, lumpSumPv, annuityPmt, isPerpetuity, annuityPeriods, annuityRate, annuityPv, cashFlows.length, cfRate, unevenPvTotal, npvRate, npvResult, irrResult, tableRates.length, tableMaxPeriod]);

  // Copy CSV for PV Table
  const handleCopyCsv = () => {
    const headers = ['Period', ...tableRates.map((r) => `${r}%`)].join(',');
    const rows = generatedTable.map((row) => [row.period, ...tableRates.map((r) => row.factors[r])].join(','));
    const csvContent = [headers, ...rows].join('\n');

    navigator.clipboard.writeText(csvContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(currentFormulas.excel).then(() => {
      setFormulaCopied(true);
      setTimeout(() => setFormulaCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className={styles.wrap}>
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="Present value calculation modes" />

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.inputs}>
          <PvInputGuide
            mode={activeTab}
            activeField={activeField}
            fv={lumpFv}
            ratePct={activeTab === 'annuity' ? annuityRate : activeTab === 'npv' ? npvRate : lumpRate}
            years={lumpYears}
            compounding={lumpCompounding}
            payment={annuityPmt}
            timing={annuityTiming}
            initialInvestment={initialOutlay}
            pvResult={activeTab === 'annuity' ? annuityPv : activeTab === 'cash-flows' ? unevenPvTotal : lumpSumPv}
            npvResult={npvResult}
            irrResult={irrResult}
          />

          {/* TAB 1: LUMP SUM */}
          {activeTab === 'lump-sum' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Lump Sum Future Value Parameters</h3>
                  <p className={styles.cardSubtitle}>Future cash receipt to be discounted to today</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-lumpFv`} className={styles.label}>
                    Future Value (FV)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-lumpFv`}
                      type="number"
                      min="0"
                      step="500"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={lumpFv || ''}
                      onChange={(e) => setLumpFv(Number(e.target.value))}
                      onFocus={() => setActiveField('fv')}
                      onBlur={() => setActiveField(undefined)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-lumpRate`} className={styles.label}>
                    Annual Discount Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-lumpRate`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.25"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={lumpRate || ''}
                      onChange={(e) => setLumpRate(Number(e.target.value))}
                      onFocus={() => setActiveField('rate')}
                      onBlur={() => setActiveField(undefined)}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-lumpYears`} className={styles.label}>
                    Time Horizon (Years)
                  </label>
                  <input
                    id={`${baseId}-lumpYears`}
                    type="number"
                    min="0.1"
                    max="100"
                    step="1"
                    className={styles.input}
                    value={lumpYears || ''}
                    onChange={(e) => setLumpYears(Number(e.target.value))}
                    onFocus={() => setActiveField('years')}
                    onBlur={() => setActiveField(undefined)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-lumpComp`} className={styles.label}>
                    Compounding Frequency
                  </label>
                  <select
                    id={`${baseId}-lumpComp`}
                    className={styles.select}
                    value={lumpCompounding}
                    onChange={(e) => setLumpCompounding(e.target.value as CompoundingFrequency)}
                  >
                    <option value="annually">Annually (1/yr)</option>
                    <option value="semiannually">Semi-Annually (2/yr)</option>
                    <option value="quarterly">Quarterly (4/yr)</option>
                    <option value="monthly">Monthly (12/yr)</option>
                    <option value="daily">Daily (365/yr)</option>
                    <option value="continuous">Continuous</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANNUITY */}
          {activeTab === 'annuity' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Annuity Payment Parameters</h3>
                  <p className={styles.cardSubtitle}>Series of recurring payments over time</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-annPmt`} className={styles.label}>
                    Payment Amount per Period
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-annPmt`}
                      type="number"
                      min="0"
                      step="100"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={annuityPmt || ''}
                      onChange={(e) => setAnnuityPmt(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-annRate`} className={styles.label}>
                    Discount Rate per Period (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-annRate`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.25"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={annuityRate || ''}
                      onChange={(e) => setAnnuityRate(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-annPer`} className={styles.label}>
                    Number of Periods {isPerpetuity && '(Disabled for Perpetuity)'}
                  </label>
                  <input
                    id={`${baseId}-annPer`}
                    type="number"
                    min="1"
                    max="300"
                    step="1"
                    disabled={isPerpetuity}
                    className={styles.input}
                    value={annuityPeriods || ''}
                    onChange={(e) => setAnnuityPeriods(Number(e.target.value))}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Payment Timing</label>
                  <div className={styles.radioGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${annuityTiming === 'ordinary' ? styles.activeToggle : ''}`}
                      onClick={() => setAnnuityTiming('ordinary')}
                    >
                      Ordinary (End)
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${annuityTiming === 'due' ? styles.activeToggle : ''}`}
                      onClick={() => setAnnuityTiming('due')}
                    >
                      Due (Beginning)
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-annGrowth`} className={styles.label}>
                    Annual Growth Rate (%) (0 = Level)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-annGrowth`}
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={annuityGrowth || ''}
                      onChange={(e) => setAnnuityGrowth(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ justifyContent: 'center' }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isPerpetuity}
                      onChange={(e) => setIsPerpetuity(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span>Perpetuity (Payments continue forever)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UNEVEN CASH FLOWS */}
          {activeTab === 'cash-flows' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Uneven Cash Flows Stream</h3>
                  <p className={styles.cardSubtitle}>Discount variable cash flows period-by-period</p>
                </div>
              </div>

              <div className={styles.fieldGroup} style={{ marginBottom: '1rem' }}>
                <label htmlFor={`${baseId}-cfRate`} className={styles.label}>
                  Discount Rate (%)
                </label>
                <div className={styles.inputWrap} style={{ maxWidth: '240px' }}>
                  <input
                    id={`${baseId}-cfRate`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={cfRate || ''}
                    onChange={(e) => setCfRate(Number(e.target.value))}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.cfList}>
                {cashFlows.map((amount, idx) => (
                  <div key={idx} className={styles.cfRow}>
                    <span className={styles.cfPeriod}>Year {idx + 1}</span>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        type="number"
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                        value={amount || ''}
                        onChange={(e) => {
                          const updated = [...cashFlows];
                          updated[idx] = Number(e.target.value);
                          setCashFlows(updated);
                        }}
                      />
                    </div>
                    {cashFlows.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => setCashFlows(cashFlows.filter((_, i) => i !== idx))}
                        aria-label={`Remove Year ${idx + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.addBtn}
                onClick={() => setCashFlows([...cashFlows, 3000])}
              >
                + Add Another Year
              </button>
            </div>
          )}

          {/* TAB 4: NPV & IRR */}
          {activeTab === 'npv' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Capital Project Cash Flows</h3>
                  <p className={styles.cardSubtitle}>Initial investment outlay and projected annual cash inflows</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-initOutlay`} className={styles.label}>
                    Initial Outlay (Year 0 Investment)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id={`${baseId}-initOutlay`}
                      type="number"
                      min="0"
                      step="1000"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      value={initialOutlay || ''}
                      onChange={(e) => setInitialOutlay(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-npvRate`} className={styles.label}>
                    Discount Rate / Hurdle Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-npvRate`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={npvRate || ''}
                      onChange={(e) => setNpvRate(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <label className={styles.label} style={{ marginTop: '0.75rem' }}>
                Annual Operating Inflows (Years 1 to {projectFlows.length})
              </label>
              <div className={styles.cfList}>
                {projectFlows.map((amount, idx) => (
                  <div key={idx} className={styles.cfRow}>
                    <span className={styles.cfPeriod}>Year {idx + 1}</span>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        type="number"
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                        value={amount || ''}
                        onChange={(e) => {
                          const updated = [...projectFlows];
                          updated[idx] = Number(e.target.value);
                          setProjectFlows(updated);
                        }}
                      />
                    </div>
                    {projectFlows.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => setProjectFlows(projectFlows.filter((_, i) => i !== idx))}
                        aria-label={`Remove Year ${idx + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.addBtn}
                onClick={() => setProjectFlows([...projectFlows, 3000])}
              >
                + Add Inflow Year
              </button>
            </div>
          )}

          {/* TAB 5: PV TABLE */}
          {activeTab === 'pv-table' && (
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h3 className={styles.cardTitle}>Table Configuration</h3>
                  <p className={styles.cardSubtitle}>Generate customized printable discount factor tables</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Table Type</label>
                  <div className={styles.radioGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${tableType === 'pv' ? styles.activeToggle : ''}`}
                      onClick={() => setTableType('pv')}
                    >
                      PV Lump Sum
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${tableType === 'annuity' ? styles.activeToggle : ''}`}
                      onClick={() => setTableType('annuity')}
                    >
                      Annuity Factor
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-maxPer`} className={styles.label}>
                    Max Periods (Years)
                  </label>
                  <input
                    id={`${baseId}-maxPer`}
                    type="number"
                    min="5"
                    max="50"
                    step="5"
                    className={styles.input}
                    value={tableMaxPeriod || ''}
                    onChange={(e) => setTableMaxPeriod(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-startRate`} className={styles.label}>
                    Start Rate (%)
                  </label>
                  <input
                    id={`${baseId}-startRate`}
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    className={styles.input}
                    value={tableStartRate || ''}
                    onChange={(e) => setTableStartRate(Number(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-endRate`} className={styles.label}>
                    End Rate (%)
                  </label>
                  <input
                    id={`${baseId}-endRate`}
                    type="number"
                    min="2"
                    max="50"
                    step="1"
                    className={styles.input}
                    value={tableEndRate || ''}
                    onChange={(e) => setTableEndRate(Number(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-stepRate`} className={styles.label}>
                    Step Rate (%)
                  </label>
                  <input
                    id={`${baseId}-stepRate`}
                    type="number"
                    min="0.5"
                    max="5"
                    step="0.5"
                    className={styles.input}
                    value={tableStepRate || ''}
                    onChange={(e) => setTableStepRate(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.results}>
          {/* Hero Card */}
          <div className={styles.heroCard} aria-live="polite">
            <div className={styles.heroHead}>
              <span className={styles.heroTag}>
                {activeTab === 'lump-sum' && 'Present Value (PV)'}
                {activeTab === 'annuity' && 'PV of Annuity Stream'}
                {activeTab === 'cash-flows' && 'Total Discounted Present Value'}
                {activeTab === 'npv' && 'Net Present Value (NPV)'}
                {activeTab === 'pv-table' && `${tableType === 'pv' ? 'PV' : 'PVIFA'} Discount Table`}
              </span>
              <span className={styles.heroBadge}>
                {activeTab === 'npv'
                  ? npvResult >= 0
                    ? 'Value Created'
                    : 'Value Destroyed'
                  : 'Discounted'}
              </span>
            </div>

            <div className={styles.heroValue}>
              {activeTab === 'lump-sum' && `$${lumpSumPv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {activeTab === 'annuity' && `$${annuityPv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {activeTab === 'cash-flows' && `$${unevenPvTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {activeTab === 'npv' && `$${npvResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {activeTab === 'pv-table' && `${tableRates.length} Rates × ${tableMaxPeriod} Periods`}
            </div>

            <div className={styles.heroSub}>
              {activeTab === 'lump-sum' &&
                `Future sum of $${lumpFv.toLocaleString('en-US')} discounted at ${lumpRate}% over ${lumpYears} years`}
              {activeTab === 'annuity' &&
                `${isPerpetuity ? 'Perpetuity' : `${annuityPeriods} payments`} of $${annuityPmt.toLocaleString('en-US')} discounted at ${annuityRate}%`}
              {activeTab === 'cash-flows' &&
                `Sum of ${cashFlows.length} future uneven payments discounted at ${cfRate}%`}
              {activeTab === 'npv' &&
                `Initial investment $${initialOutlay.toLocaleString('en-US')} with ${projectFlows.length} annual cash inflows`}
              {activeTab === 'pv-table' &&
                `Standard 4-decimal factor matrix for quick offline discount factor lookup`}
            </div>
          </div>

          {/* High-Contrast Summary Banner */}
          <div className={styles.summaryBanner}>
            <div className={styles.summaryIcon}>✓</div>
            <p className={styles.summaryText}>{blufSentence}</p>
          </div>

          {/* NPV Metrics Grid */}
          {activeTab === 'npv' && (
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Internal Rate of Return (IRR)</span>
                <span className={styles.metricVal}>
                  {irrResult !== null ? `${irrResult.toFixed(2)}%` : 'N/A'}
                </span>
                <span className={styles.metricNote}>Hurdle: {npvRate}%</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Profitability Index (PI)</span>
                <span className={styles.metricVal}>
                  {piResult !== null ? piResult.toFixed(2) : 'N/A'}
                </span>
                <span className={styles.metricNote}>{piResult && piResult >= 1 ? 'PI ≥ 1.0 (Good)' : 'PI < 1.0'}</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricLabel}>Discounted Payback</span>
                <span className={styles.metricVal}>
                  {paybackResult !== null ? `${paybackResult.toFixed(1)} yrs` : '> Project Life'}
                </span>
                <span className={styles.metricNote}>At {npvRate}% hurdle</span>
              </div>
            </div>
          )}

          {/* NPV Profile Chart */}
          {activeTab === 'npv' && profilePoints.length > 0 && (
            <div className={styles.card}>
              <h4 className={styles.cardTitle} style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                NPV Profile Curve (Rate vs NPV)
              </h4>
              <div className={styles.chartWrap}>
                <svg viewBox="0 0 400 120" className={styles.chartSvg} role="img" aria-label="NPV Profile Curve">
                  <line x1="40" y1="60" x2="380" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="35" y="64" textAnchor="end" fontSize="10" fill="#64748b">
                    $0
                  </text>
                  {/* Path */}
                  {(() => {
                    const maxNpv = Math.max(...profilePoints.map((p) => Math.abs(p.npv)), 1000);
                    const pointsStr = profilePoints
                      .map((pt, i) => {
                        const x = 50 + (i / (profilePoints.length - 1)) * 320;
                        const y = 60 - (pt.npv / maxNpv) * 45;
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" points={pointsStr} />;
                  })()}
                </svg>
              </div>
              <p className={styles.chartCaption}>
                The curve crosses the $0 axis at the Internal Rate of Return (IRR = {irrResult !== null ? `${irrResult.toFixed(2)}%` : 'N/A'}).
              </p>
            </div>
          )}

          {/* Excel & Spreadsheet Formula Box */}
          <div className={styles.card}>
            <div className={styles.formulaHead}>
              <span className={styles.formulaTag}>Spreadsheet Formula</span>
              <button type="button" className={styles.copySmallBtn} onClick={handleCopyFormula}>
                {formulaCopied ? 'Copied!' : 'Copy Formula'}
              </button>
            </div>
            <code className={styles.formulaCode}>{currentFormulas.excel}</code>
            <p className={styles.formulaNote}>{currentFormulas.notes}</p>
          </div>

          {/* PV Table Render */}
          {activeTab === 'pv-table' && (
            <div className={styles.card}>
              <div className={styles.tableControls}>
                <h4 className={styles.cardTitle} style={{ fontSize: '0.95rem' }}>
                  {tableType === 'pv' ? 'Present Value Factors' : 'Annuity Factors'} (1 to {tableMaxPeriod} periods)
                </h4>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.actionBtn} onClick={handleCopyCsv}>
                    {copied ? 'Copied CSV!' : 'Copy CSV'}
                  </button>
                  <button type="button" className={styles.actionBtn} onClick={handlePrint}>
                    Print Table
                  </button>
                </div>
              </div>

              <div className={styles.tableScroll}>
                <table className={styles.pvTable}>
                  <thead>
                    <tr>
                      <th>Period</th>
                      {tableRates.map((r) => (
                        <th key={r}>{r}%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedTable.map((row) => (
                      <tr key={row.period}>
                        <td className={styles.periodCol}>{row.period}</td>
                        {tableRates.map((r) => (
                          <td key={r}>{row.factors[r]?.toFixed(4)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
