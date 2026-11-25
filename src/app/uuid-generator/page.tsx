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
import { MAX_UUID, NIL_UUID } from '@/lib/uuid-engine';
import UuidGenerator from '@/components/tool/uuid-generator';
import styles from './page.module.css';

export const dynamic = 'force-static';

const route = ROUTES.uuidGenerator;

export const metadata: Metadata = buildMetadata({
  title: route.title,
  description: route.description,
  path: route.path,
});

const faqs = [
  {
    q: 'What is a UUID, and what does GUID stand for?',
    a: 'UUID stands for Universally Unique Identifier, and GUID for Globally Unique Identifier. It is a standardized 128-bit (16-byte) label defined in RFC 9562 (which replaced RFC 4122) and ISO/IEC 9834-8, written as 32 hexadecimal digits in five hyphen-separated groups (8-4-4-4-12) so distributed systems can create unique IDs without a central coordinator.',
  },
  {
    q: 'What is the difference between a UUID and a GUID?',
    a: 'Technically they share the same 128-bit RFC 9562 / ISO 9834-8 structure. "UUID" is the IETF/Linux/Postgres term formatted in lowercase hyphens, while "GUID" (Globally Unique Identifier) is Microsoft’s term in .NET, Windows, and SQL Server, often formatted in uppercase, wrapped in braces {...}, or stored in mixed-endian byte order for legacy COM APIs.',
  },
  {
    q: 'Are UUIDs truly unique — can two v4 UUIDs collide?',
    a: 'A UUIDv4 contains 122 random bits (6 bits are fixed for version 4 and variant 10), giving 5.3 × 10^36 possible values. By the birthday bound, you would need roughly 2.71 × 10^18 UUIDs (about one billion per second for 85 years) to reach a 50% chance of a single duplicate, assuming a cryptographic RNG.',
  },
  {
    q: 'Which UUID version should I use: v4, v7, or v5?',
    a: 'Use v7 for new database primary keys and event logs because its leading 48-bit Unix millisecond timestamp keeps B-tree inserts sequential. Use v4 when you want pure randomness with no embedded timestamp. Use v5 (SHA-1) when you need the exact same deterministic UUID every time for a given namespace and input name.',
  },
  {
    q: 'Why is UUIDv7 better for database primary keys than v4?',
    a: 'Random v4 UUIDs scatter inserts across the entire B-tree index, causing frequent page splits and cache misses on large tables. UUIDv7 places a monotonically increasing 48-bit millisecond timestamp in the most significant bits, so new rows append near the end of the index like an auto-increment integer while remaining globally unique.',
  },
  {
    q: 'What is the difference between UUIDv3 and UUIDv5?',
    a: 'Both are deterministic name-based versions that hash a 16-byte namespace UUID and a UTF-8 name string. Version 3 uses MD5 and version 5 uses SHA-1 cut to 128 bits. Both then replace 6 bits with the version and variant. RFC 9562 recommends v5 over v3 for new systems unless legacy compatibility requires MD5.',
  },
  {
    q: 'What is an empty (nil) GUID, and what is the Max UUID?',
    a: `The Nil UUID (${NIL_UUID}) has all 128 bits set to zero and represents a null or unset identifier. RFC 9562 also defines the Max UUID (${MAX_UUID}) with all 128 bits set to one as an upper sentinel value for range queries.`,
  },
  {
    q: 'How long is a UUID or GUID?',
    a: 'It is 128 bits (16 bytes): 32 hex digits, or 36 characters with the four hyphens. In Base64 it is 24 characters with padding, and 22 in base64url without it.',
  },
  {
    q: 'How do I generate a UUID in C#, Python, Java, SQL or PowerShell?',
    a: 'C#: Guid.NewGuid(). Python: uuid.uuid4(). Java: UUID.randomUUID(). PostgreSQL 13+: gen_random_uuid(). PowerShell: [guid]::NewGuid(). Each is shown as a code block in the section above.',
  },
  {
    q: 'How do I validate a UUID?',
    a: 'Check the 8-4-4-4-12 canonical layout with the version nibble (13th hex digit) in [1-8] and the variant nibble (17th hex digit) in [89ab]: ^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$ (case-insensitive), plus optional special checks for Nil and Max UUIDs. Paste any string into the Validate tab above to inspect its exact version, variant, and embedded v7 timestamp.',
  },
  {
    q: 'Can I generate UUIDs offline or in bulk?',
    a: 'Yes. Every generation mode (v4, v7, v5, v3, Nil/Max) and the validator run strictly inside your browser using Web Crypto (crypto.getRandomValues and crypto.subtle.digest). Generate up to 1,000 UUIDs in one click and copy or download them as .txt or .json without sending anything over the network.',
  },
  {
    q: 'Are UUIDs secure as passwords or API tokens?',
    a: 'Standard v7, v5, v3, and v1 UUIDs are not secret—they leak timestamps or deterministic inputs and should never be used as bearer tokens or passwords. Even v4 (122 random bits) relies on a cryptographic CSPRNG; if you need an authentication secret, generate a dedicated high-entropy token or password instead.',
  },
  {
    q: 'What changed in RFC 9562 compared to RFC 4122?',
    a: 'Published in May 2024, RFC 9562 obsoleted RFC 4122. It kept v1 through v5 unchanged, standardized time-ordered UUIDv6, epoch-ms UUIDv7, and custom/experimental UUIDv8, formalized the Max UUID (all F), and documented monotonic sub-millisecond counter methods for v7.',
  },
];

export default function UuidGeneratorPage() {
  const breadcrumbs = [
    { name: 'Tools', path: '/tools/' },
    { name: 'Developer & Web', path: '/tools/#developer' },
    { name: 'UUID / GUID Generator', path: route.path },
  ];

  return (
    <main className={`${styles.main} ${toolDisplayFont.variable} ${typo.scope}`} id="main-content">
      <JsonLd
        data={buildWebApplicationSchema({
          name: route.title,
          description: route.description,
          path: route.path,
          applicationCategory: 'DeveloperApplication',
        })}
      />
      <JsonLd data={buildFaqSchema(faqs)} />

      <div className="container">
        <Breadcrumbs items={breadcrumbs} />

        <div className={styles.intro}>
          <h1 className={styles.title}>
            UUID Generator: Create Random UUIDs (v4, v7) and GUIDs
          </h1>
          <p className={styles.subtitle}>
            Generate RFC 9562 v4 random, v7 time-ordered, v5 (SHA-1), and v3 (MD5) UUIDs or Microsoft-style GUIDs,
            export up to 1,000 at once, and inspect or validate any identifier offline.
          </p>

          <div className={styles.bluf}>
            Generate valid RFC 9562 UUIDs and Microsoft-format GUIDs in your browser: random v4 (122 random bits),
            sortable timestamp-ordered v7, deterministic v5 (SHA-1) or v3 (MD5), or validate and inspect any UUID.
            Create up to 1,000 at once and copy or download — nothing leaves your device.
          </div>
        </div>

        <div className={styles.calculatorWrapper}>
          <ToolShell
            features={[
              'v4, v7 & v5 (RFC 9562)',
              'Bulk up to 1,000',
              'Validate & decode',
              'Code for 6 languages',
            ]}
          >
            <UuidGenerator />
          </ToolShell>
        </div>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2>How to Generate a UUID</h2>
            <p>
              This UUID and GUID generator operates entirely client-side inside your browser across five tabs:
            </p>
            <ul>
              <li><strong>1. v4 (Random):</strong> Choose how many (1 to 1,000), the case, hyphens, braces, URN or Base64, then copy or download the list.</li>
              <li><strong>2. v7 (Time-Ordered):</strong> The same options for IDs that sort by creation time. The list presets give plain text, a SQL <code>IN</code> list, JSON or CSV.</li>
              <li><strong>3. v5 / v3 (Name):</strong> Supply a standard RFC 9562 namespace (DNS, URL, OID, X.500, or custom UUID) plus a UTF-8 name string to compute deterministic SHA-1 (v5) or MD5 (v3) UUIDs.</li>
              <li><strong>4. Validate &amp; Convert:</strong> Paste a UUID or GUID to check its format, see its version and variant, convert it, and read the time inside v1, v6 and v7 values.</li>
              <li><strong>5. Nil &amp; Max:</strong> Copy the empty (nil) GUID or the Max UUID.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Which UUID Version Should I Use?</h2>
            <p>
              RFC 9562 defines eight UUID versions, though most modern applications rely on three: v4, v7, and v5. Choosing the right version depends on whether you need unpredictability, database index locality, or deterministic repeatability.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.contentTable}>
                <caption>Comparison of common UUID versions (RFC 9562)</caption>
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Mechanism</th>
                    <th>Random / Hash Bits</th>
                    <th>Sortable?</th>
                    <th>Best Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>v4</strong></td>
                    <td>Cryptographic RNG</td>
                    <td>122 random bits</td>
                    <td>No (random)</td>
                    <td>General IDs and URLs where creation time should stay hidden</td>
                  </tr>
                  <tr>
                    <td><strong>v7</strong></td>
                    <td>48-bit Unix ms + counter + RNG</td>
                    <td>Up to 74 bits</td>
                    <td>Yes (time-ordered)</td>
                    <td>Database primary keys, distributed logs, ordered event streams</td>
                  </tr>
                  <tr>
                    <td><strong>v5</strong></td>
                    <td>SHA-1(namespace + name)</td>
                    <td>122 hash bits</td>
                    <td>No (deterministic)</td>
                    <td>Idempotent IDs derived from URLs, domains, or external keys</td>
                  </tr>
                  <tr>
                    <td><strong>v3</strong></td>
                    <td>MD5(namespace + name)</td>
                    <td>122 hash bits</td>
                    <td>No (deterministic)</td>
                    <td>Legacy compatibility only; prefer v5 for new designs</td>
                  </tr>
                  <tr>
                    <td><strong>v1</strong></td>
                    <td>Gregorian timestamp + MAC</td>
                    <td>60-bit time + node</td>
                    <td>Byte-swapped</td>
                    <td>Legacy systems; leaks hardware MAC address and clock</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>UUID v4 (Random) and Collision Odds</h2>
            <p>
              A version 4 UUID fills 122 of its 128 bits using a cryptographically secure pseudorandom number generator (here, Web Crypto <code>crypto.getRandomValues</code>). The remaining 6 bits are fixed: 4 bits hold the version nibble (<code>0100</code>, hex <code>4</code>) and 2 bits hold the RFC variant (<code>10</code>, hex <code>8</code>, <code>9</code>, <code>a</code>, or <code>b</code>).
            </p>
            <p>
              Because there are 2¹²² ≈ <strong>5.3169 × 10³⁶</strong> unique v4 values, accidental collisions are astronomically unlikely when using a proper CSPRNG. Under the birthday approximation <code>p ≈ n² / (2 × 2¹²²)</code>, generating <strong>1 billion (10⁹)</strong> v4 UUIDs yields a collision probability around 9.4 × 10⁻²⁰. Generating <strong>5 × 10⁹</strong> UUIDs gives roughly 2.35 × 10⁻¹⁸, and reaching a 50% collision chance requires approximately <strong>2.71 × 10¹⁸</strong> UUIDs—more than 100 million per second for 850 years.
            </p>
          </section>

          <section className={styles.section}>
            <h2>UUID v7 (Time-Ordered) and Database Indexing</h2>
            <p>
              Random v4 UUIDs hurt write throughput on large relational tables because every insert lands at a random page in a B-tree index (PostgreSQL, MySQL InnoDB, SQL Server). Over millions of rows, random writes fragment the index and thrash the buffer pool.
            </p>
            <p>
              Standardized in <strong>RFC 9562 §5.7</strong>, UUIDv7 solves this by putting a big-endian <strong>48-bit Unix epoch millisecond timestamp</strong> in the first 6 bytes, followed by version <code>7</code> (<code>0111</code>), 12 bits of monotonic sub-millisecond counter or random bits, the <code>10</code> variant, and 62 random bits. When generating bulk v7 batches inside the same millisecond, this tool implements RFC 9562 monotonic counter incrementing (Method 1/2) so every generated ID strictly sorts after the previous one.
            </p>
          </section>

          <section className={styles.section}>
            <h2>UUID v5 and v3 (Name-Based)</h2>
            <p>
              Name-based UUIDs produce the exact same 128-bit output every time you combine the same 16-byte namespace UUID with the same UTF-8 string. RFC 9562 defines four standard namespaces:
            </p>
            <ul>
              <li><strong>DNS:</strong> <code>6ba7b810-9dad-11d1-80b4-00c04fd430c8</code></li>
              <li><strong>URL:</strong> <code>6ba7b811-9dad-11d1-80b4-00c04fd430c8</code></li>
              <li><strong>OID:</strong> <code>6ba7b812-9dad-11d1-80b4-00c04fd430c8</code></li>
              <li><strong>X.500 DN:</strong> <code>6ba7b814-9dad-11d1-80b4-00c04fd430c8</code></li>
            </ul>
            <p>
              For example, hashing the DNS namespace with <code>www.example.com</code> produces <code>2ed6657d-e927-568b-95e1-2665a8aea6a2</code> under v5 (SHA-1) and <code>5df41881-3aed-3515-88a7-2f4a814cf09e</code> under v3 (MD5). Both can also accept any valid custom UUID as a namespace.
            </p>
          </section>

          <section className={styles.section}>
            <h2>UUID vs GUID: Is There a Difference?</h2>
            <p>
              In everyday software engineering, UUID and GUID refer to the same 128-bit identifier specification. However, ecosystem conventions differ in presentation and binary layout:
            </p>
            <ul>
              <li><strong>Canonical UUID (RFC 9562):</strong> Lowercase hexadecimal with hyphens (<code>550e8400-e29b-41d4-a716-446655440000</code>), stored in network big-endian byte order.</li>
              <li><strong>Microsoft GUID:</strong> Often displayed uppercase or wrapped in curly braces (<code>{'{550E8400-E29B-41D4-A716-446655440000}'}</code>). In Windows COM and <code>System.Guid</code> byte arrays, the first three fields (<code>time_low</code>, <code>time_mid</code>, <code>time_hi_and_version</code>) are stored in little-endian order while the last 8 bytes remain big-endian.</li>
            </ul>
            <p>
              Use the format options to output standard canonical UUIDs, uppercase GUIDs, braced GUIDs, 32-character hex strings without hyphens, or RFC URN format (<code>urn:uuid:...</code>).
            </p>
          </section>

          <section className={styles.section}>
            <h2>UUID Format and Byte Layout</h2>
            <p>
              A canonical UUID consists of 32 hexadecimal characters (16 bytes = 128 bits) separated into five groups of lengths <strong>8-4-4-4-12</strong>:
            </p>
            <div className={styles.codeBlock}>xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx</div>
            <p>
              Here <code>M</code> (the 13th hex digit) indicates the <strong>version</strong> (e.g., <code>4</code> for random or <code>7</code> for time-ordered), and <code>N</code> (the 17th hex digit) encodes the <strong>variant</strong>. Standard RFC 4122 / RFC 9562 UUIDs have their two most significant bits of that byte set to <code>10</code>, restricting <code>N</code> to <code>8</code>, <code>9</code>, <code>a</code>, or <code>b</code>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Nil and Max UUIDs</h2>
            <p>
              RFC 9562 specifies two special sentinel UUIDs that bypass normal version/variant checks:
            </p>
            <ul>
              <li><strong>Nil UUID:</strong> <code>{NIL_UUID}</code> — all 128 bits set to zero, useful for representing an uninitialized or empty foreign-key placeholder without nullable columns.</li>
              <li><strong>Max UUID:</strong> <code>{MAX_UUID}</code> — all 128 bits set to one, standardized in RFC 9562 §5.10 as an upper-bound sentinel for sorted range scans and pagination.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Validate a UUID</h2>
            <p>
              A naive 32-hex regex accepts invalid strings with bogus version or variant bits. To validate a standard RFC 9562 UUID strictly (versions 1 through 8, variant <code>10xx</code>), match against:
            </p>
            <div className={styles.codeBlock}>{`^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`}</div>
            <p>
              Remember to allow the Nil and Max UUIDs explicitly if your application treats them as valid sentinels, and apply case-insensitive matching (<code>/i</code>) if Microsoft uppercase GUIDs are accepted.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Generate UUIDs in Code</h2>
            <p>
              Built-in standard library commands for new UUIDs. Databases differ in the version they return, so check yours:
            </p>
            <h3>JavaScript / Node.js / Browser</h3>
            <div className={styles.codeBlock}>{`crypto.randomUUID()`}</div>
            <h3>Python</h3>
            <div className={styles.codeBlock}>{`import uuid\nprint(uuid.uuid4())`}</div>
            <h3>C# / .NET</h3>
            <div className={styles.codeBlock}>{`Guid.NewGuid().ToString()      // standard form\nGuid.NewGuid().ToString("B")   // with braces`}</div>
            <h3>Java</h3>
            <div className={styles.codeBlock}>{`import java.util.UUID;\nUUID.randomUUID().toString();`}</div>
            <h3>SQL: PostgreSQL (13+), SQL Server, MySQL</h3>
            <div className={styles.codeBlock}>{`SELECT gen_random_uuid(); -- PostgreSQL, v4\nSELECT NEWID();            -- SQL Server\nSELECT UUID();             -- MySQL, v1`}</div>
            <h3>PowerShell</h3>
            <div className={styles.codeBlock}>{`[guid]::NewGuid().ToString()`}</div>
          </section>

          <section className={styles.section}>
            <h2>Security Notes: CSPRNG &amp; Predictability</h2>
            <p>
              UUIDs are designed for <strong>uniqueness</strong>, not secrecy. Version 1 leaks the host MAC address and creation timestamp; version 7 reveals millisecond creation timestamps; versions 3 and 5 are deterministic hashes of known inputs. Even version 4 (122 random bits) relies entirely on the quality of the underlying random number generator—always use Web Crypto <code>crypto.getRandomValues</code> or OS CSPRNGs rather than <code>Math.random()</code>, and do not use standard UUIDs as passwords or unhashed bearer secrets where cryptographic tokens are required.
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

          <section className={styles.section}>
            <h2>Related Developer Tools</h2>
            <ul>
              <li><Link href="/password-generator/"><strong>Password Generator:</strong></Link> Generate high-entropy secret tokens and passwords (when a UUID should not be used as a secret).</li>
              <li><Link href="/comma-separator/"><strong>Comma Separator:</strong></Link> Format bulk UUIDs or columns into SQL IN clauses, CSVs, and JSON arrays.</li>
            </ul>
          </section>
        </article>

        <HowWeCalculate slug="uuid-generator" />
      </div>
    </main>
  );
}
