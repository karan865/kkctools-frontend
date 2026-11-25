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
import { DEFAULT_HACKER_OPTIONS, generateHackerNames } from '@/lib/hacker-name-engine';
import HackerNameGenerator from '@/components/tool/hacker-name-generator';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.hackerNameGenerator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What makes a good hacker name or handle?',
    a: 'A memorable handle is short (under 16 characters), easy to pronounce out loud, free of personal details like birth years or legal names, and distinct enough not to collide with common dictionary words.',
  },
  {
    q: 'What is leet speak (1337)?',
    a: 'Leet speak (written 1337) is an internet typing style from early bulletin boards that swaps letters for visually similar numbers—such as o→0, e→3, a→4, i→1, s→5, and t→7. Our generator lets you toggle between None, Light, and Heavy leet density.',
  },
  {
    q: 'Is this free, and can I use the names anywhere?',
    a: 'Yes, the hacker name generator is completely free with no account required. Before registering a handle publicly, always verify that it is not already claimed by another user or protected as someone else’s trademark.',
  },
  {
    q: 'Can I add my own word to the generated names?',
    a: 'Yes. Enter any word up to 20 characters in the Seed Word field and the engine weaves it into l33t, cyberpunk, gamer tag, minimal, or terminal patterns while applying your length and character filters.',
  },
  {
    q: 'Will the names work as a gamer tag or username?',
    a: 'Use the Length (min–max), Underscore, Spaces, and Case controls to match common username style constraints. Because every game and social platform enforces its own rules, double-check the target platform’s signup requirements.',
  },
  {
    q: 'Are these real hacker aliases?',
    a: 'No. Every name is synthesized from our original fictional word bank of tech nouns, adjectives, prefixes, and terminal tokens, and screened against a blocklist that covers offensive terms and some well-known aliases and brands. The list is not complete.',
  },
  {
    q: 'Is this related to real hacking?',
    a: 'No. This page is strictly for entertainment, gaming handles, tabletop RPGs, and creative writing. Nothing on this site teaches or involves real-world hacking.',
  },
  {
    q: 'Can I use these names for games or stories?',
    a: 'Yes. Many writers, game masters, and players use the Cyberpunk and Terminal styles to name fictional characters, netrunners, squads, and online personas.',
  },
];

export default function HackerNameGeneratorPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Developer & Web', path: '/tools/#developer' },
    { name: 'Hacker Name Generator', path: route.path },
  ];

  const exL33t = generateHackerNames({ ...DEFAULT_HACKER_OPTIONS, style: 'l33t', count: 5, rngSeed: 101 }).names.slice(0, 2);
  const exCyber = generateHackerNames({ ...DEFAULT_HACKER_OPTIONS, style: 'cyberpunk', count: 5, rngSeed: 202 }).names.slice(0, 2);
  const exMin = generateHackerNames({ ...DEFAULT_HACKER_OPTIONS, style: 'minimal', count: 5, rngSeed: 303 }).names.slice(0, 2);
  const exGamer = generateHackerNames({ ...DEFAULT_HACKER_OPTIONS, style: 'gamerTag', count: 5, rngSeed: 404 }).names.slice(0, 2);
  const exTerm = generateHackerNames({ ...DEFAULT_HACKER_OPTIONS, style: 'terminal', count: 5, rngSeed: 505 }).names.slice(0, 2);

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`} id="main-content">
      <JsonLd
        data={buildWebApplicationSchema({
          name: route.title,
          description: route.description,
          path: route.path,
          applicationCategory: 'UtilitiesApplication',
        })}
      />
      <JsonLd data={buildFaqSchema(faqs)} />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            Hacker Name Generator: Cool Hacker Names and Usernames
          </h1>
          <p className={styles.subtitle}>
            Generate fictional hacker handles, cyberpunk codenames, l33t usernames, and terminal-style
            gamer tags with custom seed words and length rules—all locally in your browser.
          </p>

          <div className={styles.bluf}>
            Pick a style (l33t, cyberpunk, minimal, gamer tag or terminal), add your own word if you like, and the
            hacker name generator makes 10 names at a time. Set the length and allowed characters so they work as a
            username, save your favourites, and copy them. It&apos;s just for fun, and it all runs in your browser.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              '5 styles incl. l33t',
              'Add your own word',
              'Username-safe options',
              'Save favourites, no account',
            ]}
          >
            <HackerNameGenerator />
          </ToolShell>
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Use the Hacker Name Generator</h2>
            <p>
              Our <strong>hacker name generator</strong> builds fictional handles in seconds without requiring an account or sending your ideas to a server:
            </p>
            <ul>
              <li><strong>Pick a style:</strong> Choose a single mode or mix all five styles together.</li>
              <li><strong>Add an optional seed word:</strong> Type a word up to 20 characters (for example, <code>ghost</code>) to anchor every generated handle around your theme.</li>
              <li><strong>Dial in username rules:</strong> Set minimum and maximum length (default 4–16), toggle underscores or spaces, pick a capitalization style, and choose Light, Heavy, or None for leet substitutions.</li>
              <li><strong>Save favourites locally:</strong> Click <code>☆ Save</code> on any handle to keep it in the Favourites tab inside your browser&apos;s local storage.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Cool Hacker Names: The Five Styles</h2>
            <p>
              Different games, stories, and developer profiles call for different aesthetics. Each mode combines our original word bank using dedicated templates:
            </p>
            <ul>
              <li><strong>l33t (leet speak):</strong> Blends adjectives and tech nouns with reversible character swaps and shows the readable form beside each handle—such as <code>{exL33t[0]?.name}</code> and <code>{exL33t[1]?.name}</code>.</li>
              <li><strong>Cyberpunk:</strong> Pairs atmospheric modifiers with sci-fi hardware and network imagery in clean CamelCase, such as <code>{exCyber[0]?.name}</code> and <code>{exCyber[1]?.name}</code>.</li>
              <li><strong>Minimal:</strong> Joins a short crisp word with a two- or three-digit suffix for compact handles like <code>{exMin[0]?.name}</code> and <code>{exMin[1]?.name}</code>.</li>
              <li><strong>Gamer tag:</strong> Wraps your word or noun with prefixes and suffixes using underscores or CamelCase, producing handles like <code>{exGamer[0]?.name}</code> and <code>{exGamer[1]?.name}</code>.</li>
              <li><strong>Terminal:</strong> Mimics command-line tokens, hexadecimal prefixes, and system identifiers, such as <code>{exTerm[0]?.name}</code> and <code>{exTerm[1]?.name}</code>.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>What Makes a Memorable Hacker Handle</h2>
            <p>
              Whether you are naming a character for a tabletop RPG or picking a coding handle, a few practical habits keep a name sharp:
            </p>
            <ul>
              <li><strong>Keep it concise and sayable:</strong> Handles between 6 and 14 characters fit cleanly in chat windows, scoreboards, and terminal prompts.</li>
              <li><strong>Avoid personal identifiers:</strong> Leave out your real name, birth year, city, or reused account handles.</li>
              <li><strong>Check availability first:</strong> Search the platform where you plan to register before settling on a final pick.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Leet Speak Explained</h2>
            <p>
              Leet speak (&ldquo;1337&rdquo;) is a playful shorthand that swapped letters for digits of a similar shape. In our generator, <strong>Light</strong> mode swaps only <code>o→0</code> and <code>e→3</code> so handles remain effortless to skim, while <strong>Heavy</strong> mode adds <code>a→4</code>, <code>i→1</code>, <code>s→5</code>, and <code>t→7</code> while preserving uppercase initials.
            </p>
            <p>
              Keep in mind that leet speak is purely stylistic—it does not make a password harder to crack because cracking tools test common substitutions automatically. For real account security, pair your new handle with our{' '}
              <Link href="/password-generator/">Password Generator</Link> or{' '}
              <Link href="/passphrase-generator/">Passphrase Generator</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Hacker Usernames and Gamer Tags</h2>
            <p>
              Username rules differ from site to site. The default here is 4 to 16 characters, no spaces, and only ASCII letters, digits, or underscores. Turning off spaces and setting length bounds in the tool lets you filter out candidates that would fail a signup form—though you should always check the exact rules of the specific platform you are joining. If you are looking for creative project or band names instead, try our{' '}
              <Link href="/band-name-generator/">Band Name Generator</Link>.
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

        <HowWeCalculate slug="hacker-name-generator" />
      </div>
    </main>
  );
}
