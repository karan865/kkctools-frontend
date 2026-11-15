import React from 'react';
import type { GenreId, StyleId } from '@/lib/generator/types';
import { FORMULAS, formulaOf, type FormulaId } from './nameFormula';
import styles from './FormulaPanel.module.css';

interface Props {
  names: string[];
  genre: GenreId;
  style: StyleId;
}

const FALLBACK: Record<FormulaId, string> = {
  the: 'The Iron Vultures',
  'two-word': 'Velvet Static',
  'of-phrase': 'Hammer of Glory',
  'one-word': 'Thunderbird',
  and: 'Rust & Anthem',
  concept: 'NOVA ONE',
  phrase: 'No Curfew Tonight',
};

/**
 * "How these names are built": each naming formula as word slots, with an example taken from the
 * current results and how many of them use it — so users can see how the generator works.
 */
export default function FormulaPanel({ names, genre, style }: Props) {
  const groups = new Map<FormulaId, string[]>();
  for (const n of names) {
    const f = formulaOf(n, genre).id;
    groups.set(f, [...(groups.get(f) ?? []), n]);
  }
  const order: FormulaId[] = genre === 'kpop' ? ['concept', 'one-word', 'two-word', 'the'] : ['two-word', 'the', 'of-phrase', 'one-word'];
  for (const id of groups.keys()) if (!order.includes(id)) order.push(id);
  return (
    <section className={styles.panel} aria-labelledby="bng-formula-title">
      <h2 id="bng-formula-title" className={styles.title}>
        How these names are built
      </h2>
      <p className={styles.sub}>Every name follows a formula. Pick one in Naming Style to get only that kind.</p>
      <ol className={styles.list}>
        {order.map((id) => {
          const f = FORMULAS[id];
          const list = groups.get(id) ?? [];
          const active = style !== 'any' && f.style === style;
          return (
            <li key={id} className={`${styles.row} ${active ? styles.active : ''} ${list.length === 0 ? styles.unused : ''}`}>
              <div className={styles.head}>
                <span className={styles.label}>{f.label}</span>
                <span className={styles.count}>{list.length > 0 ? `${list.length} of ${names.length}` : 'none this batch'}</span>
              </div>
              <div className={styles.flow}>
                {f.parts.map((p, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <span className={styles.plus} aria-hidden="true">
                        +
                      </span>
                    )}
                    <span className={p === 'The' || p === 'of' || p === '&' ? styles.fixed : styles.slot}>{p}</span>
                  </React.Fragment>
                ))}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
                <span className={styles.example}>{list[0] ?? FALLBACK[id]}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
