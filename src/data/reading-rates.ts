/**
 * Reading and speaking rate presets.
 * Rates from Brysbaert (2019) meta-analysis are flagged unverified until confirmation.
 * Speaking rates are labeled as editable examples.
 */

export interface ReadingRatePreset {
  id: string;
  label: string;
  wpm: number;
  type: 'reading' | 'speaking';
  sourceLabel: string;
  sourceUrl?: string;
  checkedOn: string;
  verified: boolean;
  notes?: string;
}

export const READING_RATE_PRESETS: ReadingRatePreset[] = [
  {
    id: 'reading-silent-nonfiction',
    label: 'Silent Reading (Non-Fiction)',
    wpm: 238,
    type: 'reading',
    sourceLabel: 'Brysbaert (2019), Journal of Memory and Language',
    sourceUrl: 'https://doi.org/10.1016/j.jml.2019.104047',
    checkedOn: '2026-11-22',
    verified: false,
    notes: 'Unconfirmed online publisher 403; cite with formula BLUF',
  },
  {
    id: 'reading-silent-fiction',
    label: 'Silent Reading (Fiction)',
    wpm: 260,
    type: 'reading',
    sourceLabel: 'Brysbaert (2019), Journal of Memory and Language',
    sourceUrl: 'https://doi.org/10.1016/j.jml.2019.104047',
    checkedOn: '2026-11-22',
    verified: false,
    notes: 'Unconfirmed online publisher 403; cite with formula BLUF',
  },
  {
    id: 'reading-aloud',
    label: 'Reading Aloud',
    wpm: 183,
    type: 'reading',
    sourceLabel: 'Brysbaert (2019), Journal of Memory and Language',
    sourceUrl: 'https://doi.org/10.1016/j.jml.2019.104047',
    checkedOn: '2026-11-22',
    verified: false,
    notes: 'Unconfirmed online publisher 403; cite with formula BLUF',
  },
  {
    id: 'speaking-slow',
    label: 'Speaking (Slow / Formal Presentation)',
    wpm: 110,
    type: 'speaking',
    sourceLabel: 'Example pace, editable',
    checkedOn: '2026-11-22',
    verified: false,
  },
  {
    id: 'speaking-average',
    label: 'Speaking (Conversational / Podcast)',
    wpm: 130,
    type: 'speaking',
    sourceLabel: 'Example pace, editable',
    checkedOn: '2026-11-22',
    verified: false,
  },
  {
    id: 'speaking-fast',
    label: 'Speaking (Fast / Commercial)',
    wpm: 150,
    type: 'speaking',
    sourceLabel: 'Example pace, editable',
    checkedOn: '2026-11-22',
    verified: false,
  },
];
