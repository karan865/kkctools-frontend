import type { GenreConfig } from './types';

export const rockConfig: GenreConfig = {
  slug: 'rock',
  routeKey: 'rock',
  generatorGenre: 'rock',
  h1: 'Rock Band Name Generator',
  intro:
    'Discover electric, gritty, and soulful rock and roll band name ideas built for raw guitar amplifiers, smoky clubs, and wide-open highway soundscapes. Whether you are launching an indie alternative outfit, a vintage garage rock power trio, or a modern blues-rock revival, generate titles that resonate with authentic swagger and timeless attitude.',
  curatedExamples: [
    'Electric Highway',
    'Rusty Jackals',
    'Midnight Rebels',
    'Velvet Static',
    'Neon Wolves',
    'The Broken Sparks',
    'Burning Voltage',
    'Silver Roadhouse',
    'Hollow Engine',
    'Golden Jackals',
    'Restless Riot',
    'Dusty Anthem',
  ],
  sections: [
    {
      title: 'The Enduring Chemistry of Rock & Roll Monikers',
      paragraphs: [
        'Rock music has spent over seven decades reinventing itself across sub-genres, yet its naming conventions remain rooted in tangible, physical Americana, visceral urban romance, and countercultural restlessness. An effective rock band title smells of valve amp vacuum tubes, worn leather jackets, asphalt highways, and vinyl record dust.',
        'Unlike extreme metal’s focus on the underworld or pop’s polished gloss, rock monikers draw beauty from the weathered and the imperfect. Descriptors like rusty, broken, dusty, electric, and velvet communicate a tactile history—suggesting instruments beaten up in tour vans, smoky rehearsals, and relentless sweat under stage lights.',
      ],
    },
    {
      title: 'Classic Rock Naming Archetypes: From Garage to Arena',
      paragraphs: [
        'Rock bands typically gravitate toward a handful of proven grammatical structures that have dominated music charts since the 1960s. The definitive article ("The Adjective Plural" or "The Noun Plural") remains the quintessential rock archetype, projecting an immediate sense of gang cohesion, neighborhood brotherhood, and shared purpose.',
        'Compound two-word phrases that juxtapose organic vulnerability with mechanical power—such as "Velvet Engine" or "Electric Wolves"—create an intriguing cognitive tension. Such pairings tell a vivid story before a single guitar riff is struck, making them magnetic choices for modern alternative, indie, and post-punk ensembles.',
      ],
    },
    {
      title: 'Testing Auditory Impact and Stage Delivery',
      paragraphs: [
        'Rock music lives or dies on live stage delivery. A great rock name must roll off the tongue with effortless rhythm when shouted into a club microphone by a promoter, chanted between encore requests, or painted onto the front head of a bass drum kit.',
        'Pay close attention to plosive consonants (P, T, K, B, D, G) that punch through loud room acoustics. Avoid convoluted multi-syllabic phrases or awkward tongue-twisters that require repetition. If you cannot introduce your band over the ambient roar of a crowded venue in under two seconds, the name is too complex.',
      ],
    },
    {
      title: 'Vetting Digital Availability for the Modern Rock Band',
      paragraphs: [
        'Because millions of rock and roll groups have formed across high school garages and rehearsal spaces over the decades, basic rock words often face fierce name collisions on streaming platforms. Having three obscure acoustic artists sharing your identical name on Spotify can dilute your release day algorithmic momentum and confuse potential fans.',
        'Always test your shortlist using our direct search shortcuts across Spotify, Bandcamp, YouTube, and Google. If an existing band with that title hasn’t released music or performed in fifteen years, investigate whether their trademarks remain active or consider adding a regional modifier to stake an unambiguous digital claim.',
      ],
    },
  ],
  faq: [
    {
      q: 'What makes a rock band name instantly memorable?',
      a: 'Memorable rock names combine sensory, physical words (like neon, leather, smoke, or wire) with punchy, rhythmic cadences that sound authentic when announced on stage or displayed on vintage posters.',
    },
    {
      q: 'Why do so many iconic rock bands use "The" in their names?',
      a: 'Starting with "The" projects a feeling of solidarity, identity, and gang mentality, suggesting that the members are a unified collective rather than just individual session players.',
    },
    {
      q: 'Can this generator produce names for both indie rock and hard rock projects?',
      a: 'Yes. Our rock vocabulary pools span soulful blues roots, alternative grunge textures, indie rock poetry, and high-octane hard rock imagery for versatile styling.',
    },
    {
      q: 'How do I know if my rock band name sounds too cliché?',
      a: 'If a combination immediately reminds you of an existing household stadium band, it may lean too close to parody. Strive for unexpected pairings that spark curiosity while honoring classic rock energy.',
    },
    {
      q: 'Should my band name reflect our hometown or region?',
      a: 'While not required, incorporating evocative geographical metaphors (like highway, coast, canyon, or avenue) adds evocative regional color that roots your musical narrative in a specific place.',
    },
  ],
  siblings: [
    {
      slug: 'heavy-metal',
      title: 'Heavy Metal Band Name Generator',
      description: 'Explore epic arena-conquering power, mythological titans, and screaming twin-lead battle anthems.',
    },
    {
      slug: 'metal',
      title: 'Metal Band Name Generator',
      description: 'Dive into extreme subterranean doom, death metal fury, and brutal catacomb atmospheres.',
    },
    {
      slug: 'random',
      title: 'Random Band Name Generator',
      description: 'Generate unexpected cross-genre band name combinations with zero stylistic limitations.',
    },
  ],
  guides: [
    {
      path: '/guides/how-to-choose-a-band-name/',
      title: 'How to Choose a Band Name: The Practical Guide',
      description: 'A complete masterclass on brainstorming, testing live pronunciation, and securing legal trademark availability.',
    },
    {
      path: '/guides/band-name-ideas-by-genre/',
      title: 'Band Name Ideas by Genre: The Complete Breakdown',
      description: 'Analyze the unique formulas, vocabulary choices, and aesthetic trends that define great musical titles.',
    },
  ],
};

