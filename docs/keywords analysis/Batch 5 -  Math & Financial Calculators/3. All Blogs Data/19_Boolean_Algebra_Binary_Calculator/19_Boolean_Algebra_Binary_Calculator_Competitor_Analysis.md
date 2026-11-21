# Boolean Algebra & Binary Calculator — Competitor Analysis

> **Target page:** KKCTools `/boolean-algebra-calculator/` (Batch 5, Tool #19 🟡, Tier 3)
> **Primary keyword:** `boolean algebra calculator`: US 1,600 · KD 11 · declining. Cluster of 3 keywords, 3,480 US vol: `boolean calculator` 1,000 and `binary math calculator` 880.
> **SERP source:** ⚠ No Semrush SERP export for Batch 5. Competitors come from a live web search for `boolean algebra calculator truth table simplify expression` (2026-11-14), plus binary calculators known from the `binary math calculator` term (Calculator.net, RapidTables). `TODO(owner): pull Google top 10.`
> **Pages visited (2026-11-14):** 5 read: dCode, Calculators.sg, eMathHelp, Calculator.net binary, RapidTables binary.

---

## 0. How this was collected (read first)

- **Who ranks.** The SERP is **unusually spammy.** Many results are keyword-stuffed pages hosted on hijacked or unrelated domains: umb.edu survey subdomain, jntua alumni, ecocart analytics, matthewmarks, oli.org. These are not real tools. The genuine tools are:
  - dCode
  - Calculators.sg
  - eMathHelp
  - PrimeCalcPro
  - Wolfram|Alpha (referenced by others)
- **The binary maths part** (`binary math calculator`) is served by separate sites, Calculator.net and RapidTables. No Boolean page includes binary arithmetic.
- **Algorithm.** Truth tables plus **Quine–McCluskey** (exact minimum SOP for a small number of variables) run fully in the browser. This matches the keyword file.
- **Checks.** Simplifications and arithmetic were spot-checked:
  - eMathHelp's result is verified ✔.
  - Calculator.net's addition example appears wrong (34 vs 36), possibly an extraction issue.
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | dcode.fr/boolean-expressions | Puzzle/crypto tools site | Boolean Expressions Calculator | ~500 tool-specific |
| 2 | calculators.sg/boolean-algebra-calculator/ | Calc site | Boolean Algebra Calculator | 900–1,000 |
| 3 | emathhelp.net/calculators/discrete-mathematics/boolean-algebra-calculator/ | Maths education | Boolean Algebra Calculator | ~350 |
| 4 | calculator.net/binary-calculator.html | Calc giant | Binary Calculator | ~800 |
| 5 | rapidtables.com/calc/math/binary-calculator.html | Calc/reference site | Binary Calculator | ~70 |

**What this tells us:**
- **dCode** has the best minimisation outputs:
  - DNF/SOP, CNF/POS, NAND-only and NOR-only forms
  - 4 input notations
  - 7 FAQs
  - **But:** no truth table or K-map on the page, no steps, an undocumented variable limit, and XOR syntax that is never shown.
- **eMathHelp** shows **law-by-law steps** (De Morgan, double negation), with a correct result. It covers a wide set of operators (NAND, NOR, XNOR, implications), but it has no syntax guide, and the truth table and normal forms it advertises are not visible.
- **Calculators.sg** offers a truth table, K-map (≤ 4 variables), DNF/CNF and steps. It has no worked example, no stated precedence, and its FAQ overclaims ("can simplify any").
- **Binary calculators:**
  - RapidTables has 12 operations (arithmetic, bitwise, shifts), with "^" used for both exponent and XOR and a 32-bit limit.
  - Calculator.net has arithmetic and conversion only, with no bitwise operations.
  - **Neither handles two's complement / signed numbers, or explains it.**
- **No page combines all of these:**
  - truth table
  - minimal SOP and POS
  - K-map
  - steps
  - equivalence check of two expressions
  - binary/hex arithmetic and bitwise operations

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | dCode | Calculators.sg | eMathHelp | Calc.net binary | RapidTables |
|---|---|---|---|---|---|
| Expression parser | ✅ (4 notations) | ✅ (several styles) | ✅ | n/a | n/a |
| AND/OR/NOT | ✅ | ✅ | ✅ | n/a | ✅ (bitwise) |
| XOR / NAND / NOR / XNOR | ⚠️ (XOR syntax undocumented) | ✅ (no XNOR) | ✅ (+ implications) | ❌ | ⚠️ (XOR only) |
| Precedence documented | ❌ | ❌ | ❌ | n/a | n/a |
| Truth table | ❌ (separate tool) | ✅ (≤ 4 vars) | ⚠️ (link, not shown) | n/a | n/a |
| Minimal SOP (DNF) | ✅ | ✅ | ⚠️ (simplified form) | n/a | n/a |
| Minimal POS (CNF) | ✅ | ✅ | ⚠️ (advertised) | n/a | n/a |
| NAND-only / NOR-only form | ✅ | ❌ | ❌ | n/a | n/a |
| Karnaugh map | ❌ (separate tool) | ✅ (≤ 4 vars) | ❌ | n/a | n/a |
| Simplification steps (laws cited) | ❌ (says it can't) | ⚠️ (claimed) | ✅ | n/a | n/a |
| Equivalence check (A ≡ B) | ⚠️ (FAQ method) | ❌ | ❌ | n/a | n/a |
| Minterms / maxterms list | ⚠️ | ⚠️ | ❌ | n/a | n/a |
| Binary add/sub/mul/div | ❌ | ❌ | ❌ | ✅ | ✅ |
| Bitwise + shifts | ❌ | ❌ | ❌ | ❌ | ✅ (32-bit) |
| Base conversion bin/dec/hex | ❌ | ❌ | ❌ | ⚠️ (bin↔dec) | ✅ (output) |
| Two's complement / bit width | ❌ | ❌ | ❌ | ❌ | ❌ |
| Arithmetic steps | n/a | n/a | n/a | ⚠️ (rules) | ⚠️ (empty heading) |

---

## 3. Feature matrix — content and trust

| Item | dCode | Calculators.sg | eMathHelp | Calc.net | RapidTables |
|---|---|---|---|---|---|
| Laws explained (De Morgan, absorption…) | ✅ (FAQ) | ✅ (notation mixed) | ⚠️ (cited in steps) | n/a | n/a |
| Worked example with output | ❌ | ❌ | ✅ (verified) | ⚠️ (addition example 100100 vs 100010) | ❌ |
| Syntax guide | ⚠️ (examples conflict with list) | ✅ | ❌ | n/a | ⚠️ |
| FAQ count | 7 | 4 | 0 | 0 | 0 |
| Named author | ❌ | ✅ (Henrick Yau) | ❌ | ❌ | ❌ |
| Date | ❌ | ✅ (Aug 2026) | ❌ | ❌ | ❌ |

---

## 4. Competitor-by-competitor detail

### 1. dCode — Boolean Expressions Calculator
- **Notations:** algebraic (`* + !`), logical (∧ ∨ ¬), programming (`&& || ~`), literal (AND OR NOT).
- **Outputs:** any / DNF / CNF / NAND / NOR forms.
- **FAQs (7):**
  1. Definition
  2. How to simplify
  3. Methods
  4. Proving equivalence
  5. De Morgan
  6. DNF/CNF
  7. Steps (it says none are available)
- **Weak points:**
  - The notation list conflicts with the examples (`~` vs `!`; `*` vs implicit multiplication).
  - XOR syntax is never shown.
  - Variable limit not documented.
  - No sample output.
  - Donation and boilerplate clutter.

### 2. Calculators.sg — Boolean Algebra Calculator (Henrick Yau, Aug 2026)
- **Inputs:** AND, OR, NOT, XOR, NAND, NOR; variables A–Z, constants 0/1.
- **Outputs:** result, truth table, simplification, DNF/CNF, K-map (≤ 4 vars), analysis.
- **FAQs (4).**
- **Weak points:**
  - No worked example.
  - The 4-variable limit for tables and maps conflicts with the A–Z claim.
  - No precedence rules.
  - The FAQ says it can simplify "any" expression, while the disclaimer says the result may not be minimal.
  - Mixed notation.

### 3. eMathHelp — Boolean Algebra Calculator
- **Operators:** ¬, ∧, ∨, ↑, ↓, ↔, →, ←, ↛, ↚, ⊕, T, F.
- **Example:** simplifies to (A·B̄) + (B·C̄). Spot-checked ✔. The steps cite De Morgan and double negation.
- **Weak points:**
  - No syntax guide.
  - The advertised truth table, DNF, CNF and NNF are not visible.
  - One example only.
  - Leftover `$$$` rendering artifacts.
  - No FAQ.

### 4. Calculator.net — Binary Calculator
- **Operations:** add, subtract, multiply, divide; bin↔dec conversion.
- **Examples:**
  - Subtraction 23 − 13 = 10 ✔.
  - Multiplication 23 × 3 = 69 ✔.
  - Addition: 10111 + 1011 should be 100010 (34), but the page shows 100100. `TODO(owner)`: confirm on the rendered page.
- **Weak points:**
  - No bitwise operations, no signed numbers, no hex.
  - Division example is an image.
  - Confusing borrow wording.

### 5. RapidTables — Binary Calculator
- **Operations (12):** + − × ÷, mod, exponent, AND, OR, NOT, XOR, <<, >>.
- **Outputs:** binary, decimal and hex, each with copy.
- **Weak points:**
  - "^" is used for both exponent and XOR.
  - 32-bit limit, no two's complement.
  - About 70 words of content.
  - Empty "steps" section.

---

## 5. Patterns

**Parser**
- Tokens: variables, 0/1, NOT (¬ ! ~ '), AND (∧ & · * or implicit), OR (∨ | +), XOR (⊕ ^), NAND, NOR, XNOR, →, ↔, parentheses.
- **Precedence (state it on the page):** NOT > AND > XOR > OR > → > ↔.
- `TODO(owner)`: approve the precedence convention and cite a logic textbook.

**Truth table and minimisation**
- Truth table: 2ⁿ rows. Practical limit about 10–12 variables for display; ≤ 6 for a K-map.
- Minimal SOP via Quine–McCluskey and Petrick's method. POS via minimisation of the complement. Results are labelled "a minimum form" (several may exist).
- Canonical forms: Σm(…) minterms and ΠM(…) maxterms.
- NAND-only and NOR-only conversions.
- **Equivalence:** compare truth tables, and show a counterexample row if the expressions differ.

**Steps**
- Show the law-based steps for simple cases. Otherwise show the QM prime-implicant table, which is honest about the method.

**Binary**
- Arbitrary-precision BigInt for add, subtract, multiply, divide and mod.
- Bitwise AND, OR, XOR, NOT, shifts, with a chosen bit width (8, 16, 32, 64).
- Two's complement signed view.
- Bin ↔ oct ↔ dec ↔ hex conversion.
- Steps for addition (carries) and subtraction (borrows).

**Coverage across the 5 pages**

| Section | Pages (of 5) |
|---|:---:|
| Expression → simplified | 3 |
| Truth table shown | 1 |
| K-map | 1 |
| Steps | 1 |
| Equivalence check | **0** (tool) |
| Binary arithmetic | 2 |
| Bitwise | 1 |
| Two's complement | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages, or a cluster keyword. Map to: boolean algebra calculator, boolean calculator, binary math calculator.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ How do you simplify a Boolean expression? | dCode, Calculators.sg, eMathHelp |
| 2 | ★ What are De Morgan's laws? | dCode, eMathHelp |
| 3 | ★ What are DNF/SOP and CNF/POS forms? | dCode, Calculators.sg |
| 4 | ★ How do I make a truth table? | Calculators.sg |
| 5 | How do I prove two expressions are equivalent? | dCode |
| 6 | What is a Karnaugh map? | Calculators.sg |
| 7 | What is the order of operations in Boolean algebra? | — (gap) |
| 8 | How do you add and subtract binary numbers? | Calc.net · `binary math calculator` |
| 9 | What is two's complement? | — (gap) |
| 10 | How do bitwise AND, OR and XOR work? | RapidTables |

---

## 7. Gaps nobody fills — our opportunities

1. **One page for both topics:**
   - Logic tab: expression → truth table, minimal SOP and POS, Σm/ΠM, NAND/NOR forms, K-map (≤ 6 vars).
   - Binary tab: arithmetic, bitwise, shifts, bases, two's complement.
2. **Documented syntax and precedence**, with every notation accepted and the parsed expression shown back with full brackets.
3. **Honest steps:** law-based steps when possible, otherwise the QM prime-implicant table. Say clearly that more than one minimal form may exist.
4. **Equivalence checker:** two expressions → same / different, with a counterexample row.
5. **Binary with a chosen bit width** and a signed (two's complement) view. Carry and borrow steps shown.
6. **Correct, complete worked examples** for each tab.
7. **Copy-friendly outputs:** truth table as CSV; expression in several notations (C/JS, maths, text).
8. **Theme-aware K-map** with groups highlighted.
9. **Links:** Metric Conversion (#20), future Number Base / Hex tools, Batch 7 developer tools.

---

## 8. Blueprint for the KKCTools Boolean Algebra & Binary Calculator

### 8.1 SEO

- **URL:** `/boolean-algebra-calculator/`
- **Title:** Boolean Algebra Calculator – Truth Tables
- **H1:** Boolean Algebra Calculator: Truth Tables, Simplification and Binary Maths
- **Meta:** use the keyword file's meta (151 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Logic input | Any notation; variables A–Z (warn > 12); precedence shown |
| Logic outputs | Truth table, minimal SOP/POS (QM), Σm/ΠM, NAND/NOR-only, K-map ≤ 6 vars, steps/QM table |
| Equivalence | Two expressions → result + counterexample |
| Binary | BigInt add/sub/mul/div/mod; AND/OR/XOR/NOT/shifts; width 8–64; signed two's complement; bases 2/8/10/16; carry/borrow steps |
| UX | Copy (CSV, notations), share URL, no network |

### 8.3 Content outline (≈ 1,300–1,600 words, original)

1. Intro (primary keyword)
2. How to use (syntax table, precedence)
3. Boolean operators and truth tables, with an example
4. Simplifying expressions: laws, K-maps, Quine–McCluskey, with an example
5. SOP vs POS and canonical forms
6. NAND and NOR universal gates
7. Checking two expressions are equivalent
8. Binary arithmetic, with examples
9. Bitwise operations and two's complement
10. FAQ (10)
11. Related tools: Metric Conversion (#20), Batch 7 developer tools

### 8.4 Quality checks

- **Unit tests:**
  - parser: precedence and all notations
  - truth tables
  - QM against brute-force minimal forms for ≤ 4 variables
  - equivalence checker
  - BigInt arithmetic, bitwise operations, two's-complement edges
- **Fixtures:** 10111 + 1011 = 100010; 23 − 13 = 10; 23 × 3 = 69.
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`: pull Google top 10; approve the precedence convention; set the variable limit.
