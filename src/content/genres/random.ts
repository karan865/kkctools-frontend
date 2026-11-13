import type { GenreConfig } from './types';

export const randomConfig: GenreConfig = {
  slug: 'random',
  routeKey: 'random',
  generatorGenre: 'any',
  h1: 'Random Band Name Generator',
  intro:
    'Not sure what genre you are? The random band name generator mixes words from every genre list at once, so you get surprising pairings you would never think of on your own. It is a fast way to break a creative block, find a name for a side project, or spark a better idea.',
  curatedExamples: [
    'Velvet Blizzard',
    'Neon Orchard',
    'Electric Meadow',
    'Whispering Diesel',
    'Subterranean Carousel',
    'Cosmic Cardigan',
    'The Iron Postcards',
    'Starlit Jackals',
    'Obsidian Skyline',
    'Paper Titan',
    'Midnight Lighthouse',
    'Static Meadow',
  ],
  sections: [
    {
      title: 'Why random names help',
      paragraphs: [
        'When a band is stuck, it is usually because everyone keeps suggesting the same kind of name. A random generator breaks that habit. By pulling one word from the rock list and another from the K-pop or metal list, it creates pairs that feel fresh precisely because nobody would put them together on purpose.',
        'Not every result will be good, and that is fine. The goal is volume. Generate twenty names, read them out loud, and you will usually find one or two that make the band laugh, react or argue. That reaction is a sign the name has some energy.',
      ],
    },
    {
      title: 'Good for bands that mix styles',
      paragraphs: [
        'If your music sits between genres, a name from one genre\'s list can feel wrong. A dream pop band with heavy riffs, or an electronic act with a punk attitude, does not fit neatly anywhere. Random pairings like "Neon Orchard" or "Paper Titan" do not lock you into one sound.',
        'Mixed names also leave room to change. If your second album sounds different from your first, a name that was never tied to one genre ages better.',
      ],
    },
    {
      title: 'How to find the good ones',
      paragraphs: [
        'Treat the results as raw material, not final answers. Save anything with one great word in it, even if the full name is not right. Often the best name comes from taking a word from one result and a word from another.',
        'Then run your favourites through three quick tests: can you say it clearly, can a friend spell it after hearing it once, and does it still feel right after a day? Names that survive all three are worth checking properly.',
      ],
    },
    {
      title: 'Unusual names are easier to own',
      paragraphs: [
        'One real advantage of random names is that odd combinations are less likely to be taken. A strange pair of words is more likely to be free on streaming services, social media and domains than a common phrase.',
        'That does not mean you can skip checking. Search the exact name, check the main platforms, and look at trademark registers for music before you print anything. Our guide on how to check if a band name is taken walks through it.',
      ],
    },
  ],
  faq: [
    {
      q: 'How does the random band name generator work?',
      a: 'It picks words from all of our genre word lists at once and combines them with naming patterns, then removes offensive words and names of well-known bands. Everything runs in your browser.',
    },
    {
      q: 'Why choose a random name instead of a genre-specific one?',
      a: 'Random names are good when your music mixes styles, when you want something unusual, or when you are stuck and need fresh ideas. Genre names are better when you want fans of one scene to recognise you.',
    },
    {
      q: 'Can I control the random results at all?',
      a: 'Yes. You can choose a naming style, the number of names, a starting letter and a word that every name must include, which is a quick way to steer the results.',
    },
    {
      q: 'Are random names easier to register and find online?',
      a: 'Often, yes. Unusual word pairs are less likely to be taken as handles, domains or trademarks. You still need to check, because nothing is guaranteed to be free.',
    },
    {
      q: 'What if a result is almost right but a bit too strange?',
      a: 'Keep the word you like and swap the other one, either by generating again or by choosing a word yourself. Many final band names start as a half-right random result.',
    },
  ],
  siblings: [
    {
      slug: 'rock',
      title: 'Rock Band Name Generator',
      description: 'Explore gritty overdrive, vintage blues attitude, and raw guitar amplifier swagger.',
    },
    {
      slug: 'metal',
      title: 'Metal Band Name Generator',
      description: 'Summon subterranean catacomb darkness, brutal riffing, and ancient apocalyptic weight.',
    },
    {
      slug: 'kpop',
      title: 'K-pop Band Name Generator',
      description: 'Discover celestial concepts, futuristic typography, and numeric idol group formulas.',
    },
  ],
  guides: [
    {
      path: '/guides/how-to-choose-a-band-name/',
      title: 'How to Choose a Band Name: Practical Roadmap',
      description: 'A comprehensive guide to testing phonetic rhythm, building shortlists, and clearing legal rights.',
    },
    {
      path: '/guides/how-to-check-if-a-band-name-is-taken/',
      title: 'How to Check If a Band Name Is Taken',
      description: 'An actionable step-by-step checklist to verify streaming availability, social handles, and trademark records.',
    },
  ],
};

