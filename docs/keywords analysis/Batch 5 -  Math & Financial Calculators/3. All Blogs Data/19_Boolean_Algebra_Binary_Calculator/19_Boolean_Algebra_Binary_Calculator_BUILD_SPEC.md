# Boolean Algebra & Binary Calculator — Build Spec

> **URL:** `/boolean-algebra-calculator/` · Batch 5 · Tier 3 · rank chance 🟡 · **Build order 19**
> **Read first:** `../00_BATCH5_BUILD_RULES.md`
> **Inputs used:** `19_Boolean_Algebra_Binary_Calculator_Competitor_Analysis.md` (5 pages read, 2026-11-14), keyword file §2 #19
> **SERP:** provisional
> **Written:** 2026-11-22 (full rewrite after the research pass)

---

## 0. Strategy

**Search demand:** ~3,500 searches at KD 10–11.

| Keyword | Volume | Trend |
|---|---:|---|
| `boolean algebra calculator` | 1,600 | declining |
| `boolean calculator` | 1,000 | declining |
| `binary math calculator` | 880 | — |

**Build after Tier 1 and Tier 2.**

**The SERP is unusually spammy.** Keyword-stuffed pages sit on hijacked domains (a university survey subdomain, an alumni site, analytics subdomains). The genuine tools are:

| Tool | Strength | Weakness |
|---|---|---|
| dCode | best minimal forms | no truth table, no steps, XOR syntax never shown |
| eMathHelp | law-by-law steps | no syntax guide |
| Calculators.sg | truth table + K-map ≤ 4 vars | no example; FAQ overclaims "can simplify any" |

A clean, correct, documented page can stand out.

**Binary maths** is served by separate sites:
- Calculator.net: its addition example looks wrong (34 vs 36).
- RapidTables: "^" means both exponent and XOR.
- **Neither handles two's complement.**
- **No page combines** logic + equivalence check + binary/bitwise.

## 1. Keywords and placement

| Role | Keyword | US vol | KD | Where it goes |
|---|---|---:|---:|---|
| **Primary** | boolean algebra calculator | 1,600 | 11 | Title, H1, first sentence |
| Secondary | boolean calculator | 1,000 | 10 | Intro, tool heading |
| Secondary | binary math calculator | 880 | 10 | Binary tab heading + H2 "Binary math: add, subtract and convert" |
| Natural | truth table generator · simplify boolean expression · karnaugh map · two's complement · De Morgan's laws | — | — | H2s, FAQ |

## 2. Our edge (5 genuine tools checked)

| Feature | Competitors with it |
|---|---|
| Expression → simplified | 3/5 |
| Truth table shown | 1/5 |
| K-map (≤ 6 vars, groups highlighted, theme-aware) | 1/5 (≤ 4) |
| Steps (law-based where possible, else the QM prime-implicant table; "several minimal forms may exist") | 1/5 |
| **Documented syntax + precedence**, every notation accepted, parsed expression echoed with full brackets | 0 |
| **Equivalence checker with a counterexample row** | **0** |
| Minimal SOP **and** POS, Σm/ΠM, NAND-only / NOR-only | 1/5 |
| Binary arithmetic (BigInt), bitwise, shifts, bases 2/8/10/16 | 2/5 |
| **Chosen bit width + two's complement signed view**, carry/borrow steps | **0** |
| Copy truth table as CSV; expression in C/JS, maths and text notations | 0 |

## 3. Calculator spec

### 3.1 Tabs

1. **Simplify & truth table** (default)
2. **Equivalence check**
3. **Binary / hex / decimal**

### 3.2 Input guide diagram (above the inputs)

`BooleanInputGuide.tsx`

- **Logic tab:** the logic-gate diagram is built live from "1 Expression". Inputs A, B, C sit on the left; the output is on the right. Next to it, a mini truth-table preview and a small **syntax legend** (AND & · *, OR | +, NOT ! ¬ ', XOR ^ ⊕).
- **Equivalence tab:** two gate diagrams, "Expression 1" and "Expression 2", with a ✓/✗.
- **Binary tab:** two binary numbers stacked, "2 First number" and "3 Second number", with carry bits above, plus a "4 Bit width" selector and a "signed" toggle.

### 3.3 Inputs (defaults = examples)

| Field | Default / notes |
|---|---|
| Expression | `(A AND B) OR (A AND NOT B)` |
| Variables | A–Z; warn above 12 |
| Precedence (shown) | NOT > AND > XOR > OR > → > ↔. `TODO(owner)`: approve and cite a logic textbook |
| Equivalence | `NOT(A AND B)` vs `NOT A OR NOT B` |
| Binary | `1011 + 0110`, width 8, unsigned; signed example −5 |

### 3.4 Engine (`src/lib/boolean-engine.ts`)

```ts
tokenizer (all notations) → precedence-climbing parser → AST ; echo with full brackets
truthTable(ast) (≤ 12 vars display) ; minterms/maxterms → Σm(…), ΠM(…)
Quine–McCluskey + Petrick → minimal SOP ; POS = minimise complement ; NAND-only / NOR-only conversion
kmap(≤ 6 vars) with groups ; lawSteps (simple cases) else QM table
equivalent(a, b) → bool + first differing row
binary: BigInt add/sub/mul/div/mod ; AND/OR/XOR/NOT/shifts ; width mask 8–64 ; two's complement view ; bases 2/8/10/16 ; carry/borrow steps
```

**Worked examples (checked 2026-11-22):**

| Case | Result |
|---|---|
| `(A AND B) OR (A AND NOT B)` | **A**, via the distributive and complement laws (Σm(2,3) for A,B with A as the MSB) |
| `NOT(A AND B)` vs `NOT A OR NOT B` | **equivalent** (De Morgan) |
| `A AND (A OR B)` | **A** (absorption) |
| 1011 + 0110 | **10001** (11 + 6 = 17) |
| −5 in 8-bit two's complement | **11111011** |

### 3.5 Outputs

- Simplified forms (SOP, POS, NAND/NOR), truth table, K-map, steps.
- **Sentence:** "(A AND B) OR (A AND NOT B) simplifies to A: B doesn't affect the result."
- Equivalence result + counterexample.
- Binary result in all bases + carry steps + signed view.
- Copy CSV / notations; Share URL.

### 3.6 Tests

- Parser precedence and notations; invalid input messages.
- Truth tables; QM minimal forms vs brute force for ≤ 6 vars.
- Equivalence with a counterexample.
- BigInt arithmetic; widths; two's complement edge cases (−128 in 8-bit).
- The examples above. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Boolean Algebra Calculator – Truth Tables` (41; 53 with the suffix: OK) |
| Meta | `Free boolean algebra calculator. Type an expression to get its truth table and a simplified form, and do binary add, subtract and convert in one place.` (151) |
| H1 | `Boolean Algebra Calculator: Truth Tables, Simplification and Binary Maths` |
| BLUF | "Type a boolean expression to see its truth table and simplest form. For example, (A AND B) OR (A AND NOT B) simplifies to just A. The binary tab adds, subtracts and converts numbers: 1011 + 0110 = 10001 (11 + 6 = 17)." (engine) |
| ToolShell pills | `Truth tables & K-maps`, `Minimal SOP & POS`, `Equivalence check`, `Binary, hex & two's complement` |
| Links out | Metric Conversion (#20), Ratio (#1), Batch 7 developer tools (when built) |
| Links in | Tools hub "Math & Finance", future developer tools |

## 5. Content (~1,400–1,700 words)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the boolean algebra calculator | Syntax table + precedence | 150 |
| 2 | Boolean operators and truth tables | Example | 150 |
| 3 | How to simplify a boolean expression | Laws (De Morgan, absorption) + QM + K-map example | 250 |
| 4 | SOP vs POS and canonical forms | Σm / ΠM | 150 |
| 5 | NAND and NOR: universal gates | Conversion example | 120 |
| 6 | Checking if two expressions are equivalent | Example + counterexample | 120 |
| 7 | Binary math: add, subtract and convert | Carries/borrows (`binary math calculator`) | 180 |
| 8 | Bitwise operations and two's complement | Signed numbers, width | 150 |
| 9 | FAQ | §6 | 380 |

## 6. FAQ (10, from the question bank)

1. How do you simplify a boolean expression?
2. What are De Morgan's laws?
3. What are SOP (DNF) and POS (CNF) forms?
4. How do I make a truth table?
5. How do I prove two expressions are equivalent?
6. What is a Karnaugh map?
7. What is the order of operations in boolean algebra?
8. How do you add and subtract binary numbers?
9. What is two's complement?
10. How do bitwise AND, OR and XOR work?

## 7. Done when

- [ ] `boolean-engine.ts` + tests (QM vs brute force); `npm run verify` passes.
- [ ] Syntax and precedence documented on the page; InputGuide above the inputs; ToolShell + TabSlider + fonts + `<main>`.
- [ ] Registrations + docs; `graphify update .`.
