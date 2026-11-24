import React from 'react';
import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';
import ToolShell from '@/components/tool/shared/ToolShell';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { BudgetCalculator } from '@/components/tool/budget-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import AdSlot from '@/components/ads/AdSlot';
import { ROUTES } from '@/lib/routes';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.budgetCalculator ?? {
  path: '/budget-calculator/',
  title: 'Budget Calculator – Monthly Budget Planner 50/30/20',
  description:
    'Free monthly budget calculator. List income and expenses, compare them with the 50/30/20 rule and print a budget worksheet. Nothing leaves your browser.',
};

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
  absoluteTitle: true,
});

const FAQ_ITEMS = [
  {
    q: 'What is the 50/30/20 rule?',
    a: 'The 50/30/20 rule is a popular budgeting framework that allocates after-tax income into three broad buckets: 50% for essential needs (housing, utilities, groceries), 30% for discretionary wants (dining out, entertainment), and 20% for financial goals (emergency savings, debt elimination).',
  },
  {
    q: 'How do I make a budget step by step?',
    a: 'Calculate your total monthly take-home pay, list all fixed and variable monthly expenses, tag each expense into needs, wants, or savings, compare your percentages against a benchmark rule like 50/30/20, and adjust discretionary spending to eliminate shortfalls.',
  },
  {
    q: 'What counts as a need vs. a want?',
    a: 'Needs represent non-negotiable living obligations required to maintain employment and basic health: rent/mortgage, minimum debt payments, utilities, basic groceries, and insurance. Wants represent optional choices: streaming subscriptions, dining out, recreation, and vacations.',
  },
  {
    q: 'How do I budget with irregular or freelance income?',
    a: 'Base your baseline monthly spending plan on your lowest-earning month from the prior year. When higher-earning months occur, route all surplus earnings into a dedicated buffer account or sinking fund to smooth lean periods.',
  },
  {
    q: 'Should I calculate my budget using gross pay or take-home pay?',
    a: 'Always budget using net take-home pay (after payroll taxes, Social Security, and employer health insurance deductions). Budgeting from gross pay overstates the money you can actually spend, because taxes and deductions are taken out first.',
  },
  {
    q: 'Where do minimum debt payments belong in the 50/30/20 rule?',
    a: 'Minimum mandatory payments on credit cards, mortgages, and student loans count as Needs because failing to pay damages credit scores. Any additional or accelerated principal payments above the minimum count toward the 20% Savings/Debt bucket.',
  },
  {
    q: 'What if my essential needs take more than 50% of my income?',
    a: 'Then the 50/30/20 split will show a gap on Needs. You can compare another split in the Compare tab (for example 60/20/20 or 70/20/10), trim wants, or work on lowering fixed costs over time. These splits are planning guides, not rules.',
  },
  {
    q: 'What is the 70/20/10 rule?',
    a: 'The 70/20/10 rule allocates 70% to daily living expenses (needs plus basic wants), 20% to savings and debt reduction, and 10% to donations or investments. It is one alternative to 50/30/20; use whichever split fits your plan.',
  },
  {
    q: 'Is there a free budget worksheet I can print?',
    a: 'Yes. Use our Print Budget Worksheet button to generate a clean, printer-optimized physical ledger sheet formatted for standard Letter and A4 paper.',
  },
  {
    q: 'Can I use this calculator as an Excel budget template?',
    a: 'Yes. Click Download Spreadsheet (.CSV) to export your exact income sources, itemized bills, and 50/30/20 variance calculations into a universal CSV spreadsheet compatible with Microsoft Excel, Google Sheets, and Apple Numbers.',
  },
  {
    q: 'How often should I review and update my monthly budget?',
    a: 'Review your budget at the start of each month to reconcile actual spending against your targets and account for seasonal expenses, insurance renewals, or changes in pay frequency.',
  },
];

export default function BudgetPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Monthly Budget Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: route.description,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Budget Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Monthly Budget Calculator: Plan Income, Bills and Savings
          </h1>
          <p className={styles.subtitle}>
            Organize personal finances using the 50/30/20 rule or custom percentage splits. Itemize take-home
            pay and living expenses with instant spreadsheet export and printable worksheets.
          </p>

          <div className={styles.bluf}>
            <strong>Bottom Line Up Front:</strong> List your take-home pay, tag every expense as a need, a want
            or savings, and see what&apos;s left over. Under the 50/30/20 guideline, a $5,000 monthly take-home
            income designates $2,500 for needs, $1,500 for wants, and $1,000 for savings. Print a clean
            budgeting worksheet or download it directly as an Excel/Sheets spreadsheet.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Needs, wants & savings',
              '50/30/20 or custom split',
              'Printable worksheet & CSV',
              'Saved only on your device',
            ]}
          >
            <BudgetCalculator />
          </ToolShell>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <HowWeCalculate slug="budget-calculator" />

        <div className={styles.contentSection}>
          <article className={styles.prose}>
            <h2>How to Use the Budget Calculator</h2>
            <p>
              This budgeting planner operates 100% locally on your computer or phone. Your personal income
              and expense figures are never uploaded, stored on servers, or tracked:
            </p>
            <ol>
              <li>
                <strong>Monthly Budget:</strong> Add all household income sources with their exact pay frequency
                (weekly, bi-weekly, semi-monthly, or monthly). The engine normalizes every stream into an exact
                monthly figure.
              </li>
              <li>
                <strong>Tag Every Expense:</strong> Assign each expense item to one of three buckets:
                <strong> Needs</strong>, <strong>Wants</strong>, or <strong>Savings/Debt</strong>. Check the
                sinking-fund box on annual bills (e.g. auto insurance) to amortize them across 12 months.
              </li>
              <li>
                <strong>Compare with a Rule:</strong> Toggle between 50/30/20, 70/20/10, 60/20/20, or custom
                allocation guidelines to view your variance gap in dollars and percentages.
              </li>
              <li>
                <strong>Export &amp; Print:</strong> Download your finished budget plan as a clean CSV spreadsheet
                file or print a formatted physical ledger sheet.
              </li>
            </ol>

            <h2>How to Budget Money in 5 Steps</h2>
            <p>
              Creating a sustainable household cash flow plan requires five systematic steps:
            </p>
            <ol>
              <li>
                <strong>Determine True Take-Home Pay:</strong> Sum your net direct deposits after mandatory payroll
                withholdings. If you receive 26 bi-weekly paychecks per year, multiply your paycheck by 26 and divide
                by 12 to find your true monthly baseline.
              </li>
              <li>
                <strong>List Essential Fixed Obligations:</strong> Record non-negotiable survival expenses: housing
                rent or mortgage, required utilities, essential groceries, transportation, and health coverage.
              </li>
              <li>
                <strong>Track Discretionary Spending:</strong> Audit bank statements for discretionary spending:
                takeout dining, entertainment, fitness subscriptions, apparel, and hobbies.
              </li>
              <li>
                <strong>Establish Financial Buffer:</strong> Allocate funds toward high-interest debt elimination,
                an emergency savings fund (3 to 6 months of living expenses), and long-term retirement accounts.
              </li>
              <li>
                <strong>Reconcile and Automate:</strong> Compare actual expenditures against your target guideline.
                If needs exceed 50%, trim discretionary wants or reallocate non-essential line items until surplus cash remains.
              </li>
            </ol>

            <h2>The 50/30/20 Rule Explained</h2>
            <p>
              Popularized by bankruptcy scholar Elizabeth Warren and Amelia Warren Tyagi in <em>All Your Worth:
              The Ultimate Lifetime Money Plan</em> (2005), the 50/30/20 rule divides net take-home earnings into
              three distinct categories:
            </p>
            <ul>
              <li>
                <strong>50% for Needs:</strong> Essential living expenses required to survive and maintain basic employment.
              </li>
              <li>
                <strong>30% for Wants:</strong> Discretionary lifestyle choices that enhance quality of life but are not strictly necessary.
              </li>
              <li>
                <strong>20% for Savings &amp; Debt Paydown:</strong> Emergency savings, retirement contributions, and accelerated debt payoff.
              </li>
            </ul>
            <p>
              <strong>Worked Baseline Example:</strong>
            </p>
            <p style={{ fontFamily: 'monospace', padding: '10px 14px', background: 'var(--surface-subtle)', borderRadius: '6px' }}>
              Monthly Take-Home Income: $5,000.00
              <br />
              Needs Target (50%): $2,500.00 | Actual Needs: $2,750.00 (Gap: +$250.00 over target)
              <br />
              Wants Target (30%): $1,500.00 | Actual Wants: $1,000.00 (Gap: −$500.00 under target)
              <br />
              Savings Target (20%): $1,000.00 | Actual Savings: $750.00 (Gap: −$250.00 under target)
              <br />
              Total Expenses: $4,500.00 | Monthly Leftover Surplus: <strong>+$500.00</strong>
            </p>

            <h2>Needs, Wants and Savings: What Goes Where?</h2>
            <p>
              Misclassifying expenses is the most common reason budgeting attempts fail. Follow these standard guidelines:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <thead>
                  <tr>
                    <th>Bucket</th>
                    <th>Standard Inclusions</th>
                    <th>Important Exceptions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Needs (50%)</strong></td>
                    <td>Rent, mortgage, groceries, water, electric, basic phone, auto insurance, minimum loan payments</td>
                    <td>Premium cable packages, organic specialty groceries, or luxury lease upgrades belong in Wants</td>
                  </tr>
                  <tr>
                    <td><strong>Wants (30%)</strong></td>
                    <td>Restaurants, streaming services, concerts, gym memberships, vacations, fashion shopping</td>
                    <td>Work uniforms or essential safety equipment count as Needs</td>
                  </tr>
                  <tr>
                    <td><strong>Savings (20%)</strong></td>
                    <td>High-yield savings deposits, 401(k) / IRA contributions, extra credit card principal paydown</td>
                    <td>Minimum required debt payments count as Needs to protect credit ratings</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Other Budgeting Rules: 70/20/10 and 60/20/20</h2>
            <p>
              When 50/30/20 does not fit your household cost structure, alternative allocation percentages offer
              pragmatic flexibility:
            </p>
            <ul>
              <li>
                <strong>70/20/10 Rule:</strong> 70% for combined living expenses (needs and basic lifestyle),
                20% for savings and investments, and 10% for debt payoff or charitable giving.
              </li>
              <li>
                <strong>60/20/20 Rule:</strong> 60% committed expenses, 20% savings, and 20% discretionary wants.
              </li>
              <li>
                <strong>80/20 Rule:</strong> 80% for all living and lifestyle expenses combined, with 20% automatically
                diverted to savings the moment paychecks clear.
              </li>
            </ul>

            <h2>Budgeting with Irregular Income</h2>
            <p>
              Contractors, tipped workers, real estate agents, and small business owners often face variable monthly earnings.
              To maintain financial stability:
            </p>
            <ul>
              <li>
                <strong>Establish a Baseline Month:</strong> Identify your lowest monthly income over the past 12 months.
                Budget your essential Needs exclusively to that lowest figure.
              </li>
              <li>
                <strong>The Sinking Fund Method:</strong> For large annual or semi-annual bills (property taxes, insurance,
                car maintenance), divide the total expected annual cost by 12. Deposit that exact sum into a dedicated
                sinking fund each month so the money is there when the bill arrives.
              </li>
            </ul>

            <h2>Printable Budgeting Worksheet</h2>
            <p>
              Many people maintain tighter spending discipline when tracking cash flows on paper. Click the
              <strong> Print Budget Worksheet</strong> button above to render a distraction-free, print-optimized
              physical workbook page formatted for home printers.
            </p>

            <h2>Use It as an Excel or Google Sheets Budget Template (CSV)</h2>
            <p>
              If you manage your household finances using spreadsheet software, click <strong>Download Spreadsheet (.CSV)</strong>.
              The exported file contains structured rows with escaped fields for your income sources, itemized bills, and
              the 50/30/20 allocation variance table. It opens seamlessly in Microsoft Excel, Google Sheets, or LibreOffice Calc.
            </p>
            <p>
              For loan payoff modeling, explore our{' '}
              <Link href="/credit-card-payoff-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                Credit Card Payoff Calculator
              </Link>{' '}
              or calculate long-term balance accumulation with the{' '}
              <Link href="/compound-interest-calculator/" style={{ color: 'var(--cat-math)', fontWeight: 600 }}>
                Compound Interest Calculator
              </Link>.
            </p>

            <section className={styles.faqSection}>
              <h2>Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </section>

            <div className={styles.disclaimer}>
              <strong>Planning Disclaimer:</strong> This budget calculator is an educational planning tool, not
              formal financial or legal advice. Review your specific tax circumstances and debt obligations with a
              certified financial planner or licensed accountant.
            </div>
          </article>
        </div>

        <AdSlot slotId="budget-calc-ad-bottom" format="horizontal" />
      </div>
    </main>
  );
}
