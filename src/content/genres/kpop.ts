import type { GenreConfig } from './types';

export const kpopConfig: GenreConfig = {
  slug: 'kpop',
  routeKey: 'kpop',
  generatorGenre: 'kpop',
  h1: 'K-pop Band Name Generator',
  intro:
    'Create K-pop style group names: short, stylised words, cosmic and futuristic concepts, and clean all-caps branding. The generator mixes English concept words with letters, numbers and symbols the way many idol groups do, and works for boy groups, girl groups and co-ed or virtual groups.',
  curatedExamples: [
    'NOVA-X',
    'ZENITH NINE',
    'LUMEN7',
    'AURA ECLIPSE',
    'STELLA ONE',
    'PRISM ORBIT',
    'VELA ZERO',
    'SOLIS AXIS',
    'MIRA DUAL',
    'HALO VERTEX',
    'CYPHER-IZ',
    'CHROMA WAVE',
  ],
  sections: [
    {
      title: 'How K-pop group names are built',
      paragraphs: [
        'K-pop names are usually short, bold and easy to say in many languages. Many groups use one or two English words, an acronym, or a made-up word that sounds futuristic. The name is part of a wider concept that also covers the logo, colours, outfits and the story behind the group.',
        'Cosmic and light-related words are especially common, such as nova, orbit, aura or eclipse, because they suggest something bright and rising. The generator\'s K-pop word list leans on these concept words, and it can add letters or numbers to make the result look like a real group brand.',
      ],
    },
    {
      title: 'Capital letters, letters and symbols',
      paragraphs: [
        'Many K-pop names are written in all capitals, sometimes with dots, numbers or a stylised letter. Capitals make a short name look strong in a logo and on album covers. Numbers can point to the number of members or to a concept, and symbols can make a name feel more designed.',
        'Be careful not to overdo it. A name full of symbols is hard to type, hard to search and easy to misspell. A good test is whether fans could type the name on a phone in two seconds. If not, keep the decoration for the logo and keep the searchable name simple.',
      ],
    },
    {
      title: 'Units, sub-units and changing concepts',
      paragraphs: [
        'K-pop groups often release music as smaller sub-units or switch concept between albums. A flexible name makes that easier. Short concept words like "PRISM" or "ORBIT" can take a suffix for a sub-unit or a new era without losing the main brand.',
        'When you pick a name, think about how it will look with a unit name next to it, and whether it still fits if the group\'s style changes from bright to dark. Names that are too tied to one season or one trend can be hard to grow with.',
      ],
    },
    {
      title: 'Check the name before you use it',
      paragraphs: [
        'Short English words are popular, which means many are already used by other groups, brands or apps. Search the exact name with the words K-pop and group, check streaming services and social handles, and check trademark registers before you announce anything.',
        'If the exact word is taken, try a small change that still sounds natural, such as adding a letter or combining two concept words. Our guide on checking whether a band name is taken shows how to search streaming services and trademark registers step by step.',
      ],
    },
  ],
  faq: [
    {
      q: 'Why are K-pop group names often written in capital letters?',
      a: 'Capitals make short names look bold and balanced in logos, on screens and on album covers. They also help a short word stand out as a brand rather than an ordinary word.',
    },
    {
      q: 'What do numbers and extra letters add to a group name?',
      a: 'They can hint at the number of members, a concept or a debut year, and they make a short name more distinctive and easier to protect. Keep them simple enough for fans to type.',
    },
    {
      q: 'Can the generator make names for both boy groups and girl groups?',
      a: 'Yes. The K-pop word list is concept based rather than gendered, so the same results can suit boy groups, girl groups, co-ed groups or virtual idols.',
    },
    {
      q: 'Are the generated K-pop names real Korean words?',
      a: 'No. The generator uses English concept words, letters and numbers, which is how many K-pop groups brand themselves internationally. If you want a Korean word, check the meaning and spelling with a native speaker.',
    },
    {
      q: 'How do we come up with a fandom name from our group name?',
      a: 'Start from the group\'s concept word and look for a related idea, such as a star for a space concept. Keep it short, positive and easy to chant, and check it is not already used by another fandom.',
    },
  ],
  siblings: [
    {
      slug: 'boy-band',
      title: 'Boy Band Name Generator',
      description: 'Explore charismatic, vocal-harmony group names with romantic urban aesthetics and chart-topping swagger.',
    },
    {
      slug: 'rock',
      title: 'Rock Band Name Generator',
      description: 'Discover gritty, overdrive-fueled rock and roll names for alternative, garage, and indie rock collectives.',
    },
    {
      slug: 'random',
      title: 'Random Band Name Generator',
      description: 'Need eclectic musical inspiration? Generate surprise combinations across all sonic styles and naming formulas.',
    },
  ],
  guides: [
    {
      path: '/guides/how-to-choose-a-band-name/',
      title: 'How to Choose a Band Name: The Complete Practical Guide',
      description: 'Learn the exact step-by-step framework for selecting a memorable moniker, testing stage presence, and verifying legal clearance.',
    },
    {
      path: '/guides/how-to-check-if-a-band-name-is-taken/',
      title: 'How to Check If a Band Name Is Taken',
      description: 'A practical checklist for checking streaming services, social media handles, and trademark databases.',
    },
  ],
};

