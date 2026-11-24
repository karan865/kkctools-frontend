import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ToolShell from '@/components/tool/shared/ToolShell';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import { CommaSeparator } from '@/components/tool/comma-separator';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.commaSeparator || {
  title: 'Comma Separator – Column to Comma-Separated List',
  description:
    'Free comma separator. Paste a column of values to get a comma-separated list, add quotes, remove duplicates, or split a list back into lines, in your browser.',
  path: '/comma-separator/',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What does comma-delimited (CSV) mean?',
    a: 'A comma-delimited list (also called Comma-Separated Values or CSV) is a text format where individual data entries are separated by commas. It is governed by RFC 4180 standards and is the universal data exchange format between spreadsheets, relational SQL databases, marketing automation tools, and web APIs.',
  },
  {
    q: 'How do I turn a column of text into a comma-separated list?',
    a: 'Paste your vertical column into the input area. Choose your preferred delimiter (such as comma + space), select whether to trim spaces or remove empty rows, and our tool instantly joins the entries into a horizontal delimited string. You can immediately copy the output or download it as a .txt or .csv file.',
  },
  {
    q: 'How do I convert a column to a comma-separated list in Excel and Google Sheets?',
    a: 'In modern Microsoft Excel (2019, 2021, 2024, Microsoft 365, and Excel for the web), use the formula =TEXTJOIN(", ", TRUE, A2:A100). In Google Sheets, use =JOIN(", ", FILTER(A2:A, A2:A<>"")) to ignore empty rows.',
  },
  {
    q: 'How do I add quotes around each item for a SQL query?',
    a: 'In the Quote Items dropdown, choose single quotes (\') or switch to the Presets tab and select "SQL IN (...)". Our engine wraps every item in single quotes, doubles any internal apostrophes to prevent syntax breakage (e.g., O\'Brien becomes \'O\'\'Brien\'), and encloses the result in parentheses: (\'apple\', \'O\'\'Brien\', \'pear\').',
  },
  {
    q: 'How do I split a comma-separated list back into vertical lines?',
    a: 'Switch to the "List → Column (Reverse)" tab and paste your delimited string. Our engine uses an RFC 4180 parser that detects your delimiter and correctly preserves multiline fields and commas enclosed in quotes, splitting the text into clean vertical rows.',
  },
  {
    q: 'What happens if my list items contain commas or quotation marks?',
    a: 'Under our default "Auto (RFC 4180 CSV)" setting, any item containing an embedded comma, double quote, or line break is automatically enclosed in double quotation marks, and any inner quotation marks are doubled. For example, Smith, John becomes "Smith, John", and say "hi" becomes "say ""hi""".',
  },
  {
    q: 'How do I remove duplicates or alphabetize my list?',
    a: 'Use the clean-up controls below the input area. Check "Remove duplicates" and select case-sensitive or case-insensitive matching. In the Sort dropdown, pick A → Z, Z → A, Natural (which correctly orders item1, item2, item10), or Numeric.',
  },
  {
    q: 'Comma vs semicolon vs tab delimited: which should I use?',
    a: 'Use comma-delimited for general spreadsheets and CSV files. Use semicolon-delimited if your data frequently contains decimal commas (common in European locales) or complex prose. Use tab-delimited (TSV) when copying data directly between Excel and text editors without quoting issues.',
  },
  {
    q: 'How do I add commas to a list of numbers or words?',
    a: 'Paste your unpunctuated list (whether one per line or space-separated) into the tool. Select comma or comma + space as your delimiter to instantly generate a properly punctuated list for email blasts, keyword bids, or code constants.',
  },
  {
    q: 'Can this tool insert commas into an English sentence based on grammar rules?',
    a: 'No. This tool is a programmatic list delimiter and data transformer for columns, database keys, and spreadsheets. It does not perform grammatical sentence punctuation or syntax analysis.',
  },
];

export default function CommaSeparatorPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Comma Separator', path: route.path },
  ];

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`} id="main-content">
      <JsonLd
        data={buildWebApplicationSchema({
          name: route.title,
          description: route.description,
          path: route.path,
          applicationCategory: 'UtilityApplication',
        })}
      />
      <JsonLd data={buildFaqSchema(faqs)} />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Comma Separator: Turn a Column into a Comma-Separated List
          </h1>
          <p className={styles.subtitle}>
            Convert columns of data into comma-delimited lists or split delimited text back into lines.
            Apply RFC 4180 CSV-safe quoting, deduplicate, sort, and export to SQL IN, JSON, and Python arrays.
          </p>

          <div className={styles.bluf}>
            Paste a vertical column (one item per line) to instantly generate a clean
            comma-delimited list. Automatically trim excess spaces, remove empty lines, eliminate duplicates, and sort alphabetically
            or numerically. Any value containing an embedded comma is safely quoted the standard CSV way (RFC 4180), and your
            data is processed entirely within your browser — zero text ever leaves your machine.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Column ↔ list both ways',
              'CSV-safe quoting',
              'SQL, JSON & Python presets',
              'Dedupe & sort',
            ]}
          >
            <CommaSeparator />
          </ToolShell>
        </div>

        <AdSlot slotId="comma-separator-ad-1" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Comma Separator</h2>
            <p>
              When you need to add commas to a list or turn spreadsheet columns into a comma delimited string for SQL, emails, or data analysis, this tool provides a fast, private workflow:
            </p>
            <ol>
              <li>
                <strong>Column → List:</strong> Paste any column from Excel, Google Sheets, or a plain text document.
                Select your preferred delimiter (comma, comma + space, semicolon, pipe, or tab).
              </li>
              <li>
                <strong>Automated Cleaning:</strong> Enable whitespace trimming, eliminate empty rows, remove duplicate entries
                (case-sensitive or case-insensitive), and sort entries using standard alphabetical, reverse, natural, or numeric ordering.
              </li>
              <li>
                <strong>Quoting &amp; Enclosures:</strong> Select double quotes, single quotes, or backticks, or leave on &quot;Auto (RFC 4180 CSV)&quot;
                to only quote items that contain commas, quotes, or line breaks.
              </li>
              <li>
                <strong>List → Column (Reverse):</strong> Paste any horizontal comma-separated or tab-separated string to unpack it back into vertical lines.
              </li>
              <li>
                <strong>Developer Presets:</strong> Switch to the Presets tab for one-click SQL <code>IN (...)</code> clauses, JSON arrays,
                Python lists, or Excel matrix constants.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>What Comma-Delimited Means</h2>
            <p>
              A <strong>comma-delimited</strong> format (most famously represented by <code>.csv</code> files) is a universal plain-text
              standard for serializing structured data. In this format, each horizontal value is separated by a punctuation character
              designated as the <em>delimiter</em>.
            </p>
            <p>
              The formal technical specification for comma-delimited files is published under <strong>RFC 4180</strong> by the Internet
              Engineering Task Force (IETF). While the concept is simple, amateur scripts often break when data entries contain commas
              themselves (such as addresses or corporate names like <em>&quot;Smith, John&quot;</em>). RFC 4180 solves this by defining
              strict quoting rules: fields containing delimiters must be enclosed in double quotation marks, and any literal quote inside
              must be escaped by doubling it (<code>&quot;&quot;</code>).
            </p>
          </section>

          <section className={styles.section}>
            <h2>Column to Comma-Separated List: Real-World Examples</h2>
            <p>
              Depending on where you intend to paste your formatted list, different syntax rules apply:
            </p>
            <ul>
              <li>
                <strong>Plain Comma-Separated (Standard CSV):</strong>
                <div className={styles.codeBlock}>
                  apple, &quot;Smith, John&quot;, &quot;say &quot;&quot;hi&quot;&quot;&quot;, banana
                </div>
              </li>
              <li>
                <strong>SQL IN Query List:</strong>
                <div className={styles.codeBlock}>
                  SELECT * FROM customers WHERE name IN (&apos;apple&apos;, &apos;O&apos;&apos;Brien&apos;, &apos;banana&apos;);
                </div>
              </li>
              <li>
                <strong>JSON String Array:</strong>
                <div className={styles.codeBlock}>
                  [&quot;apple&quot;, &quot;say \&quot;hi\&quot;&quot;, &quot;banana&quot;]
                </div>
              </li>
              <li>
                <strong>Python / JavaScript List Literal:</strong>
                <div className={styles.codeBlock}>
                  items = [&apos;apple&apos;, &apos;Smith, John&apos;, &apos;banana&apos;]
                </div>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Comma-Separated List Back to a Column (Reverse Parsing)</h2>
            <p>
              Splitting a delimited string back into vertical rows cannot be achieved with a simple naive split on commas,
              because an entry like <code>&quot;123 Main St, Suite 400&quot;</code> contains an embedded comma that is part of the address.
            </p>
            <p>
              Our reverse parser incorporates a full RFC 4180 state machine. When scanning your text, it tracks quotation state,
              correctly groups multiline blocks, unescapes double quotes (<code>&quot;&quot;</code> into <code>&quot;</code>), and outputs
              clean, individual rows ready to be pasted back into spreadsheet columns.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Handling Values That Contain Commas or Quotes</h2>
            <p>
              The most frequent pitfall in CSV generation is corruption caused by unquoted delimiters:
            </p>
            <div className={styles.calloutCard}>
              <p>Consider three input lines:</p>
              <ol>
                <li><code>apple</code></li>
                <li><code>Smith, John</code> (contains a comma)</li>
                <li><code>say &quot;hi&quot;</code> (contains quotes)</li>
              </ol>
              <p>
                <strong>Unquoted Output:</strong> <code>apple, Smith, John, say &quot;hi&quot;</code> — spreadsheet software now reads <em>Smith</em> and <em>John</em> as two separate columns!
              </p>
              <p>
                <strong>RFC 4180 Safe Output:</strong> <code>apple, &quot;Smith, John&quot;, &quot;say &quot;&quot;hi&quot;&quot;&quot;</code> — spreadsheet software correctly preserves exactly three distinct values.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Removing Duplicates and Sorting Lists</h2>
            <p>
              Lists copied from transactional logs, server traces, or user forms frequently contain duplicates and irregular casing.
              Our cleaning pipeline executes in an explicit, deterministic sequence:
            </p>
            <ol>
              <li><strong>Trim:</strong> Strips leading and trailing invisible spaces from each item.</li>
              <li><strong>Filter Empty:</strong> Deletes blank lines caused by accidental double returns.</li>
              <li><strong>Deduplicate:</strong> Removes repeat entries while preserving the first appearance. Choose case-sensitive or case-insensitive matching.</li>
              <li><strong>Sort:</strong> Order entries alphabetically (A–Z or Z–A), naturally (ensuring <em>item2</em> precedes <em>item10</em>), or numerically for ID numbers.</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>How to Convert Columns to Lists in Excel and Google Sheets</h2>
            <p>
              If you need to join columns directly within your spreadsheet without copying text out, use these verified native formulas:
            </p>
            <ul>
              <li>
                <strong>Microsoft Excel (Excel 2019, 2021, 2024, Microsoft 365, and Web):</strong>
                <div className={styles.codeBlock}>
                  =TEXTJOIN(&quot;, &quot;, TRUE, A2:A100)
                </div>
                <p>The second argument <code>TRUE</code> instructs Excel to ignore blank cells automatically.</p>
              </li>
              <li>
                <strong>Google Sheets:</strong>
                <div className={styles.codeBlock}>
                  =JOIN(&quot;, &quot;, FILTER(A2:A, A2:A&lt;&gt;&quot;&quot;))
                </div>
                <p>Using <code>FILTER</code> ensures empty cells at the bottom of open ranges are cleanly ignored before joining.</p>
              </li>
            </ul>
            <p>
              Need to inspect character lengths for database VARCHAR columns or check string storage bytes? Visit our free <Link href="/character-counter/">Character Counter</Link>. If your list contains financial figures or check values, you can convert them with our <Link href="/numbers-to-words/">Numbers to Words Converter</Link>, or analyze complete text and essay volume using our <Link href="/word-counter/">Word Counter</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqSection}>
              {faqs.map((item, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Related Writing &amp; Text Calculators</h2>
            <p>
              Explore our full suite of free client-side writing and editing tools:
            </p>
            <ul>
              <li>
                <Link href="/word-counter/">
                  <strong>Word Counter:</strong>
                </Link>{' '}
                Count words, characters, sentences, paragraphs and reading time with essay limits.
              </li>
              <li>
                <Link href="/numbers-to-words/">
                  <strong>Numbers to Words Converter:</strong>
                </Link>{' '}
                Convert numeric amounts to full words for checks, financial documents, and formal contracts.
              </li>
              <li>
                <Link href="/character-counter/">
                  <strong>Character Counter:</strong>
                </Link>{' '}
                Count characters, spaces, and UTF-8 storage bytes with live limit alerts.
              </li>
              <li>
                <Link href="/sentence-counter/">
                  <strong>Sentence Counter:</strong>
                </Link>{' '}
                Count sentences, paragraphs and lines with smart abbreviation handling.
              </li>
              <li>
                <Link href="/words-to-pages/">
                  <strong>Words to Pages Calculator:</strong>
                </Link>{' '}
                Convert word counts to printed pages for single, 1.5, and double line spacing.
              </li>
            </ul>
          </section>

          <HowWeCalculate slug="comma-separator" />
        </article>
      </div>
    </main>
  );
}
