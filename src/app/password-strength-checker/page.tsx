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
import { COMMON_PASSWORDS, COMMON_PASSWORDS_COUNT, getCommonPasswordRank } from '@/data/common-passwords';
import { PASSPHRASE_WORDLIST, PASSPHRASE_WORDLIST_META } from '@/data/wordlist-passphrase';
import { isOffensive } from '@/lib/generator/offensive';
import { estimatePasswordStrength, DictionaryLookup } from '@/lib/strength-engine';
import { ATTACK_SCENARIOS, formatGuessTime } from '@/data/attack-scenarios';
import PasswordStrengthChecker from '@/components/tool/password-strength-checker';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.passwordStrengthChecker;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'Is it safe to type my real password here?',
    a: 'All strength checks run locally in your browser with zero network calls and zero storage. Even so, the safest habit is never to type a live banking or email password anywhere except that site’s login form—test a password with a similar structure instead.',
  },
  {
    q: 'How is password strength calculated?',
    a: 'This password strength tester breaks your input into patterns—dictionary words, l33t substitutions, keyboard runs, repeated characters, sequential characters, and dates—then uses dynamic programming to find the lowest-guess segmentation and converts that guess count into bits.',
  },
  {
    q: 'How long would it take to crack my password?',
    a: 'Guess time equals half the search space (on average) divided by an attacker’s guess rate. Because rates vary by orders of magnitude—from 100 guesses/hour on a rate-limited login form to 100 billion guesses/second on an unsalted fast hash—we show four separate scenarios and let you edit the rates.',
  },
  {
    q: 'What are the most common passwords?',
    a: `Short numeric strings and simple keyboard patterns like "123456", "password", and "qwerty" top leaked-credential compilations such as the SecLists ${COMMON_PASSWORDS_COUNT.toLocaleString('en-US')}-entry common-password list.`,
  },
  {
    q: 'What makes a password weak or strong?',
    a: 'Short length, dictionary words, predictable substitutions, and repeated sequences make a password weak regardless of special characters. High length (15+ characters) generated with true randomness makes a password strong.',
  },
  {
    q: 'Why is "123456" cracked instantly?',
    a: '"123456" ranks #2 on the bundled common-password list. Attackers test the most common passwords first, so a guesser using that list reaches it on guess 2.',
  },
  {
    q: 'What types of password attacks are there?',
    a: 'Common attack models include rate-limited online guessing, unthrottled online guessing, credential stuffing (retrying leaked password pairs), dictionary/rule-based cracking, and offline brute-force against stolen password hashes.',
  },
  {
    q: 'Do l33t swaps like "P@ssw0rd" help?',
    a: 'Barely. Swapping "@" for "a" and "0" for "o" in a rank-#1 word like "password" only multiplies the guess count by 8 in our pattern model (3.00 bits), even though naive character counting claims 52.44 bits.',
  },
  {
    q: 'What are the consequences of sharing passwords?',
    a: 'Sharing passwords removes exclusive control over an account, increases exposure if the recipient reuses or stores the credential insecurely, and makes it impossible to distinguish who took an action in audit logs.',
  },
  {
    q: 'Can you check if my password was in a breach?',
    a: 'No. Checking live breach databases requires sending a prefix or hash over the network, which conflicts with our zero-network rule. If you want a breach check, use an established dedicated k-anonymity lookup service separately.',
  },
  {
    q: 'What is a password guesser?',
    a: 'A password guesser (or strength estimator) models how many attempts an automated search needs to find a credential based on its patterns and assumed guess rates. This tool estimates strength purely for defensive testing.',
  },
];

export default function PasswordStrengthCheckerPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Developer & Web', path: '/tools/#developer' },
    { name: 'Password Strength Checker', path: route.path },
  ];

  const effSet = new Set(PASSPHRASE_WORDLIST);
  const dict: DictionaryLookup = {
    getCommonRank: getCommonPasswordRank,
    hasWord: (w) => effSet.has(w),
    wordListSize: PASSPHRASE_WORDLIST_META.size,
  };

  const fastRate = ATTACK_SCENARIOS.find((s) => s.id === 'offline-fast-hash')!.guessesPerSecond;
  const exampleRows = ['123456', 'P@ssw0rd', 'aaaaaaaa', 'abcd1234', 'Summer2026!'].map((pw) => {
    const res = estimatePasswordStrength(pw, dict);
    return {
      pw,
      band: res.bandLabel,
      realBits: res.guessesLog2,
      naiveBits: res.naiveEntropyBits,
      fastTime: formatGuessTime(res.guessesLog2, fastRate),
    };
  });

  // Top 20 common passwords skipping entries flagged by isOffensive
  const top20Visible: { rank: number; value: string }[] = [];
  let hiddenCount = 0;
  for (let i = 0; i < COMMON_PASSWORDS.length && top20Visible.length < 20; i++) {
    const candidate = COMMON_PASSWORDS[i];
    if (isOffensive(candidate)) {
      hiddenCount++;
      continue;
    }
    top20Visible.push({ rank: i + 1, value: candidate });
  }

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
            Password Strength Checker: How Strong Is Your Password?
          </h1>
          <p className={styles.subtitle}>
            Test password complexity offline in your browser with pattern matching, naive vs. real entropy bits,
            a {COMMON_PASSWORDS_COUNT.toLocaleString('en-US')}-entry common-password check, and four attack-rate scenarios.
          </p>

          <div className={styles.bluf}>
            Type a password and this password strength tester shows how long it would take to guess under four attack types, which parts are weak and why, and whether it is on a common-password list. It runs entirely on your device: nothing is stored or sent. A password like P@ssw0rd looks complex (52.44 naive bits) but drops to 3.00 real bits (8 guesses) in our pattern model because attackers test common words first.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Works offline, nothing sent',
              'Shows which part is weak',
              '4 attack scenarios, rates shown',
              'Common-password list check',
            ]}
          >
            <PasswordStrengthChecker />
          </ToolShell>
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Password Strength Tester</h2>
            <p>
              To protect your accounts, never paste a live banking or primary email password into any third-party site—even an offline one. Instead, enter a test password with a similar structure (same length, word types, and symbol placement) into the input box above.
            </p>
            <ul>
              <li><strong>1. Check:</strong> View your overall strength band (our own 0–4 scale from Very Weak to Very Strong), real pattern-aware bits, naive character-count bits, and whether the string appears in the {COMMON_PASSWORDS_COUNT.toLocaleString('en-US')}-entry common-password list.</li>
              <li><strong>2. Breakdown:</strong> Inspect every segment the estimator matched—dictionary words, l33t substitutions, keyboard runs, repeats, sequences, or dates—and see how many guesses each piece adds.</li>
              <li><strong>3. Attack Scenarios:</strong> Compare estimated average guess times across four scenarios and edit any guesses-per-second assumption.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How the Password Strength Tester Works</h2>
            <p>
              Simple password complexity checkers count character types (uppercase, lowercase, digits, symbols) and multiply length by <code>log2(pool)</code>. That naive method treats <code>P@ssw0rd</code> and a truly random 8-character string as equally strong (52.44 bits), even though attackers prioritize known patterns.
            </p>
            <p>
              Our estimator normalizes the first 128 NFC Unicode code points and searches for weak patterns: common passwords (SecLists {COMMON_PASSWORDS_COUNT.toLocaleString('en-US')}-entry list), English words, l33t substitutions (<code>4→a, 3→e, 1→i/l, 0→o, 5→s, 7→t, @→a, $→s</code>), QWERTY keyboard runs, ascending/descending sequences, repeated characters, and dates. Dynamic programming then finds the segmentation minimizing <code>m! × Π guesses_i</code>, where <code>m</code> is the segment count.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What Makes a Password Weak or Strong</h2>
            <p>
              Comparing weak passwords and strong patterns side by side in our engine shows why structure matters more than character-type checkboxes:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>Engine comparison of weak vs. strong example passwords</caption>
                <thead>
                  <tr>
                    <th>Example Password</th>
                    <th>Our Band</th>
                    <th>Naive Bits</th>
                    <th>Real Pattern Bits</th>
                    <th>Offline Fast Hash (10¹¹/s)</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleRows.map((row) => (
                    <tr key={row.pw}>
                      <td><code>{row.pw}</code></td>
                      <td>{row.band}</td>
                      <td>{row.naiveBits.toFixed(2)} bits</td>
                      <td><strong>{row.realBits.toFixed(2)} bits</strong></td>
                      <td>{row.fastTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              If your test password scores low, generate a fresh random alternative in our <Link href="/password-generator/">Password Generator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Long Would It Take to Crack?</h2>
            <p>
              Crack-time estimates equal half the search space (<code>2^(bits − 1)</code>, on average) divided by an assumed attack speed. Because real-world guessing rates vary dramatically depending on where an attacker tries your password, we separate four distinct scenarios and let you edit every rate in Tab 3:
            </p>
            <ul>
              <li><strong>Online, rate-limited (100/hour assumption):</strong> Login portals that lock accounts or add delays after failed attempts.</li>
              <li><strong>Online, no rate limit (10/sec assumption):</strong> Unthrottled web forms or APIs.</li>
              <li><strong>Offline, slow hash (10,000/sec assumption):</strong> Leaked password databases protected by memory-hard hashes like Argon2, bcrypt, or scrypt.</li>
              <li><strong>Offline, fast hash (100 billion/sec assumption):</strong> Leaked databases using fast unsalted hashes attacked on modern GPU hardware.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Types of Password Attacks</h2>
            <p>
              Understanding defensive threat models explains why short or reused passwords fail:
            </p>
            <ul>
              <li><strong>Dictionary &amp; Rule Attacks:</strong> Automated tools test millions of common words with predictable capitalizations, trailing digits, and l33t swaps before trying random characters.</li>
              <li><strong>Credential Stuffing:</strong> Attackers replay username/password pairs leaked from one breached site against other services.</li>
              <li><strong>Online Guessing vs. Offline Cracking:</strong> Online attacks are slowed by network latency and lockouts, whereas offline attacks against a stolen hash file run locally at hardware speed.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>The Most Common Passwords</h2>
            <p>
              Our offline checker bundles the MIT-licensed SecLists <code>10k-most-common.txt</code> dataset ({COMMON_PASSWORDS_COUNT.toLocaleString('en-US')} entries). Matching runs across the full list, while the preview table below skips entries flagged by our profanity filter ({hiddenCount} {hiddenCount === 1 ? 'entry' : 'entries'} hidden):
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>Top 20 non-offensive entries from SecLists ({COMMON_PASSWORDS_COUNT.toLocaleString('en-US')} total; {hiddenCount} hidden)</caption>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Password</th>
                    <th>Rank</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const left = top20Visible[idx];
                    const right = top20Visible[idx + 10];
                    return (
                      <tr key={idx}>
                        <td>#{left.rank}</td>
                        <td><code>{left.value}</code></td>
                        <td>#{right.rank}</td>
                        <td><code>{right.value}</code></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Why &ldquo;P@ssw0rd&rdquo; and &ldquo;Password1!&rdquo; Fail</h2>
            <p>
              Substituting <code>@</code> for <code>a</code>, <code>0</code> for <code>o</code>, or appending <code>1!</code> does not fool modern password crackers. Rule engines automatically apply common character substitutions to every dictionary word, turning 52.44 naive bits into just 3.00 pattern bits (8 guesses) for <code>P@ssw0rd</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Password Security: What Actually Helps</h2>
            <p>
              <strong>NIST SP 800-63B rev 4</strong> (§3.1.1.2) recommends prioritizing length (at least 15 characters for single-factor accounts, or 8 with MFA), checking new passwords against a blocklist of compromised/common strings, avoiding forced periodic rotation, and allowing spaces and Unicode characters. Combine unique random passwords from a <Link href="/password-generator/">Password Generator</Link> or memorable words from our <Link href="/passphrase-generator/">Passphrase Generator</Link> with multi-factor authentication on every critical account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Why We Don&apos;t Check Breaches Here</h2>
            <p>
              Checking whether a password appeared in historical data breaches requires querying an external server (even via k-anonymity hash prefixes). Because KKC Tools tools run 100% client-side with zero network calls, we never transmit anything off your device and check only against our bundled offline list.
            </p>
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
        </article>

        <HowWeCalculate slug="password-strength-checker" />
      </div>
    </main>
  );
}
