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

export interface LinearFootContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  sections: PageSection[];
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const linearFootPageContent: LinearFootContent = {
  hero: {
    badge: 'Lumber & Material Estimator',
    title: 'Linear Foot Calculator',
    description:
      'Use this free linear foot calculator to add up lengths and get a total in linear feet. Enter each piece with its length and quantity, add a waste allowance if you need one, and this linear feet calculator returns the total in feet, inches, yards and meters. Need to convert area to length? Switch to the Sq Ft ↔ Linear Ft tab, enter the width, and convert square feet to linear feet or the other way around.',
  },
  sections: [
    {
      heading: 'How to Use the Linear Foot Calculator',
      paragraphs: [
        'Linear Feet tab:',
        '1. Enter the length of your first piece and choose its unit: feet, inches, feet and inches, yards, meters or centimeters.',
        '2. Enter the quantity of pieces that share that length.',
        '3. Click Add row for each different length. You can mix units in the same list.',
        '4. Optional: add a waste percentage, and a price per linear foot to see an estimated cost.',
        '5. Read the total in linear feet, with inches, yards and meters shown below it.',
        'Sq Ft ↔ Linear Ft tab:',
        '1. Choose the direction: square feet to linear feet, or linear feet to square feet.',
        '2. Enter the area or the length, then enter the width of the material.',
        '3. Read the converted result. Add a waste percentage if you plan to order extra.',
      ],
    },
    {
      heading: 'What Is a Linear Foot?',
      paragraphs: [
        'A linear foot is a measure of length equal to 12 inches, taken in a straight line. It does not include width or thickness, so a board that is 1 inch wide and a board that is 10 inches wide are both one linear foot if each is 12 inches long. Linear feet are used for items sold or priced by length, such as lumber and trim, fencing, gutters and pipe.',
        'You may also see the term lineal feet. Lineal feet and linear feet mean the same thing, and this calculator works for both.',
      ],
    },
    {
      heading: 'How to Calculate Linear Feet',
      paragraphs: [
        'If you need to figure out linear feet for a fence, a run of trim or a pile of boards, the method is the same: convert each length to feet, multiply by the quantity, and add everything up.',
        '• Linear feet = Sum of (length in feet × quantity)',
        '• Total with waste = Linear feet × (1 + waste %)',
        '• Estimated cost = Total with waste × Price per linear foot',
      ],
      subsections: [
        {
          heading: 'How to Measure Linear Feet',
          paragraphs: [
            '1. Use a tape measure and measure along the straight length of each piece or run.',
            '2. For a run with corners, measure each straight section separately.',
            '3. Write down each length and how many pieces share it.',
            '4. Add the lengths, or enter them in the calculator and let it add them for you.',
          ],
        },
        {
          heading: 'How to Get Linear Feet from Inches, Yards and Meters',
          paragraphs: [
            'To get linear feet from another unit, convert the length to feet first:',
            '• Inches: Divide by 12 (e.g. 30 in ÷ 12 = 2.5 ft)',
            '• Yards: Multiply by 3 (e.g. 4 yd × 3 = 12 ft)',
            '• Meters: Multiply by 3.281 (e.g. 2 m × 3.281 = 6.56 ft)',
            '• Centimeters: Divide by 30.48 (e.g. 90 cm ÷ 30.48 = 2.95 ft)',
          ],
        },
        {
          heading: 'Worked Example: Add Up Boards of Different Lengths',
          paragraphs: [
            'Say you have four boards that are 12 ft long and two boards that are 8 ft 6 in long. Four 12 ft boards make 4 × 12 = 48 ft. 8 ft 6 in is 8.5 ft, so two of them make 2 × 8.5 = 17 ft. The total is 65 linear feet. With a 10% waste allowance, you would plan for about 71.5 linear feet.',
          ],
        },
      ],
    },
    {
      heading: 'Square Feet to Linear Feet Calculator',
      paragraphs: [
        'A linear foot calculator cannot convert square feet to linear feet on its own, because area is length times width. You also need the width of the material. Once you have it, the conversion is simple. The Sq Ft ↔ Linear Ft tab does it in one step. It works as a square foot to linear foot calculator, or a sqft to linear foot calculator, for boards, planks, trim, rolls and similar material.',
      ],
      subsections: [
        {
          heading: 'How to Convert Square Feet to Linear Feet',
          paragraphs: [
            'Linear feet = Square feet ÷ Width (in feet). If the width is in inches, use Linear feet = Square feet × 12 ÷ Width (in). Example: 200 sq ft of material that is 5 inches wide needs 200 × 12 ÷ 5 = 480 linear feet.',
          ],
        },
        {
          heading: 'How to Convert Linear Feet to Square Feet',
          paragraphs: [
            'Square feet = Linear feet × Width (in feet), or Linear feet × Width (in) ÷ 12. Example: 100 linear feet of material that is 6 inches wide covers 100 × 6 ÷ 12 = 50 square feet. Use this linear feet to square feet calculator when you know the length you have and want the area it covers.',
          ],
        },
        {
          heading: 'Quick Conversion Table',
          paragraphs: [
            'Refer to the reference table below for common board widths, square feet per linear foot, and linear feet required per square foot.',
          ],
        },
      ],
    },
    {
      heading: 'Linear Foot vs. Square Foot vs. Board Foot',
      paragraphs: [
        '• Linear foot: a length of 12 inches, regardless of width or thickness.',
        '• Square foot: an area of 1 ft × 1 ft.',
        '• Board foot: a unit of lumber volume equal to 1 ft × 1 ft × 1 in (144 cubic inches).',
        'This calculator handles linear feet and the conversion between linear feet and square feet. It does not calculate board feet.',
      ],
    },
    {
      heading: 'Tips for Measuring and Ordering by the Linear Foot',
      paragraphs: [
        '• Measure each piece or section twice, and write down the quantities.',
        '• A waste allowance of 5–10% is common when material is cut to length, and more for angled or patterned cuts.',
        '• Total linear feet does not tell you how many boards to buy. Boards come in fixed lengths and cuts leave offcuts, so check your cut list against the lengths your supplier sells.',
        '• Use the actual width of the material, not the nominal size. A 1×6 board, for example, is narrower than 6 inches.',
        '• Confirm whether your supplier prices by the linear foot or by the piece.',
      ],
    },
    {
      heading: 'Related Calculators',
      paragraphs: [
        'Explore our other free construction and site calculation utilities:',
      ],
    },
  ],
  faqs: [
    {
      q: 'How do you calculate linear feet?',
      a: 'Convert each length to feet, multiply by the number of pieces, and add the results. For example, four 12 ft boards plus two 8.5 ft boards is 4 × 12 + 2 × 8.5 = 65 linear feet.',
    },
    {
      q: 'How do I convert square feet to linear feet?',
      a: 'Divide the square feet by the width of the material in feet. You must know the width, because the same area needs more linear feet of narrow material than wide material. For example, 200 sq ft at 5 inches wide is 480 linear feet.',
    },
    {
      q: 'How many linear feet are in a square foot?',
      a: 'It depends on the width. At 12 inches wide, one square foot is 1 linear foot. At 6 inches wide it is 2 linear feet, and at 3 inches wide it is 4 linear feet.',
    },
    {
      q: 'What is the difference between linear feet and lineal feet?',
      a: 'There is no difference. Both terms mean a length measured in feet.',
    },
    {
      q: 'Is a linear foot the same as a board foot?',
      a: 'No. A linear foot measures length only. A board foot is a unit of lumber volume equal to 1 ft × 1 ft × 1 in.',
    },
    {
      q: 'How do I convert meters to linear feet?',
      a: 'Multiply the meters by 3.281. For example, 2 meters is about 6.56 linear feet.',
    },
  ],
  relatedCalculators: [
    { label: 'Cubic Yard Calculator', href: '/cubic-yard-calculator/', live: true },
    { label: 'Sand Calculator', href: '/sand-calculator/', live: true },
    { label: 'Fill Dirt Calculator', href: '/fill-dirt-calculator/', live: true },
    { label: 'Asphalt Calculator', href: '/asphalt-calculator/', live: true },
    { label: 'Construction Estimate Template', href: '/construction-estimate-template/', live: true },
  ],
};

