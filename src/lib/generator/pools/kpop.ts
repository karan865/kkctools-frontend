import type { WordPools } from '../types';

export const kpopPools: WordPools = {
  conceptWords: [
    'NOVA', 'ZENITH', 'LUMEN', 'AURA', 'STELLA', 'ORBIT', 'PRISM', 'HALO',
    'ECLIPSE', 'VELA', 'ARC', 'MIRA', 'SOLIS', 'LUNA', 'AXIS', 'VORTEX',
    'CHROMA', 'ASTRAL', 'COSMO', 'NEO', 'AEON', 'PULSE', 'APEX', 'FLARE',
    'SPECTRUM', 'HORIZON', 'GENESIS', 'CYBER', 'HYPER', 'NEXUS', 'POLARIS', 'QUASAR',
    'SOLAR', 'RADIANT', 'INFINITY', 'ALPHA', 'OMEGA', 'SIGMA', 'DELTA', 'TITAN',
    'SIREN', 'VIVID', 'BLAZE', 'SPARK', 'MIRAGE', 'PHANTOM', 'GALAXY', 'NEBULA',
    'METEOR', 'COMET', 'STARDUST', 'CELESTIAL', 'SYNERGY', 'HARMONY', 'RHYTHM', 'ECHO',
    'DYNAMIC', 'MATRIX', 'VECTOR', 'QUANTUM', 'ZEPHYR', 'PHOENIX', 'AERO', 'SONIC',
    'KINETIC', 'MIRACLE', 'UTOPIA', 'PARADOX', 'VISION', 'DESTINY', 'ILLUSION', 'INFINITY',
    'DIVINE', 'ETERNAL', 'CRYSTAL', 'DIAMOND', 'GLITZ', 'VELVET', 'SILK', 'GLAMOUR',
    'AURORA', 'LUSTER', 'ELEGANCE', 'MYSTIC', 'VIBE'
  ].filter((v, i, a) => a.indexOf(v) === i),

  suffixes: [
    'X', 'IZ', 'ST', 'EN', 'ONE', 'NINE', 'SEVEN', 'ZERO',
    'PRO', 'PLUS', 'MAX', 'PRIME', 'CORE', 'WAVE', 'LINE', 'ZONE',
    'BEAT', 'SYNC', 'LINK', 'TECH', 'FORCE', 'FUSION', 'CREW', 'SQUAD',
    'CLUB', 'FLOW', 'GIRLS', 'BOYS', 'KIDS', 'STARS', 'LIGHT', 'SHINE',
    'GLOW', 'POP', 'VIBES', 'DROP', 'JAM', 'STEP', 'MODE', 'DREAM',
    'RUSH', 'SURGE', 'BLOOM', 'SPARK', 'BLAST', 'FIRE', 'HEAT', 'ICE',
    'CHILL', 'DRIFT', 'SHIFT', 'LIFT', 'SNAP', 'CRUSH', 'FLASH', 'TWIST',
    'TURN', 'LOOP', 'ROLL', 'RISE', 'JUMP', 'BOUNCE', 'PLAY', 'MOVE',
    'SOUL', 'HEART', 'EYES', 'VOICE', 'SOUND', 'TONE', 'PEAK', 'EDGE',
    'SIDE', 'WAY', 'MARK', 'PATH', 'BASE', 'GATE', 'ROOM', 'DECK',
    'RING', 'BAND', 'TEAM', 'UNIT', 'CELL'
  ].filter((v, i, a) => a.indexOf(v) === i),

  numberWords: [
    'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT',
    'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY',
    'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY', 'HUNDRED', 'MILLION', 'BILLION', 'ZERO',
    'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH',
    'NINTH', 'TENTH', 'DUO', 'TRIO', 'QUAD', 'PENTA', 'HEXA', 'SEPTA',
    'OCTA', 'NONA', 'DECA', 'INFINITY', 'MAX', 'MINI', 'TWIN', 'DOUBLE',
    'TRIPLE', 'SINGLE', 'SOLO', 'PRIME', 'UNISON', 'BINARY', 'TRINITY', 'LEGACY',
    'CENTURY', 'DECADE', 'SEASON', 'CHAPTER', 'EPISODE', 'VOLUME', 'LEVEL', 'TIER',
    'STAGE', 'PHASE', 'GEN-1', 'GEN-2', 'GEN-3', 'GEN-4', 'GEN-5', 'GEN-X',
    'GEN-Z', 'V-1', 'V-2', 'V-3', 'V-4', 'V-5', 'X-1', 'X-2',
    'X-3', 'X-4', 'X-5', 'Z-1', 'Z-2'
  ].filter((v, i, a) => a.indexOf(v) === i),

  adjectives: [
    'Vivid', 'Shiny', 'Velvet', 'Glitter', 'Cosmic', 'Radiant', 'Starlight', 'Secret',
    'Sweet', 'Golden', 'Silver', 'Crystal', 'Pastel', 'Neon', 'Diamond', 'Breezy',
    'Cherry', 'Pure', 'Magic', 'Royal', 'Super', 'Hyper', 'Electric', 'Dreamy',
    'Solar', 'Lunar', 'Aura', 'Celestial', 'Prismatic', 'Sleek', 'Dazzling', 'Infinite',
    'Charming', 'Flirty', 'Playful', 'Bold', 'Fierce', 'Wild', 'Classy', 'Polished',
    'Glossy', 'Silk', 'Sparkling', 'Blissful', 'Sunny', 'Airy', 'Tender', 'Lush',
    'Peachy', 'Berry', 'Sugar', 'Honey', 'Candy', 'Vanilla', 'Minty', 'Crisp',
    'Sharp', 'Smooth', 'Velvety', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Onyx',
    'Platinum', 'Gleaming', 'Twinkling', 'Shimmering', 'Glowing', 'Brilliant', 'Vibrant', 'Dynamic',
    'Magnetic', 'Hypnotic', 'Alluring', 'Stunning', 'Exquisite', 'Graceful', 'Noble', 'Majestic',
    'Supreme', 'Ultimate', 'Everlasting', 'Timeless', 'Enchanted'
  ].filter((v, i, a) => a.indexOf(v) === i),

  nouns: [
    'Orbit', 'Prism', 'Galaxy', 'Mirage', 'Starlight', 'Harmony', 'Melody', 'Eclipse',
    'Dream', 'Vision', 'Fantasy', 'Romance', 'Heartbeat', 'Symphony', 'Horizon', 'Sunrise',
    'Echo', 'Whisper', 'Breeze', 'Wonder', 'Paradise', 'Oasis', 'Lagoon', 'Carnival',
    'Parade', 'Carousel', 'Confetti', 'Fireworks', 'Glitter', 'Diamond', 'Crystal', 'Pearl',
    'Ribbon', 'Balloon', 'Lollipop', 'Cupcake', 'Sundae', 'Chandelier', 'Boulevard', 'Avenue',
    'Cinema', 'Ballet', 'Studio', 'Stage', 'Spotlight', 'Encore', 'Festival', 'Holiday',
    'Vacation', 'Resort', 'Harbor', 'Island', 'Garden', 'Meadow', 'Rainbow', 'Halo',
    'Aura', 'Spectrum', 'Frequency', 'Vibration', 'Tempo', 'Cadence', 'Chorus', 'Verse',
    'Rhythm', 'Groove', 'Beat', 'Step', 'Dance', 'Motion', 'Flight', 'Glider',
    'Comet', 'Meteor', 'Constellation', 'Planet', 'Satellite', 'Voyager', 'Pioneer', 'Legend',
    'Icon', 'Idol', 'Muse', 'Goddess', 'Princess'
  ].filter((v, i, a) => a.indexOf(v) === i),
};

