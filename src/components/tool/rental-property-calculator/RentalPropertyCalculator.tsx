'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import RentalInputGuide, { RentalFieldId } from './RentalInputGuide';
import {
  calculateRentalProperty,
  RentalPropertyInput,
  RentalPropertyResult,
} from '@/lib/rental-property-engine';
import styles from './RentalPropertyCalculator.module.css';

export type RentalTabMode = 'returns' | 'pro-forma' | 'cash-vs-mortgage';

const TABS: TabItem<RentalTabMode>[] = [
  { id: 'returns', label: 'Returns & Cash Flow' },
  { id: 'pro-forma', label: '10-Year Pro Forma' },
  { id: 'cash-vs-mortgage', label: 'Cash vs Mortgage' },
];

function formatCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function formatPercent(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}

export default function RentalPropertyCalculator() {
  // Tab Navigation with URL sync
  const [activeTab, setActiveTab] = useState<RentalTabMode>('returns');

  // Input Guide active focus highlight
  const [activeField, setActiveField] = useState<RentalFieldId | null>(null);

  // Purchase Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(250000);
  const [closingCosts, setClosingCosts] = useState<number>(7500);
  const [upfrontRepairs, setUpfrontRepairs] = useState<number>(5000);

  // Financing Inputs
  const [isFinanced, setIsFinanced] = useState<boolean>(true);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(7.0);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [loanPointsPercent, setLoanPointsPercent] = useState<number>(0);

  // Income Inputs
  const [monthlyRent, setMonthlyRent] = useState<number>(2400);
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(0);
  const [vacancyPercent, setVacancyPercent] = useState<number>(5);

  // Operating Expenses Inputs
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(3000);
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(1400);
  const [hoaMonthly, setHoaMonthly] = useState<number>(0);
  const [utilitiesMonthly, setUtilitiesMonthly] = useState<number>(0);
  const [maintenancePercentOfRent, setMaintenancePercentOfRent] = useState<number>(5);
  const [capexPercentOfRent, setCapexPercentOfRent] = useState<number>(5);
  const [managementPercentOfEgi, setManagementPercentOfEgi] = useState<number>(8);
  const [otherExpensesAnnual, setOtherExpensesAnnual] = useState<number>(0);

  // Pro Forma Assumptions
  const [proFormaYears, setProFormaYears] = useState<number>(10);
  const [annualRentGrowthPercent, setAnnualRentGrowthPercent] = useState<number>(3);
  const [annualExpenseGrowthPercent, setAnnualExpenseGrowthPercent] = useState<number>(3);
  const [annualAppreciationPercent, setAnnualAppreciationPercent] = useState<number>(3);
  const [sellingCostPercent, setSellingCostPercent] = useState<number>(6);

  // Notification status
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);

  // Synchronize Tab with URL search params safely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as RentalTabMode;
        if (tabParam && ['returns', 'pro-forma', 'cash-vs-mortgage'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      } catch {
        // Fallback
      }
    };
    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = useCallback((tab: RentalTabMode) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Compute Engine Result
  const engineInput: RentalPropertyInput = useMemo(
    () => ({
      purchasePrice,
      closingCosts,
      upfrontRepairs,
      isFinanced,
      downPaymentPercent,
      interestRatePercent,
      loanTermYears,
      loanPointsPercent,
      monthlyRent,
      otherIncomeMonthly,
      vacancyPercent,
      propertyTaxAnnual,
      insuranceAnnual,
      hoaMonthly,
      utilitiesMonthly,
      maintenancePercentOfRent,
      capexPercentOfRent,
      managementPercentOfEgi,
      otherExpensesAnnual,
      proFormaYears,
      annualRentGrowthPercent,
      annualExpenseGrowthPercent,
      annualAppreciationPercent,
      sellingCostPercent,
    }),
    [
      purchasePrice,
      closingCosts,
      upfrontRepairs,
      isFinanced,
      downPaymentPercent,
      interestRatePercent,
      loanTermYears,
      loanPointsPercent,
      monthlyRent,
      otherIncomeMonthly,
      vacancyPercent,
      propertyTaxAnnual,
      insuranceAnnual,
      hoaMonthly,
      utilitiesMonthly,
      maintenancePercentOfRent,
      capexPercentOfRent,
      managementPercentOfEgi,
      otherExpensesAnnual,
      proFormaYears,
      annualRentGrowthPercent,
      annualExpenseGrowthPercent,
      annualAppreciationPercent,
      sellingCostPercent,
    ]
  );

  const result: RentalPropertyResult = useMemo(
    () => calculateRentalProperty(engineInput),
    [engineInput]
  );

  // Plain Summary Sentence
  const summarySentence = useMemo(() => {
    const cashStr = formatCurrency(result.totalCashInvested);
    const moCfStr = formatCurrency(Math.abs(result.monthlyCashFlow));
    const cocStr = formatPercent(result.cashOnCashPercent);
    const capStr = formatPercent(result.capRatePercent);

    if (result.monthlyCashFlow >= 0) {
      return `With ${cashStr} invested, this rental makes about ${moCfStr} a month after the mortgage: a ${cocStr} cash-on-cash return and a ${capStr} cap rate (before tax).`;
    }
    return `With ${cashStr} invested, this rental produces a negative cash flow of -${moCfStr} a month after debt service (${cocStr} cash-on-cash return, ${capStr} cap rate).`;
  }, [result]);

  // Actions
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleCopyCsv = () => {
    if (typeof window === 'undefined') return;
    const headers = [
      'Year',
      'Gross Rent',
      'Vacancy Loss',
      'Effective Gross Income',
      'Operating Expenses',
      'Net Operating Income',
      'Debt Service',
      'Cash Flow (Annual)',
      'Cash Flow (Monthly)',
      'Property Value',
      'Loan Balance',
      'Equity',
      'Total Return',
      'IRR %',
    ];
    const rows = result.proFormaYears.map((yr) => [
      yr.year,
      yr.grossRent.toFixed(2),
      yr.vacancyLoss.toFixed(2),
      yr.effectiveGrossIncome.toFixed(2),
      yr.operatingExpenses.toFixed(2),
      yr.noi.toFixed(2),
      yr.debtService.toFixed(2),
      yr.annualCashFlow.toFixed(2),
      yr.monthlyCashFlow.toFixed(2),
      yr.propertyValue.toFixed(2),
      yr.loanBalance.toFixed(2),
      yr.equity.toFixed(2),
      yr.totalReturn.toFixed(2),
      yr.irrPercent !== null ? `${yr.irrPercent.toFixed(2)}%` : '—',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2500);
    });
  };

  return (
    <div className={styles.wrap}>
      {/* Tab Segmented Control */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={handleTabChange}
        ariaLabel="Rental property calculator view modes"
      />

      <div className={styles.grid}>
        {/* INPUTS COLUMN */}
        <div className={styles.inputs}>
          {/* Visual Input Guide Diagram above inputs */}
          <RentalInputGuide
            mode={activeTab}
            activeField={activeField}
            price={purchasePrice}
            cashInvested={result.totalCashInvested}
            rent={monthlyRent}
            vacancyLossMonthly={result.vacancyLossAnnual / 12}
            expensesMonthly={result.expenses.totalOperatingExpensesMonthly}
            noiMonthly={result.noiMonthly}
            debtServiceMonthly={result.monthlyMortgagePayment}
            cashFlowMonthly={result.monthlyCashFlow}
            cocPercent={result.cashOnCashPercent}
            isFinanced={isFinanced}
            proFormaYears={proFormaYears}
            rentGrowthPercent={annualRentGrowthPercent}
            appreciationPercent={annualAppreciationPercent}
          />

          {/* Section 1: Purchase & Capital Outlay */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <span>🏢</span> Purchase &amp; Upfront Capital
            </h3>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="purchasePriceInput" className={styles.label}>
                  <span className={`${styles.badgeNumber} ${styles.badgeNumberBlue}`}>1</span>
                  Purchase Price
                </label>
                <span className={styles.exampleTag}>example — change to your numbers</span>
              </div>
              <div className={styles.inputWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="purchasePriceInput"
                  type="number"
                  min="0"
                  step="5000"
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  value={purchasePrice || ''}
                  onFocus={() => setActiveField('price')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label htmlFor="closingCostsInput" className={styles.label}>
                  <span className={`${styles.badgeNumber} ${styles.badgeNumberBlue}`}>3</span>
                  Closing Costs
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="closingCostsInput"
                    type="number"
                    min="0"
                    step="500"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={closingCosts || ''}
                    onFocus={() => setActiveField('closing')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setClosingCosts(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="upfrontRepairsInput" className={styles.label}>
                  <span className={`${styles.badgeNumber} ${styles.badgeNumberBlue}`}>4</span>
                  Upfront Repairs
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="upfrontRepairsInput"
                    type="number"
                    min="0"
                    step="500"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={upfrontRepairs || ''}
                    onFocus={() => setActiveField('repairs')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setUpfrontRepairs(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className={styles.summaryBarMini}>
              <span>Initial Cash Invested:</span>
              <strong>{formatCurrency(result.totalCashInvested)}</strong>
            </div>
          </div>

          {/* Section 2: Financing & Mortgage Terms */}
          <div className={styles.card}>
            <div className={styles.cardHeaderFlex}>
              <h3 className={styles.cardTitle} style={{ margin: 0 }}>
                <span>🏦</span> Financing &amp; Loan Terms
              </h3>
              <label className={styles.toggleWrap}>
                <input
                  type="checkbox"
                  checked={isFinanced}
                  onChange={(e) => setIsFinanced(e.target.checked)}
                />
                <span className={styles.toggleText}>{isFinanced ? 'Financed' : 'All-Cash'}</span>
              </label>
            </div>

            {isFinanced ? (
              <>
                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="downPaymentInput" className={styles.label}>
                      <span className={`${styles.badgeNumber} ${styles.badgeNumberBlue}`}>2</span>
                      Down Payment (%)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="downPaymentInput"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={downPaymentPercent || ''}
                        onFocus={() => setActiveField('down')}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="interestRateInput" className={styles.label}>
                      <span className={`${styles.badgeNumber} ${styles.badgeNumberPurple}`}>8</span>
                      Interest Rate (%)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="interestRateInput"
                        type="number"
                        min="0"
                        max="25"
                        step="0.125"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={interestRatePercent || ''}
                        onFocus={() => setActiveField('mortgage')}
                        onBlur={() => setActiveField(null)}
                        onChange={(e) => setInterestRatePercent(Number(e.target.value))}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="loanTermInput" className={styles.label}>
                      Loan Term (Years)
                    </label>
                    <select
                      id="loanTermInput"
                      className={styles.select}
                      value={loanTermYears}
                      onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    >
                      <option value={15}>15 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={25}>25 Years</option>
                      <option value={30}>30 Years</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="loanPointsInput" className={styles.label}>
                      Points &amp; Loan Fees (%)
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="loanPointsInput"
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                        value={loanPointsPercent || ''}
                        onChange={(e) => setLoanPointsPercent(Number(e.target.value))}
                      />
                      <span className={styles.suffix}>%</span>
                    </div>
                  </div>
                </div>

                <div className={styles.summaryBarMini}>
                  <span>Mortgage Payment (P&amp;I):</span>
                  <strong>{formatCurrency(result.monthlyMortgagePayment)}/mo</strong>
                </div>
              </>
            ) : (
              <p className={styles.allCashNotice}>
                All-cash deal selected: loan debt service is $0. Initial cash outlay equals 100% of price plus closing and repairs ({formatCurrency(result.totalCashInvested)}).
              </p>
            )}
          </div>

          {/* Section 3: Rental Income */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <span>💵</span> Rental Revenue
            </h3>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="monthlyRentInput" className={styles.label}>
                  <span className={`${styles.badgeNumber} ${styles.badgeNumberGreen}`}>5</span>
                  Gross Monthly Rent
                </label>
                <span className={styles.exampleTag}>example — change to your numbers</span>
              </div>
              <div className={styles.inputWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  id="monthlyRentInput"
                  type="number"
                  min="0"
                  step="50"
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  value={monthlyRent || ''}
                  onFocus={() => setActiveField('rent')}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label htmlFor="otherIncomeInput" className={styles.label}>
                  Other Income ($/mo)
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="otherIncomeInput"
                    type="number"
                    min="0"
                    step="25"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={otherIncomeMonthly || ''}
                    onChange={(e) => setOtherIncomeMonthly(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="vacancyPercentInput" className={styles.label}>
                  <span className={`${styles.badgeNumber} ${styles.badgeNumberAmber}`}>6</span>
                  Vacancy Allowance (%)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="vacancyPercentInput"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
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

            <div className={styles.summaryBarMini}>
              <span>Effective Gross Income (EGI):</span>
              <strong>{formatCurrency(result.effectiveGrossIncomeAnnual)}/yr</strong>
            </div>
          </div>

          {/* Section 4: Operating Expenses */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <span>📉</span> Operating Expenses (Excluding Debt Service)
            </h3>

            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label htmlFor="propertyTaxInput" className={styles.label}>
                  <span className={`${styles.badgeNumber} ${styles.badgeNumberRed}`}>7</span>
                  Property Tax ($/yr)
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="propertyTaxInput"
                    type="number"
                    min="0"
                    step="100"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={propertyTaxAnnual || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="insuranceInput" className={styles.label}>
                  Hazard Insurance ($/yr)
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="insuranceInput"
                    type="number"
                    min="0"
                    step="50"
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
                <label htmlFor="hoaInput" className={styles.label}>
                  HOA Dues ($/mo)
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="hoaInput"
                    type="number"
                    min="0"
                    step="25"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={hoaMonthly || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setHoaMonthly(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="utilitiesInput" className={styles.label}>
                  Owner Utilities ($/mo)
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="utilitiesInput"
                    type="number"
                    min="0"
                    step="25"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={utilitiesMonthly || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setUtilitiesMonthly(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label htmlFor="maintPctInput" className={styles.label}>
                  Maintenance (% of rent)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="maintPctInput"
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={maintenancePercentOfRent || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setMaintenancePercentOfRent(Number(e.target.value))}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="capexPctInput" className={styles.label}>
                  CapEx Reserve (% of rent)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="capexPctInput"
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={capexPercentOfRent || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setCapexPercentOfRent(Number(e.target.value))}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label htmlFor="mgmtPctInput" className={styles.label}>
                  Management Fee (% of EGI)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="mgmtPctInput"
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={managementPercentOfEgi || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setManagementPercentOfEgi(Number(e.target.value))}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="otherExpInput" className={styles.label}>
                  Other Expenses ($/yr)
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="otherExpInput"
                    type="number"
                    min="0"
                    step="100"
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                    value={otherExpensesAnnual || ''}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setOtherExpensesAnnual(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className={styles.summaryBarMini}>
              <span>Total Operating Expenses:</span>
              <strong>{formatCurrency(result.expenses.totalOperatingExpensesAnnual)}/yr</strong>
            </div>
          </div>

          {/* Section 5: Pro Forma Assumptions */}
          <details className={styles.detailsBox}>
            <summary className={styles.detailsSummary}>
              📈 Multi-Year Growth &amp; Appreciation Assumptions
            </summary>
            <div className={styles.detailsContent}>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="proFormaYearsSelect" className={styles.label}>
                    Projection Horizon
                  </label>
                  <select
                    id="proFormaYearsSelect"
                    className={styles.select}
                    value={proFormaYears}
                    onChange={(e) => setProFormaYears(Number(e.target.value))}
                  >
                    <option value={5}>5 Years</option>
                    <option value={10}>10 Years</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="rentGrowthInput" className={styles.label}>
                    Annual Rent Growth (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id="rentGrowthInput"
                      type="number"
                      step="0.5"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={annualRentGrowthPercent || ''}
                      onFocus={() => setActiveField('proforma')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setAnnualRentGrowthPercent(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="expGrowthInput" className={styles.label}>
                    Annual Expense Inflation (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id="expGrowthInput"
                      type="number"
                      step="0.5"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={annualExpenseGrowthPercent || ''}
                      onFocus={() => setActiveField('proforma')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setAnnualExpenseGrowthPercent(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="apprecInput" className={styles.label}>
                    Annual Property Appreciation (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id="apprecInput"
                      type="number"
                      step="0.5"
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                      value={annualAppreciationPercent || ''}
                      onFocus={() => setActiveField('proforma')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setAnnualAppreciationPercent(Number(e.target.value))}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="sellingCostInput" className={styles.label}>
                  Estimated Future Selling Costs (%)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    id="sellingCostInput"
                    type="number"
                    step="0.5"
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                    value={sellingCostPercent || ''}
                    onFocus={() => setActiveField('proforma')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setSellingCostPercent(Number(e.target.value))}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* RESULTS COLUMN */}
        <div className={styles.results}>
          {/* Primary Hero Result Card */}
          <div className={styles.heroCard} aria-live="polite">
            <div className={styles.heroHead}>
              <span className={styles.heroTag}>Primary Cash Flow Return</span>
              <span className={styles.heroDirection}>
                {result.monthlyCashFlow >= 0 ? 'Positive Cash Flow' : 'Negative Cash Flow'}
              </span>
            </div>

            <div className={styles.heroValue}>
              {formatCurrency(result.monthlyCashFlow)}
              <span className={styles.heroValueSub}>/mo</span>
            </div>

            <div className={styles.heroSub}>
              {formatCurrency(result.annualCashFlow)} annual net cash flow after debt service
            </div>
          </div>

          {/* Light Summary Banner (Proven High-Contrast Light Box) */}
          <div className={styles.summaryBanner}>
            <div className={styles.summaryIcon}>✓</div>
            <p className={styles.summaryText}>{summarySentence}</p>
          </div>

          {/* Action Bar */}
          <div className={styles.actionBar}>
            <button
              type="button"
              className={`${styles.actionBtn} ${copiedLink ? styles.copySuccess : ''}`}
              onClick={handleShare}
            >
              {copiedLink ? '✓ Link Copied!' : '🔗 Share / Save Link'}
            </button>
            <button type="button" className={styles.actionBtn} onClick={handlePrint}>
              🖨️ Print Pro Forma
            </button>
            {activeTab === 'pro-forma' && (
              <button
                type="button"
                className={`${styles.actionBtn} ${copiedCsv ? styles.copySuccess : ''}`}
                onClick={handleCopyCsv}
              >
                {copiedCsv ? '✓ CSV Copied!' : '📋 Copy CSV'}
              </button>
            )}
          </div>

          {/* TAB 1: RETURNS & CASH FLOW */}
          {activeTab === 'returns' && (
            <>
              {/* Core Real Estate Metrics Grid */}
              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Underwriting Ratios &amp; Yields</h4>
                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Cash-on-Cash (CoC)</div>
                    <div className={`${styles.metricValue} ${styles.metricHighlight}`}>
                      {formatPercent(result.cashOnCashPercent)}
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Cap Rate</div>
                    <div className={styles.metricValue}>{formatPercent(result.capRatePercent)}</div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>DSCR Ratio</div>
                    <div className={styles.metricValue}>
                      {result.dscr !== null ? `${result.dscr.toFixed(2)}×` : 'All-Cash'}
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Gross Yield</div>
                    <div className={styles.metricValue}>
                      {formatPercent(result.grossYieldPercent)}
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Net Yield</div>
                    <div className={styles.metricValue}>
                      {formatPercent(result.netYieldPercent)}
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Gross Rent Mult</div>
                    <div className={styles.metricValue}>
                      {result.grm !== null ? `${result.grm.toFixed(2)}×` : '—'}
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Rent-to-Price (1%)</div>
                    <div className={styles.metricValue}>
                      {formatPercent(result.rentToPricePercent)}
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <div className={styles.metricLabel}>Break-Even Occ</div>
                    <div className={styles.metricValue}>
                      {formatPercent(result.breakEvenOccupancyPercent)}
                    </div>
                  </div>
                </div>

                <div className={styles.ruleNote}>
                  <strong>1% Rule:</strong>{' '}
                  {result.meetsOnePercentRule ? (
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      ✓ Met ({formatPercent(result.rentToPricePercent)})
                    </span>
                  ) : (
                    <span style={{ color: '#d97706', fontWeight: 700 }}>
                      ✕ Not met ({formatPercent(result.rentToPricePercent)})
                    </span>
                  )}{' '}
                  — Rule of thumb screening indicator, not definitive investment advice.
                </div>
              </div>

              {/* Income -> NOI -> Cash Flow Waterfall Breakdown */}
              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Monthly &amp; Annual Cash Flow Waterfall</h4>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th scope="col">Cash Flow Component</th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          Monthly
                        </th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          Annual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Gross Scheduled Rent</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(monthlyRent)}</td>
                        <td style={{ textAlign: 'right' }}>
                          {formatCurrency(result.grossRentAnnual)}
                        </td>
                      </tr>
                      {otherIncomeMonthly > 0 && (
                        <tr>
                          <td>+ Ancillary Other Income</td>
                          <td style={{ textAlign: 'right' }}>
                            {formatCurrency(otherIncomeMonthly)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {formatCurrency(result.otherIncomeAnnual)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ color: '#d97706' }}>− Vacancy Allowance ({vacancyPercent}%)</td>
                        <td style={{ textAlign: 'right', color: '#d97706' }}>
                          −{formatCurrency(result.vacancyLossAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right', color: '#d97706' }}>
                          −{formatCurrency(result.vacancyLossAnnual)}
                        </td>
                      </tr>
                      <tr className={styles.subtotalRow}>
                        <td>= Effective Gross Income (EGI)</td>
                        <td style={{ textAlign: 'right' }}>
                          {formatCurrency(result.effectiveGrossIncomeAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {formatCurrency(result.effectiveGrossIncomeAnnual)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.25rem' }}>Property Taxes</td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.propertyTaxAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.propertyTaxAnnual)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.25rem' }}>Hazard Insurance</td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.insuranceAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.insuranceAnnual)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.25rem' }}>Maintenance &amp; Repairs</td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.maintenanceAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.maintenanceAnnual)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.25rem' }}>Capital Reserves (CapEx)</td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.capexAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.capexAnnual)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: '1.25rem' }}>Property Management Fee</td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.managementAnnual / 12)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          −{formatCurrency(result.expenses.managementAnnual)}
                        </td>
                      </tr>
                      <tr className={styles.subtotalRow} style={{ color: '#6b21a8' }}>
                        <td>= Net Operating Income (NOI)</td>
                        <td style={{ textAlign: 'right', fontWeight: 800 }}>
                          {formatCurrency(result.noiMonthly)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800 }}>
                          {formatCurrency(result.noiAnnual)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: '#7c3aed' }}>
                          − Debt Service (Mortgage P&amp;I)
                        </td>
                        <td style={{ textAlign: 'right', color: '#7c3aed' }}>
                          {isFinanced ? `−${formatCurrency(result.monthlyMortgagePayment)}` : '$0'}
                        </td>
                        <td style={{ textAlign: 'right', color: '#7c3aed' }}>
                          {isFinanced ? `−${formatCurrency(result.annualDebtService)}` : '$0'}
                        </td>
                      </tr>
                      <tr className={styles.totalRow}>
                        <td>= Net Cash Flow (Pocket)</td>
                        <td style={{ textAlign: 'right', fontWeight: 900 }}>
                          {formatCurrency(result.monthlyCashFlow)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 900 }}>
                          {formatCurrency(result.annualCashFlow)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PRO FORMA (10-YEAR HORIZON) */}
          {activeTab === 'pro-forma' && (
            <>
              {/* Equity vs Loan Balance SVG Visualization */}
              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Property Value &amp; Equity Amortization</h4>
                <div className={styles.chartWrap}>
                  <svg
                    viewBox="0 0 540 180"
                    className={styles.chartSvg}
                    role="img"
                    aria-label="10-year equity and loan balance amortization projection chart"
                    focusable="false"
                  >
                    {/* SVG axes and lines */}
                    <line x1="45" y1="20" x2="45" y2="150" stroke="var(--line, #cbd5e1)" strokeWidth="1" />
                    <line x1="45" y1="150" x2="520" y2="150" stroke="var(--line, #cbd5e1)" strokeWidth="1" />

                    {/* Pro Forma SVG Points and Line Generator */}
                    {(() => {
                      const maxVal = result.proFormaYears[result.proFormaYears.length - 1]?.propertyValue || 350000;
                      const xStep = (520 - 45) / Math.max(1, result.proFormaYears.length - 1);

                      const valPoints = result.proFormaYears
                        .map((yr, idx) => {
                          const x = 45 + idx * xStep;
                          const y = 150 - (yr.propertyValue / maxVal) * 125;
                          return `${x},${y}`;
                        })
                        .join(' ');

                      const loanPoints = result.proFormaYears
                        .map((yr, idx) => {
                          const x = 45 + idx * xStep;
                          const y = 150 - (yr.loanBalance / maxVal) * 125;
                          return `${x},${y}`;
                        })
                        .join(' ');

                      return (
                        <>
                          {/* Value Area / Line */}
                          <polyline
                            points={valPoints}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                          />
                          {/* Loan Line */}
                          <polyline
                            points={loanPoints}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                          />

                          {/* Year Markers */}
                          {result.proFormaYears.map((yr, idx) => {
                            const x = 45 + idx * xStep;
                            return (
                              <g key={yr.year}>
                                <line x1={x} y1="148" x2={x} y2="152" stroke="var(--ink, #0f172a)" />
                                <text x={x} y="166" fontSize="10" textAnchor="middle" fill="var(--muted, #64748b)">
                                  Y{yr.year}
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                  <div className={styles.chartLegend}>
                    <span>
                      <strong style={{ color: '#10b981' }}>——</strong> Property Value (3% Apprec)
                    </span>
                    <span>
                      <strong style={{ color: '#ef4444' }}>- - -</strong> Remaining Mortgage Debt
                    </span>
                  </div>
                </div>
              </div>

              {/* 10-Year Pro Forma Table */}
              <div className={styles.card}>
                <div className={styles.cardHeaderFlex}>
                  <h4 className={styles.cardTitle} style={{ margin: 0 }}>
                    {proFormaYears}-Year Investment Pro Forma
                  </h4>
                  <button type="button" className={styles.csvBtn} onClick={handleCopyCsv}>
                    {copiedCsv ? '✓ Copied' : 'Copy CSV'}
                  </button>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th scope="col">Year</th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          NOI
                        </th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          Debt Svc
                        </th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          Cash Flow
                        </th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          Loan Bal
                        </th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          Equity
                        </th>
                        <th scope="col" style={{ textAlign: 'right' }}>
                          IRR %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.proFormaYears.map((row) => (
                        <tr key={row.year}>
                          <td>
                            <strong>Year {row.year}</strong>
                          </td>
                          <td style={{ textAlign: 'right' }}>{formatCurrency(row.noi)}</td>
                          <td style={{ textAlign: 'right' }}>{formatCurrency(row.debtService)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: row.annualCashFlow >= 0 ? '#059669' : '#dc2626' }}>
                            {formatCurrency(row.annualCashFlow)}
                          </td>
                          <td style={{ textAlign: 'right' }}>{formatCurrency(row.loanBalance)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>
                            {formatCurrency(row.equity)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {row.irrPercent !== null ? `${row.irrPercent.toFixed(1)}%` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: CASH VS MORTGAGE COMPARISON */}
          {activeTab === 'cash-vs-mortgage' && (
            <div className={styles.card}>
              <h4 className={styles.cardTitle}>Financed vs All-Cash Deal Comparison</h4>
              <p className={styles.comparisonLead}>
                Comparing the exact same $250k property purchased with 25% down ({interestRatePercent}% financing) versus 100% all-cash.
              </p>

              <div className={styles.compareGrid}>
                {/* Financed Column */}
                <div className={styles.compareCard}>
                  <div className={styles.compareHead}>
                    <span className={styles.compareTag}>Financed (25% Down)</span>
                    <strong className={styles.compareValue}>
                      {formatCurrency(result.comparison.financed.monthlyCashFlow)}
                      <span className={styles.heroValueSub}>/mo</span>
                    </strong>
                  </div>

                  <ul className={styles.compareList}>
                    <li>
                      <span>Cash Invested:</span>
                      <strong>{formatCurrency(result.comparison.financed.cashInvested)}</strong>
                    </li>
                    <li>
                      <span>Annual Cash Flow:</span>
                      <strong>{formatCurrency(result.comparison.financed.annualCashFlow)}</strong>
                    </li>
                    <li>
                      <span>Cash-on-Cash:</span>
                      <strong style={{ color: '#059669' }}>
                        {formatPercent(result.comparison.financed.cashOnCashPercent)}
                      </strong>
                    </li>
                    <li>
                      <span>Cap Rate:</span>
                      <strong>{formatPercent(result.comparison.financed.capRatePercent)}</strong>
                    </li>
                    <li>
                      <span>Debt Coverage (DSCR):</span>
                      <strong>
                        {result.comparison.financed.dscr !== null
                          ? `${result.comparison.financed.dscr.toFixed(2)}×`
                          : '—'}
                      </strong>
                    </li>
                    <li>
                      <span>10-Yr Total Return:</span>
                      <strong>{formatCurrency(result.comparison.financed.tenYearTotalReturn)}</strong>
                    </li>
                    <li>
                      <span>10-Yr Target IRR:</span>
                      <strong style={{ color: '#2563eb' }}>
                        {formatPercent(result.comparison.financed.tenYearIrrPercent)}
                      </strong>
                    </li>
                  </ul>
                </div>

                {/* All-Cash Column */}
                <div className={styles.compareCard}>
                  <div className={styles.compareHead}>
                    <span className={styles.compareTag}>100% All-Cash</span>
                    <strong className={styles.compareValue}>
                      {formatCurrency(result.comparison.allCash.monthlyCashFlow)}
                      <span className={styles.heroValueSub}>/mo</span>
                    </strong>
                  </div>

                  <ul className={styles.compareList}>
                    <li>
                      <span>Cash Invested:</span>
                      <strong>{formatCurrency(result.comparison.allCash.cashInvested)}</strong>
                    </li>
                    <li>
                      <span>Annual Cash Flow:</span>
                      <strong>{formatCurrency(result.comparison.allCash.annualCashFlow)}</strong>
                    </li>
                    <li>
                      <span>Cash-on-Cash:</span>
                      <strong style={{ color: '#059669' }}>
                        {formatPercent(result.comparison.allCash.cashOnCashPercent)}
                      </strong>
                    </li>
                    <li>
                      <span>Cap Rate:</span>
                      <strong>{formatPercent(result.comparison.allCash.capRatePercent)}</strong>
                    </li>
                    <li>
                      <span>Debt Coverage (DSCR):</span>
                      <span style={{ color: 'var(--muted, #64748b)' }}>No Mortgage</span>
                    </li>
                    <li>
                      <span>10-Yr Total Return:</span>
                      <strong>{formatCurrency(result.comparison.allCash.tenYearTotalReturn)}</strong>
                    </li>
                    <li>
                      <span>10-Yr Target IRR:</span>
                      <strong style={{ color: '#2563eb' }}>
                        {formatPercent(result.comparison.allCash.tenYearIrrPercent)}
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
