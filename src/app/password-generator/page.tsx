import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { toolDisplayFont } from '@/lib/fonts';
import typo from '@/styles/tool-typography.module.css';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ToolShell from '@/components/tool/shared/ToolShell';
import HowWeCalculate from '@/components/seo/HowWeCalculate';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/components/seo/buildMetadata';
import { buildFaqSchema, buildWebApplicationSchema } from '@/components/seo/buildSchema';
import { ROUTES } from '@/lib/routes';
import {
  DEFAULT_PASSWORD_OPTIONS,
  DEFAULT_SYMBOL_CHARS,
  entropyBits,
} from '@/lib/password-engine';
import PasswordGenerator from '@/components/tool/password-generator';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.passwordGenerator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'How long should a password be?',
    a: 'Under NIST SP 800-63B rev 4 (§3.1.1.2), websites should require at least 15 characters when a password is the sole authentication factor, or at least 8 characters when paired with multi-factor authentication (MFA), and allow at least 64 characters. CISA (archived guidance page) also recommends at least 16 characters.',
  },
  {
    q: 'What makes a password strong?',
    a: 'Strength comes from unpredictability (high entropy in bits) and length, not predictable substitutions. A 16-character password drawn uniformly from 94 printable ASCII characters provides 104.59 bits of entropy (with at least one character from each set), making exhaustive guessing infeasible.',
  },
  {
    q: 'What are the special characters for passwords?',
    a: `The 32 non-space ASCII special characters listed in OWASP Password Special Characters are: ${DEFAULT_SYMBOL_CHARS} (plus space, making 33 total). If a specific website rejects certain symbols, you can edit the Custom Symbol Set field in the generator.`,
  },
  {
    q: 'Is it safe to use an online password generator?',
    a: 'Only if generation runs entirely in your local browser with a cryptographic random number generator and never contacts a remote server. This tool generates passwords client-side using Web Crypto (crypto.getRandomValues), stores nothing, and continues working offline after the page loads.',
  },
  {
    q: 'Should I change my password regularly?',
    a: 'No. NIST SP 800-63B rev 4 (§3.1.1.2) states that verifiers shall not require subscribers to change passwords periodically. Change a password only if there is evidence of compromise or unauthorized access.',
  },
  {
    q: 'Do I need upper and lower case letters?',
    a: 'NIST SP 800-63B rev 4 states that verifiers shall not impose composition rules requiring specific mixtures of character types. However, including uppercase, lowercase, digits, and symbols increases the character pool from 26 to 94, raising entropy from 4.70 bits per character to 6.55 bits per character.',
  },
  {
    q: 'What is an example of an 8-character password?',
    a: 'Never copy a fixed password example from a webpage, because public strings can appear on wordlists. Use the generator above with Length set to 8 to create fresh 8-character examples (about 51.32 bits across all 94 characters with at least one of each). Note that NIST recommends at least 15 characters when no MFA is present.',
  },
  {
    q: 'How do I create a strong Wi-Fi password?',
    a: 'Select the Wi-Fi tab above to generate a 20-character WPA2 passphrase (8–63 printable ASCII characters per IEEE 802.11i). By default, look-alike characters (O, 0, I, l, 1) are excluded so the key is easy to type on smart TVs and phones while still providing 116.66 bits of entropy without symbols.',
  },
  {
    q: 'What is a good phone PIN?',
    a: 'Use the PIN tab to generate a random 6-digit (19.93 bits, 1,000,000 combinations) or longer numeric PIN rather than 4 digits (10,000 combinations). Avoid sequential digits like 1234, repeated digits like 0000, or birth dates.',
  },
  {
    q: 'What are the best password practices?',
    a: 'Use a unique, randomly generated password of 15 to 16+ characters for every account, store passwords in a reputable password manager so you do not reuse them, enable multi-factor authentication (MFA) wherever supported, and only rotate passwords if a breach or compromise occurs (NIST SP 800-63B rev 4; CISA archived guidance).',
  },
  {
    q: 'Should I use a password manager?',
    a: 'Yes. Using unique, long random passwords across dozens of accounts is impractical to memorize. A password manager generates, stores, and autofills unique credentials for each site so a leak on one service cannot compromise your other accounts.',
  },
];

export default function PasswordGeneratorPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Developer & Web', path: '/tools/#developer' },
    { name: 'Password Generator', path: route.path },
  ];

  const lengthRows = [8, 12, 15, 16, 20, 24, 32].map((len) => ({
    len,
    plainBits: entropyBits({ ...DEFAULT_PASSWORD_OPTIONS, length: len, requireEach: false }),
    reqBits: entropyBits({ ...DEFAULT_PASSWORD_OPTIONS, length: len, requireEach: true }),
    lowerBits: entropyBits({
      length: len,
      upper: false,
      lower: true,
      digits: false,
      symbols: false,
      excludeLookAlikes: false,
      requireEach: false,
    }),
  }));

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`} id="main-content">
      <JsonLd
        data={buildWebApplicationSchema({
          name: route.title,
          description: route.description,
          path: route.path,
          applicationCategory: 'SecurityApplication',
        })}
      />
      <JsonLd data={buildFaqSchema(faqs)} />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Password Generator: Create a Strong, Random Password
          </h1>
          <p className={styles.subtitle}>
            Generate secure passwords, numeric PINs, and WPA2 Wi-Fi keys with custom length and character rules,
            powered by Web Crypto in your browser.
          </p>

          <div className={styles.bluf}>
            Generate a secure password in one click: 16 random characters from letters, numbers and symbols gives about 104.6 bits of randomness. Change the length or character rules, make a PIN or a Wi-Fi password, or create up to 50 at once. Passwords are made in your browser with Web Crypto and are never saved or sent.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Made in your browser (Web Crypto)',
              'Length 4–128, every character rule',
              'PIN & Wi-Fi presets',
              'Bits of strength shown',
            ]}
          >
            <PasswordGenerator />
          </ToolShell>
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Generate a Secure Password</h2>
            <p>
              This online password generator runs completely inside your browser across four tabs:
            </p>
            <ul>
              <li><strong>1. Password:</strong> Choose a length from 4 to 128 characters, toggle uppercase, lowercase, digits, or symbols, exclude look-alikes (<code>O 0 I l 1</code>), or edit the custom symbol set.</li>
              <li><strong>2. PIN:</strong> Generate random numeric PINs from 4 to 12 digits (<code>0–9</code>) for phones, locks, and banking apps.</li>
              <li><strong>3. Wi-Fi:</strong> Create 8 to 63-character WPA2 wireless keys with look-alikes excluded by default so you can read and type them accurately on TVs and smart devices.</li>
              <li><strong>4. Bulk (1–50):</strong> Create up to 50 independent random passwords at once and copy all or download a local <code>.txt</code> file.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How This Password Generator Makes Random Passwords</h2>
            <p>
              JavaScript&apos;s built-in <code>Math.random()</code> is not cryptographically secure and can exhibit predictable internal state. Instead, this generator relies exclusively on your browser&apos;s Web Crypto API (<code>crypto.getRandomValues</code>). If Web Crypto is unavailable, generation fails closed with an error rather than falling back to weak randomness.
            </p>
            <p>
              To eliminate modulo bias when picking from a pool of size <em>N</em> (for example, 94 characters), the engine draws an unsigned 32-bit integer and rejects any value at or above <code>floor(2³² / N) × N</code> (for <em>N</em> = 94, the limit is 4,294,967,254). When &ldquo;At least one of each set&rdquo; is enabled, the engine draws all characters uniformly from the full pool and redraws until every selected set appears, preserving a mathematically uniform distribution across all valid passwords.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Long Should a Password Be?</h2>
            <p>
              According to <strong>NIST SP 800-63B rev 4</strong> (§3.1.1.2), websites should require a minimum length of <strong>15 characters</strong> when a password is the only authentication factor, or <strong>8 characters</strong> when combined with multi-factor authentication (MFA), and should permit at least <strong>64 characters</strong>. Guidance from <strong>CISA</strong> (archived page) recommends at least <strong>16 characters</strong> alongside a password manager.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>Entropy in bits by password length (engine calculations)</caption>
                <thead>
                  <tr>
                    <th>Length</th>
                    <th>Lowercase Only (26 chars)</th>
                    <th>All 4 Sets, Uniform (94 chars)</th>
                    <th>All 4 Sets, At Least One Each</th>
                  </tr>
                </thead>
                <tbody>
                  {lengthRows.map((row) => (
                    <tr key={row.len}>
                      <td><strong>{row.len} characters</strong></td>
                      <td>{row.lowerBits.toFixed(2)} bits</td>
                      <td>{row.plainBits.toFixed(2)} bits</td>
                      <td><strong>{row.reqBits.toFixed(2)} bits</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Do Passwords Need Upper and Lower Case Letters?</h2>
            <p>
              NIST SP 800-63B rev 4 (§3.1.1.2) specifies that sites <em>shall not</em> impose composition rules requiring mixtures of uppercase, lowercase, digits, or symbols, because forced patterns often push people toward predictable habits like capitalizing the first letter and appending <code>!</code> at the end.
            </p>
            <p>
              For machine-generated random passwords, however, enabling more character sets genuinely expands the search space per character: 10 lowercase letters give 26¹⁰ = <strong>141,167,095,653,376</strong> combinations (47.00 bits), whereas 10 characters from all 94 printable symbols give 94¹⁰ (65.55 bits).
            </p>
          </section>

          <section className={styles.section}>
            <h2>Password Special Characters</h2>
            <p>
              The OWASP Password Special Characters list defines 32 printable non-space ASCII symbols (33 when including the space character):
            </p>
            <div className={styles.codeBlock}>{DEFAULT_SYMBOL_CHARS}</div>
            <p>
              Some legacy forms block characters such as quotes, angle brackets, or backslashes. In those cases, edit the <strong>Custom Symbol Set</strong> box in the generator to keep only the symbols that site accepts.
            </p>
          </section>

          <section className={styles.section}>
            <h2>PINs and Numbers-Only Passwords</h2>
            <p>
              When a system enforces numeric-only passcodes (<code>0–9</code>), the character pool is 10 digits: a 4-digit PIN has 10,000 combinations (13.29 bits) and a 6-digit PIN has 1,000,000 combinations (19.93 bits). Because the search space is small, security depends heavily on rate limiting by the device or server—under 10 guesses per second without rate limits, a 6-digit PIN takes an average of 13.9 hours, while at 100 guesses per hour it takes about 208 days. Avoid sequential runs like <code>1234</code> or dates.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Wi-Fi Passwords (WPA2 8–63 Characters)</h2>
            <p>
              Standard WPA2-Personal pre-shared keys accept 8 to 63 printable ASCII characters (codes 32–126; IEEE 802.11i Annex H.4.1 via secondary reference). Our Wi-Fi preset defaults to 20 characters using uppercase letters, lowercase letters, and digits with look-alike characters (<code>O, 0, I, l, 1</code>) excluded—giving a 57-character pool and <strong>116.66 bits</strong> of entropy (without require-each) that stays easy to enter on TVs, consoles, and phones.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Password Rules: What NIST Says</h2>
            <p>
              Modern guidelines in NIST SP 800-63B rev 4 shift the burden away from arbitrary user rules:
            </p>
            <ul>
              <li><strong>Length over complexity:</strong> Prioritize 15+ characters for single-factor accounts instead of short mixed-case strings.</li>
              <li><strong>No periodic expiration:</strong> Sites should not force scheduled password rotations without evidence of compromise.</li>
              <li><strong>Blocklist screening:</strong> Passwords should be checked against known compromised or common wordlists.</li>
              <li><strong>Unicode and spaces:</strong> Sites should accept spaces and printable Unicode characters (NFC-normalized).</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Password Tips That Help</h2>
            <ul>
              <li><strong>Unique per account:</strong> Never reuse a password across websites so a single breach cannot cascade.</li>
              <li><strong>Use a password manager:</strong> Store generated 16+ character passwords in a trusted password manager rather than trying to memorize them.</li>
              <li><strong>Enable MFA:</strong> Turn on hardware keys or authenticator-app multi-factor authentication wherever available.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Related Security &amp; Developer Tools</h2>
            <ul>
              <li><Link href="/password-strength-checker/"><strong>Password Strength Checker:</strong></Link> Test your password against pattern matching and 10,000+ common passwords offline.</li>
              <li><Link href="/passphrase-generator/"><strong>Passphrase Generator:</strong></Link> Create easy-to-remember random-word passphrases from the 7,776-word EFF list.</li>
              <li><Link href="/uuid-generator/"><strong>UUID / GUID Generator:</strong></Link> Generate RFC 9562 v4, v7, v5, and v3 identifiers in your browser.</li>
            </ul>
          </section>
        </article>

        <HowWeCalculate slug="password-generator" />
      </div>
    </main>
  );
}
