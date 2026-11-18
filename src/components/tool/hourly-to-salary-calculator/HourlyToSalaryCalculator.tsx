'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import styles from './HourlyToSalaryCalculator.module.css';
import WageDiagram from './WageDiagram';
import {
  PayPeriod,
  calculateWage,
  compareWages,
  generateWageTable,
  formatPeriodName,
  DailySchedule,
} from '@/lib/wage-engine';

export type ActiveTab = 'convert' | 'compare' | 'table';

const WAGE_TABS: { id: ActiveTab; label: string }[] = [
  { id: 'convert', label: '🔄 Convert (Hourly ↔ Salary)' },
  { id: 'compare', label: '⚖️ Job Offer & Raise %' },
  { id: 'table', label: '📋 Wage Table ($10–$100)' },
];

export default function HourlyToSalaryCalculator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('convert');

  // Core Wage Inputs
  const [amountStr, setAmountStr] = useState<string>('25');
  const [period, setPeriod] = useState<PayPeriod>('hour');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Schedule Configuration
  const [hoursPerWeekStr, setHoursPerWeekStr] = useState<string>('40');
  const [daysPerWeekStr, setDaysPerWeekStr] = useState<string>('5');
  const [weeksPerYearStr, setWeeksPerYearStr] = useState<string>('52');

  // Variable Schedule Toggle & Days
  const [useDailySchedule, setUseDailySchedule] = useState<boolean>(false);
  const [dailyHours, setDailyHours] = useState<DailySchedule>({
    monday: 8,
    tuesday: 8,
    wednesday: 8,
    thursday: 8,
    friday: 8,
    saturday: 0,
    sunday: 0,
  });

  // Time Off Accordion
  const [isTimeOffOpen, setIsTimeOffOpen] = useState<boolean>(false);
  const [paidHolidaysStr, setPaidHolidaysStr] = useState<string>('0');
  const [paidVacationStr, setPaidVacationStr] = useState<string>('0');
  const [unpaidDaysStr, setUnpaidDaysStr] = useState<string>('0');

  // Overtime Accordion
  const [isOvertimeOpen, setIsOvertimeOpen] = useState<boolean>(false);
  const [otHoursStr, setOtHoursStr] = useState<string>('0');
  const [otMultiplierStr, setOtMultiplierStr] = useState<string>('1.5');

  // Compare Tab State
  const [compareMode, setCompareMode] = useState<'raise' | 'secondJob'>('raise');
  const [raisePercentStr, setRaisePercentStr] = useState<string>('5');
  const [secondAmountStr, setSecondAmountStr] = useState<string>('60000');
  const [secondPeriod, setSecondPeriod] = useState<PayPeriod>('year');
  const [secondHoursStr, setSecondHoursStr] = useState<string>('40');

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState<string>('');

  // Feedback states
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  // Sync state from URL query on initial client load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'convert' || tabParam === 'compare' || tabParam === 'table') {
          setActiveTab(tabParam);
        }
        const a = params.get('amount');
        const p = params.get('period') as PayPeriod;
        const cur = params.get('cur');
        const hpw = params.get('hpw');
        const wpy = params.get('wpy');

        if (a) setAmountStr(a);
        if (p) setPeriod(p);
        if (cur) setCurrencySymbol(cur);
        if (hpw) setHoursPerWeekStr(hpw);
        if (wpy) setWeeksPerYearStr(wpy);
      } catch {
        // Safe fallback
      }
    };

    const timer = setTimeout(syncFromUrl, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update query params on state change
  const syncToUrl = useCallback(
    (tab: ActiveTab) => {
      if (typeof window === 'undefined') return;
      try {
        const params = new URLSearchParams();
        params.set('tab', tab);
        params.set('amount', amountStr);
        params.set('period', period);
        if (currencySymbol !== '$') params.set('cur', currencySymbol);
        if (hoursPerWeekStr !== '40') params.set('hpw', hoursPerWeekStr);
        if (weeksPerYearStr !== '52') params.set('wpy', weeksPerYearStr);

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
      } catch {
        // Safe fallback
      }
    },
    [amountStr, period, currencySymbol, hoursPerWeekStr, weeksPerYearStr]
  );

  useEffect(() => {
    syncToUrl(activeTab);
  }, [activeTab, syncToUrl]);

  // Handle Preset Clicks
  const applyPreset = (presetHpw: number, presetCur?: string) => {
    setHoursPerWeekStr(presetHpw.toString());
    setUseDailySchedule(false);
    if (presetCur) setCurrencySymbol(presetCur);
  };

  // Run Main Wage Engine
  const wageResult = useMemo(() => {
    const amount = parseFloat(amountStr) || 0;
    const hoursPerWeek = parseFloat(hoursPerWeekStr) || 40;
    const daysPerWeek = parseFloat(daysPerWeekStr) || 5;
    const weeksPerYear = parseFloat(weeksPerYearStr) || 52;

    const paidHolidays = parseFloat(paidHolidaysStr) || 0;
    const paidVacation = parseFloat(paidVacationStr) || 0;
    const unpaidDays = parseFloat(unpaidDaysStr) || 0;

    const otHours = parseFloat(otHoursStr) || 0;
    const otMult = parseFloat(otMultiplierStr) || 1.5;

    return calculateWage({
      amount,
      period,
      hoursPerWeek,
      daysPerWeek,
      weeksPerYear,
      dailySchedule: useDailySchedule ? dailyHours : undefined,
      paidHolidaysDays: paidHolidays,
      paidVacationDays: paidVacation,
      unpaidDaysOff: unpaidDays,
      overtimeHoursPerWeek: otHours,
      overtimeMultiplier: otMult,
    });
  }, [
    amountStr,
    period,
    hoursPerWeekStr,
    daysPerWeekStr,
    weeksPerYearStr,
    useDailySchedule,
    dailyHours,
    paidHolidaysStr,
    paidVacationStr,
    unpaidDaysStr,
    otHoursStr,
    otMultiplierStr,
  ]);

  // Run Compare Engine
  const compareResult = useMemo(() => {
    const raise = parseFloat(raisePercentStr) || 0;
    const secondAmount = parseFloat(secondAmountStr) || 0;
    const secondHours = parseFloat(secondHoursStr) || 40;

    return compareWages({
      currentWage: {
        amount: parseFloat(amountStr) || 0,
        period,
        hoursPerWeek: parseFloat(hoursPerWeekStr) || 40,
        weeksPerYear: parseFloat(weeksPerYearStr) || 52,
      },
      raisePercent: compareMode === 'raise' ? raise : undefined,
      secondWage:
        compareMode === 'secondJob'
          ? {
              amount: secondAmount,
              period: secondPeriod,
              hoursPerWeek: secondHours,
              weeksPerYear: 52,
            }
          : undefined,
    });
  }, [
    amountStr,
    period,
    hoursPerWeekStr,
    weeksPerYearStr,
    compareMode,
    raisePercentStr,
    secondAmountStr,
    secondPeriod,
    secondHoursStr,
  ]);

  // Reference Table Data
  const fullTableData = useMemo(() => {
    const hpw = parseFloat(hoursPerWeekStr) || 40;
    const wpy = parseFloat(weeksPerYearStr) || 52;
    return generateWageTable(hpw, wpy);
  }, [hoursPerWeekStr, weeksPerYearStr]);

  const filteredTable = useMemo(() => {
    if (!tableSearch.trim()) return fullTableData;
    const query = tableSearch.toLowerCase().replace('$', '').trim();
    return fullTableData.filter(
      (r) =>
        r.hourlyRate.toString().includes(query) ||
        r.annualGross.toString().includes(query) ||
        r.monthlyGross.toString().includes(query)
    );
  }, [fullTableData, tableSearch]);

  // Actions
  const handleCopy = () => {
    let text = '';
    if (activeTab === 'convert') {
      text = `=== Hourly to Salary Calculation ===\n`;
      text += `${wageResult.summarySentence}\n\n`;
      text += `Schedule: ${hoursPerWeekStr} hrs/wk, ${weeksPerYearStr} wks/yr (${wageResult.workingHoursScheduled.toLocaleString()} hours/year)\n`;
      text += `Annual Gross: ${currencySymbol}${wageResult.totalAnnualGross.toLocaleString()}\n`;
      text += `Monthly Gross: ${currencySymbol}${Math.round(wageResult.periods.monthly).toLocaleString()}\n`;
      text += `Biweekly Gross: ${currencySymbol}${Math.round(wageResult.periods.biweekly).toLocaleString()}\n`;
      text += `Weekly Gross: ${currencySymbol}${Math.round(wageResult.periods.weekly).toLocaleString()}\n`;
      text += `Hourly Rate: ${currencySymbol}${wageResult.periods.hourly.toFixed(2)}/hr\n`;
      text += `\n*Gross income before tax. Calculated at KKCTools: https://kkctools.com/hourly-to-salary-calculator/`;
    } else if (activeTab === 'compare') {
      text = `=== Wage & Raise Comparison ===\n`;
      text += `${compareResult.summarySentence}\n`;
      text += `Current Annual: ${currencySymbol}${compareResult.currentAnnual.toLocaleString()}\n`;
      text += `New Annual: ${currencySymbol}${compareResult.newAnnual.toLocaleString()}\n`;
      text += `Annual Difference: ${currencySymbol}${compareResult.annualDifference.toLocaleString()}\n`;
      text += `\nCalculated at KKCTools: https://kkctools.com/hourly-to-salary-calculator/?tab=compare`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    syncToUrl(activeTab);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Navigation Tabs */}
      <TabSlider
        tabs={WAGE_TABS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as ActiveTab)}
        ariaLabel="Hourly to Salary Calculator Modes"
      />

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* ==================================================== */}
        {/* TAB 1: CONVERT (HOURLY ↔ SALARY)                     */}
        {/* ==================================================== */}
        {activeTab === 'convert' && (
          <>
            <div className={styles.inputs}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>1</span>
                    <div>
                      <h2 className={styles.cardTitle}>Pay Rate &amp; Frequency</h2>
                      <p className={styles.cardSubtitle}>
                        Enter your hourly wage or salary amount in any pay period
                      </p>
                    </div>
                  </div>
                  <select
                    className={styles.select}
                    style={{ width: '80px', height: '32px', fontSize: '0.8rem' }}
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    aria-label="Currency"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="A$">A$ (AUD)</option>
                    <option value="C$">C$ (CAD)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="wage-amount">
                      Pay Amount
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.unitBadge}>{currencySymbol}</span>
                      <input
                        id="wage-amount"
                        type="number"
                        min="0"
                        step="any"
                        className={styles.input}
                        value={amountStr}
                        onChange={(e) => setAmountStr(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="wage-period">
                      Per Frequency
                    </label>
                    <select
                      id="wage-period"
                      className={styles.select}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value as PayPeriod)}
                    >
                      <option value="hour">per Hour</option>
                      <option value="day">per Day</option>
                      <option value="week">per Week</option>
                      <option value="biweek">every 2 Weeks (Biweekly)</option>
                      <option value="semi_month">twice a Month (Semi-Mo)</option>
                      <option value="month">per Month</option>
                      <option value="quarter">per Quarter</option>
                      <option value="year">per Year (Salary)</option>
                    </select>
                  </div>
                </div>

                {/* Schedule Presets */}
                <div className={styles.field}>
                  <label className={styles.label}>Working Schedule Presets</label>
                  <div className={styles.chipGroup}>
                    <button
                      type="button"
                      className={`${styles.chip} ${hoursPerWeekStr === '40' && !useDailySchedule ? styles.chipActive : ''}`}
                      onClick={() => applyPreset(40, '$')}
                    >
                      US / Standard (40h)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chip} ${hoursPerWeekStr === '37.5' && !useDailySchedule ? styles.chipActive : ''}`}
                      onClick={() => applyPreset(37.5, '£')}
                    >
                      UK Full-Time (37.5h)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chip} ${hoursPerWeekStr === '38' && !useDailySchedule ? styles.chipActive : ''}`}
                      onClick={() => applyPreset(38, 'A$')}
                    >
                      AU Standard (38h)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chip} ${hoursPerWeekStr === '48' && !useDailySchedule ? styles.chipActive : ''}`}
                      onClick={() => applyPreset(48, '₹')}
                    >
                      India (48h)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chip} ${hoursPerWeekStr === '20' && !useDailySchedule ? styles.chipActive : ''}`}
                      onClick={() => applyPreset(20)}
                    >
                      Part-Time (20h)
                    </button>
                  </div>
                </div>

                {/* Base Hours Grid */}
                {!useDailySchedule ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="hpw">
                        Hours / Week
                      </label>
                      <input
                        id="hpw"
                        type="number"
                        min="1"
                        max="168"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                        value={hoursPerWeekStr}
                        onChange={(e) => setHoursPerWeekStr(e.target.value)}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="dpw">
                        Days / Week
                      </label>
                      <input
                        id="dpw"
                        type="number"
                        min="1"
                        max="7"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                        value={daysPerWeekStr}
                        onChange={(e) => setDaysPerWeekStr(e.target.value)}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="wpy">
                        Weeks / Year
                      </label>
                      <input
                        id="wpy"
                        type="number"
                        min="1"
                        max="52"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                        value={weeksPerYearStr}
                        onChange={(e) => setWeeksPerYearStr(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    <span className={styles.label}>Daily Scheduled Hours (Mon–Sun)</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                      {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(
                        (day) => (
                          <div key={day} style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '0.7rem', textTransform: 'capitalize', color: '#64748b' }}>
                              {day.slice(0, 3)}
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="24"
                              className={styles.input}
                              style={{
                                border: '1px solid var(--line)',
                                borderRadius: '6px',
                                padding: '4px 2px',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                              }}
                              value={dailyHours[day]}
                              onChange={(e) =>
                                setDailyHours({
                                  ...dailyHours,
                                  [day]: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  style={{
                    appearance: 'none',
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '16px',
                    padding: 0,
                  }}
                  onClick={() => setUseDailySchedule(!useDailySchedule)}
                >
                  {useDailySchedule
                    ? '← Use Standard Hours/Week Instead'
                    : '+ Enter Variable Hours Each Day (Mon–Sun)'}
                </button>

                {/* Time Off Accordion */}
                <div className={styles.accordion}>
                  <button
                    type="button"
                    className={styles.accordionHeader}
                    onClick={() => setIsTimeOffOpen(!isTimeOffOpen)}
                  >
                    <span>🏖️ Paid &amp; Unpaid Time Off</span>
                    <span>{isTimeOffOpen ? '▲' : '▼'}</span>
                  </button>
                  {isTimeOffOpen && (
                    <div className={styles.accordionBody}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div className={styles.field}>
                          <label className={styles.label}>Paid Holidays</label>
                          <div className={styles.inputWrap}>
                            <input
                              type="number"
                              min="0"
                              className={styles.input}
                              value={paidHolidaysStr}
                              onChange={(e) => setPaidHolidaysStr(e.target.value)}
                              placeholder="0"
                            />
                            <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>days</span>
                          </div>
                        </div>

                        <div className={styles.field}>
                          <label className={styles.label}>Paid Vacation</label>
                          <div className={styles.inputWrap}>
                            <input
                              type="number"
                              min="0"
                              className={styles.input}
                              value={paidVacationStr}
                              onChange={(e) => setPaidVacationStr(e.target.value)}
                              placeholder="0"
                            />
                            <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>days</span>
                          </div>
                        </div>

                        <div className={styles.field}>
                          <label className={styles.label}>Unpaid Days Off</label>
                          <div className={styles.inputWrap}>
                            <input
                              type="number"
                              min="0"
                              className={styles.input}
                              value={unpaidDaysStr}
                              onChange={(e) => setUnpaidDaysStr(e.target.value)}
                              placeholder="0"
                            />
                            <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>days</span>
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Note: Paid time off doesn&apos;t reduce annual pay; unpaid days deduct from annual gross.
                      </span>
                    </div>
                  )}
                </div>

                {/* Overtime Accordion */}
                <div className={styles.accordion}>
                  <button
                    type="button"
                    className={styles.accordionHeader}
                    onClick={() => setIsOvertimeOpen(!isOvertimeOpen)}
                  >
                    <span>⚡ Overtime Hours (FLSA 1.5×)</span>
                    <span>{isOvertimeOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOvertimeOpen && (
                    <div className={styles.accordionBody}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className={styles.field}>
                          <label className={styles.label}>OT Hours / Week</label>
                          <div className={styles.inputWrap}>
                            <input
                              type="number"
                              min="0"
                              className={styles.input}
                              value={otHoursStr}
                              onChange={(e) => setOtHoursStr(e.target.value)}
                              placeholder="0"
                            />
                            <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>hrs</span>
                          </div>
                        </div>

                        <div className={styles.field}>
                          <label className={styles.label}>OT Rate Multiplier</label>
                          <select
                            className={styles.select}
                            value={otMultiplierStr}
                            onChange={(e) => setOtMultiplierStr(e.target.value)}
                          >
                            <option value="1.5">1.5× (Time and a Half - US FLSA)</option>
                            <option value="2.0">2.0× (Double Time)</option>
                            <option value="1.0">1.0× (Straight Time)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className={styles.results}>
              {/* Hero Result */}
              <div className={styles.heroCard}>
                <span className={styles.heroLabel}>Total Annual Gross Income</span>
                <span className={styles.heroValue}>
                  {currencySymbol}
                  {Math.round(wageResult.totalAnnualGross).toLocaleString()}
                </span>
                <span className={styles.heroSub}>
                  {wageResult.workingHoursScheduled.toLocaleString()} scheduled hours per year • Gross pay before tax
                </span>
              </div>

              {/* Summary Banner */}
              <div className={styles.summaryBanner}>
                <div className={styles.summaryIcon}>✓</div>
                <p className={styles.summaryText}>{wageResult.summarySentence}</p>
              </div>

              {/* Visual Diagram */}
              <div className={styles.card}>
                <WageDiagram wageResult={wageResult} currencySymbol={currencySymbol} />
              </div>

              {/* All 8 Pay Periods Table */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>2</span>
                    <div>
                      <h3 className={styles.cardTitle}>Complete Pay Period Breakdown</h3>
                      <p className={styles.cardSubtitle}>
                        Equivalent earnings converted across all 8 standard payroll cycles
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Frequency</th>
                        <th>Paychecks / Year</th>
                        <th>Gross Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={period === 'year' ? styles.activePeriodRow : undefined}>
                        <td><strong>Annual (Salary)</strong></td>
                        <td>1 per year</td>
                        <td>
                          <strong>
                            {currencySymbol}
                            {Math.round(wageResult.periods.annual).toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                      <tr className={period === 'quarter' ? styles.activePeriodRow : undefined}>
                        <td><strong>Quarterly</strong></td>
                        <td>4 per year</td>
                        <td>
                          {currencySymbol}
                          {Math.round(wageResult.periods.quarterly).toLocaleString()}
                        </td>
                      </tr>
                      <tr className={period === 'month' ? styles.activePeriodRow : undefined}>
                        <td><strong>Monthly</strong></td>
                        <td>12 per year</td>
                        <td>
                          <strong>
                            {currencySymbol}
                            {Math.round(wageResult.periods.monthly).toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                      <tr className={period === 'semi_month' ? styles.activePeriodRow : undefined}>
                        <td>
                          <strong>Semi-Monthly</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                            (1st &amp; 15th)
                          </span>
                        </td>
                        <td>24 per year</td>
                        <td>
                          {currencySymbol}
                          {Math.round(wageResult.periods.semiMonthly).toLocaleString()}
                        </td>
                      </tr>
                      <tr className={period === 'biweek' ? styles.activePeriodRow : undefined}>
                        <td>
                          <strong>Biweekly</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                            (Every 2 weeks)
                          </span>
                        </td>
                        <td>26 per year</td>
                        <td>
                          <strong>
                            {currencySymbol}
                            {Math.round(wageResult.periods.biweekly).toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                      <tr className={period === 'week' ? styles.activePeriodRow : undefined}>
                        <td><strong>Weekly</strong></td>
                        <td>52 per year</td>
                        <td>
                          {currencySymbol}
                          {Math.round(wageResult.periods.weekly).toLocaleString()}
                        </td>
                      </tr>
                      <tr className={period === 'day' ? styles.activePeriodRow : undefined}>
                        <td><strong>Daily</strong></td>
                        <td>{Math.round(parseFloat(daysPerWeekStr) * parseFloat(weeksPerYearStr))} work days</td>
                        <td>
                          {currencySymbol}
                          {Math.round(wageResult.periods.daily).toLocaleString()}
                        </td>
                      </tr>
                      <tr className={period === 'hour' ? styles.activePeriodRow : undefined}>
                        <td><strong>Hourly Rate</strong></td>
                        <td>{wageResult.paidHoursPerYear.toLocaleString()} paid hrs</td>
                        <td>
                          <strong>
                            {currencySymbol}
                            {wageResult.periods.hourly.toFixed(2)} / hr
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tax Notice Callout */}
                <div className={styles.noticeBox} style={{ marginTop: '14px' }}>
                  <strong>Gross Pay Notice:</strong> All figures represent gross compensation before federal,
                  state, and payroll taxes (FICA/National Insurance). For official net take-home pay calculations,
                  consult the{' '}
                  <a
                    href="https://www.irs.gov/individuals/tax-withholding-estimator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.noticeLink}
                  >
                    IRS Tax Withholding Estimator (US)
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://www.gov.uk/estimate-income-tax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.noticeLink}
                  >
                    GOV.UK Income Tax Tool (UK)
                  </a>.
                </div>

                {/* Actions */}
                <div className={styles.actionsBar} style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✓ Copied' : '📋 Copy Results'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                    onClick={handleShare}
                  >
                    {shared ? '✓ URL Copied' : '🔗 Share URL'}
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handlePrint}
                  >
                    🖨️ Print Breakdown
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================================== */}
        {/* TAB 2: JOB OFFER & RAISE COMPARISON                  */}
        {/* ==================================================== */}
        {activeTab === 'compare' && (
          <>
            <div className={styles.inputs}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardHeadTitle}>
                    <span className={styles.step}>1</span>
                    <div>
                      <h2 className={styles.cardTitle}>Comparison Options</h2>
                      <p className={styles.cardSubtitle}>
                        Evaluate a percentage pay raise or compare two competing job offers
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Comparison Mode</label>
                  <div className={styles.chipGroup}>
                    <button
                      type="button"
                      className={`${styles.chip} ${compareMode === 'raise' ? styles.chipActive : ''}`}
                      onClick={() => setCompareMode('raise')}
                    >
                      📈 Percentage Pay Raise (%)
                    </button>
                    <button
                      type="button"
                      className={`${styles.chip} ${compareMode === 'secondJob' ? styles.chipActive : ''}`}
                      onClick={() => setCompareMode('secondJob')}
                    >
                      💼 Compare Job A vs Job B
                    </button>
                  </div>
                </div>

                {/* Current Pay Baseline */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Current Baseline: {currencySymbol}{amountStr} / {formatPeriodName(period)}
                  </span>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Annual Gross: {currencySymbol}{Math.round(compareResult.currentAnnual).toLocaleString()}
                  </div>
                </div>

                {compareMode === 'raise' ? (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="raise-percent">
                      Expected Raise Percentage
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="raise-percent"
                        type="number"
                        step="any"
                        min="0"
                        className={styles.input}
                        value={raisePercentStr}
                        onChange={(e) => setRaisePercentStr(e.target.value)}
                        placeholder="5"
                      />
                      <span className={`${styles.unitBadge} ${styles.unitBadgeRight}`}>%</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <div className={styles.field}>
                        <label className={styles.label}>Job B Pay Amount</label>
                        <div className={styles.inputWrap}>
                          <span className={styles.unitBadge}>{currencySymbol}</span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            className={styles.input}
                            value={secondAmountStr}
                            onChange={(e) => setSecondAmountStr(e.target.value)}
                            placeholder="60000"
                          />
                        </div>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label}>Frequency</label>
                        <select
                          className={styles.select}
                          value={secondPeriod}
                          onChange={(e) => setSecondPeriod(e.target.value as PayPeriod)}
                        >
                          <option value="hour">per Hour</option>
                          <option value="year">per Year</option>
                          <option value="month">per Month</option>
                          <option value="biweek">Biweekly</option>
                          <option value="week">per Week</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Job B Hours / Week</label>
                      <input
                        type="number"
                        min="1"
                        className={styles.input}
                        style={{ border: '1px solid var(--line)', borderRadius: '8px' }}
                        value={secondHoursStr}
                        onChange={(e) => setSecondHoursStr(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.results}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardTitle}>Compensation Impact</h3>
                </div>

                <div
                  className={styles.summaryBanner}
                  style={{
                    background: compareResult.annualDifference >= 0 ? '#ecfdf5' : '#fef2f2',
                    borderColor: compareResult.annualDifference >= 0 ? '#a7f3d0' : '#fecaca',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    className={styles.summaryIcon}
                    style={{
                      background: compareResult.annualDifference >= 0 ? '#10b981' : '#ef4444',
                    }}
                  >
                    {compareResult.annualDifference >= 0 ? '✓' : '!'}
                  </div>
                  <p
                    className={styles.summaryText}
                    style={{
                      color: compareResult.annualDifference >= 0 ? '#065f46' : '#991b1b',
                    }}
                  >
                    {compareResult.summarySentence}
                  </p>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>New Total Annual Gross</span>
                    <span className={`${styles.metricVal} ${styles.metricValGood}`}>
                      {currencySymbol}
                      {Math.round(compareResult.newAnnual).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      vs {currencySymbol}{Math.round(compareResult.currentAnnual).toLocaleString()} current
                    </span>
                  </div>

                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Annual Increase / Gap</span>
                    <span className={styles.metricVal}>
                      {compareResult.annualDifference >= 0 ? '+' : ''}
                      {currencySymbol}
                      {Math.round(compareResult.annualDifference).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {compareResult.percentChange >= 0 ? '+' : ''}
                      {compareResult.percentChange.toFixed(1)}% gain
                    </span>
                  </div>

                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Monthly Extra Pay</span>
                    <span className={styles.metricVal}>
                      {compareResult.monthlyDifference >= 0 ? '+' : ''}
                      {currencySymbol}
                      {Math.round(compareResult.monthlyDifference).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Pre-tax per month</span>
                  </div>

                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Hourly Extra Value</span>
                    <span className={styles.metricVal}>
                      {compareResult.hourlyDifference >= 0 ? '+' : ''}
                      {currencySymbol}
                      {compareResult.hourlyDifference.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Per scheduled hour</span>
                  </div>
                </div>

                <div className={styles.actionsBar} style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✓ Copied' : '📋 Copy Comparison'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${shared ? styles.actionBtnSuccess : ''}`}
                    onClick={handleShare}
                  >
                    {shared ? '✓ URL Copied' : '🔗 Share URL'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================================================== */}
        {/* TAB 3: HOURLY WAGE TABLE ($10–$100)                  */}
        {/* ==================================================== */}
        {activeTab === 'table' && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.cardHeadTitle}>
                  <div>
                    <h2 className={styles.cardTitle}>
                      Hourly Wage to Salary Conversion Table ($10 to $100 / hr)
                    </h2>
                    <p className={styles.cardSubtitle}>
                      Based on standard {hoursPerWeekStr} hours/week × {weeksPerYearStr} weeks/year ({Math.round(parseFloat(hoursPerWeekStr) * parseFloat(weeksPerYearStr)).toLocaleString()} working hours/year)
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  className={styles.input}
                  style={{
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    maxWidth: '220px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                  }}
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="🔍 Search rate (e.g. 25)..."
                />
              </div>

              <div className={styles.tableWrap} style={{ maxHeight: '520px', overflowY: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Hourly Rate</th>
                      <th>Weekly Gross</th>
                      <th>Biweekly Gross</th>
                      <th>Monthly Gross</th>
                      <th>Annual Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTable.map((row) => (
                      <tr key={row.hourlyRate} id={`hourly-${row.hourlyRate}`}>
                        <td>
                          <strong>
                            {currencySymbol}
                            {row.hourlyRate.toFixed(2)} / hr
                          </strong>
                        </td>
                        <td>
                          {currencySymbol}
                          {row.weeklyGross.toLocaleString()}
                        </td>
                        <td>
                          {currencySymbol}
                          {Math.round(row.biweeklyGross).toLocaleString()}
                        </td>
                        <td>
                          {currencySymbol}
                          {Math.round(row.monthlyGross).toLocaleString()}
                        </td>
                        <td>
                          <strong>
                            {currencySymbol}
                            {row.annualGross.toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.actionsBar} style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handlePrint}
                >
                  🖨️ Print Full Table
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
