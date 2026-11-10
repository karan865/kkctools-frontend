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

export interface FillDirtContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  sections: PageSection[];
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const fillDirtPageContent: FillDirtContent = {
  hero: {
    badge: 'Grading & Excavation Estimator',
    title: 'Fill Dirt Calculator',
    description:
      'Use this free fill dirt calculator to find out how many cubic yards of dirt you need to fill a hole, level a yard or raise the grade. Enter the size and depth of each area, add a little extra for settling, and this dirt calculator returns cubic yards, cubic feet and, if you want them, tons and truckloads. It also works as a soil yard calculator for garden beds, and it handles rectangles, circles, triangles and irregular areas in US units or metric.',
  },
  sections: [
    {
      heading: 'How to Use the Fill Dirt Calculator',
      paragraphs: [
        '1. Pick a shape for your first area: rectangle, circle, triangle, or enter a known area in square feet.',
        '2. Enter the dimensions of that area.',
        '3. Enter the depth. If the fill slopes, switch to Sloped and enter the shallow and deep ends. The calculator averages them.',
        '4. Use Add area for L-shaped or irregular spaces. It works as a calculator for dirt fill with up to 10 areas, and each area can have its own shape and depth.',
        '5. Set the extra for settling (the default is 10%). Optionally pick a material to see the weight in tons, and enter your supplier’s truck capacity to see the number of loads.',
        '6. Read your result in cubic yards and cubic feet. Click Show math to see each step.',
      ],
    },
    {
      heading: 'Fill Dirt Calculator Formula',
      paragraphs: [
        'Fill dirt volume is area times depth:',
        '• Area: rectangle = length × width; circle = π × radius²; triangle = ½ × base × height',
        '• Volume (cubic feet) = Area (sq ft) × Depth (in) ÷ 12',
        '• Cubic yards = Cubic feet ÷ 27',
        '• Dirt to order = Cubic yards × (1 + extra %)',
        '• Tons (optional) = Cubic yards × Density (lb per cubic yard) ÷ 2,000',
        '• Truckloads (optional) = Cubic yards ÷ Truck capacity, rounded up',
      ],
      subsections: [
        {
          heading: 'Worked Example: Fill Dirt for a 20 ft × 15 ft Area',
          paragraphs: [
            'To raise a 20 ft × 15 ft area by 6 inches: 20 × 15 = 300 sq ft, and 300 × 6 ÷ 12 = 150 ft³. Divide by 27 and you get 5.56 yd³. Add 10% for settling and you need about 6.1 cubic yards. At roughly 2,700 lb per cubic yard, that is about 8.25 tons.',
          ],
        },
      ],
    },
    {
      heading: 'How to Estimate Dirt Yardage (Step by Step)',
      paragraphs: [
        'Estimating dirt yardage takes five steps:',
        '1. Measure the length and width of the area in feet, or the diameter if it is round.',
        '2. Measure the depth you want to fill, in inches. For a slope, measure the shallow and deep ends and average them: (shallow + deep) ÷ 2. This works when the slope is even.',
        '3. Multiply the area by the depth ÷ 12 to get cubic feet.',
        '4. Divide by 27 to convert to cubic yards.',
        '5. Add extra for settling before you order.',
      ],
      subsections: [
        {
          heading: 'Calculating Fill Dirt for an Irregular Area',
          paragraphs: [
            'Calculating fill dirt for a space that is not a simple rectangle is easy if you split it into shapes. An L-shaped yard is two rectangles, a round flower bed is a circle, and a corner can be a triangle. Calculate dirt fill for each section, then add the volumes together. The Add area button does this for you.',
          ],
        },
      ],
    },
    {
      heading: 'Dirt Calculator: How Much Dirt Do I Need for Common Projects?',
      paragraphs: [
        'Here is what the dirt calculator gives for some common jobs, with 10% extra for settling:',
        'Raised beds are usually filled with topsoil or garden mix rather than fill dirt, so pick the material that matches your project.',
      ],
    },
    {
      heading: 'Fill Dirt vs. Topsoil: Which Do I Need?',
      paragraphs: [
        'Fill dirt is typically subsoil with little organic matter. It is used to fill holes, raise the grade and level ground, and it is not meant for growing plants. Topsoil is darker and richer in organic matter, and it is used for lawns, gardens and planting beds. Either way, you can use this soil yard calculator the same way: enter the area and depth, and choose the matching material if you want the weight. Material names vary by region, so ask your supplier what they sell as fill dirt.',
        'If the fill will sit under a slab, driveway or foundation, follow the compaction requirements from your engineer or local code. This calculator estimates volume only.',
      ],
    },
    {
      heading: 'How Much Does a Cubic Yard of Fill Dirt Weigh?',
      paragraphs: [
        'A cubic yard of dirt typically weighs somewhere between 2,000 and 3,000 pounds (about 1 to 1.5 tons), depending on the type of soil, how wet it is and how tightly it is compacted. The calculator offers starter densities for fill dirt and topsoil, and you can type your own.',
      ],
    },
    {
      heading: 'How Much Extra Dirt Should I Order for Settling?',
      paragraphs: [
        'Loose dirt settles and compacts once it is spread, watered and tamped or rolled. A common allowance is 10–20% extra, and deeper fills that are compacted in layers can need more. The default here is 10%. Change it to match your project and your supplier’s advice.',
      ],
    },
    {
      heading: 'How Many Truckloads of Dirt Do I Need?',
      paragraphs: [
        'Truck and trailer sizes vary, so this calculator does not assume a standard load. Enter your supplier’s truck capacity in cubic yards and it rounds up the number of loads. Ask the supplier what capacity they will actually deliver.',
      ],
    },
    {
      heading: 'Related Calculators',
      paragraphs: [
        'Need more excavation, paving or materials estimators? Explore our other free construction tools:',
      ],
    },
  ],
  faqs: [
    {
      q: 'How do I calculate how much fill dirt I need?',
      a: 'Multiply the area in square feet by the depth in inches divided by 12 to get cubic feet, then divide by 27 to get cubic yards. Add 10–20% for settling.',
    },
    {
      q: 'How many cubic yards of dirt do I need to cover 1,000 square feet with 1 inch?',
      a: 'About 3.1 cubic yards before extra: 1,000 × 1 ÷ 12 = 83.3 ft³, and 83.3 ÷ 27 = 3.09 yd³.',
    },
    {
      q: 'How much extra fill dirt should I order?',
      a: 'A common allowance is 10–20% extra to cover settling and compaction. The calculator uses 10% by default, and you can change it.',
    },
    {
      q: 'How much does a cubic yard of fill dirt weigh?',
      a: 'Roughly 2,000 to 3,000 lb (1 to 1.5 tons), depending on soil type, moisture and compaction. Confirm with your supplier.',
    },
    {
      q: 'Is fill dirt the same as topsoil?',
      a: 'No. Fill dirt is used to fill and level, while topsoil is richer in organic matter and is used for planting. See the section above for the difference.',
    },
    {
      q: 'Can I use this dirt fill calculator for a sloped area?',
      a: 'Yes. Choose Sloped for that area, enter the shallow and deep depths, and the calculator uses the average depth. This assumes an even slope.',
    },
  ],
  relatedCalculators: [
    { label: 'Cubic Yard Calculator', href: '/cubic-yard-calculator/', live: true },
    { label: 'Sand Calculator', href: '/sand-calculator/', live: true },
    { label: 'Asphalt Calculator', href: '/asphalt-calculator/', live: true },
    { label: 'Construction Estimate Template', href: '/construction-estimate-template/', live: true },
    { label: 'Stone Calculator', href: '/stone-calculator/', live: false },
  ],
};

