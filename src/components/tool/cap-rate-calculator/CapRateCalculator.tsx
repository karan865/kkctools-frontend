'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import CapRateInputGuide, { CapRateFieldId } from './CapRateInputGuide';
import {
  calculateCapRateTool,
  CapRateMode,
  IncomeBasis,
  CapRateEngineInput,
  CapRateExpenseRow,
} from '@/lib/cap-rate-engine';
import styles from './CapRateCalculator.module.css';

const TABS: TabItem<CapRateMode>[] = [
  { id: 'cap-rate', label: 'Cap Rate (Solve Yield)' },
  { id: 'property-value', label: 'Property Value (Solve Price)' },
  { id: 'required-noi', label: 'Required NOI (Target Yield)' },
];

function formatCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function formatPercent(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}

export default function CapRateCalculator() {
  // Active Solve Tab
  const [activeTab, setActiveTab] = useState<CapRateMode>('cap-rate');

  // Input Guide active focus tracking
  const [activeField, setActiveField] = useState<CapRateFieldId | null>(null);

  // NOI Mode: Builder vs Direct
  const [noiMode, setNoiMode] = useState<'builder' | 'direct'>('builder');

  // Income Basis: Units vs Sq Ft
  const [incomeBasis, setIncomeBasis] = useState<IncomeBasis>('units');
  const [unitCount, setUnitCount] = useState<number>(10);
  const [rentPerUnitMonthly, setRentPerUnitMonthly] = useState<number>(1500);
  const [buildingSqft, setBuildingSqft] = useState<number>(12000);
  const [rentPerSqftAnnual, setRentPerSqftAnnual] = useState<number>(15);

  // Other Income & Vacancy
  const [otherIncomeAnnual, setOtherIncomeAnnual] = useState<number>(3000);
  const [vacancyPercent, setVacancyPercent] = useState<number>(5);

  // Operating Expenses
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(18000);
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(6000);
  const [repairsAnnual, setRepairsAnnual] = useState<number>(9000);
  const [reservesAnnual, setReservesAnnual] = useState<number>(3000);
  const [managementPercent, setManagementPercent] = useState<number>(6);
  const [customExpenses, setCustomExpenses] = useState<CapRateExpenseRow[]>([]);

  // Direct NOI
  const [directNoi, setDirectNoi] = useState<number>(127560);

  // Price & Cap Rate Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(2400000);
  const [targetCapRatePercent, setTargetCapRatePercent] = useState<number>(7);

  // Advanced Projections / Exit Analysis
  const [holdingPeriodYears, setHoldingPeriodYears] = useState<number>(5);
  const [annualNoiGrowthPercent, setAnnualNoiGrowthPercent] = useState<number>(3);
  const [exitCapRatePercent, setExitCapRatePercent] = useState<number>(6.5);

  // Copy notification status
  const [copied, setCopied] = useState<boolean>(false);

  // Sync tab with URL query parameter on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as CapRateMode;
        if (tabParam && ['cap-rate', 'property-value', 'required-noi'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      } catch {
        // Safe fallback
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = useCallback((tab: CapRateMode) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Compute Engine Result
  const engineInput: CapRateEngineInput = useMemo(
    () => ({
      mode: activeTab,
      noiMode,
      directNoi,
      incomeBasis,
      unitCount,
      rentPerUnitMonthly,
      buildingSqft,
      rentPerSqftAnnual,
      otherIncomeAnnual,
      vacancyPercent,
      propertyTaxAnnual,
      insuranceAnnual,
      repairsAnnual,
      reservesAnnual,
      managementPercent,
      customExpenses,
      purchasePrice,
      targetCapRatePercent,
      holdingPeriodYears,
      annualNoiGrowthPercent,
      exitCapRatePercent,
    }),
    [
      activeTab,
      noiMode,
      directNoi,
      incomeBasis,
      unitCount,
      rentPerUnitMonthly,
      buildingSqft,
      rentPerSqftAnnual,
      otherIncomeAnnual,
      vacancyPercent,
      propertyTaxAnnual,
      insuranceAnnual,
      repairsAnnual,
      reservesAnnual,
      managementPercent,
      customExpenses,
      purchasePrice,
      targetCapRatePercent,
      holdingPeriodYears,
      annualNoiGrowthPercent,
      exitCapRatePercent,
    ]
  );

  const result = useMemo(() => calculateCapRateTool(engineInput), [engineInput]);

  // Add custom expense row
  const addExpenseRow = () => {
    setCustomExpenses((prev) => [
      ...prev,
      { id: `exp_${Date.now()}`, name: 'Other Expense', amount: 1000 },
    ]);
  };

  const removeExpenseRow = (id: string) => {
    setCustomExpenses((prev) => prev.filter((row) => row.id !== id));
  };

  const updateExpenseRow = (id: string, key: 'name' | 'amount', val: string | number) => {
    setCustomExpenses((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: val } : row))
    );
  };

  // Share URL handler
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Print handler
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  // Summary plain text line for sharing or screen reader
  const blufSentence = useMemo(() => {
    if (activeTab === 'cap-rate') {
      return `A property with ${formatCurrency(result.effectiveNoi)} NOI priced at ${formatCurrency(purchasePrice)} has a ${formatPercent(result.calculatedCapRate)} capitalization rate.`;
    }
    if (activeTab === 'property-value') {
      return `A commercial property generating ${formatCurrency(result.effectiveNoi)} NOI at a ${formatPercent(targetCapRatePercent)} market cap rate is estimated at ${formatCurrency(result.calculatedValue)}.`;
    }
    return `To deliver a ${formatPercent(targetCapRatePercent)} cap rate on a ${formatCurrency(purchasePrice)} purchase, the property must generate ${formatCurrency(result.calculatedRequiredNoi)} in annual NOI.`;
  }, [activeTab, result, purchasePrice, targetCapRatePercent]);

  return (
    <div className={styles.wrap}>
      {/* Tab Navigation */}
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="Cap Rate Calculator solve modes" />

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.inputs}>
          {/* Visual Input Guide Diagram */}
          <CapRateInputGuide
            mode={activeTab}
            activeField={activeField}
            grossRent={result.noiBreakdown?.grossRent || (incomeBasis === 'units' ? unitCount * rentPerUnitMonthly * 12 : buildingSqft * rentPerSqftAnnual)}
            otherIncome={otherIncomeAnnual}
            vacancyLoss={result.noiBreakdown?.vacancyLoss || 0}
            totalExpenses={result.noiBreakdown?.totalExpenses || 0}
            noi={result.effectiveNoi}
            price={purchasePrice}
            capRatePercent={activeTab === 'cap-rate' ? result.calculatedCapRate : targetCapRatePercent}
            propertyValue={activeTab === 'property-value' ? result.calculatedValue : purchasePrice}
            requiredNoi={result.calculatedRequiredNoi}
          />

          {/* NOI Section Card */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>1</span>
              <div>
                <h3 className={styles.cardTitle}>Net Operating Income (NOI)</h3>
                <p className={styles.cardSubtitle}>Operating revenue minus normal operating expenses</p>
              </div>
            </div>

            {/* NOI Mode Toggle */}
            <div className={styles.toggleGroup} role="group" aria-label="NOI Input Method">
              <button
                type="button"
                className={`${styles.toggleBtn} ${noiMode === 'builder' ? styles.toggleBtnActive : ''}`}
                onClick={() => setNoiMode('builder')}
              >
                Build my NOI (Recommended)
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${noiMode === 'direct' ? styles.toggleBtnActive : ''}`}
                onClick={() => setNoiMode('direct')}
              >
                I know my NOI
              </button>
            </div>

            {noiMode === 'direct' ? (
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="directNoiInput" className={styles.label}>
                    Annual Net Operating Income (NOI)
                  </label>
                  <span className={styles.exampleTag}>example — change to your numbers</span>
                </div>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="directNoiInput"
                    type="number"
                    min="0"
                    step="1000"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={directNoi || ''}
                    onFocus={() => setActiveField('income')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setDirectNoi(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* 1. Rent Roll Basis */}
                <div className={styles.fieldGroup}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>
                      <span className={styles.badgeNumber}>1</span>
                      Gross Rental Income (Rent Roll)
                    </label>
                    <span className={styles.exampleTag}>example — change to your numbers</span>
                  </div>

                  <div className={styles.toggleGroup} style={{ marginBottom: '0.625rem' }}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${incomeBasis === 'units' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setIncomeBasis('units')}
                    >
                      Residential Units
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${incomeBasis === 'sqft' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setIncomeBasis('sqft')}
                    >
                      Commercial / Sq Ft
                    </button>
                  </div>

                  {incomeBasis === 'units' ? (
                    <div className={styles.row2}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="unitCountInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                          Number of Units
                        </label>
                        <input
                          id="unitCountInput"
                          type="number"
                          min="1"
                          className={styles.input}
                          value={unitCount || ''}
                          onFocus={() => setActiveField('income')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setUnitCount(Math.max(1, Number(e.target.value)))}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="rentPerUnitInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                          Avg Rent / Unit / Mo
                        </label>
                        <div className={styles.inputWrap}>
                          <span className={styles.prefix}>$</span>
                          <input
                            id="rentPerUnitInput"
                            type="number"
                            min="0"
                            className={`${styles.input} ${styles.inputWithPrefix}`}
                            value={rentPerUnitMonthly || ''}
                            onFocus={() => setActiveField('income')}
                            onBlur={() => setActiveField(null)}
                            onChange={(e) => setRentPerUnitMonthly(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.row2}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="sqftInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                          Rentable Area (Sq Ft)
                        </label>
                        <input
                          id="sqftInput"
                          type="number"
                          min="0"
                          className={styles.input}
                          value={buildingSqft || ''}
                          onFocus={() => setActiveField('income')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setBuildingSqft(Number(e.target.value))}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="rentPerSqftInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                          Rent / Sq Ft / Year
                        </label>
                        <div className={styles.inputWrap}>
                          <span className={styles.prefix}>$</span>
                          <input
                            id="rentPerSqftInput"
                            type="number"
                            min="0"
                            step="0.5"
                            className={`${styles.input} ${styles.inputWithPrefix}`}
                            value={rentPerSqftAnnual || ''}
                            onFocus={() => setActiveField('income')}
                            onBlur={() => setActiveField(null)}
                            onChange={(e) => setRentPerSqftAnnual(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Other Income & 3. Vacancy */}
                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label htmlFor="otherIncomeInput" className={styles.label}>
                        <span className={`${styles.badgeNumber} ${styles.badgeNumberGreen}`}>2</span>
                        Other Income / Yr
                      </label>
                    </div>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id="otherIncomeInput"
                        type="number"
                        min="0"
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                        value={otherIncomeAnnual || ''}
                        onFocus={() => setActiveField('otherIncome')}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => setOtherIncomeAnnual(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <div className={styles.labelRow}>
                      <label htmlFor="vacancyInput" className={styles.label}>
                        <span className={`${styles.badgeNumber} ${styles.badgeNumberAmber}`}>3</span>
                        Vacancy Loss %
                      </label>
                    </div>
                    <div className={styles.inputWrap}>
                      <input
                        id="vacancyInput"
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={vacancyPercent || ''}
                        onFocus={() => setActiveField('vacancy')}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => setVacancyPercent(Number(e.target.value))}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>

                {/* 4. Operating Expenses */}
                <div className={styles.fieldGroup} style={{ marginTop: '0.25rem' }}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>
                      <span className={`${styles.badgeNumber} ${styles.badgeNumberRed}`}>4</span>
                      Annual Operating Expenses
                    </label>
                    <span className={styles.exampleTag}>mortgage &amp; capex excluded</span>
                  </div>

                  <div className={styles.row2}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="propertyTaxInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                        Property Tax ($/yr)
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="propertyTaxInput"
                          type="number"
                          min="0"
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                          value={propertyTaxAnnual || ''}
                          onFocus={() => setActiveField('expenses')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="insuranceInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                        Insurance ($/yr)
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="insuranceInput"
                          type="number"
                          min="0"
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                          value={insuranceAnnual || ''}
                          onFocus={() => setActiveField('expenses')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setInsuranceAnnual(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.row2}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="repairsInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                        Repairs &amp; Maintenance ($/yr)
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="repairsInput"
                          type="number"
                          min="0"
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                          value={repairsAnnual || ''}
                          onFocus={() => setActiveField('expenses')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setRepairsAnnual(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="reservesInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                        Replacement Reserves ($/yr)
                      </label>
                      <div className={styles.inputWrap}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="reservesInput"
                          type="number"
                          min="0"
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                          value={reservesAnnual || ''}
                          onFocus={() => setActiveField('expenses')}
                          onBlur={() => setActiveField(null)}
                          onChange={(e) => setReservesAnnual(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="mgmtPercentInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                      Property Management Fee (% of effective gross income)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="mgmtPercentInput"
                        type="number"
                        min="0"
                        max="30"
                        step="0.5"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={managementPercent || ''}
                        onFocus={() => setActiveField('expenses')}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => setManagementPercent(Number(e.target.value))}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>

                  {/* Custom Expense Rows */}
                  {customExpenses.map((row) => (
                    <div key={row.id} className={styles.expenseRow}>
                      <input
                        type="text"
                        className={`${styles.input} ${styles.expenseName}`}
                        value={row.name}
                        onChange={(e) => updateExpenseRow(row.id, 'name', e.target.value)}
                        placeholder="Expense Name"
                      />
                      <div className={`${styles.inputWrap} ${styles.expenseAmount}`}>
                        <span className={styles.prefix}>$</span>
                        <input
                          type="number"
                          min="0"
                          className={`${styles.input} ${styles.inputWithPrefix}`}
                          value={row.amount || ''}
                          onChange={(e) => updateExpenseRow(row.id, 'amount', Number(e.target.value))}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeExpenseRow(row.id)}
                        aria-label={`Remove ${row.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button type="button" className={styles.addBtn} onClick={addExpenseRow}>
                    + Add Custom Expense Item
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Pricing & Cap Rate Card */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={`${styles.step} ${styles.stepPurple}`}>
                {activeTab === 'property-value' ? '6' : '5'}
              </span>
              <div>
                <h3 className={styles.cardTitle}>
                  {activeTab === 'property-value' ? 'Market Cap Rate' : 'Purchase / Property Price'}
                </h3>
                <p className={styles.cardSubtitle}>
                  {activeTab === 'property-value'
                    ? 'Target or local comparable market capitalization rate'
                    : 'Agreed contract price or property acquisition value'}
                </p>
              </div>
            </div>

            {/* Price Input (Shown on Cap Rate and Required NOI tabs) */}
            {activeTab !== 'property-value' && (
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="purchasePriceInput" className={styles.label}>
                    <span className={`${styles.badgeNumber} ${styles.badgeNumberPurple}`}>5</span>
                    Property Purchase Price
                  </label>
                  <span className={styles.exampleTag}>example — change to your numbers</span>
                </div>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="purchasePriceInput"
                    type="number"
                    min="1"
                    step="50000"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={purchasePrice || ''}
                    onFocus={() => setActiveField('price')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Target Cap Rate Input (Shown on Value and Required NOI tabs) */}
            {activeTab !== 'cap-rate' && (
              <div className={styles.fieldGroup}>
                <div className={styles.labelRow}>
                  <label htmlFor="targetCapInput" className={styles.label}>
                    <span className={`${styles.badgeNumber} ${styles.badgeNumberPurple}`}>6</span>
                    Target Market Cap Rate
                  </label>
                  <span className={styles.exampleTag}>example — change to your numbers</span>
                </div>
                <div className={styles.inputWrap}>
                  <input
                    id="targetCapInput"
                    type="number"
                    min="0.1"
                    max="30"
                    step="0.25"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={targetCapRatePercent || ''}
                    onFocus={() => setActiveField('capRate')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setTargetCapRatePercent(Number(e.target.value))}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            )}

            {/* Optional Collapsed Exit Projections */}
            <details className={styles.detailsBox}>
              <summary className={styles.detailsSummary}>
                Optional: Exit Valuation &amp; Holding Period Projections
              </summary>
              <div className={styles.detailsContent}>
                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="holdingYearsInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                      Holding Period (Years)
                    </label>
                    <input
                      id="holdingYearsInput"
                      type="number"
                      min="1"
                      max="30"
                      className={styles.input}
                      value={holdingPeriodYears || ''}
                      onChange={(e) => setHoldingPeriodYears(Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="noiGrowthInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                      Annual NOI Growth (%)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="noiGrowthInput"
                        type="number"
                        step="0.5"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={annualNoiGrowthPercent || ''}
                        onChange={(e) => setAnnualNoiGrowthPercent(Number(e.target.value))}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="exitCapInput" className={styles.label} style={{ fontSize: '0.75rem' }}>
                    Projected Exit Cap Rate (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id="exitCapInput"
                      type="number"
                      step="0.25"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={exitCapRatePercent || ''}
                      onChange={(e) => setExitCapRatePercent(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.results}>
          {/* Primary Result Headline */}
          <div className={styles.heroCard} aria-live="polite">
            <div className={styles.heroHead}>
              <span className={styles.heroTag}>
                {activeTab === 'cap-rate' ? 'Capitalization Rate' : activeTab === 'property-value' ? 'Estimated Property Value' : 'Required Net Operating Income'}
              </span>
              <span className={styles.heroDirection}>
                {activeTab === 'cap-rate' ? 'Annual Un-leveraged Yield' : activeTab === 'property-value' ? 'Income Capitalization' : 'Target Yield Hurdle'}
              </span>
            </div>

            <div className={styles.heroValue}>
              {activeTab === 'cap-rate' && formatPercent(result.calculatedCapRate)}
              {activeTab === 'property-value' && formatCurrency(result.calculatedValue)}
              {activeTab === 'required-noi' && formatCurrency(result.calculatedRequiredNoi)}
            </div>

            <div className={styles.heroSub}>
              {activeTab === 'cap-rate' && 'Un-leveraged annual operating return on cost'}
              {activeTab === 'property-value' && `Capitalized at ${targetCapRatePercent}% target hurdle rate`}
              {activeTab === 'required-noi' && `Net operating income required at ${targetCapRatePercent}% target yield`}
            </div>
          </div>

          {/* Light Summary Banner */}
          <div className={styles.summaryBanner}>
            <div className={styles.summaryIcon}>✓</div>
            <p className={styles.summaryText}>{blufSentence}</p>
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <button
              type="button"
              className={`${styles.actionBtn} ${copied ? styles.copySuccess : ''}`}
              onClick={handleShare}
            >
              {copied ? '✓ Link Copied!' : '🔗 Share / Save Link'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handlePrint}>
              🖨️ Print Report
            </button>
          </div>

          {/* Secondary Real Estate Metrics */}
          <div className={styles.card}>
            <h4 className={styles.cardTitle} style={{ marginBottom: '0.75rem' }}>
              Key Valuation Benchmarks &amp; Ratios
            </h4>
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Gross Rent Mult (GRM)</div>
                <div className={styles.metricValue}>
                  {result.grm !== null ? `${result.grm.toFixed(2)}×` : '—'}
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Price / Unit</div>
                <div className={styles.metricValue}>
                  {result.pricePerUnit !== null ? formatCurrency(result.pricePerUnit) : '—'}
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Price / Sq Ft</div>
                <div className={styles.metricValue}>
                  {result.pricePerSqft !== null ? formatCurrency(result.pricePerSqft) : '—'}
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Price to NOI</div>
                <div className={styles.metricValue}>
                  {result.priceToNoiMultiple !== null ? `${result.priceToNoiMultiple.toFixed(2)}×` : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized NOI Breakdown Table (Builder Mode) */}
          {result.noiBreakdown && (
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Annual NOI Statement &amp; Waterfall</h4>
              <p className={styles.cardSubtitle} style={{ marginBottom: '0.5rem' }}>
                Effective Gross Income: {formatCurrency(result.noiBreakdown.effectiveIncome)} · Operating Expense Ratio:{' '}
                {result.noiBreakdown.expenseRatioPct.toFixed(1)}%
              </p>

              <div className={styles.tableScroll}>
                <table className={styles.noiTable}>
                  <thead>
                    <tr>
                      <th>Line Item</th>
                      <th style={{ textAlign: 'right' }}>Annual Amount</th>
                      <th style={{ textAlign: 'right' }}>% of Effective Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Gross Potential Rent</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(result.noiBreakdown.grossRent)}</td>
                      <td style={{ textAlign: 'right' }}>—</td>
                    </tr>
                    {result.noiBreakdown.otherIncome > 0 && (
                      <tr>
                        <td>+ Other Income (Parking / Laundry)</td>
                        <td style={{ textAlign: 'right', color: '#10b981' }}>
                          +{formatCurrency(result.noiBreakdown.otherIncome)}
                        </td>
                        <td style={{ textAlign: 'right' }}>—</td>
                      </tr>
                    )}
                    <tr>
                      <td>− Vacancy &amp; Credit Loss ({vacancyPercent}%)</td>
                      <td style={{ textAlign: 'right', color: '#e11d48' }}>
                        −{formatCurrency(result.noiBreakdown.vacancyLoss)}
                      </td>
                      <td style={{ textAlign: 'right' }}>—</td>
                    </tr>
                    <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                      <td>Effective Gross Income (EGI)</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(result.noiBreakdown.effectiveIncome)}</td>
                      <td style={{ textAlign: 'right' }}>100.0%</td>
                    </tr>
                    {result.noiBreakdown.itemizedExpenses.map((exp, i) => (
                      <tr key={i}>
                        <td style={{ paddingLeft: '1.25rem' }}>− {exp.name}</td>
                        <td style={{ textAlign: 'right', color: '#e11d48' }}>−{formatCurrency(exp.amount)}</td>
                        <td style={{ textAlign: 'right' }}>{exp.pctOfEffective.toFixed(1)}%</td>
                      </tr>
                    ))}
                    <tr className={styles.noiTotalRow}>
                      <td>Net Operating Income (NOI)</td>
                      <td style={{ textAlign: 'right', color: result.isNoiNegative ? '#e11d48' : '#1e3a8a' }}>
                        {formatCurrency(result.effectiveNoi)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {(100 - result.noiBreakdown.expenseRatioPct).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sensitivity Matrix */}
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Valuation Sensitivity Matrix</h4>
            <p className={styles.cardSubtitle} style={{ marginBottom: '0.5rem' }}>
              How commercial property value changes across Cap Rates (±1.0%) and NOI shifts (±10%)
            </p>

            <div className={styles.tableScroll}>
              <table className={styles.sensitivityTable}>
                <thead>
                  <tr>
                    <th>Cap Rate</th>
                    {result.sensitivity.noiSteps.map((step) => (
                      <th key={step} style={{ textAlign: 'right' }}>
                        NOI {step > 0 ? `+${step}%` : `${step}%`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.sensitivity.rows.map((row) => (
                    <tr key={row.capRatePercent}>
                      <td style={{ fontWeight: 700 }}>{row.capRatePercent.toFixed(2)}%</td>
                      {row.cells.map((cell, idx) => (
                        <td
                          key={idx}
                          className={cell.isBase ? styles.activeCell : ''}
                          style={{ textAlign: 'right' }}
                        >
                          {cell.propertyValue !== null ? formatCurrency(cell.propertyValue) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step-by-Step Formula Callout */}
          <div className={styles.formulaCard}>
            <div className={styles.formulaTitle}>Mathematical Formula (Your Calculation)</div>
            {activeTab === 'cap-rate' && (
              <div>
                Cap Rate = <span className={styles.formulaMath}>NOI ÷ Purchase Price × 100</span>
                <br />
                = {formatCurrency(result.effectiveNoi)} ÷ {formatCurrency(purchasePrice)} × 100 ={' '}
                <strong>{formatPercent(result.calculatedCapRate)}</strong>
              </div>
            )}
            {activeTab === 'property-value' && (
              <div>
                Property Value = <span className={styles.formulaMath}>NOI ÷ (Cap Rate % ÷ 100)</span>
                <br />
                = {formatCurrency(result.effectiveNoi)} ÷ ({targetCapRatePercent}% ÷ 100) ={' '}
                <strong>{formatCurrency(result.calculatedValue)}</strong>
              </div>
            )}
            {activeTab === 'required-noi' && (
              <div>
                Required NOI = <span className={styles.formulaMath}>Purchase Price × (Target Cap Rate % ÷ 100)</span>
                <br />
                = {formatCurrency(purchasePrice)} × ({targetCapRatePercent}% ÷ 100) ={' '}
                <strong>{formatCurrency(result.calculatedRequiredNoi)}</strong>
              </div>
            )}
          </div>

          {/* Future Exit Valuation Projection Card */}
          {result.exitValue !== null && (
            <div className={styles.card} style={{ background: '#f8fafc' }}>
              <h4 className={styles.cardTitle} style={{ fontSize: '0.9rem' }}>
                Projected {holdingPeriodYears}-Year Exit Valuation
              </h4>
              <p className={styles.cardSubtitle}>
                At {annualNoiGrowthPercent}% annual NOI growth, Year {holdingPeriodYears} NOI is projected at{' '}
                <strong>{formatCurrency(result.projectedExitNoi)}</strong>. At a {exitCapRatePercent}% exit cap rate,
                the estimated disposition value is <strong>{formatCurrency(result.exitValue)}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
