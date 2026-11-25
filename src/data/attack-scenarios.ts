/**
 * Shared password attack-rate assumptions.
 * Marked sourced: false because these are order-of-magnitude assumptions
 * rather than measurements from a single external standard; users can edit them in the UI.
 */

export interface AttackScenario {
  id: string;
  label: string;
  guessesPerSecond: number;
  note: string;
  sourced: false;
}

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'online-rate-limited',
    label: 'Online, rate-limited',
    guessesPerSecond: 100 / 3600, // 100 guesses per hour
    note: 'Assumes a login form that throttles or locks after failed attempts (100/hr).',
    sourced: false,
  },
  {
    id: 'online-unthrottled',
    label: 'Online, no rate limit',
    guessesPerSecond: 10,
    note: 'Assumes a login endpoint with no throttling (10 guesses/sec).',
    sourced: false,
  },
  {
    id: 'offline-slow-hash',
    label: 'Offline, slow hash',
    guessesPerSecond: 10_000,
    note: 'Assumes a leaked database protected by bcrypt, scrypt, or Argon2 (10,000/sec).',
    sourced: false,
  },
  {
    id: 'offline-fast-hash',
    label: 'Offline, fast hash',
    guessesPerSecond: 100_000_000_000, // 10^11/s
    note: 'Assumes a leaked database using an unsalted fast hash on GPU hardware (100 billion/sec).',
    sourced: false,
  },
];

/**
 * Formats average guess time = 2^(bits - 1) / guessesPerSecond into human-readable units.
 */
export function formatGuessTime(bits: number, guessesPerSecond: number): string {
  if (guessesPerSecond <= 0 || !Number.isFinite(guessesPerSecond)) {
    return '—';
  }
  if (bits <= 0) return 'Instant';

  // Average guesses = 0.5 * 2^bits = 2^(bits - 1)
  const log2Seconds = bits - 1 - Math.log2(guessesPerSecond);
  if (log2Seconds < 0) {
    return 'Less than 1 second';
  }

  // Convert safely without Infinity overflow for huge bits: log10(x) = log2(x) * log10(2)
  const SECONDS_PER_YEAR = 31_557_600; // 365.25 days
  const log10Years = (log2Seconds - Math.log2(SECONDS_PER_YEAR)) * Math.LOG10E * Math.LN2;

  if (log10Years >= 12) {
    const exp = Math.floor(log10Years);
    const mantissa = Math.pow(10, log10Years - exp);
    return `${mantissa.toFixed(2)} × 10^${exp} years`;
  }

  const seconds = Math.pow(2, log2Seconds);
  if (seconds < 60) {
    return `${seconds.toFixed(1)} seconds`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minutes`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  }
  const days = hours / 24;
  if (days < 365.25) {
    return `${Math.round(days).toLocaleString('en-US')} days`;
  }
  const years = days / 365.25;
  if (years < 10) {
    return `${years.toFixed(1)} years`;
  }
  if (years < 1_000_000) {
    return `${Math.round(years).toLocaleString('en-US')} years`;
  }
  if (years < 1_000_000_000) {
    return `${(years / 1_000_000).toFixed(2)} million years`;
  }
  return `${(years / 1_000_000_000).toFixed(2)} billion years`;
}
