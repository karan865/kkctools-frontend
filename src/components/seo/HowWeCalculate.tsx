import React from 'react';
import Link from 'next/link';
import { CALCULATION_METHODS } from '@/content/calculation-methods';
import { INDEXABLE_ROUTES } from '@/lib/routes';
import { OWNER_EMAIL } from '@/config/site';

/**
 * Standard "How this calculator works" block (SEO audit 2026-11-14, M5):
 * formula, default values with where they come from, linked sources, last-updated date,
 * and how to report a mistake. Content lives in src/content/calculation-methods.ts.
 */
export default function HowWeCalculate({ slug }: { slug: string }) {
  const method = CALCULATION_METHODS[slug];
  if (!method) return null;
  const route = INDEXABLE_ROUTES.find((r) => r.path === `/${slug}/`);
  const updated = route
    ? new Date(route.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : null;

  const box: React.CSSProperties = {
    border: '1px solid var(--line, #E2E8F0)',
    borderRadius: 12,
    padding: '20px 22px',
    margin: '36px 0',
    background: 'var(--surface, #F8FAFC)',
    color: 'var(--ink, #0F172A)',
    lineHeight: 1.65,
  };
  const h3: React.CSSProperties = { fontSize: '1.05rem', fontWeight: 700, margin: '18px 0 8px' };

  return (
    <section style={box} id="how-we-calculate" aria-labelledby="how-we-calculate-title">
      <h2 id="how-we-calculate-title" style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
        How This Calculator Works: Formula, Defaults &amp; Sources
      </h2>

      <h3 style={h3}>Formula</h3>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {method.formula.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h3 style={h3}>Default values (you can change them)</h3>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {method.defaults.map((d) => (
          <li key={d.label}>
            <strong>{d.label}:</strong> {d.value}
          </li>
        ))}
      </ul>

      <h3 style={h3}>Sources</h3>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {method.sources.map((s) =>
          s.url ? (
            <li key={s.label}>
              <a href={s.url} rel="noopener" target="_blank">
                {s.label}
              </a>
              {s.note ? ` — ${s.note}` : ''}
            </li>
          ) : (
            <li key={s.label}>
              {s.label}
              {s.note ? ` — ${s.note}` : ''}
            </li>
          )
        )}
      </ul>

      <p style={{ margin: '16px 0 0', fontSize: '0.9rem', color: 'var(--ink-2, #475569)' }}>
        Results are planning estimates, not engineering advice. Confirm quantities with your supplier and follow your
        plans and local building code.{updated ? ` Last updated: ${updated}.` : ''} Spotted a wrong number?{' '}
        <a href={`mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(`Correction: /${slug}/`)}`}>Email us</a> or use the{' '}
        <Link href="/contact/">contact page</Link>.
      </p>
    </section>
  );
}
