'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import FreelanceInputGuide, { FreelanceFieldId } from './FreelanceInputGuide';
import styles from './FreelanceRateCalculator.module.css';
import {
  calculateFreelanceRateFromGoal,
  calculateIncomeFromRate,
  calculateProjectQuote,
  calculateUsSelfEmploymentTaxHelper,
  FreelanceGoalInput,
  FreelanceIncomeInput,
  FreelanceProjectInput,
} from '../../../lib/freelance-rate-engine';
import { ROUTES } from '@/lib/routes';

type FreelanceTab = 'goal' | 'income' | 'project';

const TABS: TabItem<FreelanceTab>[] = [
  { id: 'goal', label: 'What Should I Charge? (Goal → Rate)' },
  { id: 'income', label: 'What Will I Earn? (Rate → Income)' },
  { id: 'project', label: 'Project Quote Builder' },
];

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function fmtDec(n: number | null | undefined, dec = 2): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function FreelanceRateCalculatorInner() {
  const [activeTab, setActiveTab] = useState<FreelanceTab>('goal');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as FreelanceTab;
      if (tabParam === 'income' || tabParam === 'project') {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: FreelanceTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<FreelanceFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Tab 1 (Goal -> Rate) Inputs
  const [targetTakeHome, setTargetTakeHome] = useState<number>(70000);
  const [taxPct, setTaxPct] = useState<number>(25);
  const [bufferPct, setBufferPct] = useState<number>(15);

  // Calendar Inputs
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [holidays, setHolidays] = useState<number>(10);
  const [vacation, setVacation] = useState<number>(15);
  const [sickDays, setSickDays] = useState<number>(5);
  const [trainingDays, setTrainingDays] = useState<number>(5);
  const [billablePct, setBillablePct] = useState<number>(70);

  // Business Overhead Inputs
  const [softwareMonthly, setSoftwareMonthly] = useState<number>(200);
  const [equipmentAnnual, setEquipmentAnnual] = useState<number>(1600);
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(1000);
  const [coworkingMonthly, setCoworkingMonthly] = useState<number>(0);
  const [otherAnnual, setOtherAnnual] = useState<number>(1000);

  // Benefits Inputs
  const [healthAnnual, setHealthAnnual] = useState<number>(6000);
  const [retirementAnnual, setRetirementAnnual] = useState<number>(3500);

  // Tab 2 (Rate -> Income) Input
  const [customHourlyRate, setCustomHourlyRate] = useState<number>(95);

  // Tab 3 (Project Quote) Inputs
  const [projectHours, setProjectHours] = useState<number>(40);
  const [projectBufferPct, setProjectBufferPct] = useState<number>(15);
  const [projectFixedExpenses, setProjectFixedExpenses] = useState<number>(250);

  // Computations
  const goalInput: FreelanceGoalInput = useMemo(
    () => ({
      targetTakeHome,
      taxPct,
      bufferPct,
      calendar: {
        workDaysPerWeek: daysPerWeek,
        hoursPerDay,
        holidaysDays: holidays,
        vacationDays: vacation,
        sickDays,
        trainingDays,
        billablePct,
      },
      businessCosts: {
        softwareMonthly,
        equipmentAnnual,
        insuranceAnnual,
        coworkingMonthly,
        otherAnnual,
      },
      benefits: {
        healthInsuranceAnnual: healthAnnual,
        retirementAnnual,
      },
    }),
    [
      targetTakeHome,
      taxPct,
      bufferPct,
      daysPerWeek,
      hoursPerDay,
      holidays,
      vacation,
      sickDays,
      trainingDays,
      billablePct,
      softwareMonthly,
      equipmentAnnual,
      insuranceAnnual,
      coworkingMonthly,
      otherAnnual,
      healthAnnual,
      retirementAnnual,
    ]
  );

  const goalResult = useMemo(() => calculateFreelanceRateFromGoal(goalInput), [goalInput]);

  const incomeInput: FreelanceIncomeInput = useMemo(
    () => ({
      hourlyRate: customHourlyRate,
      calendar: goalInput.calendar,
      businessCosts: goalInput.businessCosts,
      benefits: goalInput.benefits,
      taxPct,
    }),
    [customHourlyRate, goalInput.calendar, goalInput.businessCosts, goalInput.benefits, taxPct]
  );

  const incomeResult = useMemo(() => calculateIncomeFromRate(incomeInput), [incomeInput]);

  const projectInput: FreelanceProjectInput = useMemo(
    () => ({
      estimatedHours: projectHours,
      hourlyRate: goalResult.recommendedHourlyRate ?? customHourlyRate,
      revisionBufferPct: projectBufferPct,
      fixedExpenses: projectFixedExpenses,
    }),
    [projectHours, goalResult.recommendedHourlyRate, customHourlyRate, projectBufferPct, projectFixedExpenses]
  );

  const projectResult = useMemo(() => calculateProjectQuote(projectInput), [projectInput]);

  // US SE-Tax helper
  const seTaxHelper = useMemo(
    () => calculateUsSelfEmploymentTaxHelper(goalResult.preTaxProfitNeeded),
    [goalResult.preTaxProfitNeeded]
  );

  // Copy Summary Handler
  const handleCopySummary = () => {
    let summaryText = '';
    if (activeTab === 'goal') {
      summaryText = [
        `KKC Tools — Freelance Rate Calculator Report (Goal → Rate)`,
        `Target Take-Home Pay: ${fmt(targetTakeHome)}/year (after tax)`,
        `Billable Hours: ${Math.round(goalResult.billableHours)} hrs/year (${goalResult.actualWorkDays} working days, ${billablePct}% billable)`,
        `Required Gross Revenue: ${fmt(goalResult.requiredRevenueAnnual)}/year (${fmt(goalResult.requiredRevenueMonthly)}/mo)`,
        `Break-Even Hourly Rate: $${fmtDec(goalResult.breakEvenHourlyRate)}/hr`,
        `Recommended Hourly Rate (+${bufferPct}% buffer): $${fmtDec(goalResult.recommendedHourlyRate)}/hr`,
        `Full Day Rate (8h): ${fmt(goalResult.dayRate)} · Weekly Retainer: ${fmt(goalResult.weeklyRetainer)}`,
        `Salaried Equivalent: Approx ${fmt(goalResult.equivalentSalaryGross)} gross salary (before employer benefits & leave)`,
      ].join('\n');
    } else if (activeTab === 'income') {
      summaryText = [
        `KKC Tools — Freelance Income Report (Rate → Income)`,
        `Hourly Rate: $${customHourlyRate}/hr · Billable Hours: ${Math.round(incomeResult.billableHours)} hrs/year`,
        `Gross Annual Revenue: ${fmt(incomeResult.grossRevenueAnnual)}/year (${fmt(incomeResult.grossRevenueMonthly)}/mo)`,
        `Operating Profit (after overhead & benefits): ${fmt(incomeResult.operatingProfit)}/year`,
        `Estimated Taxes (${taxPct}%): ${fmt(incomeResult.taxAmount)}/year`,
        `Net Take-Home Pay: ${fmt(incomeResult.netTakeHomeAnnual)}/year (${fmt(incomeResult.netTakeHomeMonthly)}/mo)`,
      ].join('\n');
    } else {
      summaryText = [
        `KKC Tools — Freelance Project Quote Report`,
        `Estimated Hours: ${projectHours} hrs @ $${fmtDec(projectInput.hourlyRate)}/hr`,
        `Base Labor: ${fmt(projectResult.baseLaborCost)}`,
        `Scope / Revision Buffer (+${projectBufferPct}%): ${fmt(projectResult.bufferAmount)}`,
        `Fixed Project Expenses: ${fmt(projectResult.fixedExpenses)}`,
        `Total Recommended Project Quote: ${fmt(projectResult.totalProjectQuote)}`,
        `Effective Hourly Rate: $${fmtDec(projectResult.effectiveHourlyRate)}/hr`,
      ].join('\n');
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className={styles.calcContainer}>
      <TabSlider tabs={TABS} activeId={activeTab} onChange={handleTabChange} ariaLabel="Freelance rate calculator modes" />

      {/* Visual Input Guide Diagram */}
      <FreelanceInputGuide
        mode={activeTab}
        activeField={activeField}
        targetTakeHome={targetTakeHome}
        billableHours={goalResult.billableHours}
        totalWorkingHours={goalResult.totalWorkingHours}
        timeOffDays={goalResult.timeOffDays}
        billablePct={billablePct}
        taxPct={taxPct}
        businessCosts={goalResult.totalBusinessCostsAnnual}
        benefits={goalResult.totalBenefitsAnnual}
        recommendedRate={goalResult.recommendedHourlyRate ?? 0}
        breakEvenRate={goalResult.breakEvenHourlyRate ?? 0}
      />

      {/* Dynamic Summary Banner (BLUF) */}
      <div className={styles.summaryBanner}>
        {activeTab === 'goal' ? (
          <>
            To take home <strong>{fmt(targetTakeHome)} a year</strong> after tax with{' '}
            <strong>{Math.round(goalResult.billableHours)} billable hours</strong>, charge at least{' '}
            <strong>${fmtDec(goalResult.breakEvenHourlyRate)} an hour</strong> to break even.{' '}
            <strong>${fmtDec(goalResult.recommendedHourlyRate)}/hr</strong> adds a {bufferPct}% risk and profit buffer.
          </>
        ) : activeTab === 'income' ? (
          <>
            At <strong>${customHourlyRate} an hour</strong> with{' '}
            <strong>{Math.round(incomeResult.billableHours)} billable hours/year</strong>, you will gross{' '}
            <strong>{fmt(incomeResult.grossRevenueAnnual)} per year</strong> and take home approximately{' '}
            <strong>{fmt(incomeResult.netTakeHomeMonthly)} per month</strong> ({fmt(incomeResult.netTakeHomeAnnual)}/yr)
            after business costs, health/retirement benefits, and taxes.
          </>
        ) : (
          <>
            For a <strong>{projectHours}-hour project</strong> quoted at{' '}
            <strong>${fmtDec(projectInput.hourlyRate)}/hr</strong> with a {projectBufferPct}% revision buffer and{' '}
            {fmt(projectFixedExpenses)} in expenses, your total client quote should be{' '}
            <strong>{fmt(projectResult.totalProjectQuote)}</strong> (effective ${fmtDec(projectResult.effectiveHourlyRate)}/hr).
          </>
        )}
      </div>

      <div className={styles.gridTwoCol}>
        {/* Left Column: Form Inputs */}
        <div className={styles.inputsCol}>
          {activeTab === 'goal' && (
            <>
              {/* Card 1: Target Take-Home & Taxes */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardStepBadge}>1</span>
                  <h2 className={styles.cardTitle}>Take-Home Pay Goal &amp; Taxes</h2>
                </div>
                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="targetTakeHome">
                      Target Annual Take-Home
                      <span className={styles.inputSubtext}>After-tax income</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="targetTakeHome"
                        type="number"
                        min={1000}
                        max={10000000}
                        step={1000}
                        value={targetTakeHome}
                        onChange={(e) => setTargetTakeHome(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('targetTakeHome')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="taxPct">
                      Effective Tax Rate
                      <span className={styles.inputSubtext}>Income + SECA %</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="taxPct"
                        type="number"
                        min={0}
                        max={60}
                        value={taxPct}
                        onChange={(e) => setTaxPct(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('taxRate')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="bufferPct">
                      Profit &amp; Risk Buffer
                      <span className={styles.inputSubtext}>Over break-even</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="bufferPct"
                        type="number"
                        min={0}
                        max={100}
                        value={bufferPct}
                        onChange={(e) => setBufferPct(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('bufferPct')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Calendar & Billable Capacity */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardStepBadge}>2</span>
                  <h2 className={styles.cardTitle}>Work Schedule &amp; Billable Ratio</h2>
                </div>
                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="billablePct">
                      Billable Time Ratio
                      <span className={styles.inputSubtext}>Excludes admin</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="billablePct"
                        type="number"
                        min={10}
                        max={100}
                        value={billablePct}
                        onChange={(e) => setBillablePct(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('billablePct')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>%</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="hoursPerDay">
                      Working Hours / Day
                      <span className={styles.inputSubtext}>Standard workday</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="hoursPerDay"
                        type="number"
                        min={1}
                        max={16}
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(Number(e.target.value) || 1)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>hrs</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="vacation">
                      Vacation Days / Year
                      <span className={styles.inputSubtext}>Paid time off</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="vacation"
                        type="number"
                        min={0}
                        max={90}
                        value={vacation}
                        onChange={(e) => setVacation(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>days</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="holidays">
                      Public Holidays
                      <span className={styles.inputSubtext}>Observed days</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="holidays"
                        type="number"
                        min={0}
                        max={30}
                        value={holidays}
                        onChange={(e) => setHolidays(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>days</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="sickDays">
                      Sick Days Reserved
                      <span className={styles.inputSubtext}>Health cushion</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="sickDays"
                        type="number"
                        min={0}
                        max={30}
                        value={sickDays}
                        onChange={(e) => setSickDays(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>days</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="trainingDays">
                      Professional Development
                      <span className={styles.inputSubtext}>Conferences, courses</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="trainingDays"
                        type="number"
                        min={0}
                        max={30}
                        value={trainingDays}
                        onChange={(e) => setTrainingDays(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithSuffix}`}
                      />
                      <span className={styles.inputSuffix}>days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Overhead Expenses & Benefits */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardStepBadge}>3</span>
                  <h2 className={styles.cardTitle}>Business Costs &amp; Benefits</h2>
                </div>
                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="softwareMonthly">
                      Software &amp; Tools / Month
                      <span className={styles.inputSubtext}>Adobe, Figma, SaaS</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="softwareMonthly"
                        type="number"
                        min={0}
                        value={softwareMonthly}
                        onChange={(e) => setSoftwareMonthly(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('businessCosts')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                      <span className={styles.inputSuffix}>/mo</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="equipmentAnnual">
                      Equipment &amp; Hardware / Year
                      <span className={styles.inputSubtext}>Laptop amortized</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="equipmentAnnual"
                        type="number"
                        min={0}
                        value={equipmentAnnual}
                        onChange={(e) => setEquipmentAnnual(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                      <span className={styles.inputSuffix}>/yr</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="insuranceAnnual">
                      Liability Insurance / Year
                      <span className={styles.inputSubtext}>E&amp;O coverage</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="insuranceAnnual"
                        type="number"
                        min={0}
                        value={insuranceAnnual}
                        onChange={(e) => setInsuranceAnnual(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                      <span className={styles.inputSuffix}>/yr</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="healthAnnual">
                      Health Insurance / Year
                      <span className={styles.inputSubtext}>Medical premiums</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="healthAnnual"
                        type="number"
                        min={0}
                        value={healthAnnual}
                        onChange={(e) => setHealthAnnual(Number(e.target.value) || 0)}
                        onFocus={() => setActiveField('benefits')}
                        onBlur={() => setActiveField(null)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                      <span className={styles.inputSuffix}>/yr</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="retirementAnnual">
                      Retirement Contribution / Year
                      <span className={styles.inputSubtext}>SEP-IRA, 401(k)</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="retirementAnnual"
                        type="number"
                        min={0}
                        value={retirementAnnual}
                        onChange={(e) => setRetirementAnnual(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                      <span className={styles.inputSuffix}>/yr</span>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="otherAnnual">
                      Other Business Expenses
                      <span className={styles.inputSubtext}>Accounting, phone</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputPrefix}>$</span>
                      <input
                        id="otherAnnual"
                        type="number"
                        min={0}
                        value={otherAnnual}
                        onChange={(e) => setOtherAnnual(Number(e.target.value) || 0)}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                      <span className={styles.inputSuffix}>/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'income' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardStepBadge}>1</span>
                <h2 className={styles.cardTitle}>Set Your Hourly Rate</h2>
              </div>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="customHourlyRate">
                    Your Hourly Rate
                    <span className={styles.inputSubtext}>Quoted to clients</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="customHourlyRate"
                      type="number"
                      min={1}
                      max={10000}
                      value={customHourlyRate}
                      onChange={(e) => setCustomHourlyRate(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                    <span className={styles.inputSuffix}>/hr</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="taxPct2">
                    Estimated Tax %
                    <span className={styles.inputSubtext}>Effective tax</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="taxPct2"
                      type="number"
                      min={0}
                      max={60}
                      value={taxPct}
                      onChange={(e) => setTaxPct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'project' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardStepBadge}>1</span>
                <h2 className={styles.cardTitle}>Project Scope &amp; Deliverables</h2>
              </div>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="projectHours">
                    Estimated Work Hours
                    <span className={styles.inputSubtext}>Design, coding, revisions</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="projectHours"
                      type="number"
                      min={1}
                      max={1000}
                      value={projectHours}
                      onChange={(e) => setProjectHours(Number(e.target.value) || 1)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.inputSuffix}>hrs</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="projectBufferPct">
                    Scope Creep Buffer
                    <span className={styles.inputSubtext}>Extra revisions %</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="projectBufferPct"
                      type="number"
                      min={0}
                      max={50}
                      value={projectBufferPct}
                      onChange={(e) => setProjectBufferPct(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.inputSuffix}>%</span>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="projectFixedExpenses">
                    Subcontracts &amp; Assets
                    <span className={styles.inputSubtext}>Stock photos, fonts</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      id="projectFixedExpenses"
                      type="number"
                      min={0}
                      value={projectFixedExpenses}
                      onChange={(e) => setProjectFixedExpenses(Number(e.target.value) || 0)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Financial Results */}
        <div className={styles.resultsCol}>
          {activeTab === 'goal' && (
            <>
              {/* Key Metrics Grid */}
              <div className={styles.metricsGrid}>
                <div className={`${styles.metricCard} ${styles.metricCardFeatured}`}>
                  <span className={styles.metricLabel}>Recommended Rate</span>
                  <span className={styles.metricValue}>${fmtDec(goalResult.recommendedHourlyRate)}</span>
                  <span className={styles.metricSubtext}>+ {bufferPct}% buffer</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Break-Even Rate</span>
                  <span className={styles.metricValue}>${fmtDec(goalResult.breakEvenHourlyRate)}</span>
                  <span className={styles.metricSubtext}>floor rate</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Full Day Rate</span>
                  <span className={styles.metricValue}>{fmt(goalResult.dayRate)}</span>
                  <span className={styles.metricSubtext}>{hoursPerDay}h billable day</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Weekly Retainer</span>
                  <span className={styles.metricValue}>{fmt(goalResult.weeklyRetainer)}</span>
                  <span className={styles.metricSubtext}>
                    {Math.round(hoursPerDay * daysPerWeek * (billablePct / 100))} billable h/wk
                  </span>
                </div>
              </div>

              {/* Annual Revenue & Take-Home Waterfall Table */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Annual Financial Waterfall (Why Freelance Rates Are Higher)</h3>
                </div>
                <table className={styles.waterfallTable}>
                  <thead>
                    <tr>
                      <th>Financial Component</th>
                      <th className={styles.numRight}>Annual Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Target After-Tax Take-Home Pay</td>
                      <td className={styles.numRight}>{fmt(goalResult.targetTakeHome)}</td>
                    </tr>
                    <tr>
                      <td>Estimated Income &amp; Self-Employment Tax ({taxPct}%)</td>
                      <td className={styles.numRight}>+ {fmt(goalResult.taxAmount)}</td>
                    </tr>
                    <tr className={styles.rowBold}>
                      <td>Pre-Tax Business Profit Needed</td>
                      <td className={styles.numRight}>{fmt(goalResult.preTaxProfitNeeded)}</td>
                    </tr>
                    <tr>
                      <td>Business Operating Overhead (Software, Hardware, Ins.)</td>
                      <td className={styles.numRight}>+ {fmt(goalResult.totalBusinessCostsAnnual)}</td>
                    </tr>
                    <tr>
                      <td>Health Insurance &amp; Retirement Benefits</td>
                      <td className={styles.numRight}>+ {fmt(goalResult.totalBenefitsAnnual)}</td>
                    </tr>
                    <tr className={styles.rowHighlight}>
                      <td>Total Gross Revenue Required to Break Even</td>
                      <td className={styles.numRight}>{fmt(goalResult.requiredRevenueAnnual)}</td>
                    </tr>
                    <tr>
                      <td>Total Billable Client Hours / Year</td>
                      <td className={styles.numRight}>{Math.round(goalResult.billableHours)} hrs</td>
                    </tr>
                    <tr className={styles.rowBold}>
                      <td>Break-Even Hourly Rate Floor</td>
                      <td className={styles.numRight}>${fmtDec(goalResult.breakEvenHourlyRate)}/hr</td>
                    </tr>
                    <tr className={styles.rowHighlight}>
                      <td>Recommended Rate (with {bufferPct}% Profit Buffer)</td>
                      <td className={styles.numRight}>${fmtDec(goalResult.recommendedHourlyRate)}/hr</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Salaried Equivalent Notice Card */}
              <div className={styles.salaryCard}>
                <strong>Salaried Job Equivalent:</strong> Earning <strong>{fmt(goalResult.targetTakeHome)}</strong> net as a
                freelancer equates to a traditional salaried corporate job paying roughly{' '}
                <strong>{fmt(goalResult.equivalentSalaryGross)} gross</strong>, because corporate employers directly cover
                paid leave (holidays, vacation, sick days) and match 7.65% in payroll taxes plus healthcare subsidies. Compare
                directly on our{' '}
                <Link href={ROUTES.hourlyToSalaryCalculator.path} style={{ textDecoration: 'underline', fontWeight: 700 }}>
                  Hourly to Salary Calculator
                </Link>
                .
              </div>

              {/* US Self-Employment Tax Helper Card */}
              <div className={styles.taxHelperBox}>
                <div className={styles.taxHelperTitle}>
                  <span>🏛️</span>
                  <span>US Self-Employment Tax (SECA) Estimation Helper</span>
                </div>
                <div>
                  On <strong>{fmt(goalResult.preTaxProfitNeeded)}</strong> in net self-employment profit, 92.35% (
                  {fmt(seTaxHelper.profitSubjectToTax)}) is subject to SE tax: 12.4% Social Security ({fmt(seTaxHelper.socialSecurityTax)})
                  plus 2.9% Medicare ({fmt(seTaxHelper.medicareTax)}) = <strong>{fmt(seTaxHelper.totalSelfEmploymentTax)}</strong> total SE tax
                  ({fmtDec(seTaxHelper.effectiveSeTaxRatePct, 1)}% effective rate). Half of this ({fmt(seTaxHelper.halfDeductiblePortion)}) is an
                  above-the-line deduction on IRS Form 1040.
                </div>
              </div>
            </>
          )}

          {activeTab === 'income' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Projected Annual &amp; Monthly Income</h3>
              </div>
              <table className={styles.waterfallTable}>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th className={styles.numRight}>Monthly</th>
                    <th className={styles.numRight}>Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.rowBold}>
                    <td>Gross Client Billings (${customHourlyRate}/hr × {Math.round(incomeResult.billableHours)}h)</td>
                    <td className={styles.numRight}>{fmt(incomeResult.grossRevenueMonthly)}</td>
                    <td className={styles.numRight}>{fmt(incomeResult.grossRevenueAnnual)}</td>
                  </tr>
                  <tr>
                    <td>Business Operating Expenses</td>
                    <td className={styles.numRight}>−{fmt(incomeResult.totalBusinessCostsAnnual / 12)}</td>
                    <td className={styles.numRight}>−{fmt(incomeResult.totalBusinessCostsAnnual)}</td>
                  </tr>
                  <tr>
                    <td>Health &amp; Retirement Benefits</td>
                    <td className={styles.numRight}>−{fmt(incomeResult.totalBenefitsAnnual / 12)}</td>
                    <td className={styles.numRight}>−{fmt(incomeResult.totalBenefitsAnnual)}</td>
                  </tr>
                  <tr className={styles.rowBold}>
                    <td>Net Pre-Tax Business Profit</td>
                    <td className={styles.numRight}>{fmt(incomeResult.operatingProfit / 12)}</td>
                    <td className={styles.numRight}>{fmt(incomeResult.operatingProfit)}</td>
                  </tr>
                  <tr>
                    <td>Estimated Taxes ({taxPct}%)</td>
                    <td className={styles.numRight}>−{fmt(incomeResult.taxAmount / 12)}</td>
                    <td className={styles.numRight}>−{fmt(incomeResult.taxAmount)}</td>
                  </tr>
                  <tr className={styles.rowHighlight}>
                    <td>Net Take-Home Pay (After Taxes &amp; Overhead)</td>
                    <td className={styles.numRight}>{fmt(incomeResult.netTakeHomeMonthly)}</td>
                    <td className={styles.numRight}>{fmt(incomeResult.netTakeHomeAnnual)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'project' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Recommended Client Project Quote</h3>
              </div>
              <table className={styles.waterfallTable}>
                <thead>
                  <tr>
                    <th>Quote Component</th>
                    <th className={styles.numRight}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Base Labor ({projectHours} hrs × ${fmtDec(projectInput.hourlyRate)}/hr)</td>
                    <td className={styles.numRight}>{fmt(projectResult.baseLaborCost)}</td>
                  </tr>
                  <tr>
                    <td>Revision &amp; Scope Buffer (+{projectBufferPct}%)</td>
                    <td className={styles.numRight}>{fmt(projectResult.bufferAmount)}</td>
                  </tr>
                  <tr>
                    <td>Subcontracts &amp; Fixed Expenses</td>
                    <td className={styles.numRight}>{fmt(projectResult.fixedExpenses)}</td>
                  </tr>
                  <tr className={styles.rowHighlight}>
                    <td>Total Recommended Project Quote</td>
                    <td className={styles.numRight}>{fmt(projectResult.totalProjectQuote)}</td>
                  </tr>
                  <tr className={styles.rowBold}>
                    <td>Effective Realized Hourly Rate</td>
                    <td className={styles.numRight}>${fmtDec(projectResult.effectiveHourlyRate)}/hr</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actionsRow}>
            <button type="button" className={styles.actionBtn} onClick={handleCopySummary}>
              📋 Copy Rate Report
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

      {copiedToast && <div className={styles.toast}>Report copied to clipboard!</div>}
    </div>
  );
}

export default function FreelanceRateCalculator() {
  return (
    <ToolShell
      features={[
        'Rate ↔ income both ways',
        'Billable hours calendar',
        'Day & project rates',
        'Print & share link',
      ]}
    >
      <Suspense fallback={<div>Loading calculator...</div>}>
        <FreelanceRateCalculatorInner />
      </Suspense>
    </ToolShell>
  );
}
