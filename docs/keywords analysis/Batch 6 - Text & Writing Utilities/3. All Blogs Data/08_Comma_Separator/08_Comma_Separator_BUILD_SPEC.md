# Comma Separator (Column ↔ Comma-Separated List) — Build Spec

> **URL:** `/comma-separator/` · Batch 6 · Tier 2 · **Build order 8**
> **Read first:** `../00_BATCH6_BUILD_RULES.md` (§3 RFC 4180, TEXTJOIN and JOIN sources; §4 `list-engine`)
> **Inputs:** `08_Comma_Separator_Competitor_Analysis.md`, keyword file §2 #8
> **SERP:** provisional
> **Written:** 2026-11-22

---

## 0. Strategy

**About 5,400 searches in 6 keywords**:
- `comma delimited` 1,600 / KD 20 (primary; a definition query);
- `column to comma` 1,300 / KD 29 (rising); `column to comma separated` 720 / KD 26;
- `insert comma` 1,000 / KD 17 (rising, **mixed** with grammar intent);
- **easiest first targets:** `comma adder` 390 / KD 9 and `add commas to list` 390 / KD 13.

**Users:** SEO people (keyword lists), spreadsheet users (a column of IDs or emails), developers (SQL `IN (…)` lists, JSON arrays). They paste private data, so **"nothing leaves your browser" is a real selling point.**

**The leaders are small single-purpose sites** with few options and no correctness. **No competitor handles values that contain commas or quotes** (RFC 4180 quoting), and none goes both ways with a proper CSV parser.

### Research notes from the competitor analysis

- **Pages read:** Convert.town, Capitalize My Title, Spreadsheet Planet (Excel). Retool timed out; CodeShack 403.
- **Capitalize My Title** has the most options (delimiter, item and list prefix/suffix, quotes, lowercase, reverse, whitespace and duplicate removal, Save CSV) **but**:
  - says columns "are defined by each semicolon", contradicting its own CSV definition;
  - says CSV is "associated with creating tables of contents";
  - has no sort and no explanation of quoting embedded commas.
- **Convert.town:** delimiter + prefix/suffix + collapse; no labels, no example, no reverse, dedupe or sort; ~200 words; PRO upsell.
- **Spreadsheet Planet:** TEXTJOIN, CONCATENATE/&, Power Query, VBA. Its Power Query "Close & Load" of a scalar will likely fail; the VBA block is duplicated.
- **0 of 3** sort, quote correctly, offer SQL/JSON presets or chunk long lists.

## 1. Keywords

| Role | Keyword | US vol | KD | Where |
|---|---|---:|---:|---|
| **Primary** | comma delimited | 1,600 | 20 | intro sentence, H2 "What comma-delimited means", HowWeCalculate |
| Head (not in exports) | comma separator | — | — | title, H1, ToolShell heading (`TODO(owner)`: pull volume) |
| Secondary | column to comma · column to comma separated | 1,300 · 720 | 26–29 | title ("Column to Comma-Separated List"), H1, H2 "Column to comma-separated list: examples" |
| Secondary | comma adder · add commas to list | 390 · 390 | 9–13 | first paragraph ("add commas to a list"), Lines → list tab label, FAQ 9 |
| Secondary (mixed) | insert comma | 1,000 | 17 | one FAQ: inserting commas into a list here; grammar comma rules are a different topic (one plain sentence, no grammar tool) |

## 2. Our edge

- **Both directions:** lines → list and list → lines, the reverse with an **RFC 4180-aware parser** (quoted fields, doubled quotes, newlines inside quotes).
- **CSV-correct mode** (§3, RFC 4180 §2 items 6–7): a value with the delimiter, a `"` or a line break is wrapped in `"` and inner `"` doubled. Default **on** when the delimiter is `,` and quoting is "auto".
- **One-click presets:** SQL `IN (…)` (inner `'` → `''`), JSON array (JSON escaping), Python list, JavaScript array, Excel/Sheets array constant `{"a","b"}`, Markdown bullets, plain CSV row.
- **Clean-up pipeline in a fixed, stated order:** trim → remove empty → dedupe (case-insensitive option, keeps the first) → sort (A–Z, Z–A, natural, numeric) → change case.
- **Chunking:** N items per line (long SQL batches).
- **Live counts:** input lines, items out, empty removed, duplicates removed.
- **Excel and Sheets formulas** from the verified help pages (§3), with a worked example.
- **Download** `.csv` / `.txt` generated in the browser (Blob), no server.

## 3. Calculator spec

### 3.1 Tabs

1. **Column → list** (default)
2. **List → column**
3. **Presets** (SQL, JSON, Python, JS, Excel, Markdown)

### 3.2 Input guide diagram (above the inputs)

`CommaSeparatorInputGuide.tsx`: a column of cells → arrow → one line.

- **Left:** a 4-row column (`apple`, `Smith, John`, `say "hi"`, `apple`) labelled "1 Your column (one item per line)".
- **Middle:** three chips "2 Clean up (trim, dedupe, sort)", "3 Quote each item", "4 Delimiter".
- **Right:** the result line `apple,"Smith, John","say ""hi"""` with a callout on the quoted item: "Values with commas or quotes are quoted (CSV rule)".
- **List → column tab:** the arrow reverses.
- **Presets tab:** the result changes to `('apple', 'O''Brien')`.

Live values: the diagram uses the user's first 4 lines; the focused option highlights its chip.

### 3.3 Inputs

| Field | Default |
|---|---|
| Input | sample column (our own, 6 lines incl. a duplicate and a blank) |
| Delimiter | `, ` (comma + space) · `,` · `;` · `\|` · tab · space · newline · custom |
| Quote items | auto (CSV rule) · none · `"` · `'` · backtick · custom prefix/suffix |
| Wrap result | none · `( )` · `[ ]` · `{ }` · custom |
| Trim spaces | on |
| Remove empty lines | on |
| Remove duplicates | off · case-sensitive · case-insensitive |
| Sort | none · A–Z · Z–A · natural · numeric |
| Change case | none · lower · UPPER |
| Items per line (chunk) | all on one line |
| List → column: input delimiter | auto-detect (`,` `;` tab `\|`) · manual |

### 3.4 Engine (`src/lib/list-engine.ts`)

```ts
splitLines(t) = t.split(/\r\n|\n|\r/)
cleanList(items, {trim, removeEmpty, dedupe:'off'|'cs'|'ci', sort, case})   // fixed order, keep first on dedupe
quoteCsv(v, delim) = (v includes delim or '"' or \r or \n) ? '"' + v.replaceAll('"','""') + '"' : v
joinList(items, {delimiter, quote, wrap, chunk})
parseDelimited(t, delim) : RFC 4180 state machine (fields, quoted fields, "" → ", newlines in quotes)
presets: sql(items) = "(" + items.map(v => "'" + v.replaceAll("'","''") + "'").join(", ") + ")"
         json(items) = JSON.stringify(items) ; python/js: own escaping (\\, quotes, newlines)
         excel(items) = "{" + items.map(v => '"' + v.replaceAll('"','""') + '"').join(",") + "}"
         markdown(items) = items.map(v => "- " + v).join("\n")
alphaCompare   = Intl.Collator(undefined, {sensitivity:'base'}).compare            // A–Z ignores case ("apple" < "Banana")
naturalCompare = Intl.Collator(undefined, {numeric:true, sensitivity:'base'}).compare
numericCompare = parse as number; non-numbers sort last, in input order
counts → {inputLines, items, emptyRemoved, duplicatesRemoved}
```

**Worked examples (checked with node, 2026-11-22):**

| Input | Options | Output |
|---|---|---|
| `apple` / `Smith, John` / `say "hi"` / `line` + newline + `break` (one value) | `,`, CSV auto | `apple,"Smith, John","say ""hi""","line` ⏎ `break"` |
| `apple` / `O'Brien` / `pear` | SQL preset | `('apple', 'O''Brien', 'pear')` |
| `apple` / `say "hi"` / `pear` | JSON preset | `["apple","say \"hi\"","pear"]` |
| `apple` / `Banana` / *(blank)* / `apple ` / `cherry` / `banana` | trim, remove empty, dedupe case-insensitive, sort A–Z, `, ` | `apple, Banana, cherry` · counts: 6 lines, 1 empty removed, 2 duplicates removed, 3 items |
| `item10` / `item2` / `item1` | natural sort | `item1, item2, item10` (plain A–Z gives `item1, item10, item2`) |
| `10` / `9` / `100` | numeric sort | `9, 10, 100` |
| `a`…`e` (5 items) | chunk 2 | `a, b` ⏎ `c, d` ⏎ `e` |
| Reverse: `apple,"Smith, John","say ""hi""",pear` | list → column | `apple` / `Smith, John` / `say "hi"` / `pear` (4 lines) |
| Round trip | column → list → column | identical to the cleaned input |

`TODO(builder)`: add each row as a unit test (the first three outputs were produced with node).

### 3.5 Outputs

- **Result box** (monospace, wraps), Copy, Download `.csv` / `.txt`.
- **Counts strip:** "6 lines in → 3 items out · 1 empty removed · 2 duplicates removed".
- **Sentence:** "Your 6 lines became a comma-separated list of 3 items."
- Warning chip when a value contained the delimiter and quoting is "none" ("2 values contain commas; turn on CSV quoting or pick another delimiter").
- Share URL (options only, **never the data**).

### 3.6 Tests

- CRLF / CR / LF input; trailing newline.
- Quoting edge cases: delimiter, `"`, newline, leading/trailing spaces with trim off.
- SQL `'` escaping; JSON and Python/JS escaping (backslash, quotes, newline, Unicode).
- Dedupe case-sensitive vs insensitive (keeps the first); natural and numeric sort (non-numbers last).
- Parser: quoted fields, `""`, newline inside quotes, empty fields, auto-detect.
- Round trip; chunking.
- 100,000 lines under ~200 ms (perf note).
- The worked examples. Snapshot.

## 4. Page SEO

| Item | Value |
|---|---|
| Title | `Comma Separator – Column to Comma-Separated List` (48; 60 with the suffix: OK) |
| Meta | `Free comma separator. Paste a column of values to get a comma-separated list, add quotes, remove duplicates, or split a list back into lines, in your browser.` (158) |
| H1 | `Comma Separator: Turn a Column into a Comma-Separated List` |
| BLUF | "Paste a column (one item per line) and get a comma-delimited list instantly. Trim spaces, remove duplicates, sort, add quotes or wrap it as a SQL IN list or JSON array, or paste a list to split it back into a column. Values that contain commas are quoted the CSV way, and your data never leaves this browser." |
| ToolShell pills | `Column ↔ list both ways`, `CSV-safe quoting`, `SQL, JSON & Python presets`, `Dedupe & sort` |
| Links out | Character Counter (#5), Word Counter (#6); UUID Generator (Batch 7, when live) |
| Links in | #5, Tools hub "Text & Writing" |

## 5. Content (~1,000–1,300 words, original)

| # | H2 | Content | Words |
|---:|---|---|---:|
| 1 | How to use the comma separator | 3 tabs, the clean-up order | 110 |
| 2 | What comma-delimited means | Plain definition of comma-delimited text and CSV; delimiter vs quote; one line citing RFC 4180 (`comma delimited`) | 140 |
| 3 | Column to comma-separated list: examples | Plain, quoted, SQL IN, JSON (engine outputs) | 160 |
| 4 | Comma-separated list back to a column | Reverse + quoted values | 90 |
| 5 | Values that contain commas or quotes | The CSV rule with the `"Smith, John"` / `""hi""` example | 130 |
| 6 | Removing duplicates and sorting a list | Case-insensitive dedupe, natural vs A–Z | 100 |
| 7 | Doing it in Excel and Google Sheets | Excel: `=TEXTJOIN(", ", TRUE, A2:A100)` (Excel 2019, 2021, 2024, Microsoft 365, web; §3). Sheets: `=JOIN(", ", FILTER(A2:A, A2:A<>""))` (JOIN syntax verified). Sheets TEXTJOIN only after `TODO(owner)` confirms answer/7013992 | 140 |
| 8 | FAQ | §6 | 300 |

## 6. FAQ (10, from the competitor question bank + cluster keywords)

1. What does comma-delimited (CSV) mean?
2. How do I turn a column into a comma-separated list?
3. How do I do it in Excel or Google Sheets?
4. How do I add quotes around each item (for SQL)?
5. How do I split a comma-separated list back into lines?
6. What happens if my values contain commas?
7. How do I remove duplicates or sort the list?
8. Comma vs semicolon vs tab delimited: which should I use?
9. How do I add commas to a list of numbers or words? (`comma adder`)
10. Can it insert commas into a sentence? (no; this tool joins list items; grammar rules are a separate topic)

## 7. Done when

- [ ] `list-engine.ts` + tests (parser, quoting, presets, sort, dedupe, chunk); `npm run verify` passes.
- [ ] InputGuide above the inputs; ToolShell/TabSlider/fonts/`<main>`.
- [ ] Formulas exactly as §5 row 7; downloads made locally; data never in the share URL.
- [ ] Registrations + docs; `graphify update .`.
