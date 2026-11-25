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
  calculatePassphraseEntropy,
  DEFAULT_PASSPHRASE_OPTIONS,
} from '@/lib/passphrase-engine';
import { ATTACK_SCENARIOS, formatGuessTime } from '@/data/attack-scenarios';
import PassphraseGenerator from '@/components/tool/passphrase-generator';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.passphraseGenerator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What is a passphrase?',
    a: 'A passphrase is a sequence of unrelated random words—such as six words joined by hyphens or spaces—used in place of a short, complex character password. Because length drives password entropy, a six-word passphrase from a 7,776-word list delivers 77.55 bits of randomness while staying easy to read and type.',
  },
  {
    q: 'Passphrase vs password: which is stronger?',
    a: 'Strength depends on total entropy bits, not format. A 6-word EFF passphrase provides 77.55 bits (about 35,027 years on average at 100 billion guesses/sec), which beats a random 10-character mixed-case-and-digit password (59.5 bits), while a 16-character full-ASCII random password (104.6 bits) is stronger still.',
  },
  {
    q: 'How many words should a passphrase have?',
    a: 'The Electronic Frontier Foundation (EFF) recommends at least 6 words from its 7,776-word Long Wordlist (77.55 bits) for important accounts. CISA (archived guidance page) suggests a passphrase of 4 to 7 unrelated words. Use 7 or 8 words (90.5 to 103.4 bits) for master password manager vaults.',
  },
  {
    q: 'What is Diceware?',
    a: 'Diceware is a method of generating passphrases by rolling five six-sided dice to look up each word in a numbered 7,776-word dictionary (6^5 = 7,776). Both physical dice and a browser CSPRNG using rejection sampling produce uniform, independent word picks.',
  },
  {
    q: 'How strong is a 4, 5, or 6-word passphrase?',
    a: 'Using the 7,776-word EFF Long Wordlist (12.925 bits per word): 4 words give 51.70 bits (~5.1 hours on average at 100 billion guesses/sec), 5 words give 64.62 bits (~4.5 years), and 6 words give 77.55 bits (~35,027 years).',
  },
  {
    q: 'Do capital letters or numbers make a passphrase stronger?',
    a: 'Only if they are chosen randomly. Capitalizing the first letter of every word adds 0 bits because an attacker can apply that deterministic rule. Capitalizing one random word adds log2(k) bits (~2.58 bits for 6 words), and adding a random 0–99 number at a random gap adds 9.45 bits—though adding a seventh random word adds 12.92 bits.',
  },
  {
    q: 'Is "correct horse battery staple" safe to use?',
    a: 'No. Any famous published example from a comic, blog post, or documentation page can be on a guessing list, so treat it as known. Always generate fresh random words.',
  },
  {
    q: 'Can I make up my own words for a passphrase?',
    a: 'No. Humans pick familiar themes, song lyrics, or common collocations ("blue sky", "coffee cup"), which drastically shrinks the effective search space. Only uniform random draws from a large, public wordlist guarantee the full entropy math.',
  },
  {
    q: 'Is an online passphrase generator safe?',
    a: 'Only if all word selection happens locally in your browser using Web Crypto (crypto.getRandomValues) and nothing is transmitted over the network. This tool runs 100% client-side and works offline once loaded.',
  },
  {
    q: 'Can I use spaces in a password or passphrase?',
    a: 'NIST SP 800-63B rev 4 (§3.1.1.2) states that websites should accept spaces and printable Unicode characters and allow at least 64 characters. If an older form rejects spaces or caps length, switch the separator above to hyphen, dot, or none.',
  },
];

export default function PassphraseGeneratorPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Developer & Web', path: '/tools/#developer' },
    { name: 'Passphrase Generator', path: route.path },
  ];

  const fastRate =
    ATTACK_SCENARIOS.find((s) => s.id === 'offline-fast-hash')?.guessesPerSecond ?? 100_000_000_000;
  const slowRate =
    ATTACK_SCENARIOS.find((s) => s.id === 'offline-slow-hash')?.guessesPerSecond ?? 10_000;

  const wordRows = [4, 5, 6, 7, 8].map((wc) => {
    const b = calculatePassphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, wordCount: wc });
    return {
      wc,
      bits: b.totalBits,
      fastTime: formatGuessTime(b.totalBits, fastRate),
      slowTime: formatGuessTime(b.totalBits, slowRate),
    };
  });

  const optOneCap = calculatePassphraseEntropy({
    ...DEFAULT_PASSPHRASE_OPTIONS,
    wordCount: 6,
    capitals: 'one-random',
  });
  const optAddNum = calculatePassphraseEntropy({
    ...DEFAULT_PASSPHRASE_OPTIONS,
    wordCount: 6,
    addNumber: true,
  });
  const optDigitSep = calculatePassphraseEntropy({
    ...DEFAULT_PASSPHRASE_OPTIONS,
    wordCount: 6,
    separator: 'random-digit',
  });

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
            Passphrase Generator: Strong Passwords Made of Random Words
          </h1>
          <p className={styles.subtitle}>
            Generate a passphrase from the 7,776-word EFF Long Wordlist with live entropy breakdown,
            flexible separators, optional capitals or numbers, and bulk export—all inside your browser.
          </p>

          <div className={styles.bluf}>
            Generate a passphrase of random words that&apos;s strong and easy to remember: 6 words from a 7,776-word
            list give about 77.5 bits, the length the EFF suggests. Choose 3 to 10 words, a separator, capitals or an
            extra number, and the exact strength updates as you go. Everything is made in your browser and never sent.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'Exact strength in bits',
              '3–10 words, your separator',
              'Named word list (EFF 7,776)',
              'Made in your browser',
            ]}
          >
            <PassphraseGenerator />
          </ToolShell>
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Generate a Passphrase</h2>
            <p>
              To <strong>generate a passphrase</strong> locally with Web Crypto, pick your settings across three tabs:
            </p>
            <ul>
              <li><strong>Passphrase:</strong> Choose 3 to 10 random words (default 6), select a separator (hyphen, space, dot, underscore, none, random digit, random symbol, or custom), pick a capitalization rule, optionally insert a random 0–99 number or symbol, or enforce no repeated words.</li>
              <li><strong>Options &amp; strength:</strong> Inspect the exact bits contributed by the word list, separator, capitalization, and extras, and test average guess times across four editable attack scenarios.</li>
              <li><strong>Bulk:</strong> Create up to 20 independent passphrases at once and copy the full list in one click.</li>
            </ul>
            <p>
              Every word is drawn using <code>crypto.getRandomValues</code> with 32-bit rejection sampling—never <code>Math.random()</code>—and nothing is logged or transmitted.
            </p>
          </section>

          <section className={styles.section}>
            <h2>What Is a Passphrase?</h2>
            <p>
              A <strong>passphrase</strong> replaces hard-to-remember punctuation soup with a string of unrelated dictionary words (for example, six words separated by hyphens or spaces). Instead of relying on short 8-character substitutions like <code>P@ssw0rd!</code>, passphrases achieve high security through sheer length and a large uniform word pool.
            </p>
            <p>
              Under <strong>NIST SP 800-63B rev 4</strong> (§3.1.1.2), websites and verifiers should accept spaces and printable Unicode characters and permit passwords of at least <strong>64 characters</strong>, making multi-word passphrases first-class credentials alongside random character passwords.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Strong Is a Passphrase?</h2>
            <p>
              Entropy measures how large an attacker&apos;s search space is, assuming <strong>the attacker knows the exact word list</strong> (Kerckhoffs&apos;s principle). When each of <em>k</em> words is drawn independently with replacement from a list of size <em>N</em> = 7,776, each word contributes <code>log₂(7,776) ≈ 12.925 bits</code>, and the total baseline entropy is <code>k × 12.925 bits</code>.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>EFF Long Wordlist (7,776 words) entropy and average guess times (engine calculations)</caption>
                <thead>
                  <tr>
                    <th>Words</th>
                    <th>Entropy (bits)</th>
                    <th>Offline Slow Hash (10k/s)</th>
                    <th>Offline Fast Hash (100B/s)</th>
                  </tr>
                </thead>
                <tbody>
                  {wordRows.map((row) => (
                    <tr key={row.wc}>
                      <td><strong>{row.wc} words</strong></td>
                      <td>{row.bits.toFixed(2)} bits</td>
                      <td>{row.slowTime}</td>
                      <td>{row.fastTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Notice why list size matters: a small ~130-word list gives only <code>log₂(130) ≈ 7.02 bits</code> per word—so 6 words from a tiny list yield just 42.1 bits, nowhere near &ldquo;very strong.&rdquo; Using the full 7,776-word EFF list nearly doubles the bits per word.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How Many Words Should a Passphrase Have?</h2>
            <p>
              For most accounts and master passwords, the <strong>Electronic Frontier Foundation (EFF)</strong> recommends <strong>6 words</strong> from its Long Wordlist (77.55 bits, averaging roughly 35,027 years at 100 billion guesses per second). <strong>CISA</strong> (archived password guidance page) similarly advises a passphrase of <strong>4 to 7 unrelated words</strong>.
            </p>
            <p>
              Avoid dropping to 4 words (51.70 bits) for high-value offline vaults or encryption keys, because fast GPU cracking rigs can search 2⁵¹ guesses in hours. Use 6 words as your baseline and step up to 7 or 8 words for disk encryption or primary password manager vaults.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Why Random Words Beat Words You Choose</h2>
            <p>
              When people invent a passphrase themselves, they gravitate toward idioms, favorite foods, movie quotes, or topically linked words (&ldquo;morning-coffee-sunrise-desk&rdquo;). Attackers exploit these linguistic patterns with Markov models and phrase wordlists, which need far fewer guesses than the word count suggests.
            </p>
            <p>
              Equally important: never reuse published examples like &ldquo;correct horse battery staple.&rdquo; Published examples can be on a guessing list.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Diceware and the EFF Word List</h2>
            <p>
              Original Diceware, created by Arnold Reinhold, maps every sequence of five 6-sided dice rolls (6⁵ = 7,776 outcomes) to a word. In 2016, the EFF published the{' '}
              <a href="https://www.eff.org/dice" target="_blank" rel="noopener noreferrer">
                EFF Long Wordlist
              </a>{' '}
              (7,776 words,{' '}
              <a href="https://www.eff.org/copyright" target="_blank" rel="noopener noreferrer">
                CC BY
              </a>
              ), curated to strip obscure abbreviations, hard-to-spell terms, and confusing prefixes while keeping words between 3 and 9 letters (plus a few hyphenated compounds). Both rolling physical dice and drawing indices with Web Crypto rejection sampling yield identical mathematical security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Do Capitals, Numbers, and Symbols Help?</h2>
            <p>
              Random modifications add measurable bits, whereas predictable rules add zero:
            </p>
            <ul>
              <li><strong>Title Case every word:</strong> +0.00 bits (completely deterministic).</li>
              <li><strong>One random word in CAPITALS (6 words):</strong> {optOneCap.totalBits.toFixed(2)} bits (+{optOneCap.capitalsBits.toFixed(2)} bits).</li>
              <li><strong>Add a random 0–99 number at a random gap (6 words):</strong> {optAddNum.totalBits.toFixed(2)} bits (+{optAddNum.numberBits.toFixed(2)} bits across 7 gaps).</li>
              <li><strong>Random digit separator in 5 slots (6 words):</strong> {optDigitSep.totalBits.toFixed(2)} bits (+{optDigitSep.separatorBits.toFixed(2)} bits).</li>
            </ul>
            <p>
              To prevent inflated numbers, this generator disables adding an extra 0–99 number when random-digit separators are active (and disables extra symbols with random-symbol separators) so adjacent extras never create ambiguous boundaries.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Where Passphrases Work (and Sites That Block Them)</h2>
            <p>
              Passphrases shine for master logins you actually have to type: device boot encryption, laptop sign-in, and your password manager master password. For everyday websites, store unique random strings from the{' '}
              <Link href="/password-generator/">Password Generator</Link> in your password manager, or audit an existing phrase in the{' '}
              <Link href="/password-strength-checker/">Password Strength Checker</Link>. If a legacy website blocks spaces or restricts length, switch the separator to a hyphen or remove separators altogether.
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

        <HowWeCalculate slug="passphrase-generator" />
      </div>
    </main>
  );
}
