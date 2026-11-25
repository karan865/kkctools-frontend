'use client';

import React, { useState, useMemo, useEffect, useId } from 'react';
import TabSlider from '@/components/tool/shared/TabSlider';
import { useTabParam } from '@/components/tool/shared/useTabParam';
import NetWorthInputGuide from './NetWorthInputGuide';
import {
  calculateNetWorth,
  compareWithSnapshot,
  AssetsInput,
  LiabilitiesInput,
  CustomEntry,
} from '@/lib/net-worth-engine';
import { safeStorage } from '@/lib/storage';
import styles from './NetWorthCalculator.module.css';

type Mode = 'personal' | 'household' | 'tracker';

const TABS: Array<{ id: Mode; label: string }> = [
  { id: 'personal', label: 'My Net Worth' },
  { id: 'household', label: 'Household Mode' },
  { id: 'tracker', label: 'Track Changes' },
];
const TAB_IDS: readonly Mode[] = TABS.map((t) => t.id);

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
];

const SNAPSHOTS_KEY = 'kkc_networth_snapshots_v1';

interface SavedSnapshot {
  id: string;
  dateStr: string;
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export default function NetWorthCalculator() {
  const [activeTab, setActiveTab] = useTabParam<Mode>(TAB_IDS, 'personal');
  const [activeField, setActiveField] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Options
  const [preTaxHaircut, setPreTaxHaircut] = useState<number>(0);
  const [monthlySpend, setMonthlySpend] = useState<number>(5000);

  // Tab 1: Personal Assets Inputs
  const [cashChecking, setCashChecking] = useState<number>(10000);
  const [savings, setSavings] = useState<number>(15000);
  const [taxableInvestments, setTaxableInvestments] = useState<number>(40000);
  const [retirementPreTax, setRetirementPreTax] = useState<number>(80000);
  const [retirementRoth, setRetirementRoth] = useState<number>(40000);
  const [primaryHome, setPrimaryHome] = useState<number>(350000);
  const [otherRealEstate, setOtherRealEstate] = useState<number>(0);
  const [vehicles, setVehicles] = useState<number>(15000);
  const [businessInterests, setBusinessInterests] = useState<number>(0);
  const [otherAssets, setOtherAssets] = useState<number>(0);
  const [customAssets, setCustomAssets] = useState<CustomEntry[]>([]);

  // Tab 1: Personal Liabilities Inputs
  const [primaryMortgage, setPrimaryMortgage] = useState<number>(260000);
  const [helocHomeEquity, setHelocHomeEquity] = useState<number>(0);
  const [autoLoans, setAutoLoans] = useState<number>(10000);
  const [studentLoans, setStudentLoans] = useState<number>(20000);
  const [creditCards, setCreditCards] = useState<number>(4000);
  const [personalLoans, setPersonalLoans] = useState<number>(0);
  const otherLiabilities = 0;
  const [customLiabilities, setCustomLiabilities] = useState<CustomEntry[]>([]);

  // Tab 2: Household Inputs
  const [memberAName, setMemberAName] = useState('Person A');
  const [memberAAssets, setMemberAAssets] = useState<number>(145000);
  const [memberALiabilities, setMemberALiabilities] = useState<number>(34000);

  const [memberBName, setMemberBName] = useState('Person B');
  const [memberBAssets, setMemberBAssets] = useState<number>(115000);
  const [memberBLiabilities, setMemberBLiabilities] = useState<number>(24500);

  const [jointAssets, setJointAssets] = useState<number>(350000);
  const [jointLiabilities, setJointLiabilities] = useState<number>(260000);

  // Tab 3: Snapshots
  const [snapshots, setSnapshots] = useState<SavedSnapshot[]>([]);
  const [snapshotSavedNotice, setSnapshotSavedNotice] = useState(false);

  const baseId = useId();

  // Load snapshots from safeStorage on mount
  useEffect(() => {
    const loaded = safeStorage.getJSON<SavedSnapshot[]>(SNAPSHOTS_KEY, []);
    if (Array.isArray(loaded)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnapshots(loaded);
    }
  }, []);

  const handleTabChange = (tabId: Mode) => {
    setActiveTab(tabId);
  };

  const currSymbol = useMemo(() => {
    return CURRENCIES.find((c) => c.code === currency)?.symbol || '$';
  }, [currency]);

  const fmt = React.useCallback(
    (val: number) => {
      const isNeg = val < 0;
      const absVal = Math.abs(val);
      const formatted = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(absVal);
      return `${isNeg ? '−' : ''}${currSymbol}${formatted}`;
    },
    [currSymbol]
  );

  // 1. Personal Calculation
  const personalAssets: AssetsInput = useMemo(
    () => ({
      cashChecking,
      savings,
      taxableInvestments,
      retirementPreTax,
      retirementRoth,
      primaryHome,
      otherRealEstate,
      vehicles,
      businessInterests,
      otherAssets,
      customAssets,
    }),
    [
      cashChecking,
      savings,
      taxableInvestments,
      retirementPreTax,
      retirementRoth,
      primaryHome,
      otherRealEstate,
      vehicles,
      businessInterests,
      otherAssets,
      customAssets,
    ]
  );

  const personalLiabilities: LiabilitiesInput = useMemo(
    () => ({
      primaryMortgage,
      helocHomeEquity,
      autoLoans,
      studentLoans,
      creditCards,
      personalLoans,
      otherLiabilities,
      customLiabilities,
    }),
    [
      primaryMortgage,
      helocHomeEquity,
      autoLoans,
      studentLoans,
      creditCards,
      personalLoans,
      otherLiabilities,
      customLiabilities,
    ]
  );

  const personalResult = useMemo(() => {
    return calculateNetWorth(personalAssets, personalLiabilities, {
      preTaxHaircutPct: preTaxHaircut,
      monthlySpend,
      currency,
    });
  }, [personalAssets, personalLiabilities, preTaxHaircut, monthlySpend, currency]);

  // 2. Household Calculation
  const householdResult = useMemo(() => {
    const netA = memberAAssets - memberALiabilities;
    const netB = memberBAssets - memberBLiabilities;
    const netJoint = jointAssets - jointLiabilities;
    const combinedAssets = memberAAssets + memberBAssets + jointAssets;
    const combinedLiabilities = memberALiabilities + memberBLiabilities + jointLiabilities;
    const combinedNet = combinedAssets - combinedLiabilities;

    return {
      netA,
      netB,
      netJoint,
      combinedAssets,
      combinedLiabilities,
      combinedNet,
    };
  }, [memberAAssets, memberALiabilities, memberBAssets, memberBLiabilities, jointAssets, jointLiabilities]);

  // 3. Snapshot Comparison with most recent snapshot
  const mostRecentSnapshot = snapshots[0] || null;
  const snapshotChange = useMemo(() => {
    if (!mostRecentSnapshot) return null;
    return compareWithSnapshot(personalResult.netWorth, mostRecentSnapshot.netWorth);
  }, [personalResult.netWorth, mostRecentSnapshot]);

  // Bottom Line Sentence
  const summaryText = useMemo(() => {
    if (activeTab === 'personal') {
      return `You own ${fmt(personalResult.totalAssets)} and owe ${fmt(personalResult.totalLiabilities)}, giving you a net worth of ${fmt(personalResult.netWorth)}. Your liquid net worth is ${fmt(personalResult.liquidNetWorth)}.`;
    }
    if (activeTab === 'household') {
      return `Your combined household owns ${fmt(householdResult.combinedAssets)} and owes ${fmt(householdResult.combinedLiabilities)}, producing a combined household net worth of ${fmt(householdResult.combinedNet)}.`;
    }
    if (activeTab === 'tracker') {
      if (snapshotChange) {
        return `Current net worth is ${fmt(personalResult.netWorth)}, changing by ${snapshotChange.isPositive ? '+' : ''}${fmt(snapshotChange.dollarChange)} (${snapshotChange.pctChange !== null ? `${snapshotChange.pctChange}%` : ''}) since your last saved snapshot on ${mostRecentSnapshot?.dateStr}.`;
      }
      return `Save private snapshots in your browser to track your wealth trajectory over time. Zero data ever leaves your device.`;
    }
    return '';
  }, [activeTab, personalResult, householdResult, snapshotChange, mostRecentSnapshot, currSymbol, fmt]);

  const handleCopySummary = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleSaveSnapshot = () => {
    const newSnap: SavedSnapshot = {
      id: String(Date.now()),
      dateStr: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      netWorth: personalResult.netWorth,
      totalAssets: personalResult.totalAssets,
      totalLiabilities: personalResult.totalLiabilities,
    };
    const updated = [newSnap, ...snapshots.slice(0, 49)];
    setSnapshots(updated);
    safeStorage.setJSON(SNAPSHOTS_KEY, updated);
    setSnapshotSavedNotice(true);
    setTimeout(() => setSnapshotSavedNotice(false), 3000);
  };

  const handleClearSnapshots = () => {
    if (window.confirm('Are you sure you want to delete all saved snapshots on this browser?')) {
      setSnapshots([]);
      safeStorage.removeItem(SNAPSHOTS_KEY);
    }
  };

  const handleDownloadCsv = () => {
    const lines = [
      'Category,Type,Amount',
      `Cash & Checking,Asset,${cashChecking}`,
      `Savings & Cash Reserves,Asset,${savings}`,
      `Taxable Investments,Asset,${taxableInvestments}`,
      `Pre-Tax Retirement,Asset,${retirementPreTax}`,
      `Roth Retirement,Asset,${retirementRoth}`,
      `Primary Residence,Asset,${primaryHome}`,
      `Other Real Estate,Asset,${otherRealEstate}`,
      `Vehicles,Asset,${vehicles}`,
      `Business Interests,Asset,${businessInterests}`,
      `Other Assets,Asset,${otherAssets}`,
      ...customAssets.map((c) => `${c.name || 'Custom Asset'},Asset,${c.value}`),
      `Primary Mortgage,Liability,${primaryMortgage}`,
      `HELOC & 2nd Mortgage,Liability,${helocHomeEquity}`,
      `Auto Loans,Liability,${autoLoans}`,
      `Student Loans,Liability,${studentLoans}`,
      `Credit Card Debt,Liability,${creditCards}`,
      `Personal Loans,Liability,${personalLoans}`,
      `Other Liabilities,Liability,${otherLiabilities}`,
      ...customLiabilities.map((c) => `${c.name || 'Custom Debt'},Liability,${c.value}`),
      '',
      `TOTAL ASSETS,,${personalResult.totalAssets}`,
      `TOTAL LIABILITIES,,${personalResult.totalLiabilities}`,
      `NET WORTH,,${personalResult.netWorth}`,
      `LIQUID NET WORTH,,${personalResult.liquidNetWorth}`,
      `INVESTABLE NET WORTH,,${personalResult.investableNetWorth}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `net-worth-statement-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrap}>
      {/* 3-Tab Slider */}
      <TabSlider
        tabs={TABS}
        activeId={activeTab}
        onChange={(id) => handleTabChange(id as Mode)}
        ariaLabel="Net Worth Calculator Modes"
      />

      {/* Visual Balance Scale Guide */}
      <NetWorthInputGuide
        mode={activeTab}
        activeField={activeField}
        totalAssets={activeTab === 'household' ? householdResult.combinedAssets : personalResult.totalAssets}
        totalLiabilities={
          activeTab === 'household' ? householdResult.combinedLiabilities : personalResult.totalLiabilities
        }
        netWorth={activeTab === 'household' ? householdResult.combinedNet : personalResult.netWorth}
        liquidNetWorth={personalResult.liquidNetWorth}
      />

      {/* Dynamic Summary Banner (Light Mint) */}
      <div className={styles.summaryBanner} role="region" aria-label="Net Worth Summary">
        <div className={styles.summaryContent}>
          <span className={styles.summaryIcon} aria-hidden="true">💡</span>
          <div className={styles.summaryText}>
            <strong>Bottom Line:</strong> {summaryText}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopySummary}
          className={styles.copySummaryBtn}
          title="Copy net worth summary"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* ================= TAB 1: MY NET WORTH ================= */}
      {activeTab === 'personal' && (
        <div className={styles.grid}>
          {/* Inputs Column */}
          <div className={styles.inputs}>
            {/* Currency & Base Options */}
            <div className={styles.card} style={{ padding: '0.75rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.label}>Select Currency:</span>
                <select
                  value={currency}
                  aria-label="Display Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                  className={styles.select}
                  style={{ width: '130px', height: '34px' }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assets Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={`${styles.step} ${styles.stepGreen}`}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>What You Own (Assets)</h2>
                  <p className={styles.cardSubtitle}>Total: {fmt(personalResult.totalAssets)}</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-cash`} className={styles.label}>
                    Checking &amp; Physical Cash
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-cash`}
                      type="number"
                      min="0"
                      step="1000"
                      value={cashChecking || ''}
                      onChange={(e) => setCashChecking(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('cash')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-savings`} className={styles.label}>
                    Savings &amp; Money Market
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-savings`}
                      type="number"
                      min="0"
                      step="1000"
                      value={savings || ''}
                      onChange={(e) => setSavings(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('cash')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-taxable`} className={styles.label}>
                    Taxable Brokerage Accounts
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-taxable`}
                      type="number"
                      min="0"
                      step="1000"
                      value={taxableInvestments || ''}
                      onChange={(e) => setTaxableInvestments(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('invest')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-retPre`} className={styles.label}>
                    Pre-Tax Retirement (401k / Trad IRA)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-retPre`}
                      type="number"
                      min="0"
                      step="5000"
                      value={retirementPreTax || ''}
                      onChange={(e) => setRetirementPreTax(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('ret')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-retRoth`} className={styles.label}>
                    Roth &amp; After-Tax Retirement
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-retRoth`}
                      type="number"
                      min="0"
                      step="5000"
                      value={retirementRoth || ''}
                      onChange={(e) => setRetirementRoth(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('ret')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-home`} className={styles.label}>
                    Primary Home Market Value
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-home`}
                      type="number"
                      min="0"
                      step="10000"
                      value={primaryHome || ''}
                      onChange={(e) => setPrimaryHome(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('realEstate')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-reOther`} className={styles.label}>
                    Other Real Estate / Land
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-reOther`}
                      type="number"
                      min="0"
                      step="10000"
                      value={otherRealEstate || ''}
                      onChange={(e) => setOtherRealEstate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-vehicles`} className={styles.label}>
                    Vehicles &amp; Cars (Resale Value)
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-vehicles`}
                      type="number"
                      min="0"
                      step="1000"
                      value={vehicles || ''}
                      onChange={(e) => setVehicles(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-biz`} className={styles.label}>
                    Business Equity / Private Shares
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-biz`}
                      type="number"
                      min="0"
                      step="5000"
                      value={businessInterests || ''}
                      onChange={(e) => setBusinessInterests(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-otherAsset`} className={styles.label}>
                    Other Personal Assets
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-otherAsset`}
                      type="number"
                      min="0"
                      step="1000"
                      value={otherAssets || ''}
                      onChange={(e) => setOtherAssets(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Assets list */}
              {customAssets.map((asset, idx) => (
                <div key={asset.id} className={styles.customRow}>
                  <input
                    type="text"
                    value={asset.name}
                    aria-label={`Custom Asset ${idx + 1} Name`}
                    placeholder="Asset Description"
                    onChange={(e) => {
                      const updated = [...customAssets];
                      updated[idx].name = e.target.value;
                      setCustomAssets(updated);
                    }}
                    className={styles.input}
                  />
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      type="number"
                      value={asset.value || ''}
                      aria-label={`${asset.name || 'Custom Asset'} Value`}
                      onChange={(e) => {
                        const updated = [...customAssets];
                        updated[idx].value = Math.max(0, parseFloat(e.target.value) || 0);
                        setCustomAssets(updated);
                      }}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomAssets(customAssets.filter((_, i) => i !== idx))}
                    className={styles.removeBtn}
                    title="Remove asset"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCustomAssets([
                    ...customAssets,
                    { id: String(Date.now()), name: `Custom Asset ${customAssets.length + 1}`, value: 5000 },
                  ])
                }
                className={styles.addBtn}
              >
                + Add Custom Asset
              </button>
            </div>

            {/* Liabilities Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={`${styles.step} ${styles.stepRed}`}>2</span>
                <div>
                  <h2 className={styles.cardTitle}>What You Owe (Liabilities)</h2>
                  <p className={styles.cardSubtitle}>Total: {fmt(personalResult.totalLiabilities)}</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-mortgage`} className={styles.label}>
                    Primary Mortgage Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-mortgage`}
                      type="number"
                      min="0"
                      step="5000"
                      value={primaryMortgage || ''}
                      onChange={(e) => setPrimaryMortgage(Math.max(0, parseFloat(e.target.value) || 0))}
                      onFocus={() => setActiveField('mortgage')}
                      onBlur={() => setActiveField(undefined)}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-heloc`} className={styles.label}>
                    HELOC / 2nd Mortgage Balance
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-heloc`}
                      type="number"
                      min="0"
                      step="2500"
                      value={helocHomeEquity || ''}
                      onChange={(e) => setHelocHomeEquity(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-auto`} className={styles.label}>
                    Auto &amp; Vehicle Loans
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-auto`}
                      type="number"
                      min="0"
                      step="1000"
                      value={autoLoans || ''}
                      onChange={(e) => setAutoLoans(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-student`} className={styles.label}>
                    Student Loans
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-student`}
                      type="number"
                      min="0"
                      step="2000"
                      value={studentLoans || ''}
                      onChange={(e) => setStudentLoans(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-cards`} className={styles.label}>
                    Credit Card Balances
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-cards`}
                      type="number"
                      min="0"
                      step="500"
                      value={creditCards || ''}
                      onChange={(e) => setCreditCards(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-personalLoans`} className={styles.label}>
                    Personal Loans &amp; Other Debt
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-personalLoans`}
                      type="number"
                      min="0"
                      step="500"
                      value={personalLoans || ''}
                      onChange={(e) => setPersonalLoans(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Liabilities list */}
              {customLiabilities.map((debt, idx) => (
                <div key={debt.id} className={styles.customRow}>
                  <input
                    type="text"
                    value={debt.name}
                    aria-label={`Custom Debt ${idx + 1} Name`}
                    placeholder="Debt Description"
                    onChange={(e) => {
                      const updated = [...customLiabilities];
                      updated[idx].name = e.target.value;
                      setCustomLiabilities(updated);
                    }}
                    className={styles.input}
                  />
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      type="number"
                      value={debt.value || ''}
                      aria-label={`${debt.name || 'Custom Debt'} Amount`}
                      onChange={(e) => {
                        const updated = [...customLiabilities];
                        updated[idx].value = Math.max(0, parseFloat(e.target.value) || 0);
                        setCustomLiabilities(updated);
                      }}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomLiabilities(customLiabilities.filter((_, i) => i !== idx))}
                    className={styles.removeBtn}
                    title="Remove debt"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setCustomLiabilities([
                    ...customLiabilities,
                    { id: String(Date.now()), name: `Custom Debt ${customLiabilities.length + 1}`, value: 2000 },
                  ])
                }
                className={styles.addBtn}
              >
                + Add Custom Debt
              </button>
            </div>

            {/* Optional Tax & Spending Haircut Settings */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Advanced Planning Options</h3>
              <p className={styles.cardSubtitle}>Estimate tax drag on retirement and emergency runway</p>

              <div className={styles.formRow} style={{ marginTop: '0.75rem' }}>
                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-haircut`} className={styles.label}>
                    Pre-Tax Retirement Tax Haircut (%)
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      id={`${baseId}-haircut`}
                      type="number"
                      min="0"
                      max="50"
                      step="5"
                      value={preTaxHaircut || ''}
                      onChange={(e) => setPreTaxHaircut(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithSuffix}`}
                    />
                    <span className={styles.suffix}>%</span>
                  </div>
                  <span className={styles.helperText}>
                    Discounts 401k/IRA balances for future income taxes (e.g. 15%–25%)
                  </span>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor={`${baseId}-spend`} className={styles.label}>
                    Monthly Living Expenses ({currSymbol})
                  </label>
                  <div className={styles.inputWrap}>
                    <span className={styles.prefix}>{currSymbol}</span>
                    <input
                      id={`${baseId}-spend`}
                      type="number"
                      min="500"
                      step="500"
                      value={monthlySpend || ''}
                      onChange={(e) => setMonthlySpend(Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                    />
                  </div>
                  <span className={styles.helperText}>Calculates months of emergency coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className={styles.results}>
            {/* Hero Net Worth Card */}
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Total Net Worth</span>
              <div className={`${styles.heroValue} ${personalResult.isNegative ? styles.heroValueNegative : ''}`}>
                {fmt(personalResult.netWorth)}
              </div>
              <div className={styles.heroSub}>
                Assets: {fmt(personalResult.totalAssets)} · Liabilities: {fmt(personalResult.totalLiabilities)}
              </div>
              {personalResult.isNegative && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#fca5a5' }}>
                  A negative net worth is normal early in life (e.g. recent college graduates or new medical
                  professionals). As student loans amortize and earnings compound, net worth expands into positive
                  territory.
                </div>
              )}
            </div>

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Liquid Net Worth</span>
                <span className={styles.metricValue}>{fmt(personalResult.liquidNetWorth)}</span>
                <span className={styles.metricHelp}>Liquid assets − non-mortgage debt</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Investable Net Worth</span>
                <span className={styles.metricValue}>{fmt(personalResult.investableNetWorth)}</span>
                <span className={styles.metricHelp}>Liquid + retirement − consumer debt</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Debt-to-Asset Ratio</span>
                <span className={styles.metricValue}>
                  {personalResult.debtToAssetPct !== null ? `${personalResult.debtToAssetPct}%` : '0%'}
                </span>
                <span className={styles.metricHelp}>Under 50% is healthy</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Home Equity</span>
                <span className={styles.metricValue}>{fmt(personalResult.homeEquity)}</span>
                <span className={styles.metricHelp}>Home value − mortgage</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Total Liquid Assets</span>
                <span className={styles.metricValue}>{fmt(personalResult.liquidAssets)}</span>
                <span className={styles.metricHelp}>Cash, savings &amp; brokerage</span>
              </div>

              <div className={styles.metricTile}>
                <span className={styles.metricLabel}>Emergency Runway</span>
                <span className={styles.metricValue}>
                  {personalResult.monthsCovered !== null ? `${personalResult.monthsCovered} mos` : '—'}
                </span>
                <span className={styles.metricHelp}>At {fmt(monthlySpend)}/month</span>
              </div>
            </div>

            {/* Asset Allocation Chart Card */}
            <div className={styles.chartCard}>
              <h3 className={styles.cardTitle}>Asset Allocation Mix</h3>
              <p className={styles.cardSubtitle}>Distribution across asset classes</p>

              {/* Stacked bar */}
              <div className={styles.barTrack}>
                {personalResult.assetBreakdown.map((item) => {
                  if (item.pctOfTotal <= 0) return null;
                  return (
                    <div
                      key={item.category}
                      className={styles.barSegment}
                      style={{
                        width: `${item.pctOfTotal}%`,
                        backgroundColor: item.color,
                      }}
                      title={`${item.label}: ${item.pctOfTotal}% (${fmt(item.amount)})`}
                    />
                  );
                })}
              </div>

              {/* Legend list */}
              <div className={styles.legendList}>
                {personalResult.assetBreakdown.map((item) => (
                  <div key={item.category} className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                      <span>{item.label}</span>
                    </div>
                    <strong>{item.pctOfTotal}%</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Save Snapshot & Export */}
            <div className={styles.card}>
              <div className={styles.actionsBar}>
                <button type="button" onClick={handleSaveSnapshot} className={styles.actionBtn}>
                  💾 Save Snapshot to Browser
                </button>
                <button type="button" onClick={handleDownloadCsv} className={styles.actionBtn}>
                  ⬇ Download Statement (CSV)
                </button>
              </div>
              {snapshotSavedNotice && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                  ✓ Snapshot saved privately in this browser! View it in the &quot;Track Changes&quot; tab.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: HOUSEHOLD MODE ================= */}
      {activeTab === 'household' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Household Balance Sheets</h2>
                  <p className={styles.cardSubtitle}>Track partner assets, partner debt, and joint property</p>
                </div>
              </div>

              {/* Person A */}
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  value={memberAName}
                  onChange={(e) => setMemberAName(e.target.value)}
                  className={styles.input}
                  style={{ fontWeight: 700, marginBottom: '0.5rem' }}
                  placeholder="Partner 1 Name"
                />
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-memberAAssets`} className={styles.label}>
                      {memberAName} Total Assets
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>{currSymbol}</span>
                      <input
                        id={`${baseId}-memberAAssets`}
                        type="number"
                        min="0"
                        step="5000"
                        value={memberAAssets || ''}
                        onChange={(e) => setMemberAAssets(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-memberALiab`} className={styles.label}>
                      {memberAName} Total Debt
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>{currSymbol}</span>
                      <input
                        id={`${baseId}-memberALiab`}
                        type="number"
                        min="0"
                        step="5000"
                        value={memberALiabilities || ''}
                        onChange={(e) => setMemberALiabilities(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Person B */}
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  value={memberBName}
                  onChange={(e) => setMemberBName(e.target.value)}
                  className={styles.input}
                  style={{ fontWeight: 700, marginBottom: '0.5rem' }}
                  placeholder="Partner 2 Name"
                />
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-memberBAssets`} className={styles.label}>
                      {memberBName} Total Assets
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>{currSymbol}</span>
                      <input
                        id={`${baseId}-memberBAssets`}
                        type="number"
                        min="0"
                        step="5000"
                        value={memberBAssets || ''}
                        onChange={(e) => setMemberBAssets(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-memberBLiab`} className={styles.label}>
                      {memberBName} Total Debt
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>{currSymbol}</span>
                      <input
                        id={`${baseId}-memberBLiab`}
                        type="number"
                        min="0"
                        step="5000"
                        value={memberBLiabilities || ''}
                        onChange={(e) => setMemberBLiabilities(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Joint Property */}
              <div>
                <h3 className={styles.cardTitle} style={{ marginBottom: '0.5rem' }}>
                  Joint Assets &amp; Mortgages
                </h3>
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-jointAssets`} className={styles.label}>
                      Joint Assets (e.g. Home, Joint Savings)
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>{currSymbol}</span>
                      <input
                        id={`${baseId}-jointAssets`}
                        type="number"
                        min="0"
                        step="10000"
                        value={jointAssets || ''}
                        onChange={(e) => setJointAssets(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${baseId}-jointLiab`} className={styles.label}>
                      Joint Debt (e.g. Primary Mortgage)
                    </label>
                    <div className={styles.inputWrap}>
                      <span className={styles.prefix}>{currSymbol}</span>
                      <input
                        id={`${baseId}-jointLiab`}
                        type="number"
                        min="0"
                        step="10000"
                        value={jointLiabilities || ''}
                        onChange={(e) => setJointLiabilities(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`${styles.input} ${styles.inputWithPrefix}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.heroCard}>
              <span className={styles.heroTag}>Combined Household Net Worth</span>
              <div className={styles.heroValue}>{fmt(householdResult.combinedNet)}</div>
              <div className={styles.heroSub}>
                Household Assets: {fmt(householdResult.combinedAssets)} · Household Debt:{' '}
                {fmt(householdResult.combinedLiabilities)}
              </div>
            </div>

            <div className={styles.householdCols}>
              <div className={styles.householdCard}>
                <div className={styles.householdCardTitle}>{memberAName}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {fmt(householdResult.netA)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                  Assets: {fmt(memberAAssets)}
                  <br />
                  Debt: {fmt(memberALiabilities)}
                </div>
              </div>

              <div className={styles.householdCard}>
                <div className={styles.householdCardTitle}>{memberBName}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {fmt(householdResult.netB)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                  Assets: {fmt(memberBAssets)}
                  <br />
                  Debt: {fmt(memberBLiabilities)}
                </div>
              </div>

              <div className={styles.householdCard}>
                <div className={styles.householdCardTitle}>Joint Accounts</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>
                  {fmt(householdResult.netJoint)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                  Assets: {fmt(jointAssets)}
                  <br />
                  Debt: {fmt(jointLiabilities)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRACK CHANGES ================= */}
      {activeTab === 'tracker' && (
        <div className={styles.grid}>
          <div className={styles.inputs}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <div>
                  <h2 className={styles.cardTitle}>Local Net Worth History</h2>
                  <p className={styles.cardSubtitle}>
                    All data is stored exclusively in this browser&apos;s localStorage
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
                Track your financial freedom journey by taking periodic snapshots (monthly or quarterly). None of your
                account numbers, names, or balances are ever uploaded to a server or third-party database.
              </p>

              <div className={styles.actionsBar} style={{ marginTop: '1rem' }}>
                <button type="button" onClick={handleSaveSnapshot} className={styles.actionBtn}>
                  📸 Save Today&apos;s Snapshot ({fmt(personalResult.netWorth)})
                </button>
                {snapshots.length > 0 && (
                  <button type="button" onClick={handleClearSnapshots} className={styles.clearBtn}>
                    Clear Saved History
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Snapshot Progression ({snapshots.length} saved)</h3>
              {snapshots.length > 0 ? (
                <div className={styles.tableWrap} style={{ marginTop: '0.75rem' }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th className={styles.numCell}>Net Worth</th>
                        <th className={styles.numCell}>Assets</th>
                        <th className={styles.numCell}>Debt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshots.map((snap) => (
                        <tr key={snap.id}>
                          <td>{snap.dateStr}</td>
                          <td className={styles.numCell} style={{ fontWeight: 700, color: 'var(--accent)' }}>
                            {fmt(snap.netWorth)}
                          </td>
                          <td className={styles.numCell}>{fmt(snap.totalAssets)}</td>
                          <td className={styles.numCell}>{fmt(snap.totalLiabilities)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.75rem' }}>
                  No snapshots saved yet. Click &quot;Save Today&apos;s Snapshot&quot; to establish your baseline!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
