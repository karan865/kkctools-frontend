"use client";

import React, { useEffect, useId, useState } from "react";
import styles from "./FloorRefinishingCalculator.module.css";
import { BoardSection, OptionBars, RoomsPlan, type Bar } from "./FloorDiagram";
import {
  DEFAULT_COATS,
  DIY_DEFAULTS,
  EXTRAS,
  EXTRA_ORDER,
  FINISHES,
  FINISH_COVERAGE,
  METHODS,
  METHOD_ORDER,
  REPLACE,
  SPECIES,
  SQFT_PER_M2,
  STAIN,
  calculateDiy,
  calculateRefinish,
  checkQuote,
  replaceCost,
  speciesFactor,
  type DiyPrices,
  type ExtraId,
  type FinishType,
  type Method,
  type RefinishInput,
  type Species,
} from "@/lib/floor-refinish-engine";

type Units = "us" | "metric";
const M_PER_FT = 0.3048;
const L_PER_GAL = 3.785411784;
const CURRENCIES = [
  { id: "USD", sym: "$", label: "US $" },
  { id: "GBP", sym: "£", label: "£" },
  { id: "EUR", sym: "€", label: "€" },
  { id: "CAD", sym: "C$", label: "C$" },
  { id: "AUD", sym: "A$", label: "A$" },
  { id: "NZD", sym: "NZ$", label: "NZ$" },
  { id: "INR", sym: "₹", label: "₹" },
];

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, max = 2, min = 0) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    maximumFractionDigits: max,
    minimumFractionDigits: min,
  });
const r2 = (n: number) => `${Math.round(n * 100) / 100}`;

/** Default quantities when an extra is first ticked (sq ft extras in ft², converted for metric). */
const EXTRA_QTY: Record<ExtraId, number> = {
  repair: 20,
  boards: 10,
  subfloor: 20,
  carpet: 100,
  stairs: 12,
  furniture: 1,
  baseboard: 1,
};
const isArea = (k: ExtraId) => EXTRAS[k].unit === "sqft";
const UNIT_WORD: Record<string, string> = { step: "steps", room: "rooms" };

interface Room {
  id: number;
  l: string;
  w: string;
}
let roomSeq = 10;

type DiyStrings = Record<keyof DiyPrices, string>;
const diyStrings = (): DiyStrings =>
  Object.fromEntries(
    Object.entries(DIY_DEFAULTS).map(([k, v]) => [k, r2(v)]),
  ) as DiyStrings;

interface Shared {
  u: Units;
  c: string;
  am: "rooms" | "area";
  rm: [string, string][];
  a: string;
  m: Method;
  sp: Species;
  mr: string;
  st: boolean;
  sr: string;
  on: ExtraId[];
  q: Partial<Record<ExtraId, string>>;
  er: Partial<Record<ExtraId, string>>;
  rg: string;
  mn: string;
  ft: FinishType;
  co: string;
  dy: string;
  vc: boolean;
  dp: DiyStrings;
}
const encode = (s: Shared) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(s))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
function decode(raw: string): Shared | null {
  try {
    const s = JSON.parse(
      decodeURIComponent(
        escape(atob(raw.replace(/-/g, "+").replace(/_/g, "/"))),
      ),
    ) as Shared;
    return s && s.m in METHODS && s.sp in SPECIES && Array.isArray(s.rm)
      ? s
      : null;
  } catch {
    return null;
  }
}

export default function FloorRefinishingCalculator() {
  const [units, setUnits] = useState<Units>("us");
  const [currency, setCurrency] = useState("USD");
  const [areaMode, setAreaMode] = useState<"rooms" | "area">("rooms");
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, l: "20", w: "15" },
    { id: 2, l: "12", w: "12" },
  ]);
  const [area, setArea] = useState("444");
  const [method, setMethod] = useState<Method>("sand");
  const [species, setSpecies] = useState<Species>("oak");
  const [methodRate, setMethodRate] = useState(r2(METHODS.sand.rate));
  const [stain, setStain] = useState(false);
  const [stainRate, setStainRate] = useState(r2(STAIN.rate));
  const [on, setOn] = useState<ExtraId[]>([]);
  const [qty, setQty] = useState<Partial<Record<ExtraId, string>>>({});
  const [extraRates, setExtraRates] = useState<
    Partial<Record<ExtraId, string>>
  >(Object.fromEntries(EXTRA_ORDER.map((k) => [k, r2(EXTRAS[k].rate)])));
  const [region, setRegion] = useState("1");
  const [minimum, setMinimum] = useState("0");
  const [finishType, setFinishType] = useState<FinishType>("water");
  const [coats, setCoats] = useState(`${DEFAULT_COATS}`);
  const [days, setDays] = useState("1");
  const [vacuum, setVacuum] = useState(false);
  const [diy, setDiy] = useState<DiyStrings>(diyStrings());
  const [quote, setQuote] = useState("");
  const [diyOpen, setDiyOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("f");
    if (!raw) return;
    const s = decode(raw);
    if (!s) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setUnits(s.u === "metric" ? "metric" : "us");
    if (CURRENCIES.some((c) => c.id === s.c)) setCurrency(s.c);
    setAreaMode(s.am === "area" ? "area" : "rooms");
    if (s.rm.length)
      setRooms(s.rm.slice(0, 20).map(([l, w]) => ({ id: roomSeq++, l, w })));
    setArea(s.a);
    setMethod(s.m);
    setSpecies(s.sp);
    setMethodRate(s.mr);
    setStain(Boolean(s.st));
    setStainRate(s.sr);
    setOn(Array.isArray(s.on) ? s.on.filter((k) => k in EXTRAS) : []);
    setQty(s.q ?? {});
    setExtraRates((prev) => ({ ...prev, ...(s.er ?? {}) }));
    setRegion(s.rg);
    setMinimum(s.mn);
    if (s.ft in FINISHES) setFinishType(s.ft);
    setCoats(s.co);
    setDays(s.dy);
    setVacuum(Boolean(s.vc));
    if (s.dp) setDiy((prev) => ({ ...prev, ...s.dp }));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const M = units === "metric";
  const sym = CURRENCIES.find((c) => c.id === currency)?.sym ?? "$";
  const money = (n: number) =>
    `${sym}${fmt(n, Math.abs(n) >= 1000 ? 0 : 2, Math.abs(n) >= 1000 ? 0 : 2)}`;
  const L = M ? "m" : "ft";
  const AREA = M ? "m²" : "ft²";
  const toSqFt = (v: number) => (M ? v * SQFT_PER_M2 : v); // area input → ft²
  const rateToSqFt = (v: number) => (M ? v / SQFT_PER_M2 : v); // $/area input → $/ft²
  const roomAreasFt2 = rooms.map((r) => toSqFt(num(r.l) * num(r.w)));
  const areaSqFt =
    areaMode === "rooms"
      ? roomAreasFt2.reduce((a, b) => a + b, 0)
      : toSqFt(num(area));
  const roomCount =
    areaMode === "rooms"
      ? Math.max(roomAreasFt2.filter((a) => a > 0).length, 1)
      : 1;
  const areaOut = (ft2: number) =>
    M ? `${fmt(ft2 / SQFT_PER_M2, 1)} m²` : `${fmt(ft2, 0)} ft²`;
  const perArea = (pSqFt: number) =>
    M ? `${money(pSqFt * SQFT_PER_M2)}/m²` : `${money(pSqFt)}/ft²`;
  const rangeArea = (lo: number, hi: number) =>
    M
      ? `${money(lo * SQFT_PER_M2)}–${money(hi * SQFT_PER_M2)}/m²`
      : `${money(lo)}–${money(hi)}/ft²`;
  const m = METHODS[method];

  const input: RefinishInput = {
    areaSqFt,
    rooms: roomCount,
    method,
    species,
    methodRate: rateToSqFt(num(methodRate)),
    stain,
    stainRate: rateToSqFt(num(stainRate)),
    qty: Object.fromEntries(
      on.map((k) => [
        k,
        isArea(k)
          ? toSqFt(num(qty[k] ?? ""))
          : k === "baseboard"
            ? 1
            : num(qty[k] ?? ""),
      ]),
    ),
    rates: Object.fromEntries(
      EXTRA_ORDER.map((k) => [
        k,
        isArea(k)
          ? rateToSqFt(num(extraRates[k] ?? ""))
          : num(extraRates[k] ?? ""),
      ]),
    ),
    regionFactor: num(region) || 1,
    minimumCharge: num(minimum),
  };
  const res = calculateRefinish(input);
  const coverageFt2 = FINISH_COVERAGE;
  const diyRes = calculateDiy({
    areaSqFt,
    method,
    stain,
    coats: num(coats),
    stainCoats: 1,
    days: num(days),
    buyVacuum: vacuum,
    prices: Object.fromEntries(
      Object.entries(diy).map(([k, v]) => [k, num(v)]),
    ) as unknown as DiyPrices,
    finishCoverage: coverageFt2,
    stainCoverage: coverageFt2,
  });
  const replace = replaceCost(areaSqFt);
  const replaceTotal = replace.total * (num(region) || 1);
  const quoteCheck = checkQuote(num(quote), res);
  const engineered = species === "engineered";

  // the same floor and extras under every method (default rate for the other methods, your rate for the chosen one)
  const byMethod = (mm: Method, withStain: boolean) =>
    calculateRefinish({
      ...input,
      method: mm,
      stain: withStain,
      methodRate: mm === method ? input.methodRate : METHODS[mm].rate,
    }).total;
  const bars: Bar[] = [
    {
      label: METHODS.recoat.label,
      amount: byMethod("recoat", false),
      tone: "recoat",
      active: method === "recoat",
      sub: "same colour",
    },
    {
      label: METHODS.sand.label,
      amount: byMethod("sand", false),
      tone: "sand",
      active: method === "sand" && !stain,
      sub: "natural colour",
    },
    {
      label: "Full sand + stain",
      amount: byMethod("sand", true),
      tone: "sand",
      active: method === "sand" && stain,
      sub: "new colour",
    },
    {
      label: METHODS.dustless.label,
      amount: byMethod("dustless", stain),
      tone: "dustless",
      active: method === "dustless",
      sub: stain ? "with stain" : "natural colour",
    },
    {
      label: "Do it yourself",
      amount: diyRes.total,
      tone: "diy",
      sub: method === "recoat" ? "buffer + finish" : "rentals + materials",
    },
    {
      label: "Replace with new hardwood",
      amount: replaceTotal,
      tone: "replace",
      sub: `${perArea(REPLACE.rate)} installed`,
    },
  ];

  // ---------- actions ----------
  const pickMethod = (next: Method) => {
    setMethod(next);
    setMethodRate(r2(METHODS[next].rate * (M ? SQFT_PER_M2 : 1)));
  };
  const switchUnits = (next: Units) => {
    if (next === units) return;
    const lf = next === "metric" ? M_PER_FT : 1 / M_PER_FT;
    const af = next === "metric" ? 1 / SQFT_PER_M2 : SQFT_PER_M2; // area values
    const rf = 1 / af; // $/area values
    setRooms((prev) =>
      prev.map((r) => ({ ...r, l: r2(num(r.l) * lf), w: r2(num(r.w) * lf) })),
    );
    setArea(r2(num(area) * af));
    setMethodRate(r2(num(methodRate) * rf));
    setStainRate(r2(num(stainRate) * rf));
    setQty((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [
          k,
          isArea(k as ExtraId) ? r2(num(v ?? "") * af) : v,
        ]),
      ),
    );
    setExtraRates((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [
          k,
          isArea(k as ExtraId) ? r2(num(v ?? "") * rf) : v,
        ]),
      ),
    );
    setUnits(next);
  };
  const toggleExtra = (k: ExtraId) => {
    setOn((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );
    if (qty[k] === undefined) {
      const q = k === "furniture" ? roomCount : EXTRA_QTY[k];
      setQty((prev) => ({
        ...prev,
        [k]: isArea(k) && M ? r2(q / SQFT_PER_M2) : `${q}`,
      }));
    }
  };
  const updateRoom = (rid: number, k: "l" | "w", v: string) =>
    setRooms((prev) => prev.map((r) => (r.id === rid ? { ...r, [k]: v } : r)));
  const addRoom = () =>
    setRooms((prev) => [
      ...prev,
      { id: roomSeq++, l: M ? "3" : "12", w: M ? "3" : "10" },
    ]);
  const removeRoom = (rid: number) =>
    setRooms((prev) => prev.filter((r) => r.id !== rid));
  const pickFinish = (f: FinishType) => {
    setFinishType(f);
    setDiy((prev) => ({ ...prev, finishPerGallon: r2(FINISHES[f].price) }));
  };
  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 2500);
  };
  const copyText = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(ok);
    } catch {
      flash("Copy is blocked in this browser — select and copy manually.");
    }
  };
  const summary = () =>
    [
      `Hardwood floor refinishing estimate (KKC Tools) — ${areaOut(areaSqFt)}, ${m.label.toLowerCase()}, ${SPECIES[species].label.toLowerCase()}${stain && m.stainable ? ", stained" : ""}`,
      ...res.lines.map((l) => `${l.label}: ${money(l.amount)}`),
      res.regionAdj ? `Region adjustment: ${money(res.regionAdj)}` : "",
      res.minimumTopUp
        ? `Minimum charge top-up: ${money(res.minimumTopUp)}`
        : "",
      `Professional estimate: ${money(res.total)} (range ${money(res.low)}–${money(res.high)}, ${perArea(res.perSqFt)})`,
      `DIY: ${money(diyRes.total)} · Replace with new hardwood: ${money(replaceTotal)}`,
    ]
      .filter(Boolean)
      .join("\n");
  const share = () => {
    const s: Shared = {
      u: units,
      c: currency,
      am: areaMode,
      rm: rooms.map((r) => [r.l, r.w]),
      a: area,
      m: method,
      sp: species,
      mr: methodRate,
      st: stain,
      sr: stainRate,
      on,
      q: qty,
      er: extraRates,
      rg: region,
      mn: minimum,
      ft: finishType,
      co: coats,
      dy: days,
      vc: vacuum,
      dp: diy,
    };
    const url = `${window.location.origin}${window.location.pathname}?f=${encode(s)}`;
    window.history.replaceState(null, "", url);
    copyText(url, "Share link copied.");
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
  const field = (
    k: string,
    label: string,
    value: string,
    set: (s: string) => void,
    suffix?: string,
    help?: string,
  ) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id(k)}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id(k)}
          className={styles.input}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={value}
          onChange={(e) => set(e.target.value)}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {help && <p className={styles.help}>{help}</p>}
    </div>
  );
  const check = (
    checked: boolean,
    set: (v: boolean) => void,
    label: string,
    k: string,
  ) => (
    <label
      className={`${styles.check} ${checked ? styles.checkOn : ""}`}
      htmlFor={id(k)}
    >
      <input
        id={id(k)}
        type="checkbox"
        checked={checked}
        onChange={(e) => set(e.target.checked)}
      />
      {label}
    </label>
  );
  const diyField = (k: keyof DiyPrices, label: string, suffix: string) =>
    field(
      `diy-${k}`,
      label,
      diy[k],
      (v) => setDiy((prev) => ({ ...prev, [k]: v })),
      suffix,
    );
  const unitSuffix = (k: ExtraId) =>
    isArea(k) ? AREA : (UNIT_WORD[EXTRAS[k].unit] ?? "");
  const rateSuffix = (k: ExtraId) =>
    isArea(k)
      ? `${sym}/${AREA}`
      : EXTRAS[k].unit === "job"
        ? sym
        : `${sym}/${EXTRAS[k].unit}`;
  const gal = (g: number) =>
    M ? `${g} gal (${fmt(g * L_PER_GAL, 1)} L)` : `${g} gal`;

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.inputs}>
          {/* 1. floor */}
          <div className={styles.card}>
            {head("Floor area", areaOut(areaSqFt))}
            <div
              className={styles.segment}
              role="group"
              aria-label="How to enter the area"
            >
              <button
                type="button"
                aria-pressed={areaMode === "rooms"}
                className={`${styles.segBtn} ${areaMode === "rooms" ? styles.segActive : ""}`}
                onClick={() => setAreaMode("rooms")}
              >
                Room by room
              </button>
              <button
                type="button"
                aria-pressed={areaMode === "area"}
                className={`${styles.segBtn} ${areaMode === "area" ? styles.segActive : ""}`}
                onClick={() => setAreaMode("area")}
              >
                Total area
              </button>
            </div>
            {areaMode === "rooms" ? (
              <>
                {rooms.map((r, i) => (
                  <div
                    key={r.id}
                    className={styles.openings}
                    style={{ marginTop: 10 }}
                  >
                    <div
                      className={styles.cardHead}
                      style={{ marginBottom: 8, paddingBottom: 6 }}
                    >
                      <p
                        className={styles.subhead}
                        style={{ margin: 0, flex: 1 }}
                      >
                        Room {i + 1}{" "}
                        <span className={styles.titleSub}>
                          · {areaOut(roomAreasFt2[i] ?? 0)}
                        </span>
                      </p>
                      {rooms.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeRoom(r.id)}
                          aria-label={`Remove room ${i + 1}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className={styles.fields}>
                      {field(
                        `r${r.id}l`,
                        "Length",
                        r.l,
                        (v) => updateRoom(r.id, "l", v),
                        L,
                      )}
                      {field(
                        `r${r.id}w`,
                        "Width",
                        r.w,
                        (v) => updateRoom(r.id, "w", v),
                        L,
                      )}
                    </div>
                  </div>
                ))}
                <div className={styles.toggleRow} style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={addRoom}
                  >
                    + Add a room or hallway
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.fields} style={{ marginTop: 12 }}>
                {field(
                  "area",
                  "Floor area",
                  area,
                  setArea,
                  AREA,
                  "Measured wall to wall; include closets you want done.",
                )}
              </div>
            )}
            <div
              className={styles.segment}
              role="group"
              aria-label="Units"
              style={{ marginTop: 12 }}
            >
              <button
                type="button"
                aria-pressed={!M}
                className={`${styles.segBtn} ${!M ? styles.segActive : ""}`}
                onClick={() => switchUnits("us")}
              >
                Feet
              </button>
              <button
                type="button"
                aria-pressed={M}
                className={`${styles.segBtn} ${M ? styles.segActive : ""}`}
                onClick={() => switchUnits("metric")}
              >
                Metres
              </button>
            </div>
            <div className={styles.field} style={{ marginTop: 12 }}>
              <label className={styles.label} htmlFor={id("cur")}>
                Currency
              </label>
              <select
                id={id("cur")}
                className={styles.input}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.id})
                  </option>
                ))}
              </select>
              {currency !== "USD" && (
                <p className={styles.help}>
                  Default prices are US national averages — replace them with
                  local prices; the currency only changes the symbol.
                </p>
              )}
            </div>
          </div>

          {/* 2. method & wood */}
          <div className={styles.card}>
            {head(
              "Method & wood",
              `${m.short} · ${SPECIES[species].label.toLowerCase()}`,
            )}
            <div
              className={styles.kindGrid}
              style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
              role="group"
              aria-label="Refinishing method"
            >
              {METHOD_ORDER.map((mm) => (
                <button
                  key={mm}
                  type="button"
                  aria-pressed={method === mm}
                  className={`${styles.kindBtn} ${method === mm ? styles.kindActive : ""}`}
                  onClick={() => pickMethod(mm)}
                >
                  {METHODS[mm].label}
                  <span className={styles.kindSub}>
                    {rangeArea(METHODS[mm].low, METHODS[mm].high)}
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.help}>
              {method === "recoat"
                ? "Light abrasion of the old finish plus fresh coats — for dull, lightly scratched floors with the finish still intact. Colour stays the same."
                : method === "sand"
                  ? "Sanded to bare wood, then optional stain and new finish — removes deep scratches, worn traffic lanes and old colour."
                  : "The same full sand, with sanders connected to dust-collection vacuums — costs more, much less dust in the house."}
            </p>
            <div className={styles.fields} style={{ marginTop: 12 }}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={id("species")}>
                  Wood
                </label>
                <select
                  id={id("species")}
                  className={styles.input}
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as Species)}
                >
                  {(Object.keys(SPECIES) as Species[]).map((k) => (
                    <option key={k} value={k}>
                      {SPECIES[k].label}
                      {SPECIES[k].factor !== 1
                        ? ` (×${SPECIES[k].factor})`
                        : ""}
                    </option>
                  ))}
                </select>
                <p className={styles.help}>
                  {m.removesWood
                    ? SPECIES[species].factor !== 1
                      ? `Sanding ${SPECIES[species].label.toLowerCase()} is priced ×${SPECIES[species].factor} vs oak.`
                      : "Priced like oak."
                    : "Species does not change a recoat price."}
                </p>
              </div>
              {field(
                "mrate",
                `${m.label} rate`,
                methodRate,
                setMethodRate,
                `${sym}/${AREA}`,
                speciesFactor(method, species) !== 1
                  ? `× ${speciesFactor(method, species)} species = ${perArea(res.effectiveRate)}`
                  : "Default: midpoint of This Old House’s range.",
              )}
            </div>
            <div
              className={styles.toggleRow}
              style={{ marginTop: 12, marginBottom: 0 }}
            >
              {check(stain, setStain, "Change the colour (stain)", "stain")}
            </div>
            {stain && m.stainable && (
              <div className={styles.fields} style={{ marginTop: 8 }}>
                {field(
                  "srate",
                  "Staining",
                  stainRate,
                  setStainRate,
                  `${sym}/${AREA}`,
                  `Range ${rangeArea(STAIN.low, STAIN.high)}.`,
                )}
              </div>
            )}
            {stain && !m.stainable && (
              <p className={styles.warn}>
                Stain needs bare wood, so a colour change means a full sand —
                switch the method to see that price.
              </p>
            )}
            {engineered && m.removesWood && (
              <p className={styles.warn}>
                Engineered floors have a thin hardwood wear layer; This Old
                House notes most can be sanded only once or twice. Check the
                wear layer (pull a floor vent) before booking a full sand — a
                screen & recoat removes no wood.
              </p>
            )}
          </div>

          {/* 3. repairs & extras */}
          <div className={styles.card}>
            {head(
              "Repairs & extras",
              on.length ? `${on.length} added` : "none",
            )}
            <div className={styles.extraList}>
              {EXTRA_ORDER.map((k) => {
                const e = EXTRAS[k];
                const active = on.includes(k);
                return (
                  <div key={k} className={styles.extraBox}>
                    <label
                      className={`${styles.check} ${active ? styles.checkOn : ""}`}
                      htmlFor={id(`x-${k}`)}
                    >
                      <input
                        id={id(`x-${k}`)}
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleExtra(k)}
                      />
                      {e.label}
                    </label>
                    {active && (
                      <div className={styles.fields}>
                        {e.unit !== "job" &&
                          field(
                            `xq-${k}`,
                            isArea(k)
                              ? "Area"
                              : e.unit === "step"
                                ? "Steps"
                                : "Rooms",
                            qty[k] ?? "",
                            (v) => setQty((prev) => ({ ...prev, [k]: v })),
                            unitSuffix(k),
                          )}
                        {field(
                          `xr-${k}`,
                          "Price",
                          extraRates[k] ?? "",
                          (v) => setExtraRates((prev) => ({ ...prev, [k]: v })),
                          rateSuffix(k),
                          e.low === e.high
                            ? `About ${money(e.rate)} (${e.source === "Fixr" ? "Fixr" : "This Old House"}).`
                            : `Range ${isArea(k) ? rangeArea(e.low, e.high) : `${money(e.low)}–${money(e.high)}`}.`,
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. adjustments */}
          <div className={styles.card}>
            {head("Price adjustments")}
            <div className={styles.fields}>
              {field(
                "region",
                "Region factor",
                region,
                setRegion,
                "×",
                "1 = US average; 1.2 for high-cost cities.",
              )}
              {field(
                "min",
                "Minimum job charge",
                minimum,
                setMinimum,
                sym,
                "Many contractors have one for small jobs — ask.",
              )}
            </div>
          </div>

          {/* 5. DIY */}
          <div className={styles.card}>
            {head("If you do it yourself", money(diyRes.total))}
            <div className={styles.pills} role="group" aria-label="Finish type">
              {(Object.keys(FINISHES) as FinishType[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={finishType === f}
                  className={`${styles.pill} ${finishType === f ? styles.pillActive : ""}`}
                  onClick={() => pickFinish(f)}
                >
                  {FINISHES[f].label}
                </button>
              ))}
            </div>
            <div className={styles.fields} style={{ marginTop: 12 }}>
              {field(
                "coats",
                "Coats of finish",
                coats,
                setCoats,
                "coats",
                "Follow the label of your finish.",
              )}
              {field(
                "days",
                "Rental days",
                days,
                setDays,
                "days",
                "Machines are rented by the day.",
              )}
            </div>
            <div
              className={styles.toggleRow}
              style={{ marginTop: 12, marginBottom: 0 }}
            >
              {check(vacuum, setVacuum, "Buy a shop vacuum", "vac")}
            </div>
            <details
              className={styles.details}
              onToggle={(e) =>
                setDiyOpen((e.currentTarget as HTMLDetailsElement).open)
              }
            >
              <summary>Edit DIY prices</summary>
              {diyOpen && (
                <div className={styles.fields}>
                  {method === "recoat"
                    ? diyField(
                        "bufferPerDay",
                        "Floor buffer rental",
                        `${sym}/day`,
                      )
                    : diyField(
                        "sanderPerDay",
                        "Drum sander rental",
                        `${sym}/day`,
                      )}
                  {method !== "recoat" &&
                    diyField("edgerPerDay", "Edger rental", `${sym}/day`)}
                  {diyField(
                    "sandpaper",
                    method === "recoat" ? "Screening pads" : "Sandpaper",
                    sym,
                  )}
                  {diyField("finishPerGallon", "Finish", `${sym}/gal`)}
                  {stain &&
                    method !== "recoat" &&
                    diyField("stainPerGallon", "Stain", `${sym}/gal`)}
                  {diyField("rollers", "Applicators & rollers", sym)}
                  {diyField("safety", "Respirator, goggles, knee pads", sym)}
                  {diyField("sheeting", "Plastic sheeting", sym)}
                  {diyField("tape", "Tape", sym)}
                  {vacuum && diyField("vacuum", "Shop vacuum", sym)}
                </div>
              )}
              <p className={styles.help}>
                Defaults are midpoints of This Old House’s DIY price list.{" "}
                {method === "recoat"
                  ? "It gives no buffer rate, so the buffer is priced like a drum sander — check your rental shop."
                  : ""}
              </p>
            </details>
          </div>

          {/* 6. quote */}
          <div className={styles.card}>
            {head("Check a quote (optional)")}
            <div className={styles.fields}>
              {field("quote", "Contractor’s quote", quote, setQuote, sym)}
            </div>
            {quoteCheck !== "n/a" && (
              <p className={styles.help} role="status">
                {quoteCheck === "within"
                  ? `Within the estimate range (${money(res.low)}–${money(res.high)}).`
                  : quoteCheck === "low"
                    ? `Below the range (${money(res.low)}–${money(res.high)}) — check the number of coats, whether stain and edging are included, and who moves the furniture.`
                    : `Above the range (${money(res.low)}–${money(res.high)}) — ask for the price per ${AREA} and a list of repairs, and compare with the lines here.`}
              </p>
            )}
          </div>

          <div className={styles.mobileBar} aria-hidden="true">
            <span>
              <strong>{money(res.total)}</strong> · {perArea(res.perSqFt)}
            </span>
            <a
              href="#refinish-results"
              className={styles.mobileBarLink}
              tabIndex={-1}
            >
              Results ↓
            </a>
          </div>
        </div>

        {/* ---------- results ---------- */}
        <div
          className={styles.results}
          id="refinish-results"
          aria-live="polite"
        >
          <div className={styles.hero}>
            <div className={styles.heroLabel}>
              Professional refinishing estimate
            </div>
            <div className={styles.heroValue}>{money(res.total)}</div>
            <div className={styles.heroSub}>
              {res.minimumTopUp > 0 && res.low === res.high
                ? "minimum job charge applies"
                : `range ${money(res.low)}–${money(res.high)}`}{" "}
              · {perArea(res.perSqFt)} · {areaOut(areaSqFt)}
              {res.labourHours > 0 && method !== "recoat"
                ? ` · about ${fmt(res.labourHours, 0)} labour hours`
                : ""}
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Line by line</h3>
            {res.lines.length === 0 && (
              <p className={styles.note}>
                Enter the floor area to see an estimate.
              </p>
            )}
            {res.lines.map((l) => (
              <div className={styles.matRow} key={l.id}>
                <span>
                  <span className={styles.matName}>{l.label}</span>
                  <span className={styles.matSub}>
                    {l.unit === "sqft"
                      ? `${areaOut(l.qty)} × ${perArea(l.rate)}`
                      : l.unit === "job"
                        ? "per job"
                        : `${fmt(l.qty, 0)} ${l.unit}${l.qty === 1 ? "" : "s"} × ${money(l.rate)}`}
                  </span>
                </span>
                <span className={styles.matValue}>{money(l.amount)}</span>
              </div>
            ))}
            {res.regionAdj !== 0 && (
              <div className={styles.row}>
                <span>Region factor × {fmt(num(region), 2)}</span>
                <strong>{money(res.regionAdj)}</strong>
              </div>
            )}
            {res.minimumTopUp > 0 && (
              <div className={styles.row}>
                <span>Up to the minimum charge</span>
                <strong>{money(res.minimumTopUp)}</strong>
              </div>
            )}
            <div className={`${styles.row} ${styles.rowTotal}`}>
              <span>Estimate</span>
              <strong>{money(res.total)}</strong>
            </div>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Your options for this floor</h3>
            <OptionBars bars={bars} format={(v) => `${sym}${fmt(v, 0)}`} />
            <p className={styles.note}>
              Same area and extras for every pro method. Replacing is{" "}
              {rangeArea(REPLACE.low, REPLACE.high)} installed (This Old House)
              — refinishing usually costs much less while the boards are sound.
            </p>
          </div>

          <figure className={styles.panel} style={{ margin: 0 }}>
            <BoardSection
              method={method}
              engineered={engineered}
              stained={stain && m.stainable}
              idPrefix="frc"
            />
            <figcaption className={styles.note}>
              {method === "recoat"
                ? "A screen & recoat only roughens the old finish so new coats bond — no wood is removed."
                : `A full sand cuts through every coat into fresh wood${engineered ? ", which an engineered floor’s thin wear layer can take only once or twice" : ""}.`}
            </figcaption>
          </figure>

          {areaMode === "rooms" && (
            <figure className={styles.panel} style={{ margin: 0 }}>
              <RoomsPlan
                rooms={rooms.map((r, i) => ({
                  l: num(r.l),
                  w: num(r.w),
                  area: areaOut(roomAreasFt2[i] ?? 0),
                }))}
                unit={L}
                areaLabel={`Total ${areaOut(areaSqFt)}`}
                steps={
                  on.includes("stairs") ? Math.floor(num(qty.stairs ?? "")) : 0
                }
                idPrefix="frc"
              />
              <figcaption className={styles.note}>
                Rooms drawn to scale with each other
                {on.includes("stairs")
                  ? ", plus the staircase priced per step"
                  : ""}
                .
              </figcaption>
            </figure>
          )}

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              DIY shopping list · {money(diyRes.total)}
            </h3>
            {diyRes.lines.map((l) => (
              <div className={styles.matRow} key={l.id}>
                <span>
                  <span className={styles.matName}>{l.label}</span>
                  <span className={styles.matSub}>
                    {l.id === "finish"
                      ? `${gal(diyRes.finishGallons)} · ${num(coats)} coat${num(coats) === 1 ? "" : "s"} at ${M ? `${fmt(FINISH_COVERAGE / SQFT_PER_M2, 0)} m²` : `${FINISH_COVERAGE} ft²`}/gal`
                      : l.id === "stain"
                        ? gal(diyRes.stainGallons)
                        : l.detail}
                  </span>
                </span>
                <span className={styles.matValue}>{money(l.amount)}</span>
              </div>
            ))}
            {res.total > 0 && diyRes.total > 0 && (
              <p className={styles.note}>
                DIY saves about {money(Math.max(res.total - diyRes.total, 0))}{" "}
                against the pro estimate — in exchange for your time and the
                risk of sander marks
                {method === "recoat"
                  ? ""
                  : "; a drum sander left still for a moment can gouge the floor"}
                .
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => copyText(summary(), "Estimate copied.")}
            >
              Copy estimate
            </button>
            <button type="button" className={styles.actionBtn} onClick={share}>
              Copy share link
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
          )}
          <p className={styles.note}>
            Default prices are midpoints of This Old House’s June 2026 ranges
            (stairs, board replacement and baseboards from Fixr). Use real
            quotes for your budget.
          </p>
        </div>
      </div>
    </div>
  );
}
