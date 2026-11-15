import type { GenreId } from '@/lib/generator/types';

/**
 * Band name ideas shown on /band-name-generator/.
 * Hand-picked from the generator's own output (2026-11-15, 30 names per genre, 10 kept) so the page
 * shows good examples; `band-name-ideas.test.ts` checks every one against the blocklist and the offensive filter.
 */
export interface IdeaGenre {
  id: GenreId;
  label: string;
  href?: string;
  blurb: string;
  names: string[];
}

export const BAND_NAME_IDEAS: IdeaGenre[] = [
  {
    id: 'rock',
    label: 'Rock band names',
    href: '/band-name-generator/rock/',
    blurb: 'Roads, engines, outlaws and amplifiers.',
    names: ['Gritty Cobra', 'Blazing Wolves', 'Rusty Sirens', 'Howling Breakers', 'The Lawless Vultures', 'The Rambling Sinners', 'The Faded Scorpions', 'The Viper Jackals', 'Thunderbird of Bullet', 'Tempest'],
  },
  {
    id: 'metal',
    label: 'Metal band names',
    href: '/band-name-generator/metal/',
    blurb: 'Dark, heavy words for death, black and doom metal.',
    names: ['Infernal Void', 'Venomous Inferno', 'Iron Daemon', 'The Dread Obelisk', 'The Forsaken Warlock', 'The Rotting Leviathan', 'The Cavernous Blight', 'Covenant of Scythe', 'Reaper of Omen', 'Sepulcher'],
  },
  {
    id: 'heavy-metal',
    label: 'Heavy metal band names',
    href: '/band-name-generator/heavy-metal/',
    blurb: 'Steel, dragons and battle imagery in the classic 80s style.',
    names: ['Rebel Vikings', 'Lightning Gladiator', 'Starlight Wardens', 'The Thunderous Titans', 'The Fiery Swords', 'The Fearless Archon', 'The Relentless Blacksmiths', 'Fortress of Talon', 'Dragon of Talisman', 'Vanguard'],
  },
  {
    id: 'punk',
    label: 'Punk band names',
    blurb: 'Short, rude and loud.',
    names: ['No Curfew', 'Frenzied Hyenas', 'Sloppy Rejects', 'Vulgar Feedback', 'The Alley Scabs', 'The Lawless Radios', 'The Blunt Runaways', 'The Vile Clones', 'Sabotage of Revolt', 'Mutant'],
  },
  {
    id: 'pop',
    label: 'Pop band names',
    blurb: 'Bright, sweet and catchy.',
    names: ['Sunburst Heartbeat', 'Marigold Resort', 'Topaz Avenue', 'Sky-Blue Illusion', 'The Melon Breeze', 'The Radiant Prism', 'The Spirited Parade', 'Masquerade of Lantern', 'Rainbow of Symphony', 'Cupcake'],
  },
  {
    id: 'indie',
    label: 'Indie band names',
    blurb: 'Quiet, nature-inspired and a little nostalgic.',
    names: ['Faint Thrush', 'Mellow Shed', 'Poetic Ridge', 'Driftwood Meadow', 'The Gentle Trails', 'The Starlit Glades', 'The Golden Gramophone', 'The Sunlit Swans', 'The Wren of Forest', 'Orchards'],
  },
  {
    id: 'kpop',
    label: 'K-pop group names',
    href: '/band-name-generator/kpop/',
    blurb: 'Space and light concepts with codes and numbers.',
    names: ['ALPHA TWELVE', 'HARMONY GEN-3', 'VELVET NINE', 'POLARIS DREAM', 'PHANTOM GROOVE', 'ZEPHYR STUDIO', 'THE AURA MIRAGE', 'NEONWHISPER', 'APEXHEART', 'AEON'],
  },
  {
    id: 'boy-band',
    label: 'Boy band names',
    href: '/band-name-generator/boy-band/',
    blurb: 'Streets, summers and romance.',
    names: ['Seaside Heroes', 'Secret Promise', 'Midnight Echoes', 'Sunrise Phantoms', 'The Tender Singers', 'The Vocal Meteors', 'The Harbor Hearts', 'The Sweet Dancers', 'Miracle of Radio', 'Postcard'],
  },
];
