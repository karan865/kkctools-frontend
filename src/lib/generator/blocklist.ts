/**
 * Curated blocklist of well-known real music bands, artists, and groups.
 * NOTE: This blocklist avoids colliding with famous established acts,
 * but it does NOT guarantee legal availability or uniqueness for trademark purposes.
 */

export const FAMOUS_BANDS: string[] = [
  // Classic & Hard Rock
  'The Beatles', 'The Rolling Stones', 'Led Zeppelin', 'Pink Floyd', 'The Who',
  'Queen', 'AC/DC', 'Black Sabbath', 'Deep Purple', 'Aerosmith', 'Van Halen',
  'Guns N Roses', 'The Doors', 'Fleetwood Mac', 'Eagles', 'Boston', 'Journey',
  'Def Leppard', 'Kiss', 'Bon Jovi', 'Whitesnake', 'Scorpions', 'ZZ Top',
  'Lynyrd Skynyrd', 'Creedence Clearwater Revival', 'Heart', 'Rush', 'Thin Lizzy',
  'Blue Oyster Cult', 'Bad Company', 'The Police', 'Dire Straits', 'Foreigner',
  
  // Metal & Heavy Metal
  'Metallica', 'Iron Maiden', 'Judas Priest', 'Megadeth', 'Slayer', 'Anthrax',
  'Pantera', 'Motorhead', 'Dio', 'Ozzy Osbourne', 'Sepultura', 'Slipknot',
  'System of a Down', 'Rammstein', 'Korn', 'Avenged Sevenfold', 'Disturbed',
  'Lamb of God', 'Cannibal Corpse', 'Death', 'Morbid Angel', 'Opeth', 'Mastodon',
  'Ghost', 'Gojira', 'Meshuggah', 'In Flames', 'Dimmu Borgir', 'Cradle of Filth',
  'Behemoth', 'Children of Bodom', 'Nightwish', 'Helloween', 'Blind Guardian',
  'Manowar', 'Saxon', 'Dream Theater', 'Queensryche', 'Trivium', 'Killswitch Engage',
  'Bullet for My Valentine', 'Bring Me the Horizon', 'Arch Enemy', 'Amon Amarth',
  'Mayhem', 'Burzum', 'Darkthrone', 'Immortal', 'Emperor', 'Carcass',
  
  // Punk & Hardcore
  'The Clash', 'Sex Pistols', 'Ramones', 'Green Day', 'Blink-182', 'The Offspring',
  'Bad Religion', 'Black Flag', 'Dead Kennedys', 'Misfits', 'Descendents',
  'Social Distortion', 'Fugazi', 'Minor Threat', 'Rancid', 'NOFX', 'Pennywise',
  'Sum 41', 'Simple Plan', 'Good Charlotte', 'Rise Against', 'AFI', 'Anti-Flag',
  'The Damned', 'Buzzcocks', 'Siouxsie and the Banshees', 'Sublime', 'The Stooges',
  'Iggy Pop', 'Television', 'Patti Smith Group', 'Dropkick Murphys', 'Against Me',
  
  // Alternative & Indie Rock
  'Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains', 'Radiohead',
  'The Smashing Pumpkins', 'Red Hot Chili Peppers', 'Foo Fighters', 'R.E.M.',
  'U2', 'Coldplay', 'The Cure', 'The Smiths', 'Joy Division', 'New Order',
  'Oasis', 'Blur', 'Arctic Monkeys', 'The Strokes', 'The White Stripes',
  'The Killers', 'Muse', 'Franz Ferdinand', 'Interpol', 'Yeah Yeah Yeahs',
  'Arcade Fire', 'Vampire Weekend', 'Phoenix', 'The National', 'Modest Mouse',
  'Death Cab for Cutie', 'The Shins', 'Fleet Foxes', 'Bon Iver', 'Two Door Cinema Club',
  'Foals', 'The 1975', 'Florence and the Machine', 'Mumford and Sons', 'The Black Keys',
  'Cage the Elephant', 'Foster the People', 'Imagine Dragons', 'Twenty One Pilots',
  
  // Pop & Synth
  'ABBA', 'Bee Gees', 'The Beach Boys', 'Maroon 5', 'Coldplay', 'OneRepublic',
  'The Chainsmokers', 'Daft Punk', 'Gorillaz', 'Pet Shop Boys', 'Depeche Mode',
  'Tears for Fears', 'Duran Duran', 'A-ha', 'Eurythmics', 'Culture Club',
  'Modern Talking', 'Spice Girls', 'Destinys Child', 'TLC', 'Little Mix',
  'Fifth Harmony', 'The Pussycat Dolls', 'Girls Aloud', 'Sugababes', 'All Saints',
  'Black Eyed Peas', 'No Doubt', 'Paramore', 'Evanescence', 'Clean Bandit',
  
  // Boy Bands
  'Backstreet Boys', 'NSYNC', 'Boyz II Men', 'New Kids on the Block', 'One Direction',
  'The Jackson 5', 'Take That', 'Westlife', 'Boyzone', 'Jonas Brothers',
  'Five', '98 Degrees', 'Hanson', 'The Wanted', 'Big Time Rush', 'O-Town',
  'Menudo', 'Blue', 'B2K', 'JLS', '5 Seconds of Summer', 'Why Dont We',
  'All-4-One', 'Color Me Badd', 'New Edition', '112', 'Jagged Edge',
  
  // K-pop Groups
  'BTS', 'BLACKPINK', 'EXO', 'TWICE', 'Stray Kids', 'NCT', 'SEVENTEEN',
  'TXT', 'ENHYPEN', 'ATEEZ', 'TREASURE', 'ITZY', 'aespa', 'NewJeans',
  'IVE', 'LE SSERAFIM', 'NMIXX', 'Red Velvet', 'MAMAMOO', 'GOT7',
  'MONSTA X', 'SHINee', 'BIGBANG', 'Super Junior', 'TVXQ', '2PM',
  'Girls Generation', '2NE1', 'Wonder Girls', 'KARA', 'T-ara', 'SISTAR',
  'Miss A', 'Apink', 'GFRIEND', 'LOONA', 'EVERGLOW', 'Dreamcatcher',
  'STAYC', 'KISS OF LIFE', 'BOYNEXTDOOR', 'RIIZE', 'ZEROBASEONE',
  'The Boyz', 'CRAVITY', 'P1Harmony', 'DAY6', 'FTISLAND', 'CNBLUE',
  'SuperM', 'NCT 127', 'NCT DREAM', 'WayV', 'Wanna One', 'X1', 'Kep1er',
  
  // Additional Legendary Artists
  'Creed', 'Nickelback', '3 Doors Down', 'Shinedown', 'Seether', 'Breaking Benjamin',
  'Papa Roach', 'Godsmack', 'Staind', 'Puddle of Mudd', 'Trapt', 'Hoobastank',
  'Audioslave', 'Velvet Revolver', 'Stone Temple Pilots', 'Bush', 'Live',
  'Silverchair', 'Weezer', 'Jimmy Eat World', 'Dashboard Confessional', 'Taking Back Sunday',
  'The Used', 'My Chemical Romance', 'Fall Out Boy', 'Panic at the Disco', 'All Time Low',
  'Yellowcard', 'New Found Glory', 'The Starting Line', 'Story of the Year', 'Hawthorne Heights'
];

/**
 * Normalizes name for deduplication / blocklist match:
 * lowercase, removes punctuation/spaces, strips leading "the".
 */
export function normalizeName(name: string): string {
  let clean = name.toLowerCase().trim();
  if (clean.startsWith('the ')) {
    clean = clean.slice(4).trim();
  }
  return clean.replace(/[^a-z0-9]/g, '');
}

const BLOCKLIST_SET = new Set(FAMOUS_BANDS.map(normalizeName));

export function isBlocklisted(name: string): boolean {
  return BLOCKLIST_SET.has(normalizeName(name));
}

export function getBlocklistCount(): number {
  return FAMOUS_BANDS.length;
}

