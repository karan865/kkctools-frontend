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
import {
  parseNumberInput,
  bigIntToWords,
  bigIntToIndianWords,
  toCheckAmount,
  toIndianChequeAmount,
  groupDigits,
  LARGE_NUMBER_NAMES,
} from '@/lib/number-words-engine';
import { NumbersToWordsCalculator } from '@/components/tool/numbers-to-words';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.numbersToWords || {
  title: 'Numbers to Words Converter – Amount in Words',
  description:
    'Free numbers to words converter. Turn any number or dollar amount into words for checks and invoices, with US and lakh / crore styles and ordinals.',
  path: '/numbers-to-words/',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How do I write a check amount in words (cents as /100)?',
    a: 'On a standard US check, write the whole dollar amount in words, followed by the word "and", and express the cents as a fraction over 100 followed by "dollars". For example, $5,075.62 is written: "Five thousand seventy-five and 62/100 dollars". Draw a straight line from the end of the text to the printed word "DOLLARS" to prevent unauthorized alterations.',
  },
  {
    q: 'When should numbers be written as words?',
    a: 'Style guides differ, so follow the one you were given. Two places always use words: the amount line of a check, and (in most guides) a number that starts a sentence.',
  },
  {
    q: 'Do you use "and" when writing numbers in words?',
    a: 'In US style the words for a whole number have no and: one hundred twenty-five. In UK style and comes before the tens: one hundred and twenty-five. On a US check, and comes before the cents: one hundred twenty-five and 50/100 dollars.',
  },
  {
    q: 'How do I write numbers in lakh and crore in the Indian numbering system?',
    a: 'In the Indian numbering system, digit grouping groups the first three digits on the right, followed by clusters of two digits. One lakh equals 1,00,000 (100,000 in International). One crore equals 1,00,00,000 (10 million in International). For example, 12,34,567 is written as "Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven".',
  },
  {
    q: 'How do I hyphenate compound numbers like forty-two?',
    a: 'Hyphenate all compound numbers between twenty-one (21) and ninety-nine (99), except for even tens (twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety). For larger numbers, do not place hyphens between hundreds or thousands (e.g., "one hundred twenty-five", "two thousand four hundred fifty-six").',
  },
  {
    q: 'How do I write ordinal numbers in words?',
    a: 'Ordinal numbers indicate position or sequence. Numbers 1, 2, and 3 have irregular forms: first (1st), second (2nd), and third (3rd). Most other numbers append "-th" (fourth, fifth, sixth). For numbers ending in "-y", change the "y" to "-ieth" (twentieth, thirtieth, fortieth). In compound numbers, only change the final word (twenty-first, forty-second).',
  },
  {
    q: 'How do I write decimals in words?',
    a: 'For casual and scientific writing, say "point" followed by each individual decimal digit (e.g., 3.1415 is "three point one four one five"). In formal and financial contexts, express the decimal as a fraction of tenths, hundredths, or thousandths (e.g., 4.75 is "four and seventy-five hundredths").',
  },
  {
    q: 'How do I convert English words back to a numeric number?',
    a: 'To convert words back to digits, split the verbal phrase into periods (millions, thousands, hundreds). In our Words to Number tab, entering "three hundred fifty" parses the hundreds and tens to output 350. The tool supports both International scales (millions/billions) and Indian scales (lakhs/crores).',
  },
  {
    q: 'How do commas separate periods in place value?',
    a: 'In mathematics, a "period" is a three-digit group separated by commas in standard international place value. The periods from right to left are: ones (units), thousands, millions, billions, and trillions. For example, 1,234,567 places 1 in the millions period, 234 in the thousands period, and 567 in the ones period.',
  },
  {
    q: 'What names come after trillion in large numbers?',
    a: 'On the short scale used in the US, the naming sequence continues in powers of 1,000: quadrillion (10^15), quintillion (10^18), sextillion (10^21), septillion (10^24), octillion (10^27), nonillion (10^30), and decillion (10^33).',
  },
  {
    q: 'How do I write rupees and paise on an Indian bank cheque?',
    a: 'Begin with the word "Rupees", write the rupee amount in Title Case using the Indian numbering system (Lakh/Crore), add the paise portion if applicable (e.g., "and Fifty Paise"), and conclude with the word "Only". For example: "Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only".',
  },
];

const SAMPLE_NUMBERS = [
  '42',
  '123',
  '1000',
  '1234567',
  '5075.62',
  '10000000',
  '123456789',
];

export default function NumbersToWordsPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Text & Writing', path: '/tools/#writing' },
    { name: 'Numbers to Words', path: route.path },
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
            Numbers to Words: Write Any Number or Amount in Words
          </h1>
          <p className={styles.subtitle}>
            Convert numbers, currency figures, and decimals into words. Get the words line for US checks
            and Indian cheques (lakh and crore), format ordinals, and turn spelled words back into digits.
          </p>

          <div className={styles.bluf}>
            Type a number to instantly see it in words with digit place value periods shown.
            For a check, <strong>$5,075.62</strong> is written <em>&quot;Five thousand seventy-five and 62/100 dollars&quot;</em>.
            For an Indian cheque, <strong>₹12,34,567.50</strong> is written <em>&quot;Rupees Twelve Lakh Thirty-Four Thousand Five Hundred Sixty-Seven and Fifty Paise Only&quot;</em>.
            You can also convert spelled words back into numbers.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'US check & Indian cheque formats',
              'Lakh & crore',
              'Ordinals & decimals',
              'Words back to numbers',
            ]}
          >
            <NumbersToWordsCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="numbers-to-words-ad-1" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Numbers to Words Converter</h2>
            <p>
              This number to words converter writes any figure, or an amount in words for a check or invoice. It has five tabs:
            </p>
            <ol>
              <li>
                <strong>Words Mode:</strong> Enter any integer or decimal number up to 10^36. Customize output using US or UK &quot;and&quot;
                conventions, select International (Millions/Billions) or Indian (Lakhs/Crores) place value, and choose sentence, title, or upper casing.
              </li>
              <li>
                <strong>Check (US) Mode:</strong> Enter an invoice or check payment amount. The tool writes the dollar words line with cents expressed as a fraction over 100, with a sample check preview.
              </li>
              <li>
                <strong>Cheque (India) Mode:</strong> Enter amounts in Indian Rupees. The tool formats the amount using lakh and crore periods,
                incorporates Paise decimals, and ends with &quot;Only&quot;.
              </li>
              <li>
                <strong>Ordinal Mode:</strong> Convert counting numbers into ranking sequence words (e.g., 21 into &quot;twenty-first&quot; and &quot;21st&quot;).
              </li>
              <li>
                <strong>Words → Number (Reverse):</strong> Type spelled English words (such as &quot;three hundred fifty&quot;) to immediately
                extract the exact numeric value (350) with formatted digit groupings.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>Rules for Writing Numbers in Words</h2>
            <p>
              Transforming numeric digits into clear, grammatically sound English prose requires adhering to several universal spelling conventions:
            </p>
            <ul>
              <li>
                <strong>Hyphenation (21 to 99):</strong> All compound numbers between 21 and 99 must be hyphenated when written out.
                Examples include <em>twenty-one</em>, <em>thirty-five</em>, <em>sixty-eight</em>, and <em>ninety-nine</em>.
                Numbers above ninety-nine do not use hyphens between place values: <em>one hundred twenty-three</em>, not <em>one-hundred-twenty-three</em>.
              </li>
              <li>
                <strong>The Use of &quot;And&quot;:</strong> In standard American English, the word &quot;and&quot; is left out between hundreds and tens. Writing &quot;three hundred and fifty&quot; is common in colloquial speech and British English,
                but American grammar reserves &quot;and&quot; strictly for decimal points or cents on financial checks.
              </li>
              <li>
                <strong>Handling Zero:</strong> The number 0 is written as &quot;zero&quot;. When dealing with negative numbers, standard
                mathematical style prefixes &quot;negative&quot; (or &quot;minus&quot; in casual context), while negative zero is normalized to &quot;zero&quot;.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Write an Amount in Words on a Check</h2>
            <p>
              Writing a personal or commercial paper check takes three steps:
            </p>
            <ol>
              <li>
                <strong>The Dollar Amount Box:</strong> Write the numerical figure clearly with a dollar sign, commas, and two decimal places (e.g., <code>$5,075.62</code>).
              </li>
              <li>
                <strong>The amount in words line:</strong> Write the dollar portion in words, capitalize the first letter, write &quot;and&quot;,
                and write the cents as a fraction over 100 (e.g., <code>Five thousand seventy-five and 62/100</code>).
              </li>
              <li>
                <strong>Fill the Trailing Space:</strong> If your written words do not extend all the way to the printed &quot;DOLLARS&quot; label,
                draw a firm, straight line through the remaining blank space. That leaves no room to add words.
              </li>
            </ol>
            <div className={styles.calloutCard}>
              <p>
                <strong>If the two amounts disagree:</strong> UCC § 3-114 says &quot;words prevail over numbers&quot; (<a href="https://www.law.cornell.edu/ucc/3/3-114" target="_blank" rel="noopener noreferrer">US law text</a>, checked 2026-11-22). So check that your words line says what you mean.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Rupees in Words: Lakh and Crore (Indian Numbering System)</h2>
            <p>
              India, Pakistan, Bangladesh, Nepal, and Sri Lanka utilize the South Asian numbering system, which groups digits
              differently from the Western three-digit convention after the initial thousand:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <caption>Indian Numbering Scale &amp; International Equivalents</caption>
                <thead>
                  <tr>
                    <th>Indian Unit</th>
                    <th>Indian Format</th>
                    <th>International Format</th>
                    <th>International Words</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>One Thousand</strong></td>
                    <td>1,000</td>
                    <td>1,000</td>
                    <td>One thousand</td>
                  </tr>
                  <tr>
                    <td><strong>Ten Thousand</strong></td>
                    <td>10,000</td>
                    <td>10,000</td>
                    <td>Ten thousand</td>
                  </tr>
                  <tr>
                    <td><strong>One Lakh</strong></td>
                    <td>1,00,000</td>
                    <td>100,000</td>
                    <td>One hundred thousand</td>
                  </tr>
                  <tr>
                    <td><strong>Ten Lakh</strong></td>
                    <td>10,00,000</td>
                    <td>1,000,000</td>
                    <td>One million</td>
                  </tr>
                  <tr>
                    <td><strong>One Crore</strong></td>
                    <td>1,00,00,000</td>
                    <td>10,000,000</td>
                    <td>Ten million</td>
                  </tr>
                  <tr>
                    <td><strong>Ten Crore</strong></td>
                    <td>10,00,00,000</td>
                    <td>100,000,000</td>
                    <td>One hundred million</td>
                  </tr>
                  <tr>
                    <td><strong>One Hundred Crore</strong></td>
                    <td>100,00,00,000</td>
                    <td>1,000,000,000</td>
                    <td>One billion</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              On Indian cheques the usual form is &quot;Rupees&quot;, then the words in Title Case,
              and concluding with &quot;Only&quot; (e.g., <em>Rupees Twenty-Five Thousand Only</em>). If paise are present, they are joined
              with &quot;and&quot; (e.g., <em>Rupees Ninety-Nine and Ninety-Nine Paise Only</em>).
            </p>
          </section>

          <section className={styles.section}>
            <h2>Ordinal Numbers in Words</h2>
            <p>
              While cardinal numbers indicate quantity (one, two, three), ordinal numbers specify rank, order, or date sequence:
            </p>
            <ul>
              <li><strong>Irregular Forms:</strong> 1 becomes <em>first</em> (1st), 2 becomes <em>second</em> (2nd), 3 becomes <em>third</em> (3rd), 5 becomes <em>fifth</em> (5th), 8 becomes <em>eighth</em> (8th), 9 becomes <em>ninth</em> (9th), and 12 becomes <em>twelfth</em> (12th).</li>
              <li><strong>Decades Ending in -y:</strong> Replace &quot;-y&quot; with &quot;-ieth&quot;. For instance, 20 becomes <em>twentieth</em> (20th), 30 becomes <em>thirtieth</em> (30th), and 50 becomes <em>fiftieth</em> (50th).</li>
              <li><strong>Compound Ordinals:</strong> Keep all leading words in their cardinal form and convert only the final word to an ordinal (e.g., 42 is <em>forty-second</em>, 112 is <em>one hundred twelfth</em>).</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Decimals and Negative Numbers</h2>
            <p>
              When expressing numbers with fractional decimals, two standard methods exist depending on audience expectations:
            </p>
            <ul>
              <li><strong>Point-Digit Method:</strong> Say &quot;point&quot; followed by each digit individually (e.g., <code>12.34</code> is <em>twelve point three four</em>). This prevents ambiguity in science, engineering, and mathematics.</li>
              <li><strong>Fractional Method:</strong> Group the decimal digits as a fraction of tenths, hundredths, or thousandths (e.g., <code>12.34</code> is <em>twelve and thirty-four hundredths</em>). In check writing, this appears as <code>34/100 dollars</code>.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Commas and Periods (Place Value Grouping)</h2>
            <p>
              In elementary mathematics and homework curricula, students frequently encounter questions asking to
              <em>&quot;rewrite the numbers with commas separating the periods&quot;</em>.
            </p>
            <p>
              A <strong>period</strong> represents a 3-digit place value category. In the international system,
              every period from right to left contains hundreds, tens, and ones:
            </p>
            <div className={styles.calloutCard}>
              <p>For the number <code>1234567</code>:</p>
              <ul>
                <li><strong>Millions period:</strong> 1</li>
                <li><strong>Thousands period:</strong> 234</li>
                <li><strong>Ones period:</strong> 567</li>
                <li><strong>Grouped with commas:</strong> <code>1,234,567</code></li>
              </ul>
            </div>
            <p>
              In the Indian numbering system, the first period contains three digits (ones), while all subsequent periods
              (thousands, lakhs, crores) contain two digits: <code>12,34,567</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Words Back to Numbers (Reverse Conversion)</h2>
            <p>
              Converting verbal text back into numeric digits requires identifying scale multipliers (hundred, thousand, million, billion, lakh, crore)
              and summing individual group values.
            </p>
            <p>
              Our reverse parser tokenizes words, ignores conversational connectors like &quot;and&quot;, recognizes hyphenated compound numbers,
              and converts phrases like <em>&quot;three hundred fifty&quot;</em> directly into <strong>350</strong>.
              It also resolves Indian scale phrases such as <em>&quot;twelve lakh thirty-four thousand&quot;</em> into <strong>12,34,000</strong>.
            </p>
            <p>
              Need to create a complete commercial bill? Use our free <Link href="/invoice-generator/">Invoice Generator</Link> to produce itemized client invoices, calculate pre-tax amounts using our <Link href="/reverse-sales-tax-calculator/">Reverse Sales Tax Calculator</Link>, or format columns of numbers into separated lists with our <Link href="/comma-separator/">Comma Separator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Reference: Standard Sample Numbers in Words</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <caption>Sample Numbers Written in International Words &amp; Check Formats</caption>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>International Words</th>
                    <th>US Check Format</th>
                    <th>Indian Cheque Format</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_NUMBERS.map((n) => {
                    const parsed = parseNumberInput(n);
                    const intWords = parsed
                      ? bigIntToWords(parsed.intPart, { style: 'us' }) +
                        (parsed.fracStr
                          ? ` point ${parsed.fracStr.split('').map((d) => bigIntToWords(BigInt(d))).join(' ')}`
                          : '')
                      : '';
                    const checkLine = toCheckAmount(n) || '';
                    const chequeLine = toIndianChequeAmount(n) || '';

                    return (
                      <tr key={n}>
                        <td><strong>{n}</strong></td>
                        <td>{intWords}</td>
                        <td>{checkLine}</td>
                        <td>{chequeLine}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Names of Large Numbers</h2>
            <p>
              Each short-scale name is 1,000 times the one before it. Lakh and crore are shown where they fall between them:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <caption>Names of Large Numbers in International and Indian Systems</caption>
                <thead>
                  <tr>
                    <th>Scale Name</th>
                    <th>Scientific (Power of 10)</th>
                    <th>Digits</th>
                    <th>Number System</th>
                    <th>Example Format</th>
                  </tr>
                </thead>
                <tbody>
                  {LARGE_NUMBER_NAMES.map((item) => (
                    <tr key={item.name}>
                      <td><strong>{item.name}</strong></td>
                      <td>10<sup>{item.powerOfTen}</sup></td>
                      <td>{item.digits} digits</td>
                      <td>{item.system}</td>
                      <td><code>{item.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <h2>Related Financial &amp; Writing Calculators</h2>
            <p>
              Explore our full suite of free client-side financial and text tools:
            </p>
            <ul>
              <li>
                <Link href="/invoice-generator/">
                  <strong>Invoice Generator:</strong>
                </Link>{' '}
                Create professional PDF invoices with automatic tax, discounts, and line-item totals.
              </li>
              <li>
                <Link href="/reverse-sales-tax-calculator/">
                  <strong>Reverse Sales Tax Calculator:</strong>
                </Link>{' '}
                Calculate pre-tax prices and sales tax breakdowns from gross totals.
              </li>
              <li>
                <Link href="/comma-separator/">
                  <strong>Comma Separator:</strong>
                </Link>{' '}
                Convert lists of numbers or values into comma-delimited text or SQL queries.
              </li>
              <li>
                <Link href="/word-counter/">
                  <strong>Word Counter:</strong>
                </Link>{' '}
                Count words, characters, sentences, and paragraphs with live limit tracking.
              </li>
              <li>
                <Link href="/character-counter/">
                  <strong>Character Counter:</strong>
                </Link>{' '}
                Count characters, letters, spaces, and UTF-8 bytes with live progress bars.
              </li>
            </ul>
          </section>

          <HowWeCalculate slug="numbers-to-words" />
        </article>
      </div>
    </main>
  );
}
