/**
 * Offensive content and profanity filter.
 * Applied to user custom words and generated names.
 */

const OFFENSIVE_TERMS: string[] = [
  'nigger', 'nigga', 'faggot', 'kike', 'spic', 'chink', 'wetback', 'gook',
  'retard', 'cunt', 'twat', 'bitch', 'whore', 'slut', 'rape', 'rapist',
  'pedophile', 'pedo', 'hitler', 'nazi', 'holocaust', 'kkk', 'jihadist',
  'terrorist', 'fuck', 'fucker', 'fucking', 'motherfucker', 'shit', 'shitty',
  'bullshit', 'asshole', 'bastard', 'dickhead', 'pussy', 'cock', 'blowjob',
  'dildo', 'masturbate', 'porn', 'porno', 'incest', 'bestiality', 'suicide',
  'genocide', 'lynch', 'lynching', 'antisemitic', 'whitepower', 'behead',
];

export function isOffensive(text: string): boolean {
  if (!text) return false;
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  for (const term of OFFENSIVE_TERMS) {
    if (normalized.includes(term)) {
      return true;
    }
  }
  return false;
}

