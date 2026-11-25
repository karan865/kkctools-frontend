'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ToolShell from '@/components/tool/shared/ToolShell';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import LeaseInputGuide, { LeaseFieldId } from './LeaseInputGuide';
import styles from './CommercialLeaseCalculator.module.css';
import {
  calculateCommercialLease,
  calculateCamShare,
  calculatePercentageRent,
  compareLeaseOffers,
  CommercialLeaseInput,
  LeaseType,
  RateBasis,
  EscalationType,
  EscalationAppliesTo,
  FreeRentAppliesTo,
  AreaUnit,
} from '../../../lib/commercial-lease-engine';

type LeaseTab = 'cost' | 'compare' | 'cam' | 'retail';

const TABS: TabItem<LeaseTab>[] = [
  { id: 'cost', label: 'Lease Cost & Occupancy' },
  { id: 'compare', label: 'Compare 2 Offers' },
  { id: 'cam', label: 'CAM Share' },
  { id: 'retail', label: 'Percentage Rent' },
];

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function CommercialLeaseCalculatorInner() {
  const [activeTab, setActiveTab] = useState<LeaseTab>('cost');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as LeaseTab;
      if (tabParam === 'compare' || tabParam === 'cam' || tabParam === 'retail') {
        const timer = setTimeout(() => setActiveTab(tabParam), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleTabChange = (tabId: LeaseTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [activeField, setActiveField] = useState<LeaseFieldId | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Space inputs
  const [usableArea, setUsableArea] = useState<number>(2000);
  const [loadFactor, setLoadFactor] = useState<number>(15);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('sqft');

  // Rent inputs
  const [baseRate, setBaseRate] = useState<number>(24);
  const [rateBasis, setRateBasis] = useState<RateBasis>('per-year');
  const [leaseType, setLeaseType] = useState<LeaseType>('nnn');

  // Modified Gross toggles
  const [tenantPaysTax, setTenantPaysTax] = useState<boolean>(false);
  const [tenantPaysIns, setTenantPaysIns] = useState<boolean>(false);
  const [tenantPaysCam, setTenantPaysCam] = useState<boolean>(true);
  const [tenantPaysUtils, setTenantPaysUtils] = useState<boolean>(true);

  // Pass-throughs ($/unit/yr)
  const [propTaxRate, setPropTaxRate] = useState<number>(3);
  const [insuranceRate, setInsuranceRate] = useState<number>(1);
  const [camRate, setCamRate] = useState<number>(4);
  const [utilitiesRate, setUtilitiesRate] = useState<number>(0);

  // Term & Escalation
  const [leaseTermYears, setLeaseTermYears] = useState<number>(5);
  const [escalationType, setEscalationType] = useState<EscalationType>('percent');
  const [escalationValue, setEscalationValue] = useState<number>(3);
  const [escalationAppliesTo, setEscalationAppliesTo] = useState<EscalationAppliesTo>('base-only');

  // Concessions
  const [freeRentMonths, setFreeRentMonths] = useState<number>(2);
  const [freeRentAppliesTo, setFreeRentAppliesTo] = useState<FreeRentAppliesTo>('base-only');
  const [tiAllowance, setTiAllowance] = useState<number>(10);

  // Compare Tab State (Offer B)
  const [bBaseRate, setBBaseRate] = useState<number>(32);
  const [bLeaseType, setBLeaseType] = useState<LeaseType>('gross');
  const [bEscalationVal, setBEscalationVal] = useState<number>(3);

  // CAM Share Tab State
  const [buildingRsf, setBuildingRsf] = useState<number>(50000);
  const [buildingCamAnnual, setBuildingCamAnnual] = useState<number>(200000);

  // Retail Tab State
  const [projectedSales, setProjectedSales] = useState<number>(1000000);
  const [percentageRentRate, setPercentageRentRate] = useState<number>(6);
  const [breakpointMode, setBreakpointMode] = useState<'natural' | 'custom'>('natural');
  const [customBreakpoint, setCustomBreakpoint] = useState<number>(800000);

  // -------------------------------------------------------------
  // PRIMARY LEASE CALCULATION (OFFER A)
  // -------------------------------------------------------------
  const offerAInput: CommercialLeaseInput = useMemo(
    () => ({
      areaInputMode: 'usable',
      usableArea,
      loadFactorPercent: loadFactor,
      areaUnit,
      baseRate,
      rateBasis,
      leaseType,
      modifiedGrossToggles: {
        tenantPaysPropertyTax: tenantPaysTax,
        tenantPaysInsurance: tenantPaysIns,
        tenantPaysCam: tenantPaysCam,
        tenantPaysUtilities: tenantPaysUtils,
      },
      propertyTaxAnnualPerUnit: propTaxRate,
      insuranceAnnualPerUnit: insuranceRate,
      camAnnualPerUnit: camRate,
      utilitiesAnnualPerUnit: utilitiesRate,
      leaseTermYears,
      escalationType,
      escalationValue,
      escalationAppliesTo,
      freeRentMonths,
      freeRentAppliesTo,
      tenantImprovementAllowancePerUnit: tiAllowance,
    }),
    [
      usableArea,
      loadFactor,
      areaUnit,
      baseRate,
      rateBasis,
      leaseType,
      tenantPaysTax,
      tenantPaysIns,
      tenantPaysCam,
      tenantPaysUtils,
      propTaxRate,
      insuranceRate,
      camRate,
      utilitiesRate,
      leaseTermYears,
      escalationType,
      escalationValue,
      escalationAppliesTo,
      freeRentMonths,
      freeRentAppliesTo,
      tiAllowance,
    ]
  );

  const leaseResult = useMemo(() => calculateCommercialLease(offerAInput), [offerAInput]);

  // Offer B for Comparison
  const offerBInput: CommercialLeaseInput = useMemo(
    () => ({
      ...offerAInput,
      baseRate: bBaseRate,
      leaseType: bLeaseType,
      escalationValue: bEscalationVal,
      freeRentMonths: 0,
      tenantImprovementAllowancePerUnit: 0,
    }),
    [offerAInput, bBaseRate, bLeaseType, bEscalationVal]
  );

  const comparisonResult = useMemo(() => compareLeaseOffers(offerAInput, offerBInput), [offerAInput, offerBInput]);

  // CAM Pro-Rata Share
  const camShareResult = useMemo(
    () =>
      calculateCamShare({
        tenantRentableArea: leaseResult.rentableArea,
        buildingRentableArea: buildingRsf,
        totalBuildingCamAnnual: buildingCamAnnual,
      }),
    [leaseResult.rentableArea, buildingRsf, buildingCamAnnual]
  );

  // Retail Percentage Rent
  const retailResult = useMemo(
    () =>
      calculatePercentageRent({
        annualGrossSales: projectedSales,
        breakpointMode,
        annualBaseRent: leaseResult.year1BaseRentAnnual,
        customBreakpoint,
        percentageRentRate,
      }),
    [projectedSales, breakpointMode, leaseResult.year1BaseRentAnnual, customBreakpoint, percentageRentRate]
  );

  // BLUF dynamic sentence
  const blufSentence = useMemo(() => {
    if (activeTab === 'cost') {
      const uStr = areaUnit === 'sqm' ? 'm²' : 'sq ft';
      const pStr = areaUnit === 'sqm' ? 'm²' : 'SF';
      return `${Math.round(usableArea).toLocaleString()} usable ${uStr} at a ${loadFactor}% load factor is ${Math.round(
        leaseResult.rentableArea
      ).toLocaleString()} rentable ${uStr}. At $${baseRate}/${pStr}/yr ${leaseType.toUpperCase()} plus pass-throughs, Year 1 costs ${fmt(
        leaseResult.year1TotalMonthly
      )} a month, and the ${leaseTermYears}-year lease totals ${fmt(leaseResult.totalLeaseCost)}.`;
    }
    if (activeTab === 'compare') {
      const winner = comparisonResult.cheaperOffer;
      return winner === 'A'
        ? `Offer A is cheaper by ${fmt(Math.abs(comparisonResult.costDifferenceTotal))} (${comparisonResult.savingsPercent.toFixed(
            1
          )}% savings) over the ${leaseTermYears}-year term compared to Offer B.`
        : winner === 'B'
        ? `Offer B is cheaper by ${fmt(Math.abs(comparisonResult.costDifferenceTotal))} (${comparisonResult.savingsPercent.toFixed(
            1
          )}% savings) over the ${leaseTermYears}-year term compared to Offer A.`
        : 'Both lease offers result in the exact same total occupancy cost over the term.';
    }
    if (activeTab === 'cam') {
      return `For a ${Math.round(leaseResult.rentableArea).toLocaleString()} RSF suite in a ${Math.round(
        buildingRsf
      ).toLocaleString()} RSF building, your pro-rata CAM share is ${
        camShareResult.proRataSharePercent !== null ? `${camShareResult.proRataSharePercent.toFixed(2)}%` : '—'
      }, amounting to ${fmt(camShareResult.tenantCamAnnual)}/year (${fmt(camShareResult.tenantCamMonthly)}/mo).`;
    }
    return `At ${fmt(projectedSales)} in annual retail sales with a ${percentageRentRate}% overage rate, total rent is ${fmt(
      retailResult.totalRentAnnual
    )}/yr (${fmt(leaseResult.year1BaseRentAnnual)} base + ${fmt(retailResult.percentageRentAnnual)} percentage rent).`;
  }, [
    activeTab,
    usableArea,
    loadFactor,
    areaUnit,
    baseRate,
    leaseType,
    leaseTermYears,
    leaseResult,
    comparisonResult,
    buildingRsf,
    camShareResult,
    projectedSales,
    percentageRentRate,
    retailResult,
  ]);

  const handleCopySummary = () => {
    const summary = `Commercial Lease Analysis (KKC Tools)
--------------------------------------
Lease Type: ${leaseType.toUpperCase()}
Space: ${Math.round(usableArea)} USF (${loadFactor}% load) = ${Math.round(leaseResult.rentableArea)} RSF
Base Rate: $${baseRate}/${areaUnit === 'sqm' ? 'm²' : 'SF'}/yr
Year 1 Base Rent: ${fmt(leaseResult.year1BaseRentAnnual)}/yr (${fmt(leaseResult.year1BaseRentMonthly)}/mo)
Year 1 Pass-Throughs: ${fmt(leaseResult.year1PassThroughAnnual)}/yr (${fmt(leaseResult.year1PassThroughMonthly)}/mo)
Year 1 Total Occupancy: ${fmt(leaseResult.year1TotalAnnual)}/yr (${fmt(leaseResult.year1TotalMonthly)}/mo)
Lease Term: ${leaseTermYears} Years
Total Lease Cost: ${fmt(leaseResult.totalLeaseCost)}
Average Monthly Cost: ${fmt(leaseResult.averageMonthlyCost)}/mo
Free Rent Concessions: ${fmt(leaseResult.totalFreeRentCredit)} (${freeRentMonths} months)
TI Allowance: ${fmt(leaseResult.totalTiAllowance)} ($${tiAllowance}/SF)
Net Effective Rent: $${leaseResult.netEffectiveRentPerUnitYr.toFixed(2)}/${areaUnit === 'sqm' ? 'm²' : 'SF'}/yr
Calculated at: https://kkctools.com/commercial-lease-calculator/`;

    navigator.clipboard.writeText(summary);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <ToolShell
      features={[
        'Gross, modified gross & NNN',
        'Escalations & free rent',
        'Compare 2 offers',
        'Print & share link',
      ]}
    >
      <div className={styles.calculatorContainer}>
        {/* High-contrast mint BLUF summary banner */}
        <div className={styles.summaryBanner}>{blufSentence}</div>

        {/* Tab Navigation */}
        <TabSlider
          tabs={TABS}
          activeId={activeTab}
          onChange={handleTabChange}
          ariaLabel="Commercial Lease Calculator Modes"
        />

        {/* Visual Input Guide Diagram */}
        <LeaseInputGuide
          tab={activeTab}
          activeField={activeField}
          usableArea={usableArea}
          rentableArea={leaseResult.rentableArea}
          loadFactorPercent={loadFactor}
          baseRateYr={rateBasis === 'per-month' ? baseRate * 12 : baseRate}
          passThroughRateYr={
            leaseType === 'gross'
              ? 0
              : leaseType === 'modified-gross'
              ? (tenantPaysTax ? propTaxRate : 0) +
                (tenantPaysIns ? insuranceRate : 0) +
                (tenantPaysCam ? camRate : 0) +
                (tenantPaysUtils ? utilitiesRate : 0)
              : propTaxRate + insuranceRate + camRate + utilitiesRate
          }
          leaseType={leaseType}
          year1MonthlyTotal={leaseResult.year1TotalMonthly}
          termYears={leaseTermYears}
          totalLeaseCost={leaseResult.totalLeaseCost}
          netEffectiveRentYr={leaseResult.netEffectiveRentPerUnitYr}
          freeRentMonths={freeRentMonths}
          tiAllowancePerUnit={tiAllowance}
          buildingRsf={buildingRsf}
          tenantRsf={leaseResult.rentableArea}
          camSharePercent={camShareResult.proRataSharePercent}
          projectedSales={projectedSales}
          breakpoint={retailResult.effectiveBreakpoint}
          percentageRent={retailResult.percentageRentAnnual}
        />

        {/* ========================================================= */}
        {/* TAB 1: LEASE COST & OCCUPANCY                            */}
        {/* ========================================================= */}
        {activeTab === 'cost' && (
          <div className={styles.layoutGrid}>
            {/* Input Column */}
            <div className={styles.inputCard}>
              <div className={styles.sectionTitle}>
                <span>1. Space &amp; Floor Plan</span>
                <span className={styles.sectionBadge}>
                  {Math.round(leaseResult.rentableArea).toLocaleString()} RSF
                </span>
              </div>

              <div className={styles.toggleButtonGroup}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${areaUnit === 'sqft' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setAreaUnit('sqft')}
                >
                  Square Feet (sq ft / SF)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${areaUnit === 'sqm' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setAreaUnit('sqm')}
                >
                  Square Meters (m²)
                </button>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="usableArea">
                    Usable Area (USF)
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="usableArea"
                      type="number"
                      min="1"
                      step="50"
                      value={usableArea || ''}
                      onChange={(e) => setUsableArea(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('area')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>{areaUnit === 'sqm' ? 'm²' : 'sq ft'}</span>
                  </div>
                  <span className={styles.fieldHint}>Private interior suite area</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="loadFactor">
                    Load Factor %
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="loadFactor"
                      type="number"
                      min="0"
                      step="1"
                      value={loadFactor}
                      onChange={(e) => setLoadFactor(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('load')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.fieldHint}>Lobbies &amp; corridors (10%–20% avg)</span>
                </div>
              </div>

              {/* Rent & Lease Type */}
              <div className={styles.sectionTitle} style={{ marginTop: '1.25rem' }}>
                <span>2. Rent &amp; Lease Structure</span>
                <span className={styles.sectionBadge}>{leaseType.toUpperCase()}</span>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="baseRate">
                    Quoted Base Rent
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="baseRate"
                      type="number"
                      min="0"
                      step="0.5"
                      value={baseRate || ''}
                      onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('baserate')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                    <span className={styles.suffix}>/{areaUnit === 'sqm' ? 'm²' : 'SF'}</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Quoted Basis</label>
                  <div className={styles.toggleButtonGroup} style={{ margin: 0 }}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${rateBasis === 'per-year' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setRateBasis('per-year')}
                    >
                      Per Year
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${rateBasis === 'per-month' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setRateBasis('per-month')}
                    >
                      Per Month
                    </button>
                  </div>
                </div>
              </div>

              {/* Lease Type Buttons */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Commercial Lease Type</label>
                <div className={styles.toggleButtonGroup}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${leaseType === 'nnn' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setLeaseType('nnn')}
                  >
                    Triple Net (NNN)
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${leaseType === 'gross' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setLeaseType('gross')}
                  >
                    Full Service Gross
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${leaseType === 'modified-gross' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setLeaseType('modified-gross')}
                  >
                    Modified Gross
                  </button>
                </div>
              </div>

              {/* Modified Gross Toggles */}
              {leaseType === 'modified-gross' && (
                <div className={styles.checkboxGrid}>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={tenantPaysTax}
                      onChange={(e) => setTenantPaysTax(e.target.checked)}
                    />
                    Tenant pays Property Tax
                  </label>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={tenantPaysIns}
                      onChange={(e) => setTenantPaysIns(e.target.checked)}
                    />
                    Tenant pays Insurance
                  </label>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={tenantPaysCam}
                      onChange={(e) => setTenantPaysCam(e.target.checked)}
                    />
                    Tenant pays CAM
                  </label>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={tenantPaysUtils}
                      onChange={(e) => setTenantPaysUtils(e.target.checked)}
                    />
                    Tenant pays Utilities
                  </label>
                </div>
              )}

              {/* Pass-Through Expenses (if applicable) */}
              {leaseType !== 'gross' && (
                <>
                  <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>
                    <span>Pass-Through Expenses ($/{areaUnit === 'sqm' ? 'm²' : 'SF'}/year)</span>
                    <span className={styles.sectionBadge}>NNN Stack</span>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="taxRate">
                        Property Tax
                      </label>
                      <div className={styles.inputGroup}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="taxRate"
                          type="number"
                          step="0.25"
                          value={propTaxRate}
                          onChange={(e) => setPropTaxRate(parseFloat(e.target.value) || 0)}
                          onFocus={() => setActiveField('passthrough')}
                          onBlur={() => setActiveField(null)}
                          className={`${styles.textInput} ${styles.hasPrefix}`}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="insRate">
                        Building Insurance
                      </label>
                      <div className={styles.inputGroup}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="insRate"
                          type="number"
                          step="0.25"
                          value={insuranceRate}
                          onChange={(e) => setInsuranceRate(parseFloat(e.target.value) || 0)}
                          onFocus={() => setActiveField('passthrough')}
                          onBlur={() => setActiveField(null)}
                          className={`${styles.textInput} ${styles.hasPrefix}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="camRate">
                        CAM (Common Maintenance)
                      </label>
                      <div className={styles.inputGroup}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="camRate"
                          type="number"
                          step="0.25"
                          value={camRate}
                          onChange={(e) => setCamRate(parseFloat(e.target.value) || 0)}
                          onFocus={() => setActiveField('passthrough')}
                          onBlur={() => setActiveField(null)}
                          className={`${styles.textInput} ${styles.hasPrefix}`}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="utilRate">
                        Utilities / Reserves
                      </label>
                      <div className={styles.inputGroup}>
                        <span className={styles.prefix}>$</span>
                        <input
                          id="utilRate"
                          type="number"
                          step="0.25"
                          value={utilitiesRate}
                          onChange={(e) => setUtilitiesRate(parseFloat(e.target.value) || 0)}
                          onFocus={() => setActiveField('passthrough')}
                          onBlur={() => setActiveField(null)}
                          className={`${styles.textInput} ${styles.hasPrefix}`}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Term, Escalations & Concessions */}
              <div className={styles.sectionTitle} style={{ marginTop: '1.25rem' }}>
                <span>3. Term, Escalations &amp; Concessions</span>
                <span className={styles.sectionBadge}>{leaseTermYears} Years</span>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="termYears">
                    Lease Term (Years)
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="termYears"
                      type="number"
                      min="1"
                      max="25"
                      value={leaseTermYears}
                      onChange={(e) => setLeaseTermYears(parseInt(e.target.value) || 1)}
                      onFocus={() => setActiveField('term')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>yrs</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="escVal">
                    Annual Escalation %
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="escVal"
                      type="number"
                      step="0.5"
                      value={escalationValue}
                      onChange={(e) => setEscalationValue(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('escalation')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.fieldHint}>Standard 2.5%–4% per year</span>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="freeMonths">
                    Free Rent (Concession)
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="freeMonths"
                      type="number"
                      min="0"
                      value={freeRentMonths}
                      onChange={(e) => setFreeRentMonths(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('concession')}
                      onBlur={() => setActiveField(null)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>mos</span>
                  </div>
                  <span className={styles.fieldHint}>Applied to Year 1 base rent</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="tiAllow">
                    TI Allowance
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="tiAllow"
                      type="number"
                      min="0"
                      step="1"
                      value={tiAllowance}
                      onChange={(e) => setTiAllowance(parseFloat(e.target.value) || 0)}
                      onFocus={() => setActiveField('concession')}
                      onBlur={() => setActiveField(null)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                    <span className={styles.suffix}>/{areaUnit === 'sqm' ? 'm²' : 'SF'}</span>
                  </div>
                  <span className={styles.fieldHint}>Landlord buildout credit</span>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className={styles.resultsCard}>
              {/* Hero Metric Card */}
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Year 1 Monthly Occupancy Cost</div>
                <div className={styles.heroValue}>{fmt(leaseResult.year1TotalMonthly)}/mo</div>
                <div className={styles.heroSub}>
                  <span className={styles.heroBadge}>{fmt(leaseResult.year1TotalAnnual)}/year</span>
                  <span>
                    ({fmt(leaseResult.year1BaseRentMonthly)} base + {fmt(leaseResult.year1PassThroughMonthly)} pass-throughs)
                  </span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Full Term Cost</span>
                    <span className={styles.metricItemValue}>{fmt(leaseResult.totalLeaseCost)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Avg Monthly Cost</span>
                    <span className={styles.metricItemValue}>{fmt(leaseResult.averageMonthlyCost)}/mo</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Net Effective Rate</span>
                    <span className={styles.metricItemValue}>${leaseResult.netEffectiveRentPerUnitYr.toFixed(2)}/SF</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Total Concessions</span>
                    <span className={styles.metricItemValue}>
                      {fmt(leaseResult.totalFreeRentCredit + leaseResult.totalTiAllowance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Year-by-Year Schedule */}
              <div className={styles.card}>
                <div className={styles.sectionTitle}>
                  <span>{leaseTermYears}-Year Lease Schedule</span>
                  <span className={styles.sectionBadge}>Projections</span>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th className={styles.numCell}>Base $/SF</th>
                        <th className={styles.numCell}>Base Rent</th>
                        <th className={styles.numCell}>Pass-Throughs</th>
                        <th className={styles.numCell}>Free Rent</th>
                        <th className={styles.numCell}>Net Annual Total</th>
                        <th className={styles.numCell}>Monthly Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaseResult.schedule.map((row) => (
                        <tr key={row.year}>
                          <td>Year {row.year}</td>
                          <td className={styles.numCell}>${row.baseRatePerUnitYr.toFixed(2)}</td>
                          <td className={styles.numCell}>{fmt(row.baseRentAnnual)}</td>
                          <td className={styles.numCell}>{fmt(row.passThroughAnnual)}</td>
                          <td className={styles.numCell}>
                            {row.freeRentCredit > 0 ? `-${fmt(row.freeRentCredit)}` : '—'}
                          </td>
                          <td className={styles.numCell}>
                            <strong>{fmt(row.totalRentAnnual)}</strong>
                          </td>
                          <td className={styles.numCell}>{fmt(row.monthlyAverage)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td><strong>Total</strong></td>
                        <td className={styles.numCell}>—</td>
                        <td className={styles.numCell}>{fmt(leaseResult.totalBaseRent)}</td>
                        <td className={styles.numCell}>{fmt(leaseResult.totalPassThroughs)}</td>
                        <td className={styles.numCell}>
                          {leaseResult.totalFreeRentCredit > 0 ? `-${fmt(leaseResult.totalFreeRentCredit)}` : '—'}
                        </td>
                        <td className={styles.numCell}>
                          <strong>{fmt(leaseResult.totalLeaseCost)}</strong>
                        </td>
                        <td className={styles.numCell}>
                          <strong>{fmt(leaseResult.averageMonthlyCost)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COMPARE 2 OFFERS                                  */}
        {/* ========================================================= */}
        {activeTab === 'compare' && (
          <div>
            <div className={styles.winnerBanner}>
              <span>
                {comparisonResult.cheaperOffer === 'A'
                  ? `✓ Offer A saves ${fmt(Math.abs(comparisonResult.costDifferenceTotal))} (${comparisonResult.savingsPercent.toFixed(
                      1
                    )}%) over ${leaseTermYears} years`
                  : comparisonResult.cheaperOffer === 'B'
                  ? `✓ Offer B saves ${fmt(Math.abs(comparisonResult.costDifferenceTotal))} (${comparisonResult.savingsPercent.toFixed(
                      1
                    )}%) over ${leaseTermYears} years`
                  : 'Both offers cost the exact same amount over the term.'}
              </span>
              <span>
                Monthly diff: {fmt(Math.abs(comparisonResult.monthlyDifference))}/mo
              </span>
            </div>

            <div className={styles.compareGrid}>
              {/* Offer A Card */}
              <div className={styles.inputCard}>
                <div className={styles.sectionTitle}>
                  <span>Offer A (Current Inputs)</span>
                  <span className={styles.sectionBadge}>{leaseType.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  <p><strong>Base Rent:</strong> ${baseRate}/{areaUnit === 'sqm' ? 'm²' : 'SF'}/yr</p>
                  <p><strong>Pass-Throughs:</strong> ${leaseResult.schedule[0].passThroughRatePerUnitYr.toFixed(2)}/{areaUnit === 'sqm' ? 'm²' : 'SF'}/yr</p>
                  <p><strong>Concessions:</strong> {freeRentMonths} mos free, ${tiAllowance} TI allowance</p>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '0.75rem 0' }} />
                  <p><strong>Year 1 Monthly:</strong> {fmt(comparisonResult.offerA.year1TotalMonthly)}/mo</p>
                  <p><strong>Average Monthly:</strong> {fmt(comparisonResult.offerA.averageMonthlyCost)}/mo</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {leaseTermYears}-Year Total: {fmt(comparisonResult.offerA.totalLeaseCost)}
                  </p>
                </div>
              </div>

              {/* Offer B Card */}
              <div className={styles.inputCard}>
                <div className={styles.sectionTitle}>
                  <span>Offer B (Alternative Bid)</span>
                  <span className={styles.sectionBadge}>{bLeaseType.toUpperCase()}</span>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="bBaseRate">
                    Offer B Base Rent Rate
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="bBaseRate"
                      type="number"
                      step="0.5"
                      value={bBaseRate}
                      onChange={(e) => setBBaseRate(parseFloat(e.target.value) || 0)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                    <span className={styles.suffix}>/{areaUnit === 'sqm' ? 'm²' : 'SF'}</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Offer B Lease Type</label>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${bLeaseType === 'gross' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setBLeaseType('gross')}
                    >
                      Gross
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${bLeaseType === 'nnn' ? styles.toggleBtnActive : ''}`}
                      onClick={() => setBLeaseType('nnn')}
                    >
                      NNN
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="bEsc">
                    Offer B Annual Escalation %
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="bEsc"
                      type="number"
                      step="0.5"
                      value={bEscalationVal}
                      onChange={(e) => setBEscalationVal(parseFloat(e.target.value) || 0)}
                      className={styles.textInput}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '0.75rem 0' }} />
                  <p><strong>Year 1 Monthly:</strong> {fmt(comparisonResult.offerB.year1TotalMonthly)}/mo</p>
                  <p><strong>Average Monthly:</strong> {fmt(comparisonResult.offerB.averageMonthlyCost)}/mo</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669' }}>
                    {leaseTermYears}-Year Total: {fmt(comparisonResult.offerB.totalLeaseCost)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CAM PRO-RATA SHARE                                */}
        {/* ========================================================= */}
        {activeTab === 'cam' && (
          <div className={styles.layoutGrid}>
            <div className={styles.inputCard}>
              <div className={styles.sectionTitle}>
                <span>1. Building &amp; Suite Dimensions</span>
                <span className={styles.sectionBadge}>Pro-Rata</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bldgRsf">
                  Total Building Rentable Area (GLA)
                </label>
                <div className={styles.inputGroup}>
                  <input
                    id="bldgRsf"
                    type="number"
                    min="1"
                    step="1000"
                    value={buildingRsf}
                    onChange={(e) => setBuildingRsf(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('cam')}
                    onBlur={() => setActiveField(null)}
                    className={styles.textInput}
                  />
                  <span className={styles.suffix}>RSF</span>
                </div>
                <span className={styles.fieldHint}>Total square footage of the entire building</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="bldgCam">
                  Total Building Annual CAM Expenses
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="bldgCam"
                    type="number"
                    min="0"
                    step="5000"
                    value={buildingCamAnnual}
                    onChange={(e) => setBuildingCamAnnual(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('cam')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.textInput} ${styles.hasPrefix}`}
                  />
                  <span className={styles.suffix}>/yr</span>
                </div>
                <span className={styles.fieldHint}>Total parking, security, landscaping, and maintenance</span>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Your Suite Pro-Rata Share</div>
                <div className={styles.heroValue}>
                  {camShareResult.proRataSharePercent !== null ? `${camShareResult.proRataSharePercent.toFixed(2)}%` : '—'}
                </div>
                <div className={styles.heroSub}>
                  <span>
                    ({Math.round(leaseResult.rentableArea).toLocaleString()} RSF ÷ {Math.round(buildingRsf).toLocaleString()} RSF)
                  </span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Annual CAM Share</span>
                    <span className={styles.metricItemValue}>{fmt(camShareResult.tenantCamAnnual)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Monthly CAM</span>
                    <span className={styles.metricItemValue}>{fmt(camShareResult.tenantCamMonthly)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>CAM per SF/yr</span>
                    <span className={styles.metricItemValue}>
                      ${camShareResult.tenantCamPerUnitYr !== null ? camShareResult.tenantCamPerUnitYr.toFixed(2) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: RETAIL PERCENTAGE RENT                            */}
        {/* ========================================================= */}
        {activeTab === 'retail' && (
          <div className={styles.layoutGrid}>
            <div className={styles.inputCard}>
              <div className={styles.sectionTitle}>
                <span>1. Retail Sales &amp; Overage Terms</span>
                <span className={styles.sectionBadge}>Percentage Lease</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="projSales">
                  Projected Annual Gross Sales
                </label>
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>$</span>
                  <input
                    id="projSales"
                    type="number"
                    min="0"
                    step="10000"
                    value={projectedSales}
                    onChange={(e) => setProjectedSales(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('percentage')}
                    onBlur={() => setActiveField(null)}
                    className={`${styles.textInput} ${styles.hasPrefix}`}
                  />
                  <span className={styles.suffix}>/yr</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="pctRate">
                  Percentage Rent Rate
                </label>
                <div className={styles.inputGroup}>
                  <input
                    id="pctRate"
                    type="number"
                    step="0.5"
                    value={percentageRentRate}
                    onChange={(e) => setPercentageRentRate(parseFloat(e.target.value) || 0)}
                    onFocus={() => setActiveField('percentage')}
                    onBlur={() => setActiveField(null)}
                    className={styles.textInput}
                  />
                  <span className={styles.suffix}>%</span>
                </div>
                <span className={styles.fieldHint}>The percentage stated in your lease</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Breakpoint Mode</label>
                <div className={styles.toggleButtonGroup}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${breakpointMode === 'natural' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setBreakpointMode('natural')}
                  >
                    Natural Breakpoint (Base Rent ÷ Rate)
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${breakpointMode === 'custom' ? styles.toggleBtnActive : ''}`}
                    onClick={() => setBreakpointMode('custom')}
                  >
                    Custom Breakpoint ($)
                  </button>
                </div>
              </div>

              {breakpointMode === 'custom' && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="custBreak">
                    Custom Breakpoint Threshold
                  </label>
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>$</span>
                    <input
                      id="custBreak"
                      type="number"
                      step="10000"
                      value={customBreakpoint}
                      onChange={(e) => setCustomBreakpoint(parseFloat(e.target.value) || 0)}
                      className={`${styles.textInput} ${styles.hasPrefix}`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.resultsCard}>
              <div className={styles.heroCard}>
                <div className={styles.heroLabel}>Total Annual Retail Rent</div>
                <div className={styles.heroValue}>{fmt(retailResult.totalRentAnnual)}/yr</div>
                <div className={styles.heroSub}>
                  <span>
                    ({fmt(leaseResult.year1BaseRentAnnual)} Base + {fmt(retailResult.percentageRentAnnual)} Overage)
                  </span>
                </div>

                <div className={styles.metricsGrid}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Breakpoint</span>
                    <span className={styles.metricItemValue}>{fmt(retailResult.effectiveBreakpoint)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Sales Over Threshold</span>
                    <span className={styles.metricItemValue}>{fmt(retailResult.salesAboveBreakpoint)}</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Percentage Rent</span>
                    <span className={styles.metricItemValue}>{fmt(retailResult.percentageRentAnnual)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Action Buttons */}
        <div className={styles.actionsBar}>
          <button type="button" onClick={handleCopySummary} className={styles.actionBtn}>
            📋 Copy Lease Summary
          </button>
          <button type="button" onClick={() => window.print()} className={styles.actionBtn}>
            🖨️ Print Lease Analysis
          </button>
          {copiedToast && <span className={styles.copiedToast}>✓ Copied to clipboard!</span>}
        </div>
      </div>
    </ToolShell>
  );
}

export default function CommercialLeaseCalculator() {
  return (
    <CommercialLeaseCalculatorInner />
  );
}
