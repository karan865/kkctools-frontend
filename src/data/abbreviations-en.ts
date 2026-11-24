/**
 * Curated list of English abbreviations that end with a period but DO NOT mark a sentence boundary.
 * Lowercase without trailing period for case-insensitive lookup.
 */
export const ABBREVIATIONS_EN: ReadonlySet<string> = new Set([
  // Social & professional honorifics
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'rev', 'hon', 'gen', 'col',
  'maj', 'capt', 'lt', 'sgt', 'st', 'fr',

  // Common Latin & business abbreviations
  'etc', 'vs', 'v', 'eg', 'e.g', 'ie', 'i.e', 'al', 'approx', 'dept',
  'est', 'govt', 'inc', 'ltd', 'corp', 'co', 'no', 'nos', 'fig', 'figs',
  'vol', 'vols', 'p', 'pp', 'eds', 'misc',

  // Time & date
  'a.m', 'p.m',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
  'mon', 'tue', 'wed', 'thu', 'fri',

  // Geographic & measurement
  'u.s', 'u.s.a', 'uk', 'u.k', 'eu', 'e.u',
  'ave', 'rd', 'st', 'blvd', 'dr', 'ln', 'ct', 'hwy', 'apt', 'ste',
  'sq', 'ft', 'yd', 'cm', 'mm', 'km', 'kg', 'lb', 'oz'
]);
