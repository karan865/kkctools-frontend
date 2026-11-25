'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider from '@/components/tool/shared/TabSlider';
import LaborInputGuide, { LaborFieldId } from './LaborInputGuide';
import styles from './LaborCostCalculator.module.css';
import {
  calculateEmployeeBurden,
  calculateJobQuote,
  calculateLaborPercent,
  compareEmployeeVsSub,
  CrewMemberRow,
  EmployeeBurdenInput,
} from '../../../lib/labor-cost-engine';

type CalculatorTab = 'employee' | 'job' | 'labor-pct';

const TABS = [
  { id: 'employee', label: 'True Employee Cost' },
  { id: 'job', label: 'Job Labor & Quote' },
  { id: 'labor-pct', label: 'Labor % of Revenue' },
];

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function LaborCostCalculatorInner() {
  // Tab State
  const [activeTab, setActiveTab] = useState<CalculatorTab>('employee');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as CalculatorTab;
      if (tabParam === 'job' || tabParam === 'labor-pct') {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    const newTab = tabId as CalculatorTab;
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<LaborFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  // Tab 1: Employee Burden State
  const [payType, setPayType] = useState<'hourly' | 'salary'>('hourly');
  const [hourlyWage, setHourlyWage] = useState<number>(30);
  const [annualSalary, setAnnualSalary] = useState<number>(62400);
  const [paidHours, setPaidHours] = useState<number>(2080);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(1.5);

  // Time off
  const [holidayHours, setHolidayHours] = useState<number>(80);
  const [ptoHours, setPtoHours] = useState<number>(80);
  const [sickHours, setSickHours] = useState<number>(0);
  const [trainingHours, setTrainingHours] = useState<number>(0);

  // Geography & Taxes
  const [countryMode, setCountryMode] = useState<'us' | 'other'>('us');
  const [ssRate, setSsRate] = useState<number>(6.2);
  const [ssWageBase, setSsWageBase] = useState<number>(184500);
  const [medicareRate, setMedicareRate] = useState<number>(1.45);
  const [futaRate, setFutaRate] = useState<number>(0.6);
  const [futaWageBase, setFutaWageBase] = useState<number>(7000);
  const [sutaRate, setSutaRate] = useState<number>(2.0);
  const [sutaWageBase, setSutaWageBase] = useState<number>(10000);
  const [otherOnCostsPct, setOtherOnCostsPct] = useState<number>(25);

  // Insurance & Benefits
  const [workersCompRate, setWorkersCompRate] = useState<number>(5.0);
  const [generalLiability, setGeneralLiability] = useState<number>(0);
  const [benefitsAnnual, setBenefitsAnnual] = useState<number>(6000);

  // Subcontractor quick comparison
  const [subQuoteRate, setSubQuoteRate] = useState<number>(45);
  const [subProjectHours, setSubProjectHours] = useState<number>(500);

  // Tab 2: Job Labor & Quote State
  const [crew, setCrew] = useState<CrewMemberRow[]>([
    { id: '1', role: 'Lead Journeyman', burdenedHourlyRate: 39.86, regularHours: 40, overtimeHours: 0, overtimeMultiplier: 1.5 },
    { id: '2', role: 'Installer', burdenedHourlyRate: 39.86, regularHours: 40, overtimeHours: 0, overtimeMultiplier: 1.5 },
    { id: '3', role: 'Apprentice / Helper', burdenedHourlyRate: 39.86, regularHours: 40, overtimeHours: 0, overtimeMultiplier: 1.5 },
  ]);
  const [materialsCost, setMaterialsCost] = useState<number>(0);
  const [equipmentCost, setEquipmentCost] = useState<number>(0);
  const [subsCost, setSubsCost] = useState<number>(0);
  const [overheadPercent, setOverheadPercent] = useState<number>(15);
  const [profitPercent, setProfitPercent] = useState<number>(10);
  const [pricingMode, setPricingMode] = useState<'markup' | 'margin'>('markup');

  // Tab 3: Labor % of Revenue State
  const [annualRevenue, setAnnualRevenue] = useState<number>(300000);
  const [customLaborCost, setCustomLaborCost] = useState<number | null>(null);

  // ----------------------------------------------------------------
  // CALCULATIONS (using pure engine)
  // ----------------------------------------------------------------

  const employeeResult = useMemo(() => {
    const input: EmployeeBurdenInput = {
      payType,
      hourlyRate: hourlyWage,
      annualSalary,
      paidHoursPerYear: paidHours,
      overtimeHoursPerYear: overtimeHours,
      overtimeMultiplier,
      paidHolidaysHours: holidayHours,
      paidPtoHours: ptoHours,
      paidSickHours: sickHours,
      trainingNonBillableHours: trainingHours,
      countryMode,
      ssEmployerRate: ssRate / 100,
      ssWageBase,
      medicareRate: medicareRate / 100,
      futaRate: futaRate / 100,
      futaWageBase,
      sutaRate: sutaRate / 100,
      sutaWageBase,
      otherOnCostsPercent: otherOnCostsPct,
      workersCompRatePer100: workersCompRate,
      generalLiabilityAnnual: generalLiability,
      annualBenefits: benefitsAnnual,
    };
    return calculateEmployeeBurden(input);
  }, [
    payType,
    hourlyWage,
    annualSalary,
    paidHours,
    overtimeHours,
    overtimeMultiplier,
    holidayHours,
    ptoHours,
    sickHours,
    trainingHours,
    countryMode,
    ssRate,
    ssWageBase,
    medicareRate,
    futaRate,
    futaWageBase,
    sutaRate,
    sutaWageBase,
    otherOnCostsPct,
    workersCompRate,
    generalLiability,
    benefitsAnnual,
  ]);

  const jobQuoteResult = useMemo(() => {
    return calculateJobQuote({
      crew,
      materialsCost,
      equipmentCost,
      subcontractorsCost: subsCost,
      overheadPercent,
      profitPercent,
      pricingMode,
    });
  }, [crew, materialsCost, equipmentCost, subsCost, overheadPercent, profitPercent, pricingMode]);

  const subVsEmployeeResult = useMemo(() => {
    const rateToCompare = employeeResult.burdenedRatePerProductiveHour ?? employeeResult.burdenedRatePerPaidHour;
    return compareEmployeeVsSub({
      burdenedProductiveRate: rateToCompare,
      subcontractorHourlyRate: subQuoteRate,
      projectHours: subProjectHours,
    });
  }, [employeeResult, subQuoteRate, subProjectHours]);

  const laborPercentResult = useMemo(() => {
    const laborVal = customLaborCost !== null ? customLaborCost : employeeResult.totalCostAnnual;
    return calculateLaborPercent(laborVal, annualRevenue);
  }, [customLaborCost, employeeResult.totalCostAnnual, annualRevenue]);

  // BLUF dynamic sentence
  const blufSentence = useMemo(() => {
    if (activeTab === 'employee') {
      const prodRate = employeeResult.burdenedRatePerProductiveHour;
      const prodRateStr = prodRate !== null ? `$${prodRate.toFixed(2)}` : `$${employeeResult.burdenedRatePerPaidHour.toFixed(2)}`;
      return `A $${hourlyWage}/hour employee really costs about ${prodRateStr} per productive hour, ${employeeResult.burdenPercent.toFixed(
        2
      )}% more than their wage once payroll taxes, insurance, benefits, and time off are counted.`;
    }
    if (activeTab === 'job') {
      return `For a crew of ${crew.length} working ${jobQuoteResult.totalLaborHours} total hours, direct labor cost is ${fmt(
        jobQuoteResult.totalLaborCost
      )}; with ${overheadPercent}% overhead and ${profitPercent}% profit (${pricingMode}), the recommended client quote is ${fmt(
        jobQuoteResult.finalQuotePrice
      )}.`;
    }
    return `Annual labor cost of ${fmt(
      customLaborCost !== null ? customLaborCost : employeeResult.totalCostAnnual
    )} represents ${
      laborPercentResult.laborPercent !== null ? `${laborPercentResult.laborPercent.toFixed(1)}%` : '—'
    } of ${fmt(annualRevenue)} in gross annual revenue.`;
  }, [
    activeTab,
    hourlyWage,
    employeeResult,
    crew.length,
    jobQuoteResult,
    overheadPercent,
    profitPercent,
    pricingMode,
    customLaborCost,
    annualRevenue,
    laborPercentResult,
  ]);

  // Crew helpers
  const handleAddCrew = () => {
    const newRate = employeeResult.burdenedRatePerProductiveHour ?? 39.86;
    setCrew([
      ...crew,
      {
        id: String(Date.now()),
        role: `Worker ${crew.length + 1}`,
        burdenedHourlyRate: Math.round(newRate * 100) / 100,
        regularHours: 40,
        overtimeHours: 0,
        overtimeMultiplier: 1.5,
      },
    ]);
  };

  const handleRemoveCrew = (id: string) => {
    if (crew.length <= 1) return;
    setCrew(crew.filter((c) => c.id !== id));
  };

  const handleUpdateCrew = (id: string, field: keyof CrewMemberRow, val: string | number) => {
    setCrew(crew.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  };

  // Copy Summary
  const handleCopySummary = () => {
    let summary = '';
    if (activeTab === 'employee') {
      summary = `Labor Cost Summary (KKC Tools)
--------------------------------------
Base Wage: $${hourlyWage}/hr (${fmt(employeeResult.wagesAnnual)}/yr)
Payroll Taxes: ${fmt(employeeResult.payrollTaxesAnnual)}/yr
Workers Comp: ${fmt(employeeResult.workersCompAnnual)}/yr
Benefits: ${fmt(employeeResult.benefitsAnnual)}/yr
Total Annual Cost: ${fmt(employeeResult.totalCostAnnual)}
Labor Burden: ${employeeResult.burdenPercent.toFixed(2)}%
Paid Hours: ${employeeResult.paidHoursAnnual} hrs/yr ($${employeeResult.burdenedRatePerPaidHour.toFixed(2)}/hr)
Productive Hours: ${employeeResult.productiveHoursAnnual} hrs/yr
Burdened Productive Rate: ${
        employeeResult.burdenedRatePerProductiveHour !== null
          ? `$${employeeResult.burdenedRatePerProductiveHour.toFixed(2)}/hr`
          : '—'
      }
Calculated at: https://kkctools.com/labor-cost-calculator/`;
    } else if (activeTab === 'job') {
      summary = `Job Labor & Quote Summary (KKC Tools)
--------------------------------------
Total Labor Hours: ${jobQuoteResult.totalLaborHours} hrs
Direct Labor Cost: ${fmt(jobQuoteResult.totalLaborCost)}
Direct Costs Subtotal: ${fmt(jobQuoteResult.directCostsSubtotal)}
Overhead (${overheadPercent}%): ${fmt(jobQuoteResult.overheadAmount)}
Profit (${profitPercent}% - ${pricingMode}): ${fmt(jobQuoteResult.profitAmount)}
Final Client Quote: ${fmt(jobQuoteResult.finalQuotePrice)}
Effective Markup: ${jobQuoteResult.effectiveMarkupPercent.toFixed(1)}%
Effective Margin: ${jobQuoteResult.effectiveGrossMarginPercent.toFixed(1)}%
Calculated at: https://kkctools.com/labor-cost-calculator/?tab=job`;
    } else {
      summary = `Labor % of Revenue Summary (KKC Tools)
--------------------------------------
Total Labor Cost: ${fmt(customLaborCost !== null ? customLaborCost : employeeResult.totalCostAnnual)}
Annual Revenue: ${fmt(annualRevenue)}
Labor Cost %: ${laborPercentResult.laborPercent !== null ? `${laborPercentResult.laborPercent.toFixed(1)}%` : '—'}
Calculated at: https://kkctools.com/labor-cost-calculator/?tab=labor-pct`;
    }

    navigator.clipboard.writeText(summary);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <ToolShell
      features={['Payroll-tax caps built in', 'Crew & job quote', 'Paid vs productive hours', 'Print & share link']}
    >
      <div className={styles.calculatorContainer}>
        {/* High-contrast mint BLUF summary banner */}
        <div className={styles.summaryBanner}>{blufSentence}</div>

        {/* Tab Navigation */}
        <TabSlider
          tabs={TABS}
          activeId={activeTab}
          onChange={handleTabChange}
          ariaLabel="Labor Cost Calculator Modes"
        />

        {/* Visual Input Guide Diagram */}
        <LaborInputGuide
          tab={activeTab}
          activeField={activeField}
          wagesAnnual={employeeResult.wagesAnnual}
          payrollTaxesAnnual={employeeResult.payrollTaxesAnnual}
          workersCompAnnual={employeeResult.workersCompAnnual}
          liabilityAnnual={employeeResult.generalLiabilityAnnual}
          benefitsAnnual={employeeResult.benefitsAnnual}
          totalCostAnnual={employeeResult.totalCostAnnual}
          paidHours={employeeResult.paidHoursAnnual}
          timeOffHours={employeeResult.timeOffHoursAnnual}
          productiveHours={employeeResult.productiveHoursAnnual}
          burdenedProductiveRate={employeeResult.burdenedRatePerProductiveHour}
          totalLaborCost={jobQuoteResult.totalLaborCost}
          materialsCost={materialsCost}
          equipmentCost={equipmentCost}
          subsCost={subsCost}
          quotePrice={jobQuoteResult.finalQuotePrice}
          revenue={annualRevenue}
          laborPercent={laborPercentResult.laborPercent}
        />

        {/* ========================================================= */}
        {/* TAB 1: TRUE EMPLOYEE COST                                */}
        {/* ========================================================= */}
        {activeTab === 'employee' && (
          <div className={styles.layoutGrid}>
            {/* Input Column */}
            <div className={styles.inputCard}>
              <div className={styles.sectionTitle}>
                <span>1. Compensation & Hours</span>
                <span className={styles.sectionBadge}>Base Pay</span>
              </div>

              {/* Pay Type Toggle */}
              <div className={styles.toggleButtonGroup}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${payType === 'hourly' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setPayType('hourly')}
                >
                  Hourly Wage
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${payType === 'salary' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setPayType('salary')}
                >
                  Annual Salary
                </button>
              </div>

              {payType === 'hourly' ? (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="hourlyWage">
                      Hourly Wage
                    </label>
                    <div className={styles.inputGroup}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id="hourlyWage"
                        type="number"
                        min="0"
                        step="0.5"
                        value={hourlyWage || ''}
                        onChange={(e) => setHourlyWage(parseFloat(e.target.value) || 0)}
                        onFocus={() => setActiveField('wage')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.textInput} ${styles.hasPrefix}`}
                      />
                      <span className={styles.suffix}>/hr</span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="paidHours">
                      Paid Hours / Year
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        id="paidHours"
                        type="number"
                        min="0"
                        step="10"
                        value={paidHours || ''}
                        onChange={(e) => setPaidHours(parseFloat(e.target.value) || 0)}
                        onFocus={() => setActiveField('hours')}
                        onBlur={() => setActiveField(null)}
                        className={styles.textInput}
                      />
                      <span className={styles.suffix}>hrs</span>
                    </div>
                    <span className={styles.fieldHint}>2,080 h = 40 h/wk × 52 wks</span>
                  </div>
                </div>
              ) : (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="annualSalary">
                    Annual Base Salary
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="annualSalary"
                      type="number"
                      min="0"
                      step="1000"
                      value={annualSalary || ''}
                      onChange={(e) => setAnnualSalary(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('wage')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                  </div>
                </div>
              )}

              {/* Overtime Row */}
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="otHours">
                    Overtime Hours / Year
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="otHours"
                      type="number"
                      min="0"
                      value={overtimeHours || ''}
                      onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('hours')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>hrs</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="otMult">
                    Overtime Multiplier
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="otMult"
                      type="number"
                      min="1"
                      step="0.1"
                      value={overtimeMultiplier || ''}
                      onChange={(e) => setOvertimeMultiplier(parseFloat(e.target.value) || 1.5)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>×</span>
                  </div>
                  <span className={styles.fieldHint}>Standard FLSA is 1.5×</span>
                </div>
              </div>

              {/* Time off */}
              <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
                <span>2. Paid Time Off & Non-Billable Hours</span>
                <span className={styles.sectionBadge}>Lost Hours</span>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="holidays">
                    Paid Holidays
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="holidays"
                      type="number"
                      min="0"
                      value={holidayHours || ''}
                      onChange={(e) => setHolidayHours(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('timeoff')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>hrs</span>
                  </div>
                  <span className={styles.fieldHint}>80 h = 10 federal holidays</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="pto">
                    Paid Vacation / PTO
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="pto"
                      type="number"
                      min="0"
                      value={ptoHours || ''}
                      onChange={(e) => setPtoHours(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('timeoff')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>hrs</span>
                  </div>
                  <span className={styles.fieldHint}>80 h = 2 weeks paid leave</span>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="sick">
                    Paid Sick Leave
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="sick"
                      type="number"
                      min="0"
                      value={sickHours || ''}
                      onChange={(e) => setSickHours(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('timeoff')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>hrs</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="training">
                    Training & Meetings
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="training"
                      type="number"
                      min="0"
                      value={trainingHours || ''}
                      onChange={(e) => setTrainingHours(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('timeoff')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>hrs</span>
                  </div>
                </div>
              </div>

              {/* Payroll Taxes & Benefits */}
              <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
                <span>3. Taxes, Insurance & Benefits</span>
                <span className={styles.sectionBadge}>Taxes & On-Costs</span>
              </div>

              {/* Country mode */}
              <div className={styles.toggleButtonGroup}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${countryMode === 'us' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setCountryMode('us')}
                >
                  United States (Itemized FICA/FUTA/SUTA)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${countryMode === 'other' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setCountryMode('other')}
                >
                  International (Single On-Costs %)
                </button>
              </div>

              {countryMode === 'us' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowTaxDetails(!showTaxDetails)}
                    className={styles.taxToggle}
                  >
                    <span>US Payroll Tax Settings (IRS / SSA 2026)</span>
                    <span>{showTaxDetails ? '▲ Hide' : '▼ Customize Rates & Caps'}</span>
                  </button>

                  {showTaxDetails && (
                    <div style={{ padding: '0.5rem 0 1rem' }}>
                      <div className={styles.inputRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="ssRate">
                            Social Security (Employer)
                          </label>
                          <div className={styles.inputGroup}>
                            <input
                              id="ssRate"
                              type="number"
                              step="0.1"
                              value={ssRate}
                              onChange={(e) => setSsRate(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={styles.textInput}
                            />
                            <span className={styles.suffix}>%</span>
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="ssBase">
                            SS Wage Base Cap (2026)
                          </label>
                          <div className={styles.inputGroup}>
                            <span className={styles.prefix}>$</span>
                            <input
                              id="ssBase"
                              type="number"
                              value={ssWageBase}
                              onChange={(e) => setSsWageBase(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={`${styles.textInput} ${styles.hasPrefix}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="medRate">
                            Medicare Rate (Employer)
                          </label>
                          <div className={styles.inputGroup}>
                            <input
                              id="medRate"
                              type="number"
                              step="0.05"
                              value={medicareRate}
                              onChange={(e) => setMedicareRate(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={styles.textInput}
                            />
                            <span className={styles.suffix}>%</span>
                          </div>
                          <span className={styles.fieldHint}>No wage limit for Medicare</span>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="futaRate">
                            FUTA Rate (Effective)
                          </label>
                          <div className={styles.inputGroup}>
                            <input
                              id="futaRate"
                              type="number"
                              step="0.1"
                              value={futaRate}
                              onChange={(e) => setFutaRate(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={styles.textInput}
                            />
                            <span className={styles.suffix}>%</span>
                          </div>
                          <span className={styles.fieldHint}>Standard 0.6% on first $7,000</span>
                        </div>
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="futaBase">
                            FUTA Wage Base Cap
                          </label>
                          <div className={styles.inputGroup}>
                            <span className={styles.prefix}>$</span>
                            <input
                              id="futaBase"
                              type="number"
                              value={futaWageBase}
                              onChange={(e) => setFutaWageBase(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={`${styles.textInput} ${styles.hasPrefix}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="sutaRate">
                            SUTA Rate (State Example)
                          </label>
                          <div className={styles.inputGroup}>
                            <input
                              id="sutaRate"
                              type="number"
                              step="0.1"
                              value={sutaRate}
                              onChange={(e) => setSutaRate(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={styles.textInput}
                            />
                            <span className={styles.suffix}>%</span>
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label className={styles.fieldLabel} htmlFor="sutaBase">
                            SUTA Wage Base Cap
                          </label>
                          <div className={styles.inputGroup}>
                            <span className={styles.prefix}>$</span>
                            <input
                              id="sutaBase"
                              type="number"
                              value={sutaWageBase}
                              onChange={(e) => setSutaWageBase(parseFloat(e.target.value) || 0)}
                              onFocus={() => setActiveField('payrolltaxes')}
                              onBlur={() => setActiveField(null)}
                              className={`${styles.textInput} ${styles.hasPrefix}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="onCostsPct">
                    Employer On-Costs %
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="onCostsPct"
                      type="number"
                      step="0.5"
                      value={otherOnCostsPct}
                      onChange={(e) => setOtherOnCostsPct(parseFloat(e.target.value) || 0)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.fieldHint}>Includes national insurance, superannuation, or statutory levies</span>
                </div>
              )}

              {/* Workers Comp & Benefits */}
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="wcRate">
                    Workers&apos; Comp Rate
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="wcRate"
                      type="number"
                      step="0.25"
                      value={workersCompRate || ''}
                      onChange={(e) => setWorkersCompRate(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('workerscomp')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                    <span className={styles.suffix}>/$100</span>
                  </div>
                  <span className={styles.fieldHint}>Construction avg $3–$15 per $100</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="benefits">
                    Annual Benefits / Perks
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="benefits"
                      type="number"
                      step="250"
                      value={benefitsAnnual || ''}
                      onChange={(e) => setBenefitsAnnual(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('benefits')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                    <span className={styles.suffix}>/yr</span>
                  </div>
                  <span className={styles.fieldHint}>Health insurance, 401(k), etc.</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="genLiab">
                  General Liability Insurance (Annual)
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="genLiab"
                    type="number"
                    min="0"
                    step="100"
                    value={generalLiability || ''}
                    onChange={(e) => setGeneralLiability(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('liability')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.textInput} ${styles.hasPrefix}`}
                  />
                  <span className={styles.suffix}>/yr</span>
                </div>
                <span className={styles.fieldHint}>Annual liability policy cost allocated to this worker ($0 if unallocated)</span>
              </div>
            </div>

            {/* Results Column */}
            <div className={styles.resultsCard}>
              {/* Hero Metric Card */}
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Burdened Hourly Rate (Productive)</div>
                <div className={styles.heroValue}>
                  {employeeResult.burdenedRatePerProductiveHour !== null
                    ? `$${employeeResult.burdenedRatePerProductiveHour.toFixed(2)}/hr`
                    : '—'}
                </div>
                <div className={styles.heroSub}>
                  <span className={styles.burdenBadge}>+{employeeResult.burdenPercent.toFixed(2)}% Burden</span>
                  <span>over base wage (${employeeResult.baseHourlyWage.toFixed(2)}/hr)</span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Rate per Paid Hr</span>
                    <span className={styles.metricItemValue}>${employeeResult.burdenedRatePerPaidHour.toFixed(2)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Productive Hrs</span>
                    <span className={styles.metricItemValue}>{employeeResult.productiveHoursAnnual} hrs</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Time Off</span>
                    <span className={styles.metricItemValue}>{employeeResult.timeOffHoursAnnual} hrs</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Total Annual Cost</span>
                    <span className={styles.metricItemValue}>{fmt(employeeResult.totalCostAnnual)}</span>
                  </div>
                </div>
              </div>

              {/* Waterfall Breakdown Table */}
              <div className={styles.card}>
                <div className={styles.sectionTitle}>
                  <span>Annual Cost Breakdown Waterfall</span>
                  <span className={styles.sectionBadge}>Itemized</span>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Cost Category</th>
                        <th className={styles.numCell}>Annual Amount</th>
                        <th className={styles.numCell}>% of Wages</th>
                        <th className={styles.numCell}>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Gross Wages (Regular + OT)</td>
                        <td className={styles.numCell}>{fmt(employeeResult.wagesAnnual)}</td>
                        <td className={styles.numCell}>100.0%</td>
                        <td className={styles.numCell}>
                          {((employeeResult.wagesAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      {countryMode === 'us' ? (
                        <>
                          <tr>
                            <td>Social Security (6.2%)</td>
                            <td className={styles.numCell}>{fmt(employeeResult.socialSecurityAnnual)}</td>
                            <td className={styles.numCell}>
                              {((employeeResult.socialSecurityAnnual / (employeeResult.wagesAnnual || 1)) * 100).toFixed(2)}%
                            </td>
                            <td className={styles.numCell}>
                              {((employeeResult.socialSecurityAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td>Medicare (1.45%)</td>
                            <td className={styles.numCell}>{fmt(employeeResult.medicareAnnual)}</td>
                            <td className={styles.numCell}>
                              {((employeeResult.medicareAnnual / (employeeResult.wagesAnnual || 1)) * 100).toFixed(2)}%
                            </td>
                            <td className={styles.numCell}>
                              {((employeeResult.medicareAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          <tr>
                            <td>FUTA & SUTA (Unemployment)</td>
                            <td className={styles.numCell}>{fmt(employeeResult.futaAnnual + employeeResult.sutaAnnual)}</td>
                            <td className={styles.numCell}>
                              {(
                                ((employeeResult.futaAnnual + employeeResult.sutaAnnual) / (employeeResult.wagesAnnual || 1)) *
                                100
                              ).toFixed(2)}
                              %
                            </td>
                            <td className={styles.numCell}>
                              {(
                                ((employeeResult.futaAnnual + employeeResult.sutaAnnual) / (employeeResult.totalCostAnnual || 1)) *
                                100
                              ).toFixed(1)}
                              %
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td>Employer On-Costs ({otherOnCostsPct}%)</td>
                          <td className={styles.numCell}>{fmt(employeeResult.otherOnCostsAnnual)}</td>
                          <td className={styles.numCell}>{otherOnCostsPct.toFixed(1)}%</td>
                          <td className={styles.numCell}>
                            {((employeeResult.otherOnCostsAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>Workers&apos; Comp Insurance</td>
                        <td className={styles.numCell}>{fmt(employeeResult.workersCompAnnual)}</td>
                        <td className={styles.numCell}>
                          {((employeeResult.workersCompAnnual / (employeeResult.wagesAnnual || 1)) * 100).toFixed(2)}%
                        </td>
                        <td className={styles.numCell}>
                          {((employeeResult.workersCompAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      {employeeResult.generalLiabilityAnnual > 0 && (
                        <tr>
                          <td>General Liability Insurance</td>
                          <td className={styles.numCell}>{fmt(employeeResult.generalLiabilityAnnual)}</td>
                          <td className={styles.numCell}>
                            {((employeeResult.generalLiabilityAnnual / (employeeResult.wagesAnnual || 1)) * 100).toFixed(2)}%
                          </td>
                          <td className={styles.numCell}>
                            {((employeeResult.generalLiabilityAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>Benefits, Health & Perks</td>
                        <td className={styles.numCell}>{fmt(employeeResult.benefitsAnnual)}</td>
                        <td className={styles.numCell}>
                          {((employeeResult.benefitsAnnual / (employeeResult.wagesAnnual || 1)) * 100).toFixed(2)}%
                        </td>
                        <td className={styles.numCell}>
                          {((employeeResult.benefitsAnnual / (employeeResult.totalCostAnnual || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr>
                        <td>Total Employer Cost</td>
                        <td className={styles.numCell}>{fmt(employeeResult.totalCostAnnual)}</td>
                        <td className={styles.numCell}>{(100 + employeeResult.burdenPercent).toFixed(2)}%</td>
                        <td className={styles.numCell}>100.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Employee vs Subcontractor Quick Compare */}
              <div className={styles.card}>
                <div className={styles.sectionTitle}>
                  <span>Employee vs Subcontractor Analysis</span>
                  <span className={styles.sectionBadge}>1099 Decision</span>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="subQuote">
                      Subcontractor Hourly Quote
                    </label>
                    <div className={styles.inputGroup}>
                      <span className={styles.prefix}>$</span>
                      <input
                        id="subQuote"
                        type="number"
                        min="0"
                        step="1"
                        value={subQuoteRate || ''}
                        onChange={(e) => setSubQuoteRate(parseFloat(e.target.value) || 0)}
                        className={`${styles.textInput} ${styles.hasPrefix}`}
                      />
                      <span className={styles.suffix}>/hr</span>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="subHours">
                      Estimated Job Hours
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        id="subHours"
                        type="number"
                        min="1"
                        step="10"
                        value={subProjectHours || ''}
                        onChange={(e) => setSubProjectHours(parseFloat(e.target.value) || 0)}
                        className={styles.textInput}
                      />
                      <span className={styles.suffix}>hrs</span>
                    </div>
                  </div>
                </div>

                <div className={styles.subCompareBox}>
                  <div
                    className={`${styles.compareCard} ${
                      subVsEmployeeResult.cheaperOption === 'employee' ? styles.compareCardWinner : ''
                    }`}
                  >
                    <div className={styles.compareTitle}>W-2 Employee Cost</div>
                    <div className={styles.compareVal}>{fmt(subVsEmployeeResult.employeeTotalCost)}</div>
                    <span className={styles.fieldHint}>
                      @ ${(employeeResult.burdenedRatePerProductiveHour ?? 39.86).toFixed(2)}/hr
                    </span>
                  </div>

                  <div
                    className={`${styles.compareCard} ${
                      subVsEmployeeResult.cheaperOption === 'subcontractor' ? styles.compareCardWinner : ''
                    }`}
                  >
                    <div className={styles.compareTitle}>1099 Subcontractor Cost</div>
                    <div className={styles.compareVal}>{fmt(subVsEmployeeResult.subcontractorTotalCost)}</div>
                    <span className={styles.fieldHint}>@ ${subQuoteRate.toFixed(2)}/hr</span>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--ink-soft)' }}>
                  {subVsEmployeeResult.cheaperOption === 'employee' ? (
                    <span>
                      <strong>Employee is cheaper:</strong> saves {fmt(subVsEmployeeResult.costDifference)} (
                      {subVsEmployeeResult.percentDifference.toFixed(1)}%) over hiring a sub for {subProjectHours} hours.
                    </span>
                  ) : subVsEmployeeResult.cheaperOption === 'subcontractor' ? (
                    <span>
                      <strong>Subcontractor is cheaper:</strong> saves {fmt(Math.abs(subVsEmployeeResult.costDifference))} (
                      {subVsEmployeeResult.percentDifference.toFixed(1)}%) for {subProjectHours} hours of work.
                    </span>
                  ) : (
                    <span>Both options cost the exact same amount.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: JOB LABOR & QUOTE ESTIMATING                      */}
        {/* ========================================================= */}
        {activeTab === 'job' && (
          <div className={styles.layoutGrid}>
            <div className={styles.inputCard}>
              <div className={styles.sectionTitle}>
                <span>1. Crew Roster & Hours</span>
                <span className={styles.sectionBadge}>{crew.length} Workers</span>
              </div>

              <table className={styles.crewTable}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th style={{ width: '90px' }}>Rate/hr</th>
                    <th style={{ width: '70px' }}>Hours</th>
                    <th style={{ width: '60px' }}>OT h</th>
                    <th style={{ width: '30px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {crew.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleUpdateCrew(member.id, 'role', e.target.value)}
                          onFocus={() => setActiveField('crew')}
                          onBlur={() => setActiveField(null)}
                          className={styles.textInput}
                          style={{ height: '2rem', fontSize: '0.8125rem' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.5"
                          value={member.burdenedHourlyRate || ''}
                          onChange={(e) =>
                            handleUpdateCrew(member.id, 'burdenedHourlyRate', parseFloat(e.target.value) || 0)
                          }
                          onFocus={() => setActiveField('crew')}
                          onBlur={() => setActiveField(null)}
                          className={styles.textInput}
                          style={{ height: '2rem', fontSize: '0.8125rem' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={member.regularHours || ''}
                          onChange={(e) => handleUpdateCrew(member.id, 'regularHours', parseFloat(e.target.value) || 0)}
                          onFocus={() => setActiveField('crew')}
                          onBlur={() => setActiveField(null)}
                          className={styles.textInput}
                          style={{ height: '2rem', fontSize: '0.8125rem' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={member.overtimeHours || ''}
                          onChange={(e) =>
                            handleUpdateCrew(member.id, 'overtimeHours', parseFloat(e.target.value) || 0)
                          }
                          onFocus={() => setActiveField('crew')}
                          onBlur={() => setActiveField(null)}
                          className={styles.textInput}
                          style={{ height: '2rem', fontSize: '0.8125rem' }}
                        />
                      </td>
                      <td>
                        {crew.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCrew(member.id)}
                            className={styles.removeBtn}
                            title="Remove crew member"
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="button" onClick={handleAddCrew} className={styles.addBtn}>
                + Add Crew Member
              </button>

              {/* Direct Expenses */}
              <div className={styles.sectionTitle}>
                <span>2. Direct Materials & Subcontractors</span>
                <span className={styles.sectionBadge}>Job Expenses</span>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="jobMat">
                    Materials & Supplies
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="jobMat"
                      type="number"
                      min="0"
                      step="50"
                      value={materialsCost || ''}
                      onChange={(e) => setMaterialsCost(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('expenses')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="jobEquip">
                    Equipment Rental
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="jobEquip"
                      type="number"
                      min="0"
                      step="50"
                      value={equipmentCost || ''}
                      onChange={(e) => setEquipmentCost(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('expenses')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="jobSubs">
                  Subcontractor Invoices
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="jobSubs"
                    type="number"
                    min="0"
                    step="50"
                    value={subsCost || ''}
                    onChange={(e) => setSubsCost(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('expenses')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.textInput} ${styles.hasPrefix}`}
                  />
                </div>
              </div>

              {/* Overhead & Profit settings */}
              <div className={styles.sectionTitle}>
                <span>3. Overhead & Profit Pricing</span>
                <span className={styles.sectionBadge}>Markup / Margin</span>
              </div>

              <div className={styles.toggleButtonGroup}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${pricingMode === 'markup' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setPricingMode('markup')}
                >
                  Markup on Cost (Sequential)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${pricingMode === 'margin' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setPricingMode('margin')}
                >
                  Margin on Final Quote
                </button>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="overheadPct">
                    Overhead Rate
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="overheadPct"
                      type="number"
                      min="0"
                      step="1"
                      value={overheadPercent || ''}
                      onChange={(e) => setOverheadPercent(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('markup')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.fieldHint}>Office, insurance, vehicles</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="profitPct">
                    Desired Profit
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="profitPct"
                      type="number"
                      min="0"
                      step="1"
                      value={profitPercent || ''}
                      onChange={(e) => setProfitPercent(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('markup')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.fieldHint}>Net company profit</span>
                </div>
              </div>
            </div>

            {/* Quote Results Column */}
            <div className={styles.resultsCard}>
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Recommended Client Quote</div>
                <div className={styles.heroValue}>{fmt(jobQuoteResult.finalQuotePrice)}</div>
                <div className={styles.heroSub}>
                  <span className={styles.burdenBadge}>
                    +{jobQuoteResult.effectiveMarkupPercent.toFixed(1)}% Markup
                  </span>
                  <span>({jobQuoteResult.effectiveGrossMarginPercent.toFixed(1)}% Margin)</span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Direct Labor</span>
                    <span className={styles.metricItemValue}>{fmt(jobQuoteResult.totalLaborCost)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Labor Hours</span>
                    <span className={styles.metricItemValue}>{jobQuoteResult.totalLaborHours} hrs</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Overhead $</span>
                    <span className={styles.metricItemValue}>{fmt(jobQuoteResult.overheadAmount)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Net Profit $</span>
                    <span className={styles.metricItemValue}>{fmt(jobQuoteResult.profitAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Quote Breakdown Table */}
              <div className={styles.card}>
                <div className={styles.sectionTitle}>
                  <span>Quote Itemization Table</span>
                  <span className={styles.sectionBadge}>Cost Stack</span>
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Line Item</th>
                      <th className={styles.numCell}>Amount</th>
                      <th className={styles.numCell}>% of Quote</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Direct Labor ({jobQuoteResult.totalLaborHours} hours)</td>
                      <td className={styles.numCell}>{fmt(jobQuoteResult.totalLaborCost)}</td>
                      <td className={styles.numCell}>
                        {((jobQuoteResult.totalLaborCost / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    {materialsCost > 0 && (
                      <tr>
                        <td>Materials & Supplies</td>
                        <td className={styles.numCell}>{fmt(materialsCost)}</td>
                        <td className={styles.numCell}>
                          {((materialsCost / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    {equipmentCost > 0 && (
                      <tr>
                        <td>Equipment Rental</td>
                        <td className={styles.numCell}>{fmt(equipmentCost)}</td>
                        <td className={styles.numCell}>
                          {((equipmentCost / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    {subsCost > 0 && (
                      <tr>
                        <td>Subcontractors</td>
                        <td className={styles.numCell}>{fmt(subsCost)}</td>
                        <td className={styles.numCell}>
                          {((subsCost / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>Direct Job Costs Subtotal</td>
                      <td className={styles.numCell}>{fmt(jobQuoteResult.directCostsSubtotal)}</td>
                      <td className={styles.numCell}>
                        {((jobQuoteResult.directCostsSubtotal / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Company Overhead ({overheadPercent}%)</td>
                      <td className={styles.numCell}>{fmt(jobQuoteResult.overheadAmount)}</td>
                      <td className={styles.numCell}>
                        {((jobQuoteResult.overheadAmount / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Profit ({profitPercent}%)</td>
                      <td className={styles.numCell}>{fmt(jobQuoteResult.profitAmount)}</td>
                      <td className={styles.numCell}>
                        {((jobQuoteResult.profitAmount / (jobQuoteResult.finalQuotePrice || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Final Client Quote</td>
                      <td className={styles.numCell}>{fmt(jobQuoteResult.finalQuotePrice)}</td>
                      <td className={styles.numCell}>100.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: LABOR % OF REVENUE                                */}
        {/* ========================================================= */}
        {activeTab === 'labor-pct' && (
          <div className={styles.layoutGrid}>
            <div className={styles.inputCard}>
              <div className={styles.sectionTitle}>
                <span>1. Business Revenue & Labor Expenses</span>
                <span className={styles.sectionBadge}>Benchmark</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="annRev">
                  Annual Gross Revenue / Sales
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="annRev"
                    type="number"
                    min="1"
                    step="5000"
                    value={annualRevenue || ''}
                    onChange={(e) => setAnnualRevenue(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('revenue')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.textInput} ${styles.hasPrefix}`}
                  />
                </div>
                <span className={styles.fieldHint}>Total receipts or billings for the year</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="annLabor">
                  Total Annual Labor Cost (Wages + Burden)
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="annLabor"
                    type="number"
                    min="0"
                    step="1000"
                    value={customLaborCost !== null ? customLaborCost : employeeResult.totalCostAnnual}
                    onChange={(e) => setCustomLaborCost(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('revenue')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.textInput} ${styles.hasPrefix}`}
                  />
                </div>
                <span className={styles.fieldHint}>
                  {customLaborCost === null
                    ? `Default is 1 employee from Tab 1 (${fmt(employeeResult.totalCostAnnual)}). Edit to enter company total.`
                    : 'Custom labor cost entered.'}
                </span>
              </div>

              {customLaborCost !== null && (
                <button
                  type="button"
                  onClick={() => setCustomLaborCost(null)}
                  className={styles.toggleBtn}
                  style={{ border: '1px solid var(--line)', marginTop: '0.5rem' }}
                >
                  Reset to Tab 1 Employee Cost ({fmt(employeeResult.totalCostAnnual)})
                </button>
              )}
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Labor Cost Percentage</div>
                <div className={styles.heroValue}>
                  {laborPercentResult.laborPercent !== null ? `${laborPercentResult.laborPercent.toFixed(1)}%` : '—'}
                </div>
                <div className={styles.heroSub}>
                  <span>of gross revenue spent on wages, payroll taxes & benefits</span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Labor Spending</span>
                    <span className={styles.metricItemValue}>{fmt(laborPercentResult.laborCost)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Gross Revenue</span>
                    <span className={styles.metricItemValue}>{fmt(laborPercentResult.revenue)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Remaining %</span>
                    <span className={styles.metricItemValue}>
                      {laborPercentResult.laborPercent !== null
                        ? `${(100 - laborPercentResult.laborPercent).toFixed(1)}%`
                        : '—'}
                    </span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Remaining $</span>
                    <span className={styles.metricItemValue}>
                      {fmt(Math.max(0, laborPercentResult.revenue - laborPercentResult.laborCost))}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.sectionTitle}>
                  <span>Interpreting Your Labor Percentage</span>
                  <span className={styles.sectionBadge}>Analysis</span>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  {laborPercentResult.laborPercent !== null && laborPercentResult.laborPercent > 0 ? (
                    <>
                      For every <strong>$1.00</strong> of gross revenue generated,{' '}
                      <strong>{(laborPercentResult.laborPercent / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong>{' '}
                      pays for employee payroll, employer payroll taxes, workers&apos; compensation insurance, and benefits.{' '}
                      The remaining{' '}
                      <strong>{((100 - laborPercentResult.laborPercent) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong>{' '}
                      covers raw materials, equipment, operational overhead, and business profit.
                    </>
                  ) : (
                    'Enter positive gross revenue to see your labor cost percentage and revenue distribution.'
                  )}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                  <em>Note:</em> Healthy labor percentages vary drastically by industry (e.g., 20%–35% in construction, 25%–35% in hospitality, and 40%–60% in professional services). No universal target fits all business models.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Action Buttons */}
        <div className={styles.actionsBar}>
          <button type="button" onClick={handleCopySummary} className={styles.actionBtn}>
            📋 Copy Summary
          </button>
          <button type="button" onClick={() => window.print()} className={styles.actionBtn}>
            🖨️ Print Report
          </button>
          {copiedToast && <span className={styles.copiedToast}>✓ Copied to clipboard!</span>}
        </div>
      </div>
    </ToolShell>
  );
}

export default function LaborCostCalculator() {
  return (
    <LaborCostCalculatorInner />
  );
}
