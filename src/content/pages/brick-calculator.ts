export interface BrickFaqItem {
  q: string;
  a: string;
}

export const BRICK_FAQS: BrickFaqItem[] = [
  {
    q: 'How many bricks do I need per square foot?',
    a: 'For standard Modular bricks (7-5/8" × 2-1/4" × 3-5/8") with a 3/8" mortar joint, you need 6.857 (about 7) bricks per square foot of wall area. For Standard bricks (8" × 2-1/4" × 3-5/8"), you need about 6.55 bricks per square foot. Larger Utility bricks need only 3.0 bricks per square foot, while Queen bricks require about 5.76 bricks per square foot. Always add a 5% to 10% waste factor for cutting and breakage.',
  },
  {
    q: 'What is the size of a modular brick?',
    a: 'A modular brick size has actual manufactured dimensions of 7-5/8" long by 2-1/4" high by 3-5/8" deep. With a standard 3/8" mortar joint, its nominal dimensions equal exactly 8" long by 2-2/3" high by 4" deep. Three vertical courses of modular brick equal exactly 8 inches in height, perfectly aligning with standard 8" concrete cinder blocks.',
  },
  {
    q: 'How many bricks are on a pallet?',
    a: 'Most brick manufacturers package standard modular bricks in pallets (also called cubes or straps) of approximately 500 bricks (typically ranging from 495 to 534). Larger King or Queen bricks are usually bundled in smaller cubes of 400 to 500 units to maintain safe shipping and forklift handling weights under 2,400 pounds. Always confirm exact pallet quantities with your local brickyard.',
  },
  {
    q: 'How much mortar do I need for 1,000 bricks?',
    a: 'For 1,000 standard modular bricks with 3/8-inch joints, you need about 28 to 29 bags of 80 lb pre-blended mortar mix (or about 38 bags of 60 lb mix). If mixing on-site with bulk materials, the common bricklayer rule of thumb is about 7 to 8 bags (70 lb each) of masonry cement plus about 1 cubic yard of mason sand per 1,000 modular bricks. Actual yields vary with joint thickness, brick absorption, and mason technique; always follow the product label.',
  },
  {
    q: 'How do I use a brick wall calculator for a wall with doors and windows?',
    a: 'To use our brick wall calculator with openings, enter your total wall length and height to compute gross wall area. Next, add your doors and windows in the openings section (for example, standard 3 ft × 6.667 ft exterior doors = 20.0 sq ft and 3 ft × 4 ft windows = 12.0 sq ft). The tool automatically subtracts the opening square footage to give your net wall area, ensuring you do not over-order hundreds of unnecessary bricks.',
  },
  {
    q: 'What is the difference between single wythe and double wythe brick walls?',
    a: 'A single wythe brick wall is one brick thick (typically 3-5/8 to 4 inches), commonly built as an exterior architectural veneer anchored to a timber, steel stud, or concrete block backup wall with metal brick ties. A double wythe wall consists of two distinct parallel layers of brick bonded together with metal ties, header bricks, or a filled 3/4-inch mortar collar joint, creating a structural wall that requires about twice the bricks and mortar.',
  },
  {
    q: 'What is the standard mortar joint thickness for brick masonry?',
    a: 'The standard residential and commercial mortar joint thickness in the United States is 3/8 inch (0.375 inches). This thickness provides optimal structural bond strength and accommodates standard manufacturing dimensional tolerances. A thicker 1/2-inch (0.50-inch) joint is occasionally chosen for rustic hand-molded bricks or specific architectural mortar profiles.',
  },
  {
    q: 'How much waste should I allow when buying bricks?',
    a: 'A 10% waste factor is recommended for standard rectangular walls with a few window and door cuts. For simple unbroken walls, a 5% waste allowance may suffice. For complex facades featuring arches, soldier courses, bay windows, gables, or angled miter cuts, increase your waste factor to 15% to account for cutting scrap and transport breakage.',
  },
];

