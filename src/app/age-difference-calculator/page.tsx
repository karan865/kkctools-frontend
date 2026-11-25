import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AgeCalculator from '@/components/tool/age-difference-calculator';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import AdSlot from '@/components/ads/AdSlot';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.css';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';

export const dynamic = 'force-static';

const route = ROUTES.ageDifferenceCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How do I calculate the age difference between two people?',
    a: 'To calculate the exact age difference, count the number of full calendar years between the earlier birthdate and the later birthdate, then count the remaining full months, and finally count the remaining calendar days. For example, between 15 March 1990 and 2 July 1994, the gap is 4 years, 3 months, and 17 days (1,570 total days).',
  },
  {
    q: 'How much older is one person than another?',
    a: 'Subtract the earlier date of birth from the later date of birth using calendar month-stepping. The person with the earlier calendar birthdate is older by the resulting years, months, and days. The calculator automatically identifies who is older and prints a direct comparison sentence.',
  },
  {
    q: 'What date of birth do you need to be 21 (or 18) today?',
    a: 'Subtract the required number of years from today’s date. For example, as of 22 November 2026, a person must have been born on or before 22 November 2005 to be at least 21 years old. For non-leap years, February 29 birthdays clamp to February 28.',
  },
  {
    q: 'How are leap years and February 29 birthdays handled?',
    a: 'In leap years, February has 29 days. When stepping across common years that only have 28 days in February, the calendar clamps to 28 February so that calculation dates remain strictly valid without introducing artificial negative days.',
  },
  {
    q: 'How many days or weeks apart are two birthdays?',
    a: 'Total days are calculated by taking the absolute mathematical difference between the two dates expressed in UTC epoch days. Divide total days by 7 to find total full weeks and remaining days. For example, 1,570 days equals 224 full weeks plus 2 days.',
  },
  {
    q: 'Can I find the age gap from birth years only?',
    a: 'Subtracting birth years alone (e.g. 1994 − 1990 = 4) gives the difference in calendar years. However, depending on whether the birthday has already passed in the current year, the true chronological age gap can be 3, 4, or 5 years. Exact age difference calculations require day and month inputs.',
  },
  {
    q: 'Does the order of the dates matter?',
    a: 'No. The calculator automatically checks which date is earlier, designates that individual as the older person, and calculates the absolute difference so the order of entry does not affect the mathematical result.',
  },
  {
    q: 'Can I compare more than two people, like siblings?',
    a: 'Yes. Switch to the Family & Group List tab to enter up to 10 family members or friends. The calculator sorts everyone from oldest to youngest, displays pairwise gaps between consecutive siblings, and determines the total age spread from oldest to youngest.',
  },
  {
    q: 'Why do some calculators give a different number of days?',
    a: 'Calculators differ in how they handle uneven month lengths. A shortcut that treats every month as 30 days, or that "borrows" days from the previous month, can land a day or two away from a calendar count, and can even give negative days (31 January to 1 March). This calculator steps forward whole calendar months, with real month lengths of 28, 29, 30 and 31 days, and then counts the leftover days.',
  },
  {
    q: 'What is the "half your age plus seven" rule?',
    a: 'The "half your age plus seven" rule is an informal folk heuristic: it says the youngest partner age people tend to find socially acceptable is half your age plus seven years. For a 30-year-old that is 22. It is a rule of thumb only, with no scientific or legal standing.',
  },
];

export default function AgeDifferenceCalculatorPage() {
  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Age Difference Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>Age Difference Calculator: How Much Older Is One Person?</h1>
          <p className={styles.subtitle}>
            Use this age difference calculator to find the exact gap in years, months, and days between any two birthdays, a whole family, or target age deadlines.
          </p>

          <div className={styles.bluf}>
            Enter two dates of birth to see the exact age difference. Someone born on 15 March 1990 is 4 years, 3 months and 17 days older than someone born on 2 July 1994: 1,570 days in total.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Years, months & days',
              'Family list sorted by age',
              'Born-on-or-before dates',
              'Leap-year correct',
            ]}
          >
            <AgeCalculator />
          </ToolShell>
        </div>

        <AdSlot slotId="age-calc-ad-mid" format="horizontal" />

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Age Difference Calculator</h2>
            <p>
              This tool provides four flexible calendar modes to analyze age differences and milestone dates:
            </p>
            <ul>
              <li><strong>1. Two People:</strong> Enter birthdates for Person A and Person B along with an optional &quot;as-of&quot; date to compute the exact gap in years, months, days, total weeks, and days, plus each person&apos;s current age.</li>
              <li><strong>2. Family &amp; Group List:</strong> Add between 2 and 10 family members or colleagues. The tool automatically sorts everyone chronologically (oldest first), calculates age gaps between siblings, and displays total family spread.</li>
              <li><strong>3. Born On or Before:</strong> Determine the exact calendar cutoff date required to reach an age threshold (e.g. 18, 21, or 65) as of any date.</li>
              <li><strong>4. Quick: Birth Years:</strong> Compare two birth years directly to inspect calendar year gaps and potential age ranges.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How Age Difference is Calculated (Month-Stepping)</h2>
            <p>
              Calculating age differences across real calendars is more nuanced than simple arithmetic subtraction because months vary in length (28, 29, 30, or 31 days) and leap years add an extra day to February every four years.
            </p>
            <p>
              Many naive online tools use a flawed &quot;borrowing&quot; rule that borrows 30 days from preceding months, producing nonsensical negative day intervals (such as Jan 31 to March 1 giving 0 months and −2 days).
            </p>
            <p>
              Our calculator implements the rigorous <strong>Month-Stepping Algorithm</strong>:
            </p>
            <ol>
              <li>Order the two birthdates chronologically so that Date A is earlier and Date B is later.</li>
              <li>Find the largest integer number of whole months <em>k</em> such that stepping forward from Date A by <em>k</em> clamped months remains less than or equal to Date B.</li>
              <li>Extract full years as <code>Math.floor(k / 12)</code> and remaining full months as <code>k % 12</code>.</li>
              <li>Determine remaining days by calculating the exact UTC day difference between Date B and the stepped date.</li>
            </ol>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>Worked Example: 15 March 1990 vs. 2 July 1994</div>
              <p style={{ margin: 0 }}>
                1. Step forward by 4 full years to 15 March 1994.<br />
                2. Step forward by 3 full months to 15 June 1994 (total k = 51 months).<br />
                3. June has 30 days; 15 June to 30 June = 15 days, plus 2 days in July = 17 days.<br />
                4. Total result = <strong>4 years, 3 months, and 17 days</strong> (1,570 calendar days).
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Leap Years and February 29 Birthdays</h2>
            <p>
              A leap year occurs every four years when the year is divisible by 4, except for century years that are not divisible by 400 (e.g. 2000 was a leap year, but 1900 was not). This extra day (February 29) creates specific calendar scenarios:
            </p>
            <ul>
              <li><strong>Leap Day Birthdays:</strong> In common 365-day years that have no February 29, this calculator counts a 29 February birthday as falling on 28 February. Some people and some legal systems use 1 March instead, which is why answers can differ by one day.</li>
              <li><strong>Exact Interval Precision:</strong> When counting total days between dates, every February 29 that occurred chronologically within the range adds exactly 1 day to the total day count.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Comparing Ages in a Whole Family</h2>
            <p>
              When evaluating sibling age gaps or family generations, comparing dates in pairs can be cumbersome. The <strong>Family List</strong> tab allows entering multiple family members at once:
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.contentTable}>
                <caption>Sample family age list sorted from oldest to youngest as of 23 Nov 2026</caption>
                <thead>
                  <tr>
                    <th>Family Member</th>
                    <th>Date of Birth</th>
                    <th>Age as of 23 Nov 2026</th>
                    <th>Gap to Next Person</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Alex</strong></td>
                    <td>1990-03-15</td>
                    <td>36 y, 8 m, 8 d</td>
                    <td>4 y, 3 m, 17 d</td>
                  </tr>
                  <tr>
                    <td><strong>Sam</strong></td>
                    <td>1994-07-02</td>
                    <td>32 y, 4 m, 21 d</td>
                    <td>5 y, 5 m, 30 d</td>
                  </tr>
                  <tr>
                    <td><strong>Charlie</strong></td>
                    <td>2000-01-01</td>
                    <td>26 y, 10 m, 22 d</td>
                    <td>— (Youngest)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              In this example, the total family spread from oldest (Alex) to youngest (Charlie) is <strong>9 years, 9 months, and 17 days</strong>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What Date of Birth Makes You 21 (or 18) Today?</h2>
            <p>
              Whether checking eligibility for age-restricted venues, voting, vehicle rentals, or retirement benefits, you need to know the latest date of birth that qualifies:
            </p>
            <div className={styles.exampleBox}>
              <div className={styles.exampleTitle}>21st Birthday Cutoff Example</div>
              <p style={{ margin: 0 }}>
                As of <strong>22 November 2026</strong>, someone turning 21 must have been born on or before <strong>22 November 2005</strong>. Anyone born on 23 November 2005 or later is still 20 years old.
              </p>
            </div>
            <p>
              <em>Note:</em> KKC Tools provides mathematical date calculations. Always confirm official age verification regulations with local statutory guidelines.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Age Gap from Birth Years Only</h2>
            <p>
              When people ask &quot;how many years apart are we?&quot;, they often simply subtract birth years: <code>1994 − 1990 = 4 years</code>.
            </p>
            <p>
              However, calendar birth year subtraction is only an approximation. Depending on whether each individual&apos;s birthday has already passed during the current calendar year:
            </p>
            <ul>
              <li>If the earlier person has celebrated their birthday this year but the younger has not, the actual age difference is <strong>5 years</strong>.</li>
              <li>If both have had their birthdays (or neither has), the age difference is <strong>4 years</strong>.</li>
              <li>If the younger person has celebrated their birthday but the older has not, the age difference is <strong>3 years</strong>.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Age Gaps in Relationships: The &quot;Half-Your-Age-Plus-Seven&quot; Heuristic</h2>
            <p>
              In popular culture, romantic age differences are frequently referenced alongside the informal <em>&quot;half your age plus seven&quot;</em> rule. This social heuristic states that the minimum socially acceptable age for a romantic partner is calculated as:
            </p>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Minimum Partner Age = (Your Age ÷ 2) + 7
            </p>
            <p>
              For example, for a 30-year-old, the heuristic suggests a lower bound of (30 ÷ 2) + 7 = 22 years old. For a 40-year-old, the formula gives 27 years old. It is only an informal rule of thumb and has no legal or scientific standing. For comparing numeric values by percentage rather than dates, see the <Link href="/percentage-change-calculator/">Percentage Change Calculator</Link>, or switch between units using the <Link href="/metric-conversion-calculator/">Metric Conversion Calculator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.q}</h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </section>

          <HowWeCalculate slug="age-difference-calculator" />

          <section className={styles.section}>
            <h2>Related Calculators &amp; Converters</h2>
            <div className={styles.relatedGrid}>
              <Link href="/ratio-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Ratio Calculator</div>
                <div className={styles.relatedCardDesc}>Simplify ratios, solve proportions for x, and divide amounts into exact parts.</div>
              </Link>
              <Link href="/percentage-change-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Percentage Change Calculator</div>
                <div className={styles.relatedCardDesc}>Calculate percentage increases, drops, and relative differences between numbers.</div>
              </Link>
              <Link href="/unit-price-calculator/" className={styles.relatedCard}>
                <div className={styles.relatedCardTitle}>Unit Price Calculator</div>
                <div className={styles.relatedCardDesc}>Compare grocery sizes and retail items to find the most cost-effective unit rate.</div>
              </Link>
            </div>
          </section>
        </article>

        <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'EducationalApplication',
          })}
        />
        <JsonLd data={buildFaqSchema(faqs)} />
      </div>
    </main>
  );
}
