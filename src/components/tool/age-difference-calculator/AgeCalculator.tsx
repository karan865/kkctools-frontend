'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import TabSlider, { TabItem } from '@/components/tool/shared/TabSlider';
import AgeInputGuide from './AgeInputGuide';
import styles from './AgeCalculator.module.css';
import {
  parseISODate,
  formatISODate,
  calculateDateDiff,
  calculateBornOnOrBefore,
  compareFamilyAges,
  quickBirthYearDiff,
  DateYMD,
} from '@/lib/date-diff-engine';

type TabType = 'two' | 'family' | 'born' | 'quick';

const TABS: TabItem<TabType>[] = [
  { id: 'two', label: '1. Two People' },
  { id: 'family', label: '2. Family & Group List' },
  { id: 'born', label: '3. Born On or Before' },
  { id: 'quick', label: '4. Quick: Birth Years' },
];

interface FamilyRow {
  name: string;
  dob: string;
}

export default function AgeCalculator() {
  const id = useId();
  const [tab, setTab] = useState<TabType>('two');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync tab from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab') as TabType;
        if (urlTab && TABS.some((t) => t.id === urlTab)) {
          setTab(urlTab);
        }
      };
      const timer = setTimeout(syncFromUrl, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', newTab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // --- Tab 1: Two People State ---
  const [nameA, setNameA] = useState<string>('Alex');
  const [dateA, setDateA] = useState<string>('1990-03-15');
  const [nameB, setNameB] = useState<string>('Sam');
  const [dateB, setDateB] = useState<string>('1994-07-02');
  const [asOfDate, setAsOfDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const parsedA = useMemo(() => parseISODate(dateA), [dateA]);
  const parsedB = useMemo(() => parseISODate(dateB), [dateB]);
  const parsedAsOf = useMemo(() => parseISODate(asOfDate), [asOfDate]);

  const diffResult = useMemo(() => {
    if (!parsedA || !parsedB) return null;
    return calculateDateDiff(parsedA, parsedB);
  }, [parsedA, parsedB]);

  const ageA = useMemo(() => {
    if (!parsedA || !parsedAsOf) return null;
    return calculateDateDiff(parsedA, parsedAsOf);
  }, [parsedA, parsedAsOf]);

  const ageB = useMemo(() => {
    if (!parsedB || !parsedAsOf) return null;
    return calculateDateDiff(parsedB, parsedAsOf);
  }, [parsedB, parsedAsOf]);

  // --- Tab 2: Family List State ---
  const [familyMembers, setFamilyMembers] = useState<FamilyRow[]>([
    { name: 'Alex', dob: '1990-03-15' },
    { name: 'Sam', dob: '1994-07-02' },
    { name: 'Charlie', dob: '2000-01-01' },
  ]);

  const familyResult = useMemo(() => {
    if (!parsedAsOf) return null;
    const validInputs = familyMembers
      .map((m) => ({ name: m.name.trim(), parsedDob: parseISODate(m.dob) }))
      .filter((m): m is { name: string; parsedDob: DateYMD } => m.parsedDob !== null)
      .map((m) => ({ name: m.name, dob: m.parsedDob }));

    if (validInputs.length < 2) return null;
    return compareFamilyAges(validInputs, parsedAsOf);
  }, [familyMembers, parsedAsOf]);

  const addFamilyMember = () => {
    if (familyMembers.length < 10) {
      setFamilyMembers([...familyMembers, { name: '', dob: '2005-01-01' }]);
    }
  };

  const removeFamilyMember = (index: number) => {
    if (familyMembers.length > 2) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    }
  };

  // --- Tab 3: Born On or Before State ---
  const [targetAge, setTargetAge] = useState<number>(21);
  const bornOnOrBeforeResult = useMemo(() => {
    if (!parsedAsOf || targetAge <= 0) return null;
    return calculateBornOnOrBefore(targetAge, parsedAsOf);
  }, [targetAge, parsedAsOf]);

  // --- Tab 4: Quick Mode State ---
  const [quickYearA, setQuickYearA] = useState<number>(1990);
  const [quickYearB, setQuickYearB] = useState<number>(1994);

  const quickDiffResult = useMemo(() => {
    if (!quickYearA || !quickYearB) return null;
    return quickBirthYearDiff(quickYearA, quickYearB);
  }, [quickYearA, quickYearB]);

  // Copy handler
  const handleCopy = () => {
    let text = '';
    if (tab === 'two' && diffResult) {
      const olderName = diffResult.isNegative ? (nameB || 'Person B') : (nameA || 'Person A');
      const youngerName = diffResult.isNegative ? (nameA || 'Person A') : (nameB || 'Person B');
      text = `Age Difference: ${diffResult.years} years, ${diffResult.months} months, ${diffResult.days} days (${diffResult.totalDays.toLocaleString()} days total). ${olderName} is older than ${youngerName}.`;
    } else if (tab === 'born' && bornOnOrBeforeResult) {
      text = `To be at least ${targetAge} years old as of ${asOfDate}, a person must be born on or before ${formatISODate(bornOnOrBeforeResult)}.`;
    } else if (tab === 'family' && familyResult) {
      text = `Family Age Spread: ${familyResult.overallSpread?.years} years, ${familyResult.overallSpread?.months} months, ${familyResult.overallSpread?.days} days.`;
    } else if (tab === 'quick' && quickDiffResult) {
      text = `Calendar birth year difference: ${quickDiffResult.diffYears} years (${quickYearA} vs ${quickYearB}).`;
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.calculator}>
      <TabSlider tabs={TABS} activeId={tab} onChange={handleTabChange} ariaLabel="Age difference calculator functions" />

      {/* Visual Timeline Input Guide */}
      <AgeInputGuide
        tab={tab}
        dateA={dateA}
        dateB={dateB}
        nameA={nameA}
        nameB={nameB}
        asOfDate={asOfDate}
        targetAge={targetAge}
        bornResult={bornOnOrBeforeResult ? formatISODate(bornOnOrBeforeResult) : ''}
        gapText={diffResult ? `${diffResult.years} y · ${diffResult.months} m · ${diffResult.days} d` : ''}
        focusedField={focusedField}
      />

      {/* TAB 1: TWO PEOPLE */}
      {tab === 'two' && (
        <>
          <div className={styles.grid}>
            {/* Person A */}
            <div className={styles.field}>
              <label htmlFor={`${id}-name-a`} className={styles.label}>
                <span className={styles.badge}>1</span> Person A Name (optional)
              </label>
              <input
                id={`${id}-name-a`}
                type="text"
                className={styles.input}
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                placeholder="e.g. Alex"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-dob-a`} className={styles.label}>
                <span className={styles.badge}>📅</span> Person A Date of Birth
              </label>
              <input
                id={`${id}-dob-a`}
                type="date"
                className={styles.input}
                value={dateA}
                onChange={(e) => setDateA(e.target.value)}
                onFocus={() => setFocusedField('dobA')}
                onBlur={() => setFocusedField(null)}
              />
              <span className={styles.inputHint}>Format: YYYY-MM-DD</span>
            </div>

            {/* Person B */}
            <div className={styles.field}>
              <label htmlFor={`${id}-name-b`} className={styles.label}>
                <span className={styles.badge}>2</span> Person B Name (optional)
              </label>
              <input
                id={`${id}-name-b`}
                type="text"
                className={styles.input}
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                placeholder="e.g. Sam"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-dob-b`} className={styles.label}>
                <span className={styles.badge}>📅</span> Person B Date of Birth
              </label>
              <input
                id={`${id}-dob-b`}
                type="date"
                className={styles.input}
                value={dateB}
                onChange={(e) => setDateB(e.target.value)}
                onFocus={() => setFocusedField('dobB')}
                onBlur={() => setFocusedField(null)}
              />
              <span className={styles.inputHint}>Format: YYYY-MM-DD</span>
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: '12px', maxWidth: '300px' }}>
            <label htmlFor={`${id}-as-of`} className={styles.label}>
              <span className={styles.badge}>3</span> As-Of Date (to compute current age)
            </label>
            <input
              id={`${id}-as-of`}
              type="date"
              className={styles.input}
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              onFocus={() => setFocusedField('asOf')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {diffResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Exact Age Difference</div>
                <div className={styles.heroValue}>
                  {diffResult.years} Years, {diffResult.months} Months, {diffResult.days} Days
                </div>
                <div className={styles.heroSub}>
                  Total: {diffResult.totalDays.toLocaleString()} Days &bull; {diffResult.totalWeeks} Weeks + {diffResult.remainingDays} Days
                </div>
              </div>

              <div className={styles.sentence}>
                <strong>{diffResult.isNegative ? (nameB || 'Person B') : (nameA || 'Person A')}</strong> is{' '}
                <strong>
                  {diffResult.years} years, {diffResult.months} months, and {diffResult.days} days
                </strong>{' '}
                older than <strong>{diffResult.isNegative ? (nameA || 'Person A') : (nameB || 'Person B')}</strong> ({diffResult.totalDays.toLocaleString()} calendar days apart).
              </div>

              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Full Months</span>
                  <span className={styles.statValue}>{diffResult.totalMonths} months</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Weeks</span>
                  <span className={styles.statValue}>{diffResult.totalWeeks} weeks</span>
                </div>
                {ageA && (
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>{nameA || 'Person A'} Age Today</span>
                    <span className={styles.statValue}>{ageA.years} y, {ageA.months} m</span>
                  </div>
                )}
                {ageB && (
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>{nameB || 'Person B'} Age Today</span>
                    <span className={styles.statValue}>{ageB.years} y, {ageB.months} m</span>
                  </div>
                )}
              </div>

              <div className={styles.actionsBar}>
                <span className={styles.privacyNote}>🔒 Privacy check: Dates calculated strictly in browser memory.</span>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: FAMILY / GROUP LIST */}
      {tab === 'family' && (
        <>
          <div className={styles.field} style={{ marginBottom: '16px', maxWidth: '300px' }}>
            <label htmlFor={`${id}-family-asof`} className={styles.label}>
              <span className={styles.badge}>📅</span> Calculate Ages As Of:
            </label>
            <input
              id={`${id}-family-asof`}
              type="date"
              className={styles.input}
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {familyMembers.map((member, index) => (
              <div key={index} className={styles.grid}>
                <div className={styles.field}>
                  <label htmlFor={`${id}-fam-name-${index}`} className={styles.label}>
                    <span className={styles.badge}>{index + 1}</span> Name / Relation
                  </label>
                  <input
                    id={`${id}-fam-name-${index}`}
                    type="text"
                    className={styles.input}
                    value={member.name}
                    onChange={(e) => {
                      const next = [...familyMembers];
                      next[index].name = e.target.value;
                      setFamilyMembers(next);
                    }}
                    placeholder={`e.g. Sibling ${index + 1}`}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor={`${id}-fam-dob-${index}`} className={styles.label}>
                    <span className={styles.badge}>🎂</span> Date of Birth
                  </label>
                  <input
                    id={`${id}-fam-dob-${index}`}
                    type="date"
                    className={styles.input}
                    value={member.dob}
                    onChange={(e) => {
                      const next = [...familyMembers];
                      next[index].dob = e.target.value;
                      setFamilyMembers(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.presetBar} style={{ marginTop: '14px' }}>
            {familyMembers.length < 10 && (
              <button type="button" className={styles.presetBtn} onClick={addFamilyMember}>
                + Add Person (up to 10)
              </button>
            )}
            {familyMembers.length > 2 && (
              <button
                type="button"
                className={styles.presetBtn}
                onClick={() => removeFamilyMember(familyMembers.length - 1)}
              >
                &minus; Remove Last Person
              </button>
            )}
          </div>

          {familyResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Total Family Age Spread</div>
                <div className={styles.heroValue}>
                  {familyResult.overallSpread?.years} Years, {familyResult.overallSpread?.months} Months, {familyResult.overallSpread?.days} Days
                </div>
                <div className={styles.heroSub}>
                  Oldest ({familyResult.membersSorted[0].name}) to Youngest ({familyResult.membersSorted[familyResult.membersSorted.length - 1].name})
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order (Oldest First)</th>
                      <th>Birthdate</th>
                      <th>Age as of {asOfDate}</th>
                      <th>Gap to Next Sibling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyResult.membersSorted.map((member, i) => (
                      <tr key={i}>
                        <td><strong>{member.name}</strong></td>
                        <td>{formatISODate(member.dob)}</td>
                        <td>{member.ageYears} y, {member.ageMonths} m, {member.ageDays} d</td>
                        <td>
                          {member.gapToNext
                            ? `${member.gapToNext.years} y, ${member.gapToNext.months} m, ${member.gapToNext.days} d`
                            : '— (Youngest)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.actionsBar}>
                <span className={styles.privacyNote}>🔒 Privacy check: Dates calculated strictly in browser memory.</span>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 3: BORN ON OR BEFORE */}
      {tab === 'born' && (
        <>
          <div className={styles.presetBar}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-soft)', marginRight: '6px' }}>
              Quick Target Age:
            </span>
            {[18, 21, 65].map((age) => (
              <button
                key={age}
                type="button"
                className={`${styles.presetBtn} ${targetAge === age ? styles.presetBtnActive : ''}`}
                onClick={() => setTargetAge(age)}
              >
                {age} Years Old
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-target-age`} className={styles.label}>
                <span className={styles.badge}>🎯</span> Required Age
              </label>
              <input
                id={`${id}-target-age`}
                type="number"
                min="1"
                max="120"
                className={styles.input}
                value={targetAge}
                onChange={(e) => setTargetAge(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-born-asof`} className={styles.label}>
                <span className={styles.badge}>📅</span> As of Date
              </label>
              <input
                id={`${id}-born-asof`}
                type="date"
                className={styles.input}
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                onFocus={() => setFocusedField('asOf')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          {bornOnOrBeforeResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Must Be Born On or Before</div>
                <div className={styles.heroValue}>{formatISODate(bornOnOrBeforeResult)}</div>
                <div className={styles.heroSub}>
                  To be at least {targetAge} years old as of {asOfDate}
                </div>
              </div>

              <div className={styles.sentence}>
                To reach age <strong>{targetAge}</strong> by <strong>{asOfDate}</strong>, a person must have been born on or before{' '}
                <strong>{formatISODate(bornOnOrBeforeResult)}</strong>. Anyone born after this date has not yet reached their {targetAge}th birthday.
              </div>

              <div className={styles.actionsBar}>
                <span className={styles.privacyNote}>🔒 Legal note: Mathematical verification only. Always check jurisdiction age requirements.</span>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 4: QUICK BIRTH YEARS */}
      {tab === 'quick' && (
        <>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor={`${id}-quick-year-a`} className={styles.label}>
                <span className={styles.badge}>1</span> Birth Year A
              </label>
              <input
                id={`${id}-quick-year-a`}
                type="number"
                min="1900"
                max="2099"
                className={styles.input}
                value={quickYearA}
                onChange={(e) => setQuickYearA(parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-quick-year-b`} className={styles.label}>
                <span className={styles.badge}>2</span> Birth Year B
              </label>
              <input
                id={`${id}-quick-year-b`}
                type="number"
                min="1900"
                max="2099"
                className={styles.input}
                value={quickYearB}
                onChange={(e) => setQuickYearB(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>

          {quickDiffResult && (
            <div className={styles.resultsBand}>
              <div className={styles.heroResult}>
                <div className={styles.heroLabel}>Calendar Year Gap</div>
                <div className={styles.heroValue}>{quickDiffResult.diffYears} Years</div>
                <div className={styles.heroSub}>
                  {quickYearA} vs {quickYearB}
                </div>
              </div>

              <div className={styles.sentence}>
                {quickDiffResult.note}
              </div>

              <div className={styles.actionsBar}>
                <span className={styles.privacyNote}>Switch to Tab 1 (Two People) for exact day and month calculations.</span>
                <button type="button" className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy result'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
