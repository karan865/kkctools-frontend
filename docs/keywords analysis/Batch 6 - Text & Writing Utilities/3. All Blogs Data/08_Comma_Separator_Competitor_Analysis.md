# Comma Separator (Column ↔ Comma-Separated List) — Competitor Analysis

> **Target page:** KKCTools `/comma-separator/` (Batch 6, Tool #8 🟡)
> **Primary keyword:** `comma delimited`: US 1,600 · KD 20. Cluster: 6 keywords, 5,400 US searches. Includes `column to comma` (1,300), `insert comma` (1,000, mixed intent), `comma adder` (390), `add commas to list` (390).
> **SERP source:** ⚠ No Semrush SERP export for Batch 6. Competitors come from a live web search for `comma separator online column to comma separated list` on 2026-11-14. `TODO(owner): pull Google top 10 for "comma delimited" and "column to comma".`
> **Pages visited (2026-11-14):** 3 read: Convert.town, Capitalize My Title, Spreadsheet Planet (Excel). Retool's utility timed out. CodeShack returned 403.

---

## 0. How this was collected (read first)

- **Who ranks:**
  - Small single-purpose sites: Convert.town, delim.co, CodeShack, Capitalize My Title.
  - A dev-tool vendor: Retool.
  - A Chrome extension.
  - Excel tutorials: Spreadsheet Planet, ExcelDemy, TheBricks, Kunal Chowdhury.
  - Blogspot and pages.dev clones.
  - The keyword file says a DA-1 site can beat these **with more options**.
- **Mixed intent:**
  - `insert comma` includes grammar intent ("where to put a comma"). Azahar is an example.
  - `comma delimited` is a definition query: **what CSV / comma-delimited means**.
  - Our page needs a short definition H2 for both.
- **Correctness focus:** RFC 4180 CSV quoting. A value that contains a comma or a quote must be quoted, and inner quotes must be doubled.
  - No competitor explains this.
  - Capitalize My Title also contains a factual error about delimiters (see §4).
- No competitor text copied.

---

## 1. Competitor snapshot

| # | URL | Type | Title / H1 | Body words (est.) |
|---:|---|---|---|---:|
| 1 | convert.town/column-to-comma-separated-list | Small tool site | Convert Column to Comma Separated List | 200–250 |
| 2 | capitalizemytitle.com/tools/column-to-comma-separated-list/ | Writing-tool site | Comma Separator – Convert Column to Comma Separated List | 1,000–1,200 |
| 3 | spreadsheetplanet.com/column-to-comma-separated-list-excel/ | Excel tutorial | How to Convert a Column to a Comma-Separated List in Excel | ~1,400 |
| — | retool.com/utilities/comma-separating-tool | Dev-tool vendor | Comma separating tool | **timeout** |
| — | codeshack.io/column-to-comma-separated-list/ | Dev-tools site | Column to comma separated list | **403** |

**What this tells us:**
- **Capitalize My Title has the most options.** It has delimiter choice, item and list prefix/suffix, quotes (none, double, single), lowercase, reverse, removing line breaks, paragraph breaks, extra spaces and whitespace, and removing duplicates. It also shows a counter and offers Copy and Save CSV.
  - **Weak spots:** no sort, the reverse mode (list → column) is unclear, no explanation of how quoting interacts with embedded commas, and factual errors.
- **Convert.town** has delimiter, item and result prefix/suffix, and collapsing repeated delimiters. It auto-copies results and is ad-supported with a PRO upsell.
- **Spreadsheet Planet** covers the Excel methods: TEXTJOIN, CONCATENATE/&, Power Query `Text.Combine`, and VBA. Its Power Query "Close & Load" step will likely fail for a scalar result, and the VBA code appears twice.
- **Nobody combines all of these:**
  - **both directions** with proper CSV parsing
  - RFC 4180 quoting
  - presets for SQL IN lists, JSON arrays and Python lists
  - trim, dedupe (case-insensitive option), sort (natural or numeric), remove empty lines
  - chunking into N per line
  - live item counts
  - a short Excel/Sheets formula section

---

## 2. Feature matrix — calculator

✅ = has it · ⚠️ = partial · ❌ = not seen

| Feature | Convert.town | Capitalize My Title | Spreadsheet Planet |
|---|---|---|---|
| Lines → delimited list | ✅ | ✅ | ✅ (Excel) |
| Delimiter choice (comma, semicolon, pipe, tab, custom) | ✅ (custom) | ⚠️ (comma, comma-space, space, others) | ✅ (formula) |
| Item prefix/suffix (quotes, brackets) | ✅ | ✅ (+ quote dropdown) | ⚠️ (manual) |
| Result prefix/suffix (`(` `)`, `[` `]`) | ✅ | ✅ | ❌ |
| **Reverse: list → lines** | ❌ | ⚠️ (described, unclear in UI) | ❌ |
| Proper CSV quoting (embedded commas or quotes) | ❌ | ❌ | ❌ |
| Trim / remove extra spaces | ❌ | ✅ | ❌ |
| Remove duplicates | ❌ | ✅ | ❌ |
| Case-insensitive dedupe | ❌ | ❌ | ❌ |
| Sort (A–Z, natural, numeric) | ❌ | ❌ (separate tool) | ❌ |
| Remove empty lines | ✅ (collapse delimiters) | ✅ | ❌ |
| Lowercase / uppercase | ❌ | ✅ (lower) | ❌ |
| Chunk into N per line | ❌ | ❌ | ❌ |
| Presets (SQL IN, JSON array, Python list) | ❌ | ❌ | ❌ |
| Item count | ❌ | ✅ | ❌ |
| Copy / download CSV | ✅ (auto-copy) | ✅ (Save CSV) | n/a |

---

## 3. Feature matrix — content and trust

| Item | Convert.town | Capitalize My Title | Spreadsheet Planet |
|---|---|---|---|
| Worked example (input → output) | ❌ | ⚠️ | ⚠️ (screenshots are placeholders) |
| What "comma-delimited / CSV" means | ❌ | ⚠️ (errors, unsourced history) | ❌ |
| Excel / Sheets methods | ⚠️ (add-in) | ✅ (TEXTJOIN, VBA, Notepad++, Python) | ✅ (4 methods) |
| FAQ count | 0 | 0 | yes (some references undefined) |
| Named author | ❌ | ❌ | ✅ (Steve Scott) |
| Date | ❌ | ❌ | ❌ |
| Errors | — | "columns defined by semicolons"; "tables of contents"; typo "two two" | Power Query load step; duplicated VBA |

---

## 4. Competitor-by-competitor detail

### 1. Convert.town — Column to Comma Separated List
- **Options:** delimiter, item prefix/suffix, result prefix/suffix, collapse repeated delimiters. Output is auto-copied.
- **Weak points:**
  - No example.
  - Inputs have no labels or defaults.
  - No reverse mode, dedupe or sort.
  - PRO upsell and Excel add-in promotion.
  - About 200 words of content.

### 2. Capitalize My Title — Comma Separator
- **Options:**
  - delimiter
  - item and list prefix/suffix
  - quotes (none, double, single)
  - lowercase, reverse
  - remove line breaks, paragraph breaks, extra spaces, all whitespace, duplicates
- **Outputs:** live result, counter, Copy, Reset, Save CSV.
- **Article:** Excel (TEXTJOIN, VBA), Notepad++, Python (csv, pandas, NumPy), CSV history.
- **Errors:**
  - Says columns "are defined by each semicolon", which contradicts its own CSV definition.
  - Says CSV is "associated with creating tables of contents".
  - IBM 1972 and 2005 MIME claims have no source.
- **Weak points:**
  - No sort.
  - No quoting explanation.
  - Stale "NEW" labels.
  - No FAQ, author or date.

### 3. Spreadsheet Planet — Column to comma-separated list in Excel (Steve Scott)
- **Methods:** TEXTJOIN, CONCATENATE/&, Power Query `Text.Combine`, VBA (MsgBox output).
- **Errors:**
  - The Power Query "Close & Load" of a scalar text value will likely fail without wrapping it in a table.
  - The VBA block is duplicated.
  - The FAQ refers to dataset items that don't exist.
- **Weak points:** no date, pop-ups.

---

## 5. Patterns

**Lines → list**
- Split on CRLF, LF or CR.
- Then apply options in this order: trim → remove empty → dedupe (case-sensitive or not) → sort (A–Z, Z–A, natural, numeric) → change case.
- Wrap each item (none, `'`, `"`, backticks, or custom prefix/suffix).
- Join with the delimiter: `,`, `, `, `;`, `|`, tab, space, newline, or custom.
- Wrap the whole result (none, `()`, `[]`, `{}`, or custom).

**CSV-correct mode (RFC 4180)**
- If an item contains the delimiter, a quote or a newline, wrap it in `"` and double any inner `"`.
- `TODO(owner)`: cite RFC 4180.

**Presets**
- SQL IN: `('a','b')`, with inner `'` escaped as `''`.
- JSON array: `["a","b"]`, using JSON string escaping.
- Python list.
- JavaScript array.
- Excel or Sheets `{"a","b"}`.
- Markdown bullet list.

**List → lines (reverse)**
- Parse with a CSV-aware tokenizer that respects quotes, then output one item per line.

**Chunking**
- N items per line, for batching long SQL queries.

**Counts**
- Input lines, output items, duplicates removed, empty lines removed.

**Excel / Sheets formulas**
- `=TEXTJOIN(", ",TRUE,A2:A100)`
- Sheets: `=JOIN(", ",FILTER(A2:A,A2:A<>""))`
- `TODO(owner)`: verify both formulas.

**Coverage across the 3 competitors**

| Section | Pages (of 3) |
|---|:---:|
| Lines → list | 3 |
| Reverse | 1 (unclear) |
| Dedupe | 1 |
| Sort | **0** |
| CSV quoting correct | **0** |
| SQL/JSON presets | **0** |
| Chunking | **0** |

---

## 6. FAQ question bank

★ = asked on 2+ pages or a cluster keyword. Map to: comma delimited, add commas to list, comma adder, insert comma, column to comma, column to comma separated.

| # | Question | Seen on / keyword |
|---:|---|---|
| 1 | ★ What does comma-delimited (CSV) mean? | CMT · `comma delimited` |
| 2 | ★ How do I turn a column into a comma-separated list? | all · `column to comma`, `column to comma separated` |
| 3 | ★ How do I do it in Excel or Google Sheets? | Spreadsheet Planet, CMT |
| 4 | How do I add quotes around each item (for SQL)? | CMT, ExcelDemy (SERP) |
| 5 | How do I split a comma-separated list back into lines? | CMT |
| 6 | What happens if my values contain commas? | — (gap) |
| 7 | How do I remove duplicates or sort the list? | CMT (dedupe) |
| 8 | Comma vs semicolon vs tab delimited? | — |
| 9 | How do I add commas to a list of numbers? | `add commas to list`, `comma adder` |
| 10 | Where do commas go in a sentence? | `insert comma` (grammar intent; short note + link) |

---

## 7. Gaps nobody fills — our opportunities

1. **Both directions** with a CSV-aware parser.
2. **RFC 4180 quoting mode**, so values containing commas or quotes stay correct.
3. **One-click presets:** SQL IN list, JSON, Python and JS arrays, Excel array, Markdown list.
4. **Full clean-up pipeline:** trim, remove empty lines, dedupe (case-insensitive option), sort (natural or numeric), change case.
5. **Chunking** into N items per line.
6. **Live counts** (items, duplicates removed) and copy. Optional `.csv` / `.txt` download, generated in the browser.
7. **Correct Excel and Sheets formulas** (TEXTJOIN, JOIN/FILTER) with worked examples.
8. **Definition section:** what comma-delimited and CSV mean. Accurate and cited.
9. **Privacy:** data stays in the browser. This matters for email lists and IDs.
10. **Links:** Character Counter (#5), Word Counter (#6), Batch 7 developer tools (UUID).

---

## 8. Blueprint for the KKCTools Comma Separator

### 8.1 SEO

- **URL:** `/comma-separator/`
- **Title:** Comma Separator – Column to Comma-Separated List
- **H1:** Comma Separator: Turn a Column into a Comma-Separated List
- **Meta:** as in the keyword file (158 chars).

### 8.2 Calculator spec

| Area | Spec |
|---|---|
| Direction | Lines → list · List → lines |
| Delimiter | `,` `, ` `;` `\|` tab space newline custom |
| Wrap | Item quotes (none/'/"/`/custom), result wrapper (()/[]/{}/custom) |
| Clean | Trim, remove empty, dedupe (case opt), sort (A–Z/Z–A/natural/numeric), case |
| Modes | RFC 4180 CSV-correct; presets SQL IN / JSON / Python / JS / Excel / Markdown |
| Chunk | N items per line |
| Output | Live, counts, copy, download (.csv/.txt) |
| UX | No network, local only |

### 8.3 Content outline (≈ 900–1,200 words, original)

1. Intro (primary keyword)
2. How to use
3. What "comma-delimited" means (CSV basics)
4. Column → comma list: examples (plain, quoted, SQL IN, JSON)
5. Comma list → column
6. Values that contain commas or quotes (CSV quoting)
7. Removing duplicates and sorting
8. Doing it in Excel and Google Sheets (formulas)
9. FAQ (8–10)
10. Related tools: Character Counter (#5), Word Counter (#6), UUID Generator (Batch 7)

### 8.4 Quality checks

- **Unit tests:**
  - CRLF input
  - quoting edge cases (embedded `"`, `,`, newline)
  - SQL `'` escaping
  - JSON escaping
  - natural sort
  - case-insensitive dedupe
  - round trip (list → lines → list)
  - 100k lines performance
- No competitor wording. `npm run check:no-network` passes.
- `TODO(owner)`: pull the Google top 10, check Retool and CodeShack manually, and verify the Excel/Sheets formulas.
