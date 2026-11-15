'use client';

import React, { useEffect, useId, useState } from 'react';
import styles from './BathroomRemodelCalculator.module.css';
import { BathroomPlan, SpendBar, type Seg } from './BathroomDiagram';
import {
  BATHING,
  CONTINGENCY_PCT,
  FINISH_FACTOR,
  FINISH_LABEL,
  ITEMS,
  ROOM_TYPES,
  SQFT_PER_M2,
  WATER_HEATER,
  calculateRemodel,
  checkQuote,
  itemRate,
  type Bathing,
  type Finish,
  type RoomType,
  type Scope,
} from '@/lib/bathroom-remodel-engine';

type Units = 'us' | 'metric';
const M_PER_FT = 0.3048;
const CURRENCIES = [
  { id: 'USD', sym: '$', label: 'US $' },
  { id: 'GBP', sym: '£', label: '£' },
  { id: 'EUR', sym: '€', label: '€' },
  { id: 'CAD', sym: 'C$', label: 'C$' },
  { id: 'AUD', sym: 'A$', label: 'A$' },
  { id: 'NZD', sym: 'NZ$', label: 'NZ$' },
  { id: 'INR', sym: '₹', label: '₹' },
];

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2, min = 0) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { maximumFractionDigits: max, minimumFractionDigits: min });
const r2 = (n: number) => `${Math.round(n * 100) / 100}`;

/** Rates as input strings (area items per ft² or per m²). */
function rateStrings(finish: Finish, metric: boolean): Record<string, string> {
  return Object.fromEntries(ITEMS.map((i) => [i.id, r2(itemRate(i, finish) * (i.kind === 'area' && metric ? SQFT_PER_M2 : 1))]));
}

interface Shared {
  u: Units;
  c: string;
  t: RoomType;
  l: string;
  w: string;
  sc: Scope;
  f: Finish;
  b: Bathing;
  bp: string;
  r: Record<string, string>;
  off: string[];
  wh: boolean;
  whp: string;
  p: string;
  rg: string;
  ct: string;
}
const encode = (s: Shared) => btoa(unescape(encodeURIComponent(JSON.stringify(s)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g, '+').replace(/_/g, '/'))))) as Shared;
    return s && s.r && s.t in ROOM_TYPES ? s : null;
  } catch {
    return null;
  }
}

export default function BathroomRemodelCalculator() {
  const [units, setUnits] = useState<Units>('us');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState<RoomType>('full');
  const [len, setLen] = useState('8');
  const [wid, setWid] = useState('5');
  const [scope, setScope] = useState<Scope>('full');
  const [finish, setFinish] = useState<Finish>('mid');
  const [bathing, setBathing] = useState<Bathing>('combo');
  const [bathPrice, setBathPrice] = useState(r2(BATHING.combo.average));
  const [rates, setRates] = useState<Record<string, string>>(rateStrings('mid', false));
  const [off, setOff] = useState<string[]>([]);
  const [waterHeater, setWaterHeater] = useState(false);
  const [whPrice, setWhPrice] = useState(r2(WATER_HEATER));
  const [permit, setPermit] = useState('0');
  const [region, setRegion] = useState('1');
  const [contingency, setContingency] = useState(`${CONTINGENCY_PCT}`);
  const [quote, setQuote] = useState('');
  const [notice, setNotice] = useState('');
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('b');
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    setUnits(s.u === 'metric' ? 'metric' : 'us');
    if (CURRENCIES.some((c) => c.id === s.c)) setCurrency(s.c);
    setType(s.t);
    setLen(s.l);
    setWid(s.w);
    setScope(s.sc === 'cosmetic' ? 'cosmetic' : 'full');
    if (s.f in FINISH_FACTOR) setFinish(s.f);
    if (s.b in BATHING) setBathing(s.b);
    setBathPrice(s.bp);
    setRates((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(s.r).filter(([k]) => k in prev)) }));
    setOff(Array.isArray(s.off) ? s.off.filter((k) => ITEMS.some((i) => i.id === k)) : []);
    setWaterHeater(Boolean(s.wh));
    setWhPrice(s.whp);
    setPermit(s.p);
    setRegion(s.rg);
    setContingency(s.ct);
  }, []);

  const M = units === 'metric';
  const sym = CURRENCIES.find((c) => c.id === currency)?.sym ?? '$';
  const money = (n: number) => `${sym}${fmt(n, Math.abs(n) >= 1000 ? 0 : 2, Math.abs(n) >= 1000 ? 0 : 2)}`;
  const L = M ? 'm' : 'ft';
  const AREA = M ? 'm²' : 'ft²';
  const floorSqFt = M ? (num(len) * num(wid)) / (M_PER_FT * M_PER_FT) : num(len) * num(wid);

  const res = calculateRemodel({
    floorSqFt,
    scope,
    rates: Object.fromEntries(ITEMS.map((i) => [i.id, i.kind === 'area' && M ? num(rates[i.id]) / SQFT_PER_M2 : num(rates[i.id])])),
    off,
    bathing,
    bathingPrice: num(bathPrice),
    waterHeater,
    waterHeaterPrice: num(whPrice),
    permit: num(permit),
    regionFactor: num(region) || 1,
    contingencyPct: num(contingency),
  });
  const quoteCheck = checkQuote(num(quote), res);
  const areaOut = (ft2: number) => (M ? `${fmt(ft2 / SQFT_PER_M2, 1)} m²` : `${fmt(ft2, 0)} ft²`);
  const perArea = (pSqFt: number) => (M ? `${money(pSqFt * SQFT_PER_M2)}/m²` : `${money(pSqFt)}/ft²`);

  // ---------- actions ----------
  const applyFinish = (f: Finish, b: Bathing = bathing) => {
    setFinish(f);
    setRates(rateStrings(f, M));
    setBathPrice(r2(BATHING[b].average * FINISH_FACTOR[f]));
    setWhPrice(r2(WATER_HEATER * FINISH_FACTOR[f]));
  };
  const pickType = (t: RoomType) => {
    const d = ROOM_TYPES[t];
    setType(t);
    setLen(M ? r2(d.lengthFt * M_PER_FT) : `${d.lengthFt}`);
    setWid(M ? r2(d.widthFt * M_PER_FT) : `${d.widthFt}`);
    setBathing(d.bathing);
    setBathPrice(r2(BATHING[d.bathing].average * FINISH_FACTOR[finish]));
  };
  const pickBathing = (b: Bathing) => {
    setBathing(b);
    setBathPrice(r2(BATHING[b].average * FINISH_FACTOR[finish]));
  };
  const switchUnits = (next: Units) => {
    if (next === units) return;
    const f = next === 'metric' ? M_PER_FT : 1 / M_PER_FT;
    setLen(r2(num(len) * f));
    setWid(r2(num(wid) * f));
    setRates((prev) => Object.fromEntries(ITEMS.map((i) => [i.id, i.kind === 'area' ? r2(num(prev[i.id]) * (next === 'metric' ? SQFT_PER_M2 : 1 / SQFT_PER_M2)) : prev[i.id]])));
    setUnits(next);
  };
  const toggleItem = (iid: string) => setOff((prev) => (prev.includes(iid) ? prev.filter((x) => x !== iid) : [...prev, iid]));
  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2500);
  };
  const copyText = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(ok);
    } catch {
      flash('Copy is blocked in this browser — select and copy manually.');
    }
  };
  const summary = () =>
    [
      `Bathroom remodel estimate (KKC Tools) — ${ROOM_TYPES[type].label}, ${areaOut(floorSqFt)}, ${FINISH_LABEL[finish].toLowerCase()}, ${scope === 'full' ? 'full remodel' : 'cosmetic refresh'}`,
      ...res.lines.map((l) => `${l.label}: ${money(l.amount)}`),
      res.regionAdj ? `Region adjustment: ${money(res.regionAdj)}` : '',
      res.permit ? `Permit: ${money(res.permit)}` : '',
      `Estimate: ${money(res.total)} (range ${money(res.low)}–${money(res.high)})`,
      `Budget with ${fmt(num(contingency), 0)}% contingency: ${money(res.budget)}`,
    ]
      .filter(Boolean)
      .join('\n');
  const share = () => {
    const s: Shared = { u: units, c: currency, t: type, l: len, w: wid, sc: scope, f: finish, b: bathing, bp: bathPrice, r: rates, off, wh: waterHeater, whp: whPrice, p: permit, rg: region, ct: contingency };
    const url = `${window.location.origin}${window.location.pathname}?b=${encode(s)}`;
    window.history.replaceState(null, '', url);
    copyText(url, 'Share link copied.');
  };

  // ---------- UI helpers ----------
  let step = 0;
  const head = (title: string, sub?: string) => (
    <div className={styles.cardHead}>
      <span className={styles.step}>{++step}</span>
      <h2 className={styles.cardTitle}>
        {title} {sub && <span className={styles.titleSub}>· {sub}</span>}
      </h2>
    </div>
  );
  const pill = (active: boolean, label: React.ReactNode, onClick: () => void, key?: string | number) => (
    <button key={key} type="button" aria-pressed={active} className={`${styles.pill} ${active ? styles.pillActive : ''}`} onClick={onClick}>
      {label}
    </button>
  );
  const input = (k: string, label: string, value: string, set: (s: string) => void, suffix?: string, help?: string) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(k)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input id={id(k)} className={styles.input} type="number" inputMode="decimal" min="0" step="any" value={value} onChange={(e) => set(e.target.value)} />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );

  const group = (ids: string[]) => res.lines.filter((l) => ids.includes(l.id)).reduce((a, l) => a + l.amount, 0);
  const segments: Seg[] = [
    { label: 'Fixtures & vanity', amount: group(['toilet', 'vanity', 'top', 'faucets']), tone: 'a' },
    { label: 'Plumbing & electrical', amount: group(['plumbing', 'electrical', 'waterHeater']), tone: 'b' },
    { label: 'Floors, walls & paint', amount: group(['flooring', 'tile', 'paint', 'drywall']), tone: 'c' },
    { label: 'Tub / shower', amount: group(['bathing']), tone: 'd' },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          <div className={styles.card}>
            {head('Bathroom', `${ROOM_TYPES[type].label.toLowerCase()} · ${areaOut(floorSqFt)}`)}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} role="group" aria-label="Bathroom type">
              {(Object.keys(ROOM_TYPES) as RoomType[]).map((t) => (
                <button key={t} type="button" aria-pressed={type === t} className={`${styles.kindBtn} ${type === t ? styles.kindActive : ''}`} onClick={() => pickType(t)}>
                  {ROOM_TYPES[t].label}
                </button>
              ))}
            </div>
            <div className={styles.fields} style={{ marginTop: 12 }}>
              {input('len', 'Length', len, setLen, L)}
              {input('wid', 'Width', wid, setWid, L)}
            </div>
            <div className={styles.segment} role="group" aria-label="Units" style={{ marginTop: 12 }}>
              <button type="button" aria-pressed={!M} className={`${styles.segBtn} ${!M ? styles.segActive : ''}`} onClick={() => switchUnits('us')}>
                Feet
              </button>
              <button type="button" aria-pressed={M} className={`${styles.segBtn} ${M ? styles.segActive : ''}`} onClick={() => switchUnits('metric')}>
                Metres
              </button>
            </div>
            <div className={styles.field} style={{ marginTop: 12 }}>
              <label className={styles.label} htmlFor={id('cur')}>
                Currency
              </label>
              <select id={id('cur')} className={styles.input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.id})
                  </option>
                ))}
              </select>
              {currency !== 'USD' && <p className={styles.help}>Default prices are US national averages — replace them with local prices; the currency only changes the symbol.</p>}
            </div>
          </div>

          <div className={styles.card}>
            {head('Scope & finish', `${scope === 'full' ? 'full remodel' : 'cosmetic refresh'} · ${FINISH_LABEL[finish].toLowerCase()}`)}
            <div className={styles.kindGrid} style={{ gridTemplateColumns: '1fr 1fr' }} role="group" aria-label="Scope">
              <button type="button" aria-pressed={scope === 'cosmetic'} className={`${styles.kindBtn} ${scope === 'cosmetic' ? styles.kindActive : ''}`} onClick={() => setScope('cosmetic')}>
                Cosmetic refresh
              </button>
              <button type="button" aria-pressed={scope === 'full'} className={`${styles.kindBtn} ${scope === 'full' ? styles.kindActive : ''}`} onClick={() => setScope('full')}>
                Full remodel
              </button>
            </div>
            <p className={styles.help}>{scope === 'cosmetic' ? 'Keeps the tub, plumbing and walls; replaces fixtures, vanity, floor, tile and paint.' : 'Down to the studs: new plumbing, drywall, tub or shower and everything else.'}</p>
            <p className={styles.label} style={{ marginTop: 12 }}>
              Finish level
            </p>
            <div className={styles.pills} role="group" aria-label="Finish level">
              {(Object.keys(FINISH_LABEL) as Finish[]).map((f) => pill(finish === f, `${FINISH_LABEL[f]} ×${FINISH_FACTOR[f]}`, () => applyFinish(f), f))}
            </div>
            <p className={styles.help}>Choosing a level refills every price below from This Old House’s 2026 averages.</p>
          </div>

          {scope === 'full' && (
            <div className={styles.card}>
              {head('Tub & shower', BATHING[bathing].label.toLowerCase())}
              <div className={styles.pills} role="group" aria-label="Tub and shower">
                {(Object.keys(BATHING) as Bathing[]).map((b) => pill(bathing === b, BATHING[b].label, () => pickBathing(b), b))}
              </div>
              {bathing !== 'none' && <div className={styles.fields} style={{ marginTop: 10 }}>{input('bp', 'Installed price', bathPrice, setBathPrice, sym)}</div>}
            </div>
          )}

          <div className={styles.card}>
            {head('Line items', `${res.lines.length} items`)}
            {ITEMS.map((i) => {
              const excluded = scope === 'cosmetic' && !i.cosmetic;
              const on = !off.includes(i.id) && !excluded;
              return (
                <div key={i.id} className={styles.itemRow}>
                  <label className={`${styles.check} ${on ? styles.checkOn : ''}`} htmlFor={id(`on-${i.id}`)}>
                    <input id={id(`on-${i.id}`)} type="checkbox" checked={on} disabled={excluded} onChange={() => toggleItem(i.id)} />
                    {i.label}
                  </label>
                  <div className={styles.inputWrap} style={{ maxWidth: 150 }}>
                    <input
                      id={id(`rate-${i.id}`)}
                      aria-label={`${i.label} price ${i.kind === 'area' ? `per ${AREA}` : 'per bathroom'}`}
                      className={styles.input}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={rates[i.id] ?? ''}
                      disabled={!on}
                      onChange={(e) => setRates((prev) => ({ ...prev, [i.id]: e.target.value }))}
                    />
                    <span className={styles.suffix}>{i.kind === 'area' ? `${sym}/${AREA}` : sym}</span>
                  </div>
                </div>
              );
            })}
            <p className={styles.help}>{scope === 'cosmetic' ? 'Plumbing and drywall are greyed out in a cosmetic refresh.' : 'Untick anything you are keeping or doing yourself.'} Floor-area items are priced per {AREA} of floor.</p>
          </div>

          <div className={styles.card}>
            {head('Extras & buffer')}
            <div className={styles.toggleRow}>
              <label className={`${styles.check} ${waterHeater ? styles.checkOn : ''}`} htmlFor={id('wh')}>
                <input id={id('wh')} type="checkbox" checked={waterHeater} onChange={(e) => setWaterHeater(e.target.checked)} />
                Water heater upgrade
              </label>
            </div>
            <div className={styles.fields}>
              {waterHeater && input('whp', 'Water heater, installed', whPrice, setWhPrice, sym)}
              {input('permit', 'Permit', permit, setPermit, sym, 'Ask your building department.')}
              {input('region', 'Region factor', region, setRegion, '×', '1 = US average; 1.2 for high-cost cities.')}
              {input('ct', 'Contingency', contingency, setContingency, '%', 'This Old House suggests 20%.')}
            </div>
          </div>

          <div className={styles.card}>
            {head('Check a quote (optional)')}
            <div className={styles.fields}>{input('quote', 'Contractor’s quote', quote, setQuote, sym)}</div>
            {quoteCheck !== 'n/a' && (
              <p className={styles.help} role="status">
                {quoteCheck === 'within'
                  ? `Within the estimate range (${money(res.low)}–${money(res.high)}).`
                  : quoteCheck === 'low'
                    ? `Below the range (${money(res.low)}–${money(res.high)}) — check what is left out.`
                    : `Above the range (${money(res.low)}–${money(res.high)}) — ask for an itemised quote and compare it with the lines here.`}
              </p>
            )}
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{money(res.total)}</strong> · budget {money(res.budget)}
            </span>
            <a href="#bathroom-results" className={styles.mobileBarLink} tabIndex={-1}>
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div className={styles.results} id="bathroom-results" aria-live="polite">
          <div className={styles.hero}>
            <div className={styles.heroLabel}>Estimated remodel cost</div>
            <div className={styles.heroValue}>{money(res.total)}</div>
            <div className={styles.heroSub}>
              range {money(res.low)}–{money(res.high)} · {perArea(res.perSqFt)} · budget with {fmt(num(contingency), 0)}% buffer {money(res.budget)}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Where the money goes</h3>
            <SpendBar segments={segments} format={(n) => money(n)} />
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Line by line</h3>
            {res.lines.map((l) => {
              const item = ITEMS.find((i) => i.id === l.id);
              const detail = item?.kind === 'area' ? `${areaOut(floorSqFt)} × ${perArea(num(rates[l.id]) / (M ? SQFT_PER_M2 : 1))}` : 'installed';
              return (
                <div className={styles.matRow} key={l.id}>
                  <span>
                    <span className={styles.matName}>{l.label}</span>
                    <span className={styles.matSub}>{detail}</span>
                  </span>
                  <span className={styles.matValue}>{money(l.amount)}</span>
                </div>
              );
            })}
            {res.regionAdj !== 0 && (
              <div className={styles.row}>
                <span>Region factor × {fmt(num(region), 2)}</span>
                <strong>{money(res.regionAdj)}</strong>
              </div>
            )}
            {res.permit > 0 && (
              <div className={styles.row}>
                <span>Permit</span>
                <strong>{money(res.permit)}</strong>
              </div>
            )}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Estimate</span>
              <strong>{money(res.total)}</strong>
            </div>
            <div className={styles.row}>
              <span>+ {fmt(num(contingency), 0)}% contingency</span>
              <strong>{money(res.contingency)}</strong>
            </div>
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Budget</span>
              <strong>{money(res.budget)}</strong>
            </div>
          </div>

          <figure className={styles.panel} style={{ margin: 0 }}>
            <BathroomPlan bathing={scope === 'full' ? bathing : type === 'half' ? 'none' : 'combo'} lengthLabel={`${fmt(num(len), 2)} ${L}`} widthLabel={`${fmt(num(wid), 2)} ${L}`} ratio={num(wid) > 0 ? num(len) / num(wid) : 1} />
            <figcaption className={styles.note}>Plan view: {areaOut(floorSqFt)} of floor — flooring, tile, paint and drywall are priced from this area.</figcaption>
          </figure>

          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={() => copyText(summary(), 'Estimate copied.')}>
              Copy estimate
            </button>
            <button type="button" className={styles.actionBtn} onClick={share}>
              Copy share link
            </button>
            <button type="button" className={styles.actionBtn} onClick={() => window.print()}>
              Print
            </button>
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
          )}
          <p className={styles.note}>Default prices are This Old House’s 2026 national averages (July 2026), scaled for finish level and room size. Use real quotes for your budget.</p>
        </div>
      </div>
    </div>
  );
}
