/**
 * Passphrase engine with the EFF word list attached (tests and server pages).
 * Client components import `passphrase-core` and load the list on demand.
 */
import type { ByteSource } from './secure-random';
import * as core from './passphrase-core';
import { PASSPHRASE_WORDLIST, PASSPHRASE_WORDLIST_META } from '@/data/wordlist-passphrase';

export * from './passphrase-core';

export function generatePassphrase(
  opts: core.PassphraseOptions = core.DEFAULT_PASSPHRASE_OPTIONS,
  source?: ByteSource,
  wordList: readonly string[] = PASSPHRASE_WORDLIST
): core.PassphraseResult {
  return core.generatePassphrase(opts, source, wordList);
}

export function generateBulkPassphrases(
  count: number,
  opts: core.PassphraseOptions = core.DEFAULT_PASSPHRASE_OPTIONS,
  source?: ByteSource,
  wordList: readonly string[] = PASSPHRASE_WORDLIST
): core.PassphraseResult[] {
  return core.generateBulkPassphrases(count, opts, source, wordList);
}

export { PASSPHRASE_WORDLIST_META };
