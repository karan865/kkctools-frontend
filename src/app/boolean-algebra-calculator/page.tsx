import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/seo/buildMetadata';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Faq from '@/components/ui/Faq';
import JsonLd from '@/components/seo/JsonLd';
import { buildWebApplicationSchema } from '@/components/seo/buildSchema';
import ToolShell from '@/components/tool/shared/ToolShell';
import BooleanCalculator from '@/components/tool/boolean-calculator';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import { ROUTES } from '@/lib/routes';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.booleanCalculator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

export default function BooleanAlgebraCalculatorPage() {
  const faqs = [
    {
      q: 'How do you simplify a boolean expression?',
      a: 'Boolean expressions can be simplified using classical boolean theorems (such as De Morgan’s laws, distributive laws, and absorption rules) or algorithmic approaches like the Quine-McCluskey method and Karnaugh maps (K-maps). These identify redundant literal terms and group adjacent minterms to produce the minimal Sum of Products (SOP).',
    },
    {
      q: 'What are De Morgan’s laws?',
      a: 'De Morgan’s laws state that the negation of a conjunction is the disjunction of the negations: NOT (A AND B) ≡ (NOT A) OR (NOT B), and the negation of a disjunction is the conjunction of the negations: NOT (A OR B) ≡ (NOT A) AND (NOT B).',
    },
    {
      q: 'What are SOP (DNF) and POS (CNF) forms?',
      a: 'SOP (Sum of Products, or Disjunctive Normal Form) is an OR expression composed of AND terms (e.g. (A AND B) OR (C AND D)). POS (Product of Sums, or Conjunctive Normal Form) is an AND expression composed of OR clauses (e.g. (A OR B) AND (C OR D)).',
    },
    {
      q: 'How do I make a truth table?',
      a: 'A truth table tabulates all possible boolean values (0 and 1) for n variables, yielding 2ⁿ distinct input combinations. For each row, substitute the input values into the logic expression to determine whether the output evaluates to True (1) or False (0).',
    },
    {
      q: 'How do I prove two expressions are equivalent?',
      a: 'Two boolean expressions are logically equivalent if and only if they produce identical output values across all 2ⁿ rows of their combined truth table. If any input state produces differing outputs, that row serves as a counterexample disproving equivalence.',
    },
    {
      q: 'What is a Karnaugh map (K-map)?',
      a: 'A Karnaugh map is a visual two-dimensional grid of minterms organized according to Gray code ordering (where adjacent cells differ by exactly one binary digit). Grouping adjacent 1s in powers of two (1, 2, 4, 8, 16) allows immediate visual reduction of boolean expressions.',
    },
    {
      q: 'What is the order of operations in boolean algebra?',
      a: 'In formal digital logic and boolean algebra, the standard operator precedence from highest to lowest is: Parentheses (), Unary NOT (¬, !), Conjunction AND (&, ·), Exclusive OR XOR (⊕, ^), Disjunction OR (+, |), Implication (→), and Biconditional Equivalence (↔).',
    },
    {
      q: 'How do you add and subtract binary numbers?',
      a: 'Binary addition follows base-2 arithmetic rules: 0+0=0, 0+1=1, 1+0=1, and 1+1=10 (0 with a carry bit of 1 to the next column). For subtraction, the standard computing architecture converts the subtrahend into its two’s complement representation and adds it to the minuend.',
    },
    {
      q: 'What is two’s complement?',
      a: 'Two’s complement is the mathematical standard used by microprocessors to represent signed integers in binary. To form the two’s complement of a negative number in an N-bit system, invert all bits (one’s complement) and add 1. For example, in an 8-bit byte, −5 is represented as 11111011.',
    },
    {
      q: 'How do bitwise AND, OR and XOR work?',
      a: 'Bitwise operators execute boolean logic independently across corresponding bit positions of two binary words. Bitwise AND outputs 1 only when both bits are 1. Bitwise OR outputs 1 when at least one bit is 1. Bitwise XOR outputs 1 when the bits differ.',
    },
  ];

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`}>
      <div className="container">
        <Breadcrumbs
          items={[
            { name: 'Tools', path: '/tools/' },
            { name: 'Math & Finance', path: '/tools/#math' },
            { name: 'Boolean Algebra Calculator', path: route.path },
          ]}
        />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Boolean Algebra Calculator: Truth Tables, Simplification and Binary Maths
          </h1>
          <p className={styles.description}>
            Free boolean algebra calculator. Type any boolean expression to compute its full truth
            table, discover its minimal Sum of Products (SOP) via Quine-McCluskey reduction, verify
            symbolic equivalence, and calculate multi-base binary math with two&apos;s complement.
          </p>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Truth tables & K-maps',
              'Minimal SOP & POS',
              'Equivalence check',
              'Binary, hex & two\'s complement',
            ]}
          >
            <BooleanCalculator />
          </ToolShell>
        </div>

        <div className={styles.content}>
          <section className="prose">
            <h2>How to Use the Boolean Algebra Calculator</h2>
            <p>
              This digital logic calculator operates across three specialized tabs designed for
              students, electrical engineers, and computer scientists:
            </p>
            <ul>
              <li>
                <strong>Tab 1: Expression Simplification &amp; Truth Tables:</strong> Enter a boolean
                formula such as <code>(A AND B) OR (A AND NOT B)</code>. The engine parses the
                syntax tree, computes all 2<sup>n</sup> truth table states, and extracts the minimal
                Sum of Products (SOP) along with canonical minterm/maxterm notations.
              </li>
              <li>
                <strong>Tab 2: Equivalence Check:</strong> Enter two distinct expressions (such as{' '}
                <code>NOT(A AND B)</code> vs <code>NOT A OR NOT B</code>) to rigorously test whether
                they evaluate identically across all permutations. If they differ, the engine
                reports the exact counterexample variable assignment.
              </li>
              <li>
                <strong>Tab 3: Binary &amp; Bitwise Arithmetic:</strong> Enter two binary numbers to
                perform addition, subtraction, multiplication, integer division, and bitwise logic
                with configurable 8-bit, 16-bit, 32-bit, or 64-bit registers and two&apos;s
                complement representation.
              </li>
            </ul>

            <h2>Boolean Operators and Truth Tables</h2>
            <p>
              Digital circuits and computer systems process information using binary states: 1 (True,
              high voltage) and 0 (False, ground). The fundamental logical connectives operate as
              follows:
            </p>
            <ul>
              <li>
                <strong>AND (Conjunction &bull; &amp;, *, &middot;):</strong> True only when both
                inputs are True.
              </li>
              <li>
                <strong>OR (Disjunction &bull; |, +):</strong> True when at least one input is True.
              </li>
              <li>
                <strong>NOT (Negation &bull; !, ~, &not;):</strong> Unary inverter changing 0 to 1 and
                1 to 0.
              </li>
              <li>
                <strong>XOR (Exclusive OR &bull; ^, &oplus;):</strong> True when inputs differ (odd
                parity detector).
              </li>
            </ul>

            <h2>How to Simplify a Boolean Expression</h2>
            <p>
              Minimizing boolean logic reduces the physical gate count, silicon area, and power
              dissipation required in hardware implementations. Simplification relies on established
              axioms:
            </p>
            <ul>
              <li>
                <strong>Distributive Law:</strong> <code>A &middot; (B + C) = (A &middot; B) + (A &middot; C)</code>
              </li>
              <li>
                <strong>Complement Law:</strong> <code>B + NOT B = 1</code> and <code>B &middot; NOT B = 0</code>
              </li>
              <li>
                <strong>Absorption Law:</strong> <code>A + (A &middot; B) = A</code> and <code>A &middot; (A + B) = A</code>
              </li>
              <li>
                <strong>Identity Law:</strong> <code>A &middot; 1 = A</code> and <code>A + 0 = A</code>
              </li>
            </ul>
            <p>
              In our worked example, <code>(A AND B) OR (A AND NOT B)</code> factors out <code>A</code>{' '}
              to yield <code>A AND (B OR NOT B)</code>. Because <code>B OR NOT B</code> is universally{' '}
              <code>1</code>, the formula simplifies to <code>A AND 1 = A</code>.
            </p>

            <h2>SOP vs POS and Canonical Forms</h2>
            <p>
              Every boolean function can be uniquely described in canonical algebraic notation:
            </p>
            <ul>
              <li>
                <strong>Sum of Products (SOP / DNF):</strong> Formed by gathering all minterms (rows
                where the output is 1), represented as &Sigma;m(m<sub>1</sub>, m<sub>2</sub>, &hellip;).
              </li>
              <li>
                <strong>Product of Sums (POS / CNF):</strong> Formed by gathering all maxterms (rows
                where the output is 0), represented as &Pi;M(M<sub>1</sub>, M<sub>2</sub>, &hellip;).
              </li>
            </ul>

            <h2>NAND and NOR: Universal Gates</h2>
            <p>
              NAND and NOR gates are classified as universal gates because any combinational logic
              function (AND, OR, NOT, XOR) can be constructed solely using networks of NAND or NOR
              gates. In modern CMOS semiconductor fabrication, NAND gates are preferred due to their
              compact area and lower transistor parasitic capacitance.
            </p>

            <h2>Checking If Two Expressions Are Equivalent</h2>
            <p>
              When optimizing hardware or validating compiler transformations, verifying equivalence
              guarantees that replacement circuitry behaves identically under all operating
              conditions. For example, De Morgan&apos;s equivalence{' '}
              <code>NOT(A AND B) &equiv; NOT A OR NOT B</code> is proven by evaluating all four truth
              states: in each row (00, 01, 10, 11), both expressions evaluate to 1, 1, 1, 0
              respectively.
            </p>

            <h2>Binary Math: Add, Subtract and Convert</h2>
            <p>
              Binary arithmetic forms the foundation of Arithmetic Logic Units (ALUs). Adding{' '}
              <code>1011</code> (decimal 11) and <code>0110</code> (decimal 6) yields{' '}
              <code>10001</code> (decimal 17). The addition ripples carries from right to left:
            </p>
            <ul>
              <li>Column 0: 1 + 0 = 1 (carry 0)</li>
              <li>Column 1: 1 + 1 = 0 (carry 1)</li>
              <li>Column 2: 0 + 1 + 1 (carry) = 0 (carry 1)</li>
              <li>Column 3: 1 + 0 + 1 (carry) = 0 (carry 1)</li>
              <li>Column 4: 0 + 0 + 1 (carry) = 1</li>
            </ul>

            <h2>Bitwise Operations and Two&apos;s Complement</h2>
            <p>
              Computers represent signed integers using two&apos;s complement encoding. In an 8-bit
              register, the most significant bit (bit 7) serves as the sign bit. Positive integers
              range from 0 to 127, while negative integers range from -1 to -128. For example, to
              encode -5 in an 8-bit register:
            </p>
            <ol>
              <li>Start with positive 5: <code>00000101</code></li>
              <li>Invert all bits (one&apos;s complement): <code>11111010</code></li>
              <li>Add 1: <code>11111011</code> (hexadecimal <code>0xFB</code>)</li>
            </ol>

            <h2>How We Calculate (Digital Logic Methodology)</h2>
            <p>
              All logic parsing in this calculator is performed entirely client-side using a
              deterministic precedence-climbing Abstract Syntax Tree (AST) parser without any external
              network calls. Boolean minimization uses the Quine-McCluskey method to find the
              prime implicants, then searches every combination to pick the smallest cover (for up to 18
              candidate terms; larger cases fall back to a greedy choice). Multi-base arithmetic and
              two&apos;s complement conversions utilize JavaScript native arbitrary-precision BigInt
              arithmetic.
            </p>
            <p>
              Explore our related computational tools including the{' '}
              <Link href={ROUTES.ratioCalculator.path}>Ratio Calculator</Link> for proportional scaling and
              the upcoming <Link href={ROUTES.metricConversionCalculator.path}>Metric Conversion Calculator</Link>{' '}
              for scientific unit conversions.
            </p>

            <h2>Frequently Asked Questions</h2>
            <Faq items={faqs} />
          </section>

          <HowWeCalculate slug="boolean-algebra-calculator" />
        </div>
      </div>
      <JsonLd
          data={buildWebApplicationSchema({
            name: route.title,
            description: route.description,
            path: route.path,
            applicationCategory: 'EducationalApplication',
          })}
        />
      </main>
  );
}
