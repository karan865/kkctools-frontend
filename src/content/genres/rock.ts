import type { GenreConfig } from './types';

export const rockConfig: GenreConfig = {
  slug: 'rock',
  routeKey: 'rock',
  generatorGenre: 'rock',
  h1: 'Rock Band Name Generator',
  intro:
    'Get rock band name ideas with grit: highways, engines, neon, whiskey and late nights. The generator works for garage rock, classic rock, hard rock and indie rock, and mixes plain everyday words with a bit of attitude so the names sound like a band, not a product.',
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
      title: 'Why rock names feel the way they do',
      paragraphs: [
        'Rock names usually sound physical and a little worn. They come from roads, cars, bars, weather and city nights rather than outer space or fantasy. That fits the music: guitars, drums and songs about restlessness, love and getting out of town.',
        'Because of that, rock names work best with real, concrete words. "Rusty", "electric", "midnight", "highway", "engine" and "wolves" all paint a picture straight away. A good rock name makes you imagine a sticker on a guitar case or a sign outside a small venue.',
      ],
    },
    {
      title: 'Classic rock name shapes',
      paragraphs: [
        'The oldest trick is "The" plus a plural, such as "The Neon Wolves" or "The Midnight Rebels". It makes the band sound like a gang. Another common shape is an adjective plus an everyday object, like "Velvet Static" or "Rusty Engine". Both are easy to say and easy to remember.',
        'A third option is a place or a road: "Silver Roadhouse", "Route Nine", "Canyon Echo". Place names give the band a home in the listener\'s head. They work especially well for bands with a country, blues or Americana edge.',
      ],
    },
    {
      title: 'Test it out loud',
      paragraphs: [
        'Rock bands play loud rooms, so the name has to survive being shouted over noise. Say it into a phone at a rehearsal, or ask a friend to announce it across the room. If people mishear it or ask you to spell it, that is a warning sign.',
        'Also check how it sounds after a few drinks and in a hurry, because that is how promoters and fans will say it. Two or three short words with clear vowels are usually safest. Long names can work, but fans will shorten them, so make sure the short version still sounds good.',
      ],
    },
    {
      title: 'Make sure you can be found',
      paragraphs: [
        'The internet is full of rock bands, so check your name early. Search it in quotes with the word band, then look on Spotify, Bandcamp and Instagram. If an active band already uses it, keep looking. It is much cheaper to change a name before you print merch than after.',
        'Try to get the same handle on every platform. If the exact name is taken, adding "band", "theband" or your city is a normal workaround. A matching website domain is a bonus and makes you look established.',
      ],
    },
  ],
  faq: [
    {
      q: 'What makes a rock band name memorable?',
      a: 'Short, concrete words that create a picture straight away, an easy rhythm when you say it, and no spelling surprises. If someone can hear it once and find you online, it works.',
    },
    {
      q: 'Why do so many rock bands start their name with "The"?',
      a: 'It makes the band sound like a group of people rather than a single idea, a bit like a gang. It has been popular since the 1960s and still works well for garage and indie rock.',
    },
    {
      q: 'Does this generator work for indie rock and hard rock?',
      a: 'Yes. Keep the Rock genre selected and try different styles. Softer, odd pairings suit indie rock, while harder words like riot, engine and thunder suit hard rock.',
    },
    {
      q: 'How can I tell if my rock band name is too much of a cliché?',
      a: 'Search it. If you find lots of bands using the same pattern and the same words, it is probably a cliché. Swapping one word for something more specific to your band usually fixes it.',
    },
    {
      q: 'Should our band name mention our hometown?',
      a: 'It can help local fans connect with you, but it can also feel limiting if you tour widely. A safer option is to keep the city out of the name and add it to your handles and bio instead.',
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
      description: 'A step-by-step guide to brainstorming, testing pronunciation, and checking legal trademark availability.',
    },
    {
      path: '/guides/band-name-ideas-by-genre/',
      title: 'Band Name Ideas by Genre: The Complete Breakdown',
      description: 'Analyze the unique formulas, vocabulary choices, and aesthetic trends that define great musical titles.',
    },
  ],
};

