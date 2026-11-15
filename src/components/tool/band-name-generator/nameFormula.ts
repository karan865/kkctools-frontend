import type { GenreId, StyleId } from '@/lib/generator/types';

export type FormulaId = 'the' | 'two-word' | 'of-phrase' | 'one-word' | 'and' | 'concept' | 'phrase';

export interface Formula {
  id: FormulaId;
  label: string;
  /** word slots shown as chips in the diagram */
  parts: string[];
  /** naming-style option that produces it (if any) */
  style?: StyleId;
}

export const FORMULAS: Record<FormulaId, Formula> = {
  the: { id: 'the', label: 'The + adjective + noun', parts: ['The', 'Adjective (optional)', 'Noun'], style: 'the' },
  'two-word': { id: 'two-word', label: 'Adjective + noun', parts: ['Adjective', 'Noun'], style: 'two-word' },
  'of-phrase': { id: 'of-phrase', label: 'X of Y', parts: ['Noun', 'of', 'Noun'], style: 'of-phrase' },
  'one-word': { id: 'one-word', label: 'One word', parts: ['One strong word'], style: 'one-word' },
  and: { id: 'and', label: 'Word & word', parts: ['Noun', '&', 'Noun'] },
  concept: { id: 'concept', label: 'Concept + number / code', parts: ['CONCEPT WORD', 'NUMBER or CODE'] },
  phrase: { id: 'phrase', label: 'Short phrase', parts: ['Word', 'Word', 'Word'] },
};

/** Works out which naming formula a generated name follows, from its shape. */
export function formulaOf(name: string, genre: GenreId): Formula {
  const n = name.trim();
  const words = n.split(/\s+/).filter(Boolean);
  if (/^the\s/i.test(n)) return FORMULAS.the;
  if (/\sof\s/i.test(n)) return FORMULAS['of-phrase'];
  if (n.includes('&')) return FORMULAS.and;
  if ((genre === 'kpop' || genre === 'any') && words.length === 2 && n === n.toUpperCase() && /[A-Z]/.test(n)) return FORMULAS.concept;
  if (words.length === 1) return FORMULAS['one-word'];
  if (words.length === 2) return FORMULAS['two-word'];
  return FORMULAS.phrase;
}
