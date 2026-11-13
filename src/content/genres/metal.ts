import type { GenreConfig } from './types';

export const metalConfig: GenreConfig = {
  slug: 'metal',
  routeKey: 'metal',
  generatorGenre: 'metal',
  h1: 'Metal Band Name Generator',
  intro:
    'Get dark, heavy name ideas for death metal, black metal, doom and thrash bands. The generator pairs grim adjectives with words for ruins, rituals and decay, so every result sounds like it belongs on a black T-shirt. Pick a style, generate a batch, and save the ones your band argues about.',
  curatedExamples: [
    'Crimson Throne',
    'Abyssal Altar',
    'Infernal Dominion',
    'Obsidian Plague',
    'Funeral Carrion',
    'Wretched Legion',
    'Cursed Sepulcher',
    'Bleeding Wraith',
    'Shattered Monolith',
    'Hollow Necropolis',
    'Ashen Ritual',
    'Tomb of Torment',
  ],
  sections: [
    {
      title: 'What makes a name sound like metal',
      paragraphs: [
        'Extreme metal names set the mood before anyone hears a note. A good one tells people to expect down-tuned guitars, fast drums and harsh vocals. Most of them pull from the same few places: old buildings like tombs and altars, the body and decay, war, and very old myths.',
        'That is why words like sepulcher, carrion, wraith and obsidian show up so often. They are heavy, a little old-fashioned, and they sound serious. A metal name is not trying to get on the radio. It is trying to look right on an underground show flyer next to five other bands.',
      ],
    },
    {
      title: 'Patterns that work',
      paragraphs: [
        'Two patterns do most of the work. The first is a dark adjective plus a heavy noun, such as "Abyssal Altar" or "Ashen Ritual". The second is "Noun of Noun", such as "Tomb of Torment". The second pattern sounds more formal, almost like the title of an old book, which suits doom and symphonic bands.',
        'Single words can hit hard too, but they are risky. Most short, dark nouns have been used by some band in the last forty years, so a one-word name is much harder to find in search and much more likely to clash. Two words, or a short phrase, give you far more room.',
      ],
    },
    {
      title: 'Think about the logo early',
      paragraphs: [
        'Metal is the one genre where the logo matters as much as the name. Death metal logos are often sharp and spiky, black metal logos can be almost unreadable branches, and doom logos tend to be heavy blocks. Before you commit, sketch the name, or ask a friend who draws, and see if it can carry that kind of lettering.',
        'Names with a good mix of tall and short letters, and a few hard letters such as K, T, X or Z, are easier to turn into a symmetrical logo. Very long names can work, but they shrink on patches and shirts, so test them at small sizes too.',
      ],
    },
    {
      title: 'Match the name to your sub-genre',
      paragraphs: [
        'Fans can tell the sub-genres apart, so a name that fits your exact style earns trust. Death metal names tend to be gory and physical. Black metal names lean on cold, winter, forests and night. Doom names feel slow and huge, built on stone, grief and ancient time. Thrash names are often more aggressive and modern.',
        'Try to avoid jokes and pure shock words unless your band is deliberately funny. The scene tends to respect bands that take the atmosphere seriously, and a shock name can feel tired after the first album. Ask yourselves whether you would still be happy to say the name in ten years.',
      ],
    },
  ],
  faq: [
    {
      q: 'How are extreme metal names different from classic heavy metal names?',
      a: 'Extreme metal names lean on death, decay, the occult and ruins, and they sound grim and serious. Classic heavy metal names are usually more upbeat and heroic: steel, fire, dragons, thunder and battle.',
    },
    {
      q: 'How do I know if a metal name will work as a logo?',
      a: 'Sketch it. Names with balanced word lengths and a few strong, sharp letters are easier to draw as a symmetrical or spiky logo. Also check that it is still readable when printed small on a patch.',
    },
    {
      q: 'Does the generator filter out offensive or hateful words?',
      a: 'Yes. Every result is checked against a list of offensive terms, so you get dark names without slurs or hate speech. Results are also checked against a list of well-known bands.',
    },
    {
      q: 'Is a one-word or a two-word metal name better?',
      a: 'Two words, or a "Noun of Noun" phrase, are usually better. Most single dark nouns are already used by other bands, which makes them hard to search for and more likely to cause a clash.',
    },
    {
      q: 'What should a doom or sludge band look for in the results?',
      a: 'Look for slow, heavy words such as stone, monolith, grief, void and ancient. Pair one of those with a mournful adjective and you will usually get something that fits.',
    },
  ],
  siblings: [
    {
      slug: 'heavy-metal',
      title: 'Heavy Metal Band Name Generator',
      description: 'Step into classic 80s thunder, iron warriors, dragon fire, and roaring twin-guitar battle anthems.',
    },
    {
      slug: 'rock',
      title: 'Rock Band Name Generator',
      description: 'Craft gritty, blues-infused, driving overdrive monikers built for stage lights and stadium volume.',
    },
    {
      slug: 'random',
      title: 'Random Band Name Generator',
      description: 'Unleash unconstrained randomness across all genre pools to spark completely original conceptual titles.',
    },
  ],
  guides: [
    {
      path: '/guides/band-name-ideas-by-genre/',
      title: 'Band Name Ideas by Genre: The Complete Stylistic Breakdown',
      description: 'Discover the vocabulary patterns, rhythmic cadences, and aesthetic rules that define successful names across music scenes.',
    },
    {
      path: '/guides/how-to-check-if-a-band-name-is-taken/',
      title: 'How to Check If a Band Name Is Taken',
      description: 'A step-by-step verification blueprint covering streaming catalogs, underground archives, and trademark databases.',
    },
  ],
};

