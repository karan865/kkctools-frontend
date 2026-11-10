export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCalculatorLink {
  label: string;
  href: string;
  live: boolean;
  desc: string;
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

export interface PitchChartRow {
  pitch: string;
  angle: string;
  slope: string;
  slopeFactor: string;
  rafterPer12Run: string;
  category: string;
}

export interface RafterContent {
  hero: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
  };
  quickAnswer: string;
  sections: PageSection[];
  pitchChart: PitchChartRow[];
  faqs: FaqItem[];
  relatedCalculators: RelatedCalculatorLink[];
}

export const PITCH_CHART_DATA: PitchChartRow[] = [
  { pitch: '1/12', angle: '4.76°', slope: '8.3%', slopeFactor: '1.0035', rafterPer12Run: '12.04 in', category: 'Low' },
  { pitch: '2/12', angle: '9.46°', slope: '16.7%', slopeFactor: '1.0138', rafterPer12Run: '12.17 in', category: 'Low' },
  { pitch: '3/12', angle: '14.04°', slope: '25.0%', slopeFactor: '1.0308', rafterPer12Run: '12.37 in', category: 'Low' },
  { pitch: '4/12', angle: '18.43°', slope: '33.3%', slopeFactor: '1.0541', rafterPer12Run: '12.65 in', category: 'Conventional' },
  { pitch: '5/12', angle: '22.62°', slope: '41.7%', slopeFactor: '1.0833', rafterPer12Run: '13.00 in', category: 'Conventional' },
  { pitch: '6/12', angle: '26.57°', slope: '50.0%', slopeFactor: '1.1180', rafterPer12Run: '13.42 in', category: 'Conventional' },
  { pitch: '7/12', angle: '30.26°', slope: '58.3%', slopeFactor: '1.1577', rafterPer12Run: '13.89 in', category: 'Conventional' },
  { pitch: '8/12', angle: '33.69°', slope: '66.7%', slopeFactor: '1.2019', rafterPer12Run: '14.42 in', category: 'Conventional' },
  { pitch: '9/12', angle: '36.87°', slope: '75.0%', slopeFactor: '1.2500', rafterPer12Run: '15.00 in', category: 'Conventional' },
  { pitch: '10/12', angle: '39.81°', slope: '83.3%', slopeFactor: '1.3017', rafterPer12Run: '15.62 in', category: 'Steep' },
  { pitch: '11/12', angle: '42.51°', slope: '91.7%', slopeFactor: '1.3566', rafterPer12Run: '16.28 in', category: 'Steep' },
  { pitch: '12/12', angle: '45.00°', slope: '100.0%', slopeFactor: '1.4142', rafterPer12Run: '16.97 in', category: 'Steep' },
  { pitch: '14/12', angle: '49.40°', slope: '116.7%', slopeFactor: '1.5366', rafterPer12Run: '18.44 in', category: 'Steep' },
  { pitch: '16/12', angle: '53.13°', slope: '133.3%', slopeFactor: '1.6667', rafterPer12Run: '20.00 in', category: 'Steep' },
  { pitch: '18/12', angle: '56.31°', slope: '150.0%', slopeFactor: '1.8028', rafterPer12Run: '21.63 in', category: 'Steep' },
];

export const rafterPageContent: RafterContent = {
  hero: {
    badge: 'Roofing & Framing Estimator',
    title: 'Rafter Calculator – Find Rafter Length, Pitch & Cut Angles',
    p1: 'Use this free rafter calculator to find the length of a common rafter from your building span, roof pitch and overhang. You also get the plumb and seat cut angles, birdsmouth depth, ridge height and how many rafters to order — in feet and inches or metric.',
    p2: 'Whether you are framing a gable roof, a shed roof or a garage, this roof rafter calculator does the Pythagorean math for you and shows a live diagram so you can double-check every dimension before you cut.',
  },
  quickAnswer:
    'To find rafter length, divide the span by 2 to get the run, multiply the run by the slope factor √(1 + (pitch ÷ 12)²), then add the overhang along the slope. For a 24 ft wide building with a 6/12 pitch, a 12 in overhang and a 1½ in ridge board, each common rafter is about 14 ft 5 9/16 in long — so buy 16 ft boards.',
  sections: [
    {
      heading: 'How to Use the Rafter Calculator',
      paragraphs: [
        '1. Choose your roof type. Pick gable roof (two slopes meeting at a ridge) or shed roof (one slope).',
        '2. Enter the building span. Measure from the outside of one wall to the outside of the opposite wall. For a shed roof, enter the horizontal distance the rafter covers.',
        '3. Set the roof slope. Enter the pitch (inches of rise per 12 inches of run), the angle in degrees, or the total rise.',
        '4. Add the overhang. Enter how far the roof extends past the wall, measured horizontally. Gable roofs also need the ridge board thickness (1½ in is typical for a 2x board).',
        '5. Optional: open More options. Add the rafter size, wall thickness, rafter spacing and building length to check the birdsmouth depth and count your rafters.',
        '6. Read your results. Copy them or print the cut list and take it to the lumberyard or the job site.',
      ],
    },
    {
      heading: 'Understanding Your Results',
      paragraphs: [
        '• Rafter length (along top edge): The length of a common rafter measured along its top edge, from the plumb cut at the ridge to the plumb cut at the tail, including the overhang.',
        '• Board length to buy: The next standard lumber length (even feet, up to 20 ft) that fits the rafter\'s longest point.',
        '• Run: The horizontal distance a rafter covers. For a gable roof it is half the span.',
        '• Total rise: The vertical height from the top of the wall plate to the ridge line.',
        '• Slope factor: The number you multiply the run by to get the length along the slope. A 6/12 roof has a slope factor of 1.118.',
        '• Plumb cut angle: The angle of the vertical cut at the ridge and tail, measured from a square (90°) cut.',
        '• Level (seat) cut angle: The angle of the horizontal cut that rests on the wall plate, measured from a square cut.',
        '• Heel cut depth: How deep the vertical side of the birdsmouth notch is. Keep it small so the rafter stays strong.',
      ],
    },
    {
      heading: 'Rafter Length Calculator: Formula and Worked Example',
      paragraphs: [
        'A common rafter is the sloped board that runs from the top of the wall up to the ridge. Because the rafter, the run and the rise form a right triangle, you can find its length with the Pythagorean theorem. This rafter length calculator uses exactly that formula.',
      ],
      subsections: [
        {
          heading: 'Rafter length formula',
          paragraphs: [
            'Run = Span ÷ 2 (for a gable roof)',
            'Rise = Run × (Pitch ÷ 12)',
            'Slope factor = √(1 + (Pitch ÷ 12)²)',
            'Rafter length = Run × Slope factor',
            'Total length = Rafter length + (Overhang × Slope factor)',
            'Subtract half the ridge board thickness from the run first. A 1½ in ridge board means taking ¾ in off the run, so the rafter butts against the ridge board instead of reaching the centerline. For a shed roof, the run equals the full span and there is no ridge deduction.',
          ],
        },
        {
          heading: 'Worked example: 24 ft span, 6/12 pitch',
          paragraphs: [
            'Building span 24 ft (288 in), pitch 6/12, overhang 12 in, ridge board 1½ in.',
            '1. Run = 288 ÷ 2 = 144 in',
            '2. Adjusted run = 144 − 0.75 = 143.25 in',
            '3. Slope factor = √(1 + 0.5²) = 1.118',
            '4. Rafter length to the wall line = 143.25 × 1.118 = 160.16 in',
            '5. Overhang along the slope = 12 × 1.118 = 13.42 in',
            '6. Total rafter length = 160.16 + 13.42 = 173.57 in = 14 ft 5 9/16 in',
            '7. Total rise = 144 × 6 ÷ 12 = 72 in (6 ft)',
            'Rafter length is measured along the top edge. At a plumb-cut tail the bottom corner sticks out slightly farther, so the calculator checks the board\'s longest point (about 14 ft 9¼ in here) before it suggests a stock length. Result: buy 16 ft boards.',
          ],
        },
      ],
    },
    {
      heading: 'Roof Pitch Chart – Slope, Angle & Rafter Length per Foot of Run',
      paragraphs: [
        'Roof pitch is written as rise over run. A 6/12 pitch means the roof rises 6 inches for every 12 inches it runs horizontally. This roof slope chart converts common pitches into degrees, slope percent and rafter length per foot of run.',
        'Note: Categories are general guidelines: low slope is under 4/12, conventional is 4/12 to 9/12 and steep is over 9/12. Roofing materials have their own minimum pitch requirements, so check the manufacturer\'s instructions and local code.',
      ],
      subsections: [
        {
          heading: '4/12 Roof Pitch',
          paragraphs: [
            'A 4/12 roof pitch rises 4 inches for every 12 inches of run. That is an angle of 18.43° (a 33.3% slope), so 4/12 pitch in degrees is about 18.4°. Rafters on a 4/12 roof are 12.65 in long for every 12 in of run (slope factor 1.054). It is generally where the "conventional" pitch range begins.',
          ],
        },
        {
          heading: '6/12 Roof Slope',
          paragraphs: [
            'A 6/12 roof slope rises 6 inches per 12 inches of run, which is 26.57° or a 50% slope. Each foot of run adds 13.42 in of rafter length (slope factor 1.118). It is a very common pitch on US houses and the one used in the worked example above.',
          ],
        },
      ],
    },
    {
      heading: 'How to Calculate Roof Pitch',
      paragraphs: [
        'Roof pitch is the rise divided by the run, multiplied by 12: Pitch (per 12) = (Rise ÷ Run) × 12',
      ],
      subsections: [
        {
          heading: 'With a level and tape measure',
          paragraphs: [
            'Hold a 12 in level horizontally against the underside of a rafter (from the attic). At the 12 in mark, measure straight up to the bottom of the rafter. That measurement is your pitch: 6 in means a 6/12 roof.',
          ],
        },
        {
          heading: 'From an angle',
          paragraphs: [
            'Multiply the tangent of the angle by 12. For a 30° roof: 12 × tan(30°) = 6.93, so the pitch is about 7/12. To go the other way, angle = arctan(pitch ÷ 12).',
          ],
        },
        {
          heading: 'From span and ridge height',
          paragraphs: [
            'Divide the ridge height above the wall plate by half the span, then multiply by 12. A 6 ft rise over a 12 ft run gives (6 ÷ 12) × 12 = 6, or 6/12. In this calculator, choose Rise & run and enter the total rise.',
          ],
        },
      ],
    },
    {
      heading: 'Rafter Span, Size & Spacing',
      paragraphs: [
        'Looking for a rafter span calculator? First, know that the span of a rafter is the horizontal distance it covers between supports — not the length of the board. A rafter that is 13.4 ft long on a 6/12 roof spans only 12 ft horizontally.',
        'How far a rafter can safely span depends on the lumber species and grade, the board size, the spacing (commonly 12, 16 or 24 in on center), the roof load (snow, wind and dead load) and whether you use rafter ties or ceiling joists. These factors change by region, so this calculator finds rafter length and cut angles — it does not size rafters. Use the rafter span tables in your local building code (in the US, the International Residential Code), the American Wood Council\'s free span calculator, or ask a licensed engineer or your local building department.',
      ],
      subsections: [
        {
          heading: 'Rafter Dimensions (Nominal vs. Actual Size)',
          paragraphs: [
            'Lumber is sold by nominal size, but the real dimensions are smaller. Use the actual depth when you check the birdsmouth: 2x6 is 1½ × 5½ in, 2x8 is 1½ × 7¼ in, 2x10 is 1½ × 9¼ in, and 2x12 is 1½ × 11¼ in.',
          ],
        },
      ],
    },
    {
      heading: 'How to Mark and Cut a Rafter (Plumb Cut, Seat Cut & Birdsmouth)',
      paragraphs: [
        '• Plumb cut: the vertical cut at the ridge end (and at the tail if you cut it vertical).',
        '• Seat cut (level cut): the horizontal cut that rests on top of the wall plate.',
        '• Heel cut: the vertical cut that meets the seat cut and forms the birdsmouth notch.',
        '• Birdsmouth: the notch made by the seat cut and heel cut. The seat length usually equals the width of the wall plate (3½ in on a 2x4 wall). The heel depth equals the seat length × pitch ÷ 12 — for a 6/12 roof on a 3½ in plate, that is 1¾ in.',
        'Marking with a speed square: place the pivot point on the board edge and rotate the square until the board edge lines up with your pitch number on the Common scale (6 for a 6/12 roof). Scribe along the straight edge of the square to mark the plumb cut.',
        'Tip: cut one rafter first, test-fit it on the wall and ridge, then use it as a pattern for the rest. As a common rule of thumb, keep the heel cut depth to no more than about one-third of the rafter\'s depth. Some codes are stricter, so check yours. The calculator flags deep birdsmouth cuts.',
      ],
    },
    {
      heading: 'Common Rafter Mistakes to Avoid',
      paragraphs: [
        '• Using the run as the rafter length. The run is horizontal; the rafter is longer because it slopes.',
        '• Forgetting the ridge board deduction. Take half the ridge thickness off the run.',
        '• Adding overhang without the slope factor. The overhang is measured horizontally, so multiply it by the slope factor too.',
        '• Measuring to the wall centerline. Measure the span from the outside of the walls.',
        '• Rounding down. Always round up to the next stock length and cut a test rafter first.',
        '• Using this for hip or valley rafters. They have different geometry. This calculator is for common rafters.',
      ],
    },
    {
      heading: 'Related Calculators',
      paragraphs: [
        'Explore our other free construction, framing, and site calculation utilities:',
      ],
    },
  ],
  pitchChart: PITCH_CHART_DATA,
  faqs: [
    {
      q: 'How do you calculate rafter length?',
      a: 'Divide the building span by 2 to get the run, subtract half the ridge board thickness, multiply by the slope factor √(1 + (pitch ÷ 12)²), then add the overhang multiplied by the same slope factor. The result is the rafter length along its top edge.',
    },
    {
      q: 'What is the rafter length for a 6/12 pitch?',
      a: 'Every 12 in of run adds 13.42 in of rafter length on a 6/12 roof (slope factor 1.118). A 12 ft run needs about 13.42 ft of rafter before the overhang and ridge deduction.',
    },
    {
      q: 'How long are rafters for a 12-foot-wide building?',
      a: 'For a 12 ft wide gable roof at 6/12, the run is 6 ft, so each rafter is about 6 ft 8½ in before the overhang and ridge board deduction. Enter your own pitch and overhang above for an exact number.',
    },
    {
      q: 'How do you convert roof pitch to degrees?',
      a: 'Angle = arctan(rise ÷ 12). For example, 4/12 is 18.43°, 6/12 is 26.57° and 12/12 is 45°. See the roof pitch chart above for more.',
    },
    {
      q: 'How do you calculate the pitch of a roof?',
      a: 'Divide the rise by the run and multiply by 12. With a level, measure the vertical rise at the 12 in mark; that number is the pitch (for example, 6 in means 6/12).',
    },
    {
      q: 'Do I subtract the ridge board when calculating rafters?',
      a: 'Yes, for a gable roof. Subtract half the ridge board thickness from the run so the rafter ends at the face of the ridge board. A 1½ in ridge means subtracting ¾ in from the run.',
    },
    {
      q: 'How many rafters do I need?',
      a: 'Rafters per side = (building length ÷ spacing, rounded down) + 1. Double it for a gable roof. A 30 ft long building with rafters 16 in on center needs 23 per side, or 46 in total. Add extras for doubled rafters at gable ends and openings.',
    },
    {
      q: 'How far can a 2x8 rafter span?',
      a: 'There is no single answer. It depends on species, grade, spacing, roof load and local code. Check the rafter span tables in your building code or the American Wood Council\'s span calculator, or ask a licensed professional.',
    },
  ],
  relatedCalculators: [
    { label: 'Linear Foot Calculator', href: '/linear-foot-calculator/', live: true, desc: 'Total up board lengths and lumber needs.' },
    { label: 'Construction Estimate Template', href: '/construction-estimate-template/', live: true, desc: 'Build contractor invoices and material estimates.' },
    { label: 'Cubic Yard Calculator', href: '/cubic-yard-calculator/', live: true, desc: 'Volume for concrete footings, slabs, and site fill.' },
    { label: 'Asphalt Calculator', href: '/asphalt-calculator/', live: true, desc: 'Tonnage estimator for driveways and paving.' },
  ],
};

