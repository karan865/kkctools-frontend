export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCalculatorLink {
  label: string;
  href: string;
  live: boolean;
}

export interface SectionSubsection {
  heading: string;
  paragraphs: string[];
}

export interface PageSection {
  heading: string;
  paragraphs: string[];
  subsections?: SectionSubsection[];
}

export interface SandCalculatorContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  sections: PageSection[];
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const sandCalculatorPageContent: SandCalculatorContent = {
  hero: {
    badge: 'Masonry & Landscaping Estimator',
    title: 'Sand Calculator',
    description:
      'Use this free sand calculator to find out how much sand you need in cubic yards, cubic feet, tons or bags. Enter your area and depth, pick the type of sand, add a little extra for waste, and the sand estimator does the math for you. It works for patio and paver bases, sandboxes, leveling and general fill jobs, in US units or metric.',
  },
  sections: [
    {
      heading: 'How to Use the Sand Calculator',
      paragraphs: [
        '1. Pick a mode: Sand Volume for general jobs and sandboxes, Paver Sand for the bedding layer under pavers, or Polymeric Sand for paver joints.',
        '2. Enter the length and width of the area (or the diameter for a round area). Use Add area if the space has more than one section.',
        '3. Enter the depth in inches, feet, centimeters or meters.',
        '4. Choose the sand condition (dry, damp or wet) or type your own density, and keep or change the waste allowance. The default is 10%.',
        '5. Read your result in cubic yards, cubic feet, tons and bags. Click Show math to see each step.',
      ],
    },
    {
      heading: 'Sand Calculator Formula',
      paragraphs: [
        'The calculator uses simple volume math. For a rectangular area:',
        '• Volume (cubic feet) = Length (ft) × Width (ft) × Depth (in) ÷ 12',
        '• Cubic yards = Cubic feet ÷ 27',
        '• Tons = Cubic yards × Sand density (lb per cubic yard) ÷ 2,000',
        '• Bags = Total weight ÷ Bag weight, rounded up',
        'For a round area, use π × radius² instead of length × width. The final amount is multiplied by (1 + waste %) to cover spillage, settling and uneven ground.',
      ],
      subsections: [
        {
          heading: 'Worked Example: Sand for a 10 ft × 10 ft Area',
          paragraphs: [
            'For a 10 ft × 10 ft area filled 2 inches deep: 10 × 10 × 2 ÷ 12 = 16.67 ft³, and 16.67 ÷ 27 = 0.62 yd³. Add 10% for waste and you need about 0.68 yd³. At 2,600 lb per cubic yard (dry sand), that is about 0.88 tons, or 36 bags of 50 lb.',
          ],
        },
      ],
    },
    {
      heading: 'Sand Estimator: Cubic Yards, Tons or Bags?',
      paragraphs: [
        '• Cubic yards: how bulk suppliers usually measure a delivery. Best for medium and large jobs.',
        '• Tons: many yards sell sand by weight. The estimator converts volume to tons using the density you choose.',
        '• Bags: handy for small jobs and sandboxes. A cubic yard of dry sand is roughly 52 bags of 50 lb.',
        'Ask your supplier whether they sell by the ton or by the yard, then order using the matching result.',
      ],
    },
    {
      heading: 'Paver Sand Calculator',
      paragraphs: [
        'Paver projects use sand in two places: a bedding layer under the pavers and joint sand between them. The Paver Sand and Polymeric Sand tabs handle each one.',
      ],
      subsections: [
        {
          heading: 'How to Calculate Paver Sand (Bedding Layer)',
          paragraphs: [
            'Bedding sand is a thin, level layer spread over the compacted base. Measure the paved area and multiply by the bedding depth. About 1 inch is typical, but follow your paver manufacturer’s guide. Example: 200 sq ft × 1 in ÷ 12 = 16.67 ft³, or 0.62 yd³ before waste.',
            'Bedding sand and base gravel are different materials. For the gravel base under the sand, look into dedicated crushed stone calculations.',
          ],
        },
        {
          heading: 'Polymeric Sand Calculator (Joint Sand)',
          paragraphs: [
            'Polymeric sand fills the joints between pavers, so the amount depends on paver size, joint width and joint depth, not just area. Enter your paver length and width, joint width and joint depth, and the calculator estimates the joint volume and the bags you need.',
            'Example: a 200 sq ft patio with 6 × 9 in pavers, ¼ in joints and 2 in joint depth needs about 2.2 ft³ of joint sand before waste, which is around 5 bags of 50 lb with 10% extra. Most brands list coverage per bag, so you can also enter your product’s coverage to cross-check.',
          ],
        },
      ],
    },
    {
      heading: 'How Much Does a Yard of Sand Weigh?',
      paragraphs: [
        'A cubic yard of dry sand weighs about 2,600 pounds (1.3 tons). Damp and wet sand are heavier because water adds weight.',
        'These are typical values. Actual weight changes with sand type, grain size, moisture and compaction, so confirm with your supplier.',
      ],
    },
    {
      heading: 'Sandbox Sand Calculator',
      paragraphs: [
        'For a sandbox, open the Sand Volume tab and choose the Sandbox preset. A depth of about 6 inches is a common starting point. Example: a 4 ft × 4 ft sandbox filled 6 inches deep needs 8 ft³ (0.30 yd³), or about 0.33 yd³ with 10% extra. That is roughly 17 bags of 50 lb. For children’s sandboxes, buy sand labeled as play sand.',
      ],
    },
    {
      heading: 'Which Type of Sand Should I Buy?',
      paragraphs: [
        '• Play sand: washed, fine sand sold for sandboxes and play areas.',
        '• Concrete sand (coarse sand): commonly used for paver bedding and concrete mixes.',
        '• Masonry sand: finer sand commonly used for mortar and brickwork.',
        '• Polymeric sand: fine sand blended with a binder that hardens when wet, used for paver joints.',
        'Names and grades vary by region, so ask your local supplier which product suits your project.',
      ],
    },
    {
      heading: 'Tips to Avoid Ordering Too Much or Too Little Sand',
      paragraphs: [
        '• Measure the area twice, and use Add area for odd shapes.',
        '• Keep a 5–10% waste allowance, and use more on uneven ground.',
        '• Sand compacts and settles, so a small extra amount helps.',
        '• Wet sand weighs more than dry sand, so your tons will go up if the pile is damp.',
        '• Compare bag and bulk prices. Bulk delivery is often cheaper per yard on larger jobs, so ask about delivery minimums.',
      ],
    },
    {
      heading: 'Related Calculators',
      paragraphs: [
        'Need more site work or material estimators? Explore our other free construction utilities:',
      ],
    },
  ],
  faqs: [
    {
      q: 'How do I calculate how much sand I need?',
      a: 'Multiply length × width × depth to get volume, convert it to cubic yards by dividing cubic feet by 27, then add 5–10% for waste. To order by weight, multiply cubic yards by the sand’s density (about 2,600 lb per cubic yard for dry sand) and divide by 2,000 to get tons.',
    },
    {
      q: 'How many bags of sand are in a cubic yard?',
      a: 'About 52 bags of 50 lb dry sand, or 54 bags if each bag holds 0.5 cubic feet (27 ÷ 0.5). Bag sizes vary, so check the label.',
    },
    {
      q: 'How much sand do I need for pavers?',
      a: 'For bedding, multiply the paved area by about 1 inch of depth. Joint sand depends on paver size, joint width and joint depth. Use the Paver Sand and Polymeric Sand tabs above.',
    },
    {
      q: 'How much does a cubic yard of sand weigh?',
      a: 'About 2,600 lb (1.3 tons) when dry and up to about 3,200 lb (1.6 tons) when wet.',
    },
    {
      q: 'Should I add extra sand for waste?',
      a: 'Yes. A 5–10% allowance covers spillage, settling and uneven ground. The calculator uses 10% by default, and you can change it.',
    },
    {
      q: 'Can I use this sand calculator for gravel or crushed stone?',
      a: 'Not accurately. Gravel and stone have different densities. Use our upcoming Stone Calculator for those materials.',
    },
  ],
  relatedCalculators: [
    { label: 'Cubic Yard Calculator', href: '/cubic-yard-calculator/', live: true },
    { label: 'Asphalt Calculator', href: '/asphalt-calculator/', live: true },
    { label: 'Construction Estimate Template', href: '/construction-estimate-template/', live: true },
    { label: 'Fill Dirt Calculator', href: '/fill-dirt-calculator/', live: true },
    { label: 'Stone Calculator', href: '/stone-calculator/', live: false },
  ],
};
