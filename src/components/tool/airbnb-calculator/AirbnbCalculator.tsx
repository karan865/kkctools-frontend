'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import AirbnbInputGuide, { StrFieldId } from './AirbnbInputGuide';
import styles from './AirbnbCalculator.module.css';
import {
  calculateStrProfit,
  calculateStrScenarios,
  compareStrVsLtr,
  StrRevenueInput,
  StrPlatformFeesInput,
  StrVariableCostsInput,
  StrFixedCostsInput,
  StrTaxInput,
  StrFinancingInput,
  StrLtrComparisonInput,
} from '../../../lib/str-engine';

type StrTab = 'buy' | 'arbitrage' | 'midterm' | 'str-vs-ltr';

const TABS: TabItem<StrTab>[] = [
  { id: 'buy', label: 'Buy & Host' },
  { id: 'arbitrage', label: 'Rental Arbitrage' },
  { id: 'midterm', label: 'Mid-Term Rental' },
  { id: 'str-vs-ltr', label: 'STR vs Long-Term' },
];

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function fmtDec(n: number | null | undefined, dec = 1): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function AirbnbCalculatorInner() {
  const [activeTab, setActiveTab] = useState<StrTab>('buy');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as StrTab;
      if (tabParam === 'arbitrage' || tabParam === 'midterm' || tabParam === 'str-vs-ltr') {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: StrTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<StrFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Revenue Inputs
  const [nightlyRate, setNightlyRate] = useState<number>(180);
  const [occupancyPct, setOccupancyPct] = useState<number>(65);
  const [nightsAvailable, setNightsAvailable] = useState<number>(365);
  const [avgStayNights, setAvgStayNights] = useState<number>(3);
  const [cleaningFeeCharged, setCleaningFeeCharged] = useState<number>(90);
  const [weekendUpliftPct, setWeekendUpliftPct] = useState<number>(0);
  const [otherIncomeAnnual, setOtherIncomeAnnual] = useState<number>(0);

  // Platform & Tax Inputs
  const [hostFeePct, setHostFeePct] = useState<number>(3);
  const [paymentFeePct, setPaymentFeePct] = useState<number>(0);
  const [occupancyTaxPct, setOccupancyTaxPct] = useState<number>(0);

  // Variable Costs
  const [cleaningCost, setCleaningCost] = useState<number>(80);
  const [suppliesCost, setSuppliesCost] = useState<number>(10);
  const [managementPct, setManagementPct] = useState<number>(0);
  const [maintenancePct, setMaintenancePct] = useState<number>(5);

  // Fixed Monthly Bills
  const [utilitiesMonthly, setUtilitiesMonthly] = useState<number>(250);
  const [internetMonthly, setInternetMonthly] = useState<number>(60);
  const [insuranceMonthly, setInsuranceMonthly] = useState<number>(150);
  const [softwareMonthly, setSoftwareMonthly] = useState<number>(0);
  const [hoaMonthly, setHoaMonthly] = useState<number>(0);
  const [licencesAnnual, setLicencesAnnual] = useState<number>(0);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(0);

  // Financing / Rent
  const [mortgageMonthly, setMortgageMonthly] = useState<number>(1800);
  const [rentToLandlordMonthly, setRentToLandlordMonthly] = useState<number>(2000);
  const [cashInvested, setCashInvested] = useState<number>(60000);
  const [startupCost, setStartupCost] = useState<number>(15000);
  const [purchasePrice, setPurchasePrice] = useState<number>(300000);

  // Long-Term Rental Compare Inputs
  const [ltrRentMonthly, setLtrRentMonthly] = useState<number>(2400);
  const [ltrVacancyPct, setLtrVacancyPct] = useState<number>(5);
  const [ltrManagementPct, setLtrManagementPct] = useState<number>(8);
  const [ltrMaintenancePct, setLtrMaintenancePct] = useState<number>(5);

  // Compute Engine Result
  const revenueInput: StrRevenueInput = useMemo(
    () => ({
      nightlyRate: activeTab === 'midterm' ? Math.max(20, nightlyRate * 0.6) : nightlyRate,
      occupancyPct: activeTab === 'midterm' ? Math.max(50, Math.min(95, occupancyPct + 15)) : occupancyPct,
      nightsAvailable,
      avgStayNights: activeTab === 'midterm' ? Math.max(30, avgStayNights * 10) : avgStayNights,
      cleaningFeeCharged,
      weekendUpliftPct: activeTab === 'midterm' ? 0 : weekendUpliftPct,
      otherIncomeAnnual,
    }),
    [activeTab, nightlyRate, occupancyPct, nightsAvailable, avgStayNights, cleaningFeeCharged, weekendUpliftPct, otherIncomeAnnual]
  );

  const platformInput: StrPlatformFeesInput = useMemo(
    () => ({
      hostFeePct,
      paymentProcessingFeePct: paymentFeePct,
    }),
    [hostFeePct, paymentFeePct]
  );

  const variableInput: StrVariableCostsInput = useMemo(
    () => ({
      cleaningCostPerTurnover: cleaningCost,
      suppliesPerStay: suppliesCost,
      managementFeePct: managementPct,
      maintenancePct,
    }),
    [cleaningCost, suppliesCost, managementPct, maintenancePct]
  );

  const fixedInput: StrFixedCostsInput = useMemo(
    () => ({
      utilitiesMonthly,
      internetMonthly,
      insuranceMonthly,
      softwareMonthly,
      hoaMonthly,
      licencesAnnual,
      propertyTaxAnnual,
    }),
    [utilitiesMonthly, internetMonthly, insuranceMonthly, softwareMonthly, hoaMonthly, licencesAnnual, propertyTaxAnnual]
  );

  const taxInput: StrTaxInput = useMemo(
    () => ({
      occupancyTaxPct,
    }),
    [occupancyTaxPct]
  );

  const financingInput: StrFinancingInput = useMemo(
    () => ({
      mode: activeTab === 'arbitrage' ? 'arbitrage' : activeTab === 'midterm' ? 'midterm' : 'buy',
      mortgagePaymentMonthly: mortgageMonthly,
      rentToLandlordMonthly,
      cashInvested: activeTab === 'arbitrage' ? Math.max(1000, rentToLandlordMonthly * 2) : cashInvested,
      startupCost,
      propertyPurchasePrice: purchasePrice,
    }),
    [activeTab, mortgageMonthly, rentToLandlordMonthly, cashInvested, startupCost, purchasePrice]
  );

  const analysis = useMemo(
    () =>
      calculateStrProfit(
        revenueInput,
        platformInput,
        variableInput,
        fixedInput,
        taxInput,
        financingInput
      ),
    [revenueInput, platformInput, variableInput, fixedInput, taxInput, financingInput]
  );

  const scenarios = useMemo(
    () =>
      calculateStrScenarios(
        revenueInput,
        platformInput,
        variableInput,
        fixedInput,
        taxInput,
        financingInput
      ),
    [revenueInput, platformInput, variableInput, fixedInput, taxInput, financingInput]
  );

  const ltrComparisonInput: StrLtrComparisonInput = useMemo(
    () => ({
      monthlyLtrRent: ltrRentMonthly,
      ltrVacancyPct,
      ltrManagementPct,
      ltrMaintenancePct,
    }),
    [ltrRentMonthly, ltrVacancyPct, ltrManagementPct, ltrMaintenancePct]
  );

  const ltrCompareResult = useMemo(
    () => compareStrVsLtr(analysis, financingInput, ltrComparisonInput),
    [analysis, financingInput, ltrComparisonInput]
  );

  // Copy Summary Handler
  const handleCopySummary = () => {
    const text = [
      `KKC Tools — Short-Term Rental Profit Report (${activeTab.toUpperCase()})`,
      `ADR: $${Math.round(revenueInput.nightlyRate)}/night · Occupancy: ${revenueInput.occupancyPct}% (${Math.round(analysis.bookedNights)} nights/yr)`,
      `Gross Annual Revenue: ${fmt(analysis.grossRevenueAnnual)} (${fmt(analysis.grossRevenueMonthly)}/mo)`,
      `Platform Fees: ${fmt(analysis.platformFeesAnnual)} · Variable Costs: ${fmt(analysis.totalVariableCostsAnnual)} · Fixed Bills: ${fmt(analysis.totalFixedCostsAnnual)}`,
      `Net Operating Income (NOI): ${fmt(analysis.noiAnnual)}/yr (${fmt(analysis.noiMonthly)}/mo)`,
      `Debt / Rent: ${fmt(analysis.annualDebtServiceOrRent)}/yr`,
      `Net Cash Flow: ${fmt(analysis.cashFlowAnnual)}/yr (${fmt(analysis.cashFlowMonthly)}/mo)`,
      analysis.cashOnCashReturnPct !== null ? `Cash-on-Cash Return: ${fmtDec(analysis.cashOnCashReturnPct)}%` : null,
      analysis.breakEvenOccupancyPct !== null ? `Break-Even Occupancy: ${fmtDec(analysis.breakEvenOccupancyPct)}%` : null,
      analysis.paybackPeriodMonths !== null ? `Furniture Payback: ${fmtDec(analysis.paybackPeriodMonths)} months` : null,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const monthlyBillsTotal = utilitiesMonthly + internetMonthly + insuranceMonthly + softwareMonthly + hoaMonthly;

  return (
    <div className={styles.calcContainer}>
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="Short-term rental analysis modes" />

      {/* Visual Input Guide Diagram */}
      <AirbnbInputGuide
        mode={activeTab}
        activeField={activeField}
        nightlyRate={revenueInput.nightlyRate}
        occupancyPct={revenueInput.occupancyPct}
        avgStayNights={revenueInput.avgStayNights ?? 3}
        cleaningFeeCharged={revenueInput.cleaningFeeCharged ?? 0}
        hostFeePct={platformInput.hostFeePct}
        cleaningCost={variableInput.cleaningCostPerTurnover}
        suppliesCost={variableInput.suppliesPerStay}
        monthlyFixedBills={monthlyBillsTotal}
        monthlyDebtOrRent={
          activeTab === 'arbitrage'
            ? financingInput.rentToLandlordMonthly ?? 0
            : financingInput.mortgagePaymentMonthly ?? 0
        }
      />

      {/* Dynamic Summary Banner (BLUF) */}
      <div className={styles.summaryBanner}>
        At <strong>${Math.round(revenueInput.nightlyRate)} a night</strong> and{' '}
        <strong>{revenueInput.occupancyPct}% occupancy</strong> ({Math.round(analysis.bookedNights)} booked nights/yr),
        this property generates <strong>{fmt(analysis.grossRevenueAnnual)} per year</strong> in gross revenue and keeps{' '}
        <strong>{fmt(analysis.cashFlowMonthly)} per month</strong> in true net cash flow after operating costs and{' '}
        {activeTab === 'arbitrage' ? 'master lease rent' : 'mortgage financing'}.{' '}
        {analysis.breakEvenOccupancyPct !== null ? (
          <>
            It breaks even at <strong>{fmtDec(analysis.breakEvenOccupancyPct)}% occupancy</strong>.
          </>
        ) : null}
      </div>

      <div className={styles.honestyNote}>
        <strong>Honest Input Standard:</strong> You enter your own nightly rate and occupancy from your listing history,
        comparable properties, or market research. We run the complete un-gated expense model including platform fees,
        turnover supplies, operating reserves, and financing.
      </div>

      <div className={styles.gridTwoCol}>
        {/* Left Column: Form Inputs */}
        <div className={styles.inputsCol}>
          {/* Card 1: Revenue Parameters */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardStepBadge}>1</span>
              <h2 className={styles.cardTitle}>Guest Revenue &amp; Calendar Occupancy</h2>
            </div>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="nightlyRate">
                  Nightly Rate (ADR)
                  <span className={styles.inputSubtext}>Base average</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="nightlyRate"
                    type="number"
                    min={1}
                    max={50000}
                    value={nightlyRate}
                    onChange={(e) => setNightlyRate(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('nightlyRate')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="occupancyPct">
                  Occupancy Rate
                  <span className={styles.inputSubtext}>Annual %</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="occupancyPct"
                    type="number"
                    min={0}
                    max={100}
                    value={occupancyPct}
                    onChange={(e) => setOccupancyPct(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('occupancyPct')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                  />
                  <span className={styles.inputSuffix}>%</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="avgStayNights">
                  Average Stay Duration
                  <span className={styles.inputSubtext}>Nights per guest</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="avgStayNights"
                    type="number"
                    min={1}
                    max={365}
                    value={avgStayNights}
                    onChange={(e) => setAvgStayNights(Number(e.target.value) || 1)}
                    onFocus={() => setActiveField('avgStayNights')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                  />
                  <span className={styles.inputSuffix}>nights</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="cleaningFeeCharged">
                  Cleaning Fee to Guest
                  <span className={styles.inputSubtext}>Charged per stay</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="cleaningFeeCharged"
                    type="number"
                    min={0}
                    value={cleaningFeeCharged}
                    onChange={(e) => setCleaningFeeCharged(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('cleaningFeeCharged')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              {activeTab !== 'midterm' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="weekendUpliftPct">
                    Weekend Rate Uplift
                    <span className={styles.inputSubtext}>Fri-Sat premium</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="weekendUpliftPct"
                      type="number"
                      min={0}
                      max={100}
                      value={weekendUpliftPct}
                      onChange={(e) => setWeekendUpliftPct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="otherIncomeAnnual">
                  Other Annual Income
                  <span className={styles.inputSubtext}>Pets, parking, fees</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="otherIncomeAnnual"
                    type="number"
                    min={0}
                    value={otherIncomeAnnual}
                    onChange={(e) => setOtherIncomeAnnual(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Platform Fees & Turnover Costs */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardStepBadge}>2</span>
              <h2 className={styles.cardTitle}>Platform &amp; Variable Turnover Expenses</h2>
            </div>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="hostFeePct">
                  Platform Host Fee
                  <span className={styles.inputSubtext}>Airbnb / Vrbo %</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="hostFeePct"
                    type="number"
                    step="0.5"
                    min={0}
                    max={30}
                    value={hostFeePct}
                    onChange={(e) => setHostFeePct(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('platformFee')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                  />
                  <span className={styles.inputSuffix}>%</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="cleaningCost">
                  Cleaning Cost per Turnover
                  <span className={styles.inputSubtext}>Paid to cleaner</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="cleaningCost"
                    type="number"
                    min={0}
                    value={cleaningCost}
                    onChange={(e) => setCleaningCost(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('cleaningCost')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="suppliesCost">
                  Guest Supplies per Stay
                  <span className={styles.inputSubtext}>Coffee, toiletries</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="suppliesCost"
                    type="number"
                    min={0}
                    value={suppliesCost}
                    onChange={(e) => setSuppliesCost(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="maintenancePct">
                  Maintenance Reserve
                  <span className={styles.inputSubtext}>% of gross revenue</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="maintenancePct"
                    type="number"
                    min={0}
                    max={25}
                    value={maintenancePct}
                    onChange={(e) => setMaintenancePct(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithSuffix}`}
                  />
                  <span className={styles.inputSuffix}>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Fixed Bills & Operating Overhead */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardStepBadge}>3</span>
              <h2 className={styles.cardTitle}>Fixed Monthly Bills &amp; Insurance</h2>
            </div>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="utilitiesMonthly">
                  Monthly Utilities
                  <span className={styles.inputSubtext}>Power, gas, water</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="utilitiesMonthly"
                    type="number"
                    min={0}
                    value={utilitiesMonthly}
                    onChange={(e) => setUtilitiesMonthly(Number(e.target.value) || 0)}
                    onFocus={() => setActiveField('fixedBills')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                  <span className={styles.inputSuffix}>/mo</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="internetMonthly">
                  High-Speed Internet
                  <span className={styles.inputSubtext}>Wi-Fi &amp; streaming</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="internetMonthly"
                    type="number"
                    min={0}
                    value={internetMonthly}
                    onChange={(e) => setInternetMonthly(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                  <span className={styles.inputSuffix}>/mo</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="insuranceMonthly">
                  STR Commercial Insurance
                  <span className={styles.inputSubtext}>Liability policy</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="insuranceMonthly"
                    type="number"
                    min={0}
                    value={insuranceMonthly}
                    onChange={(e) => setInsuranceMonthly(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                  <span className={styles.inputSuffix}>/mo</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="licencesAnnual">
                  Annual Permits &amp; Licenses
                  <span className={styles.inputSubtext}>City STR permit</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="licencesAnnual"
                    type="number"
                    min={0}
                    value={licencesAnnual}
                    onChange={(e) => setLicencesAnnual(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                  <span className={styles.inputSuffix}>/yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Financing & Capital Setup */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardStepBadge}>4</span>
              <h2 className={styles.cardTitle}>
                {activeTab === 'arbitrage' ? 'Master Lease Rent &amp; Startup' : 'Financing Debt &amp; Cash Invested'}
              </h2>
            </div>
            <div className={styles.inputGrid}>
              {activeTab === 'arbitrage' ? (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="rentToLandlordMonthly">
                    Master Lease Rent to Landlord
                    <span className={styles.inputSubtext}>Monthly rent</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="rentToLandlordMonthly"
                      type="number"
                      min={0}
                      value={rentToLandlordMonthly}
                      onChange={(e) => setRentToLandlordMonthly(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('mortgageOrRent')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                    <span className={styles.inputSuffix}>/mo</span>
                  </div>
                </div>
              ) : (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="mortgageMonthly">
                    Monthly Mortgage Debt Service
                    <span className={styles.inputSubtext}>P&amp;I payment</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="mortgageMonthly"
                      type="number"
                      min={0}
                      value={mortgageMonthly}
                      onChange={(e) => setMortgageMonthly(Number(e.target.value) || 0)}
                      onFocus={() => setActiveField('mortgageOrRent')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                    <span className={styles.inputSuffix}>/mo</span>
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="startupCost">
                  Furnishing &amp; Setup Capital
                  <span className={styles.inputSubtext}>Decor, photo, locks</span>
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    id="startupCost"
                    type="number"
                    min={0}
                    value={startupCost}
                    onChange={(e) => setStartupCost(Number(e.target.value) || 0)}
                    className={`${styles.input} ${styles.inputWithPrefix}`}
                  />
                </div>
              </div>

              {activeTab !== 'arbitrage' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="cashInvested">
                    Down Payment &amp; Closing Costs
                    <span className={styles.inputSubtext}>Equity invested</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="cashInvested"
                      type="number"
                      min={0}
                      value={cashInvested}
                      onChange={(e) => setCashInvested(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Long-Term Compare Inputs Card (when on compare tab) */}
          {activeTab === 'str-vs-ltr' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardStepBadge}>5</span>
                <h2 className={styles.cardTitle}>Long-Term Rental (12-Mo Lease) Benchmarks</h2>
              </div>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="ltrRentMonthly">
                    Expected LTR Market Rent
                    <span className={styles.inputSubtext}>Standard tenant</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="ltrRentMonthly"
                      type="number"
                      min={0}
                      value={ltrRentMonthly}
                      onChange={(e) => setLtrRentMonthly(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                    <span className={styles.inputSuffix}>/mo</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="ltrVacancyPct">
                    LTR Vacancy Rate
                    <span className={styles.inputSubtext}>Standard 5%</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="ltrVacancyPct"
                      type="number"
                      min={0}
                      max={30}
                      value={ltrVacancyPct}
                      onChange={(e) => setLtrVacancyPct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Financial Results */}
        <div className={styles.resultsCol}>
          {/* Key Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={`${styles.metricCard} ${styles.metricCardFeatured}`}>
              <span className={styles.metricLabel}>Monthly Cash Flow</span>
              <span className={styles.metricValue}>{fmt(analysis.cashFlowMonthly)}</span>
              <span className={styles.metricSubtext}>{fmt(analysis.cashFlowAnnual)} / year</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Annual NOI</span>
              <span className={styles.metricValue}>{fmt(analysis.noiAnnual)}</span>
              <span className={styles.metricSubtext}>pre-financing</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Break-Even Occ.</span>
              <span className={styles.metricValue}>
                {analysis.breakEvenOccupancyPct !== null ? `${fmtDec(analysis.breakEvenOccupancyPct)}%` : '—'}
              </span>
              <span className={styles.metricSubtext}>
                {analysis.breakEvenAdr !== null ? `$${Math.round(analysis.breakEvenAdr)} min ADR` : '—'}
              </span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Cash-on-Cash</span>
              <span className={styles.metricValue}>
                {analysis.cashOnCashReturnPct !== null ? `${fmtDec(analysis.cashOnCashReturnPct)}%` : '—'}
              </span>
              <span className={styles.metricSubtext}>
                {analysis.paybackPeriodMonths !== null ? `${fmtDec(analysis.paybackPeriodMonths)} mo payback` : '—'}
              </span>
            </div>
          </div>

          {/* Full Financial P&L Waterfall Table */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Itemized Annual &amp; Monthly Waterfall</h3>
            </div>
            <table className={styles.waterfallTable}>
              <thead>
                <tr>
                  <th>Financial Line Item</th>
                  <th className={styles.numRight}>Monthly</th>
                  <th className={styles.numRight}>Annual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nightly Guest Revenue ({Math.round(analysis.bookedNights)} nights @ ${Math.round(revenueInput.nightlyRate)})</td>
                  <td className={styles.numRight}>{fmt(analysis.nightlyGrossRevenue / 12)}</td>
                  <td className={styles.numRight}>{fmt(analysis.nightlyGrossRevenue)}</td>
                </tr>
                <tr>
                  <td>Cleaning Fees Collected ({fmtDec(analysis.staysCount, 1)} stays)</td>
                  <td className={styles.numRight}>{fmt(analysis.cleaningFeeRevenue / 12)}</td>
                  <td className={styles.numRight}>{fmt(analysis.cleaningFeeRevenue)}</td>
                </tr>
                {analysis.otherRevenue > 0 && (
                  <tr>
                    <td>Other Incidental Income</td>
                    <td className={styles.numRight}>{fmt(analysis.otherRevenue / 12)}</td>
                    <td className={styles.numRight}>{fmt(analysis.otherRevenue)}</td>
                  </tr>
                )}
                <tr className={styles.rowBold}>
                  <td>Gross Operating Revenue</td>
                  <td className={styles.numRight}>{fmt(analysis.grossRevenueMonthly)}</td>
                  <td className={styles.numRight}>{fmt(analysis.grossRevenueAnnual)}</td>
                </tr>
                <tr>
                  <td>Platform &amp; Payment Fees ({platformInput.hostFeePct}%)</td>
                  <td className={styles.numRight}>−{fmt(analysis.platformFeesAnnual / 12)}</td>
                  <td className={styles.numRight}>−{fmt(analysis.platformFeesAnnual)}</td>
                </tr>
                <tr>
                  <td>Cleaning Turnover Expenses (${variableInput.cleaningCostPerTurnover}/turn)</td>
                  <td className={styles.numRight}>−{fmt(analysis.cleaningExpensesAnnual / 12)}</td>
                  <td className={styles.numRight}>−{fmt(analysis.cleaningExpensesAnnual)}</td>
                </tr>
                <tr>
                  <td>Guest Supplies &amp; Toiletries (${variableInput.suppliesPerStay}/stay)</td>
                  <td className={styles.numRight}>−{fmt(analysis.suppliesExpensesAnnual / 12)}</td>
                  <td className={styles.numRight}>−{fmt(analysis.suppliesExpensesAnnual)}</td>
                </tr>
                <tr>
                  <td>Maintenance Reserve ({variableInput.maintenancePct}%)</td>
                  <td className={styles.numRight}>−{fmt(analysis.maintenanceExpensesAnnual / 12)}</td>
                  <td className={styles.numRight}>−{fmt(analysis.maintenanceExpensesAnnual)}</td>
                </tr>
                <tr>
                  <td>Fixed Operating Overhead (Utilities, Wi-Fi, STR Ins.)</td>
                  <td className={styles.numRight}>−{fmt(analysis.totalFixedCostsAnnual / 12)}</td>
                  <td className={styles.numRight}>−{fmt(analysis.totalFixedCostsAnnual)}</td>
                </tr>
                <tr className={styles.rowBold}>
                  <td>Net Operating Income (NOI)</td>
                  <td className={styles.numRight}>{fmt(analysis.noiMonthly)}</td>
                  <td className={styles.numRight}>{fmt(analysis.noiAnnual)}</td>
                </tr>
                <tr>
                  <td>
                    {activeTab === 'arbitrage' ? 'Master Lease Rent to Landlord' : 'Mortgage Debt Service (P&I)'}
                  </td>
                  <td className={styles.numRight}>−{fmt(analysis.annualDebtServiceOrRent / 12)}</td>
                  <td className={styles.numRight}>−{fmt(analysis.annualDebtServiceOrRent)}</td>
                </tr>
                <tr className={styles.rowHighlight}>
                  <td>Net Pre-Tax Cash Flow</td>
                  <td className={styles.numRight}>{fmt(analysis.cashFlowMonthly)}</td>
                  <td className={styles.numRight}>{fmt(analysis.cashFlowAnnual)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Scenarios Table */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Sensitivity &amp; Scenario Matrix</h3>
            </div>
            <div className={styles.scenarioGrid}>
              {scenarios.map((sc, idx) => (
                <div
                  key={idx}
                  className={`${styles.scenarioCol} ${sc.label.includes('Expected') ? styles.scenarioActive : ''}`}
                >
                  <div className={styles.scenarioTitle}>{sc.label}</div>
                  <div className={styles.scenarioRate}>
                    ${Math.round(sc.nightlyRate)} · {sc.occupancyPct}%
                  </div>
                  <div className={styles.scenarioCashFlow}>{fmt(sc.monthlyCashFlow)}/mo</div>
                  <div className={styles.metricSubtext}>{fmt(sc.annualCashFlow)}/yr</div>
                </div>
              ))}
            </div>
          </div>

          {/* STR vs LTR Comparison (shown when tab selected) */}
          {activeTab === 'str-vs-ltr' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Side-by-Side: STR vs. Long-Term Rental (LTR)</h3>
              </div>
              <div className={styles.compareRow}>
                <div className={styles.compareCard}>
                  <div className={styles.compareCardTitle}>Short-Term Rental</div>
                  <div className={styles.compareLine}>
                    <span>Gross Revenue</span>
                    <span>{fmt(ltrCompareResult.strAnnualRevenue)}/yr</span>
                  </div>
                  <div className={styles.compareLine}>
                    <span>Operating Opex</span>
                    <span>−{fmt(ltrCompareResult.strAnnualOpex)}/yr</span>
                  </div>
                  <div className={styles.compareLine}>
                    <span>Monthly Cash Flow</span>
                    <span>{fmt(ltrCompareResult.strMonthlyCashFlow)}/mo</span>
                  </div>
                  <div className={styles.compareLine}>
                    <span>Annual Cash Flow</span>
                    <span>{fmt(ltrCompareResult.strAnnualCashFlow)}/yr</span>
                  </div>
                </div>

                <div className={styles.compareCard}>
                  <div className={styles.compareCardTitle}>Long-Term Rental</div>
                  <div className={styles.compareLine}>
                    <span>Gross Effective Rent</span>
                    <span>{fmt(ltrCompareResult.ltrAnnualGrossRent)}/yr</span>
                  </div>
                  <div className={styles.compareLine}>
                    <span>Operating Opex</span>
                    <span>−{fmt(ltrCompareResult.ltrAnnualOpex)}/yr</span>
                  </div>
                  <div className={styles.compareLine}>
                    <span>Monthly Cash Flow</span>
                    <span>{fmt(ltrCompareResult.ltrMonthlyCashFlow)}/mo</span>
                  </div>
                  <div className={styles.compareLine}>
                    <span>Annual Cash Flow</span>
                    <span>{fmt(ltrCompareResult.ltrAnnualCashFlow)}/yr</span>
                  </div>
                </div>
              </div>

              <div className={styles.winnerBanner}>
                {ltrCompareResult.annualCashFlowDifference >= 0 ? (
                  <>
                    Short-Term Rental yields an additional{' '}
                    <strong>{fmt(ltrCompareResult.monthlyCashFlowDifference)} per month</strong> (
                    {fmt(ltrCompareResult.annualCashFlowDifference)}/year) over traditional long-term leasing. Note: STR
                    demands active guest turnover management, municipal licensing compliance, and seasonal cash flow buffers.
                  </>
                ) : (
                  <>
                    Traditional Long-Term Rental yields{' '}
                    <strong>{fmt(Math.abs(ltrCompareResult.monthlyCashFlowDifference))} more per month</strong> with
                    lower vacancy risk and zero turnover cleaning management.
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionsRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
              📋 Copy Financial Summary
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
            >
              🖨️ Print Pro Forma Report
            </button>
          </div>
        </div>
      </div>

      {copiedToast && <div className={styles.toast}>Financial summary copied to clipboard!</div>}
    </div>
  );
}

export default function AirbnbCalculator() {
  return (
    <ToolShell
      features={[
        'Full expense model',
        'Break-even occupancy',
        'Arbitrage & mid-term modes',
        'STR vs long-term',
      ]}
    >
      <AirbnbCalculatorInner />
    </ToolShell>
  );
}
