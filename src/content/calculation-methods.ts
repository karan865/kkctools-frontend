/**
 * "How this calculator works" content for every calculator page (SEO audit 2026-11-14, M5).
 *
 * Rules:
 * - Formulas and defaults must match the engine in src/lib/ (they are the same numbers the code uses).
 * - Only link sources that were checked to exist (2026-11-14). Where a default is a typical trade value with
 *   no single public source, say so plainly instead of inventing a citation.
 */

export interface MethodSource {
  label: string;
  url?: string;
  note?: string;
}

export interface CalculationMethod {
  formula: string[];
  defaults: { label: string; value: string }[];
  sources: MethodSource[];
}

const NIST: MethodSource = {
  label: 'NIST Special Publication 811, Guide for the Use of the International System of Units',
  url: 'https://www.nist.gov/pml/special-publication-811',
  note: 'unit conversion factors (1 yd³ = 27 ft³, 1 ft = 0.3048 m, 1 lb = 0.45359237 kg)',
};
const TYPICAL_DENSITY: MethodSource = {
  label: 'Typical loose (bulk) material weights used in the trade',
  note: 'no single published standard; quarry and supplier figures vary by about 10–20%, so enter your supplier’s weight when you have it',
};
const QUIKRETE: MethodSource = {
  label: 'QUIKRETE Concrete Mix (No. 1101) product data sheet',
  url: 'https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf',
  note: 'bag yields: 40 lb = 0.30 ft³, 60 lb = 0.45 ft³, 80 lb = 0.60 ft³',
};

export const CALCULATION_METHODS: Record<string, CalculationMethod> = {
  'asphalt-calculator': {
    formula: [
      'Volume (ft³) = area (ft²) × thickness (in) ÷ 12',
      'Tons = volume × density (lb/ft³) ÷ 2,000, then × (1 + waste %)',
      'Cubic yards = volume ÷ 27',
    ],
    defaults: [
      { label: 'Compacted hot-mix asphalt density', value: '145 lb/ft³ (editable; millings use a lower value)' },
      { label: 'Waste', value: 'editable percentage' },
    ],
    sources: [NIST, { ...TYPICAL_DENSITY, label: 'Typical compacted hot-mix asphalt density (about 140–150 lb/ft³)' }],
  },
  'cubic-yard-calculator': {
    formula: [
      'Cubic feet = length × width × depth (all in feet); circles use π × r² × depth',
      'Cubic yards = cubic feet ÷ 27',
      'Weight = cubic yards × material density',
    ],
    defaults: [
      { label: 'Material densities', value: 'typical loose weights per material, shown in the material list and editable' },
      { label: 'Concrete bags', value: 'yields from the QUIKRETE data sheet' },
    ],
    sources: [NIST, QUIKRETE, TYPICAL_DENSITY],
  },
  'sand-calculator': {
    formula: [
      'Volume (yd³) = area × depth ÷ 27, then × (1 + waste %)',
      'Tons = yd³ × density (lb/yd³) ÷ 2,000',
      'Polymeric joint sand = joint length × joint width × joint depth',
    ],
    defaults: [
      { label: 'Sand density', value: 'dry 2,600 · damp 2,900 · wet 3,200 lb/yd³ (custom allowed)' },
      { label: 'Polymeric sand', value: '2,700 lb/yd³ (100 lb/ft³)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'fill-dirt-calculator': {
    formula: [
      'Volume = area × depth (sloped areas use the average of the shallow and deep ends)',
      'Cubic yards = cubic feet ÷ 27, then × (1 + settling %)',
      'Tons = yd³ × density ÷ 2,000; truckloads = yd³ ÷ your truck capacity',
    ],
    defaults: [
      { label: 'Fill dirt density', value: '2,700 lb/yd³' },
      { label: 'Topsoil density', value: '2,200 lb/yd³ (custom allowed)' },
      { label: 'Settling / extra', value: 'editable 0–50%' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'linear-foot-calculator': {
    formula: [
      'Linear feet = sum of all piece lengths (converted to feet) × quantity, then × (1 + waste %)',
      'Square feet → linear feet: linear feet = square feet ÷ material width (in feet)',
    ],
    defaults: [{ label: 'Waste', value: 'editable percentage; price per linear foot optional' }],
    sources: [NIST],
  },
  'rafter-calculator': {
    formula: [
      'Rise = run × pitch ÷ 12 (pitch in inches of rise per 12 inches of run); run = half the span for a gable roof',
      'Rafter length = √(run² + rise²), plus the overhang measured along the slope',
      'Roof angle = arctan(rise ÷ run); this is the plumb-cut angle',
    ],
    defaults: [
      { label: 'Overhang', value: '0 in unless you enter one' },
      { label: 'Stock lengths', value: 'the next standard lumber length that covers the rafter' },
    ],
    sources: [
      { label: 'Right-triangle (Pythagorean) geometry', note: 'no material defaults are involved; always check member sizes and spans against your plans and local code' },
    ],
  },
  'square-footage-calculator': {
    formula: [
      'Rectangle = length × width · triangle = ½ × base × height · circle = π × r²',
      'Trapezoid = ½ × (base₁ + base₂) × height · L-shape = sum of its two rectangles',
      'Total = added areas − subtracted areas, then × (1 + waste %)',
    ],
    defaults: [
      { label: 'Metric conversion', value: '1 sq ft = 0.09290304 m² (exact)' },
      { label: 'Waste', value: '0, 5, 10, 15% or custom' },
    ],
    sources: [
      NIST,
      { label: 'ANSI Z765 (Square Footage — Method for Calculating)', note: 'the US standard for measuring house living area, summarised in the GLA section above' },
    ],
  },
  'cinder-block-calculator': {
    formula: [
      'Blocks = net wall area (in²) ÷ nominal block face (in²); an 8 × 16 in face is 128 in², so 1.125 blocks per ft²',
      'Net area = wall area − doors and windows; then × (1 + waste %)',
      'Core fill (ft³) = blocks × core volume per block × share of cores filled',
    ],
    defaults: [
      { label: 'Core volume per block', value: '4" 0.06 · 6" 0.17 · 8" 0.27 · 10" 0.38 · 12" 0.48 ft³ (typical hollow CMU)' },
      { label: 'Pre-blended mortar', value: '80 lb bag ≈ 13 blocks, 60 lb bag ≈ 9.75 blocks (typical; check your bag)' },
    ],
    sources: [
      {
        label: 'NCMA — Concrete Masonry Unit Shapes, Sizes, Properties and Specifications',
        url: 'https://ncma.org/resource/concrete-masonry-unit-shapes-sizes-properties-and-specifications/',
        note: 'nominal vs actual CMU sizes (8 × 8 × 16 nominal = 7⅝ × 7⅝ × 15⅝ in)',
      },
      { label: 'ASTM C90 (Standard Specification for Loadbearing Concrete Masonry Units)', note: 'the US product standard for hollow block' },
      NIST,
    ],
  },
  'brick-calculator': {
    formula: [
      'US: bricks per ft² = 144 ÷ ((brick length + joint) × (brick height + joint)), in inches',
      'Metric: bricks per m² = 1 ÷ ((length + joint) × (height + joint)), in metres',
      'Bricks = net wall area × bricks per unit area × wall thickness (× 2 for a double wythe / one-brick wall), then × (1 + waste %)',
    ],
    defaults: [
      { label: 'Mortar joint', value: '3/8 in (US) or 10 mm (metric)' },
      { label: 'US pre-blended mortar', value: '80 lb bag ≈ 35 modular bricks at 3/8 in, scaled for other sizes (typical; check your bag)' },
      { label: 'Metric mortar', value: 'joint volume per brick × bricks; bag count uses the yield printed on your bag' },
      { label: 'Pallet / pack size', value: '500 bricks (editable)' },
    ],
    sources: [
      {
        label: 'Brick Industry Association, Technical Note 10: Dimensioning and Estimating Brick Masonry',
        url: 'https://www.gobrick.com/media/file/10-dimensioning-and-estimating-brick-masonry.pdf',
        note: 'nominal sizes and the bricks-per-area method',
      },
      NIST,
    ],
  },
  'paint-cost-calculator': {
    formula: [
      'Wall area = room perimeter × wall height − doors − windows (+ ceiling if selected)',
      'Gallons = area × coats ÷ coverage per gallon; primer uses its own coverage',
      'Cost = gallons (split into gallons and quarts) × price + primer + sundries',
    ],
    defaults: [
      { label: 'Coverage per gallon', value: 'smooth 380 · orange peel 350 · heavy texture 300 · unprimed 250 · masonry 225 ft²' },
      { label: 'Primer coverage', value: '300 ft² per gallon' },
      { label: 'Deductions', value: 'door 21 ft², window 15 ft²' },
      { label: 'Prices', value: 'typical US retail ranges, editable' },
    ],
    sources: [
      { label: 'Coverage printed on paint can labels', note: 'most interior paints state about 350–400 ft² per gallon on smooth surfaces; use the figure on your can' },
    ],
  },
  'tile-calculator': {
    formula: [
      'Tiles = net area ÷ area of one tile (with its grout joint), then × (1 + waste %); boxes = tiles ÷ tiles per box',
      'Thin-set bags = net area ÷ coverage per 50 lb bag (set by tile size and trowel)',
      'Grout = joint volume (joint width × tile thickness × joint length) × about 100 lb/ft³ for sanded grout, +10%, in 25 lb bags',
    ],
    defaults: [
      { label: 'Thin-set coverage per 50 lb bag', value: 'tiles up to 8 in: 80 ft² · 8–15 in: 60 ft² · larger: 50 ft²' },
      { label: 'Waste', value: 'straight lay vs diagonal / herringbone presets, editable' },
    ],
    sources: [
      { label: 'Typical thin-set coverage printed on 50 lb mortar bags', note: 'coverage depends on trowel notch; follow your mortar’s data sheet' },
      NIST,
    ],
  },
  'laminate-flooring-calculator': {
    formula: [
      'Net area = sum of rooms; order area = net area × (1 + pattern waste %)',
      'Boxes = order area ÷ coverage per box (rounded up); underlayment rolls = net area ÷ roll coverage',
      'Moldings = room perimeter ÷ piece length, +10%',
    ],
    defaults: [
      { label: 'Coverage per box', value: '20 ft² (quick picks 18–24 ft²; read your box label)' },
      { label: 'Underlayment roll', value: '100 ft²' },
      { label: 'Molding piece length', value: '7.8 ft (about 94 in)' },
    ],
    sources: [{ label: 'Coverage printed on the flooring box and underlayment roll', note: 'always use the figure on your product' }],
  },
  'stone-calculator': {
    formula: [
      'Cubic yards = area × depth ÷ 27 (summed over all areas)',
      'Tons = cubic yards × tons per yd³, then × (1 + waste %)',
      'Bags = cubic feet ÷ bag size',
    ],
    defaults: [
      { label: 'Crushed stone / gravel', value: 'about 1.35–1.55 tons per yd³ by type (preset list, editable)' },
      { label: 'Mulch / light materials', value: 'much lighter (about 0.6 tons per yd³)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'stud-calculator': {
    formula: [
      'Field studs = wall length (in) ÷ on-center spacing, rounded up, + 1 for the end stud',
      'Extras: + 2 per corner, + 2 per T-junction, + 4 per door or window (2 king + 2 jack)',
      'Plates = wall length × number of plate layers ÷ 16 ft stock boards',
    ],
    defaults: [
      { label: 'Spacing', value: '16 in or 24 in on center' },
      { label: 'Headers', value: '2 boards per rough opening' },
      { label: 'Plate stock', value: '16 ft boards' },
    ],
    sources: [
      { label: 'Common US platform-framing layout (16 or 24 in on center)', note: 'stud size, spacing and headers must follow your plans and local building code' },
    ],
  },
  'tons-to-cubic-yards': {
    formula: ['Cubic yards = tons × 2,000 ÷ density (lb/yd³)', 'Tons = cubic yards × density ÷ 2,000'],
    defaults: [
      { label: 'Crushed stone / road base', value: '2,800 lb/yd³' },
      { label: 'Topsoil', value: '2,200 lb/yd³' },
      { label: 'Compost', value: '1,300 lb/yd³ · mulch 800 lb/yd³ (all materials in the table above, editable)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'paver-sand-calculator': {
    formula: [
      'Bedding sand (yd³) = area × bedding depth ÷ 27; tons = yd³ × 1.35',
      'Joint sand bags = area ÷ coverage per 50 lb bag (by paver style and joint width), then × (1 + buffer %)',
    ],
    defaults: [
      { label: 'Bedding depth', value: '1 in (0.75–1.25 in options)' },
      { label: 'Concrete sand density', value: '1.35 tons per yd³' },
      { label: 'Polymeric sand coverage', value: 'e.g. standard brick pavers: 85 ft² (1/8 in joint), 45 ft² (1/4 in), 25 ft² (1/2 in) per 50 lb bag' },
    ],
    sources: [
      { label: 'Polymeric sand coverage charts printed on the bag', note: 'coverage changes with joint width and paver size; follow your product' },
      NIST,
      TYPICAL_DENSITY,
    ],
  },
  'paver-base-calculator': {
    formula: [
      'Compacted volume (yd³) = area × base depth ÷ 27',
      'Loose volume to order = compacted volume × (1 + compaction %)',
      'Tons = loose yd³ × density; 0.5 ft³ bags = loose ft³ ÷ 0.5',
    ],
    defaults: [
      { label: 'Base depth', value: '4–10 in presets (walkways and patios thinner, driveways thicker)' },
      { label: 'Compaction allowance', value: '15% (0–20% options)' },
      { label: 'Base density', value: '1.40 tons per yd³ (editable)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'compost-calculator': {
    formula: [
      'Volume (ft³) = area × depth (in) ÷ 12; cubic yards = ft³ ÷ 27',
      'Bags = ft³ ÷ bag size (1, 1.5 or 2 ft³), rounded up',
      'Weight = yd³ × density',
    ],
    defaults: [
      { label: 'Depth', value: '2 in top-dressing (editable)' },
      { label: 'Compost density', value: 'about 0.65 tons per yd³ (1,300 lb/yd³)' },
    ],
    sources: [NIST, TYPICAL_DENSITY],
  },
  'concrete-slab-cost-calculator': {
    formula: [
      'Slab volume (yd³) = length (ft) × width (ft) × thickness (in) ÷ 324; several slabs are added together',
      'Concrete to order = volume × (1 + waste %), rounded up to the next ¼ yd³; trucks = order ÷ truck capacity, rounded up',
      'Short-load fee = fee × yd³ ordered (or a flat fee) when the order is under the threshold; delivery = yd³ × delivery rate; pump = minimum charge',
      'Gravel base (tons) = area × depth (in) ÷ 12 ÷ 27 × (1 + 15% compaction) × 1.40 tons/yd³',
      'Mesh, rebar, vapour barrier, labour, finish, sealer and removal = area (ft²) × rate; forms = number of slabs × rate',
      'Total = (sum of lines) × region factor × (1 + overhead %) + permit; per ft² = total ÷ area; per yard = total ÷ yd³ ordered',
      'DIY bags = volume with waste ÷ bag yield (80 lb = 0.60 ft³) × bag price + base, reinforcement and forms; DIY ready-mix = concrete, fees and pump + the same prep',
    ],
    defaults: [
      { label: 'Ready-mix price', value: '$167/yd³ (4,000 psi); 3,000–5,000 psi presets $151–$186 — midpoints of LawnStarter 2026 ranges' },
      { label: 'Short-load fee', value: '$43 per yd³ ordered under a 10 yd³ truckload (LawnStarter); flat-fee option' },
      { label: 'Delivery', value: '$0 (often included within about 20 miles); LawnStarter lists $18–$20/yd³ when charged' },
      { label: 'Pump', value: 'line $500, boom $900 minimum — inside the Angi 2026 ranges ($400–$600 and $800–$1,000)' },
      { label: 'Gravel base', value: '$40/ton delivered — HomeGuide 2026: road base $18–$30/ton plus $10–$25/ton delivery' },
      { label: 'Reinforcement & barrier', value: 'wire mesh $0.35/ft², rebar grid $2.50/ft² ($2–$3), vapour barrier $0.50/ft² (This Old House, Mar 2026)' },
      { label: 'Labour', value: '$3.50/ft² placing & finishing — published labour figures run from $2–$5/ft² (Inch Calculator) to $5.50–$9/ft² (LawnStarter); chosen so a plain slab lands inside the 2026 installed ranges' },
      { label: 'Finishes', value: 'colour/stain $5.50/ft² ($3.50–$7.50), stamped $12/ft² ($10–$14) (This Old House); sealer $1.50/ft² ($1–$2, Inch Calculator)' },
      { label: 'Forms & joints', value: '$75 per slab ($50–$100 lumber and stakes, Inch Calculator)' },
      { label: 'Removal', value: '$4/ft² including disposal ($2–$6, Angi and LawnStarter 2026)' },
      { label: 'Bags', value: '80 lb bag $6.65 (LawnStarter, Sep 2026); kilogram bags scaled from 80 lb = 0.60 ft³' },
      { label: 'Published check', value: 'plain installed slab $4.34–$10.50/ft² (LawnStarter Nov 2026, average $6.60; Concrete Network Jul 2026, $6.50–$10.50)' },
    ],
    sources: [
      {
        label: 'LawnStarter — How Much Does Concrete Cost Per Yard in 2026? (updated Sep 24, 2026)',
        url: 'https://www.lawnstarter.com/blog/cost/concrete-price-per-yard/',
        note: 'price per yd³ by psi, short-load fee, delivery rates, bag price',
      },
      {
        label: 'LawnStarter — How Much Does a Concrete Slab Cost? (updated Nov 3, 2026)',
        url: 'https://www.lawnstarter.com/blog/cost/concrete-slab-price/',
        note: 'national average and range for an installed slab',
      },
      {
        label: 'Concrete Network — Concrete Prices 2026 (updated Jul 14, 2026)',
        url: 'https://www.concretenetwork.com/concrete-prices.html',
        note: 'NRMCA 2025 average $179.95/yd³; installed plain slab $6.50–$10.50/ft²',
      },
      {
        label: 'This Old House — How Much Does a Concrete Slab Cost? (updated Mar 17, 2026)',
        url: 'https://www.thisoldhouse.com/foundations/concrete-slab-cost',
        note: 'wire mesh, rebar, vapour barrier, colour and stamping costs',
      },
      {
        label: 'Angi — What Does Concrete Pumping Cost? (2026 data)',
        url: 'https://www.angi.com/articles/concrete-pumping-cost.htm',
        note: 'line and boom pump hourly rates and minimums',
      },
      {
        label: 'Angi — How Much Does Concrete Removal Cost? (2026 data)',
        url: 'https://www.angi.com/articles/how-much-should-concrete-demo-cost-square-foot.htm',
        note: 'removal and disposal per ft²',
      },
      {
        label: 'HomeGuide — Crushed Stone and Gravel Prices (2026)',
        url: 'https://homeguide.com/costs/gravel-prices',
        note: 'road base and delivery per ton',
      },
      {
        label: 'Inch Calculator — Cost to Install a Concrete Slab',
        url: 'https://www.inchcalculator.com/how-much-does-a-concrete-slab-cost/',
        note: 'labour, sealer, forms and lumber ranges',
      },
      QUIKRETE,
      NIST,
    ],
  },
  'floor-refinishing-cost-calculator': {
    formula: [
      'Floor = area × method rate; full sand and dustless rates × species factor (species midpoint ÷ oak midpoint)',
      'Stain (sanding methods only) = area × stain rate',
      'Extras = repaired area × rate, steps × rate, rooms × rate, or a flat baseboard charge',
      'Estimate = (floor + stain + extras) × region factor, never below the minimum job charge',
      'Range = the same lines priced at the low and high ends of each published range',
      'DIY = rentals × days + abrasives + ceil(area × coats ÷ 500 ft²/gal) gallons of finish (+ stain) + supplies',
    ],
    defaults: [
      { label: 'Screen & recoat', value: '$1.50/ft² (range $1–$2) — This Old House' },
      { label: 'Full sand & refinish', value: '$4.25/ft² ($3–$5.50) — This Old House' },
      { label: 'Dustless', value: '$6.50/ft² ($5–$8) — This Old House' },
      { label: 'Stain', value: '+$2/ft² ($1–$3) — This Old House' },
      { label: 'Species factor', value: 'This Old House cost by wood type: maple ×1.625, pine ×1.375, mahogany ×1.75, bamboo ×1.125, parquet ×1.063; oak, cherry, engineered ×1' },
      { label: 'Repairs, subfloor, carpet, furniture', value: '$9/ft² ($6–$12), $6.50/ft² ($3–$10), $3/ft² ($1–$5), $35/room ($20–$50) — This Old House' },
      { label: 'Stairs, board replacement, baseboards', value: '$35/step ($25–$45), $23/ft² ($14–$32), about $140 per job — Fixr' },
      { label: 'Replace with new hardwood', value: '$12/ft² installed ($6–$18) — This Old House' },
      { label: 'DIY', value: 'drum sander $65/day, edger $40/day, sandpaper $45, finish $42.50/gal (water-based) or $35 (oil-based), stain $40/gal, supplies and safety gear — This Old House midpoints; floor buffer assumed priced like a drum sander' },
      { label: 'Coverage', value: '500 ft² per gallon per coat for finish and stain — Sherwin-Williams (Minwax)' },
    ],
    sources: [
      {
        label: 'This Old House — How Much Does It Cost to Refinish Hardwood Floors? (updated Jun 5, 2026)',
        url: 'https://www.thisoldhouse.com/flooring/cost-to-refinish-hardwood-floors',
        note: 'method, stain, species, repair, carpet, furniture, DIY and installation ranges; labour share and hours; refinish frequency and limits',
      },
      {
        label: 'Fixr — Cost to Refinish Hardwood Floor (updated Jan 31, 2025)',
        url: 'https://www.fixr.com/costs/hardwood-floor-refinishing',
        note: 'stairs per step, board replacement, baseboard removal and refit, finish prices per gallon',
      },
      {
        label: 'Sherwin-Williams — Minwax Ultimate Floor Finish product data',
        url: 'https://sweets.construction.com/manufacturer/sherwin-williams-company-nst2204/products/minwax-ultimate-floor-finish-nst746935-p',
        note: 'approximately 500 sq ft per gallon',
      },
    ],
  },
  'bathroom-remodel-cost-calculator': {
    formula: [
      'Fixed items (per bathroom): toilet, vanity/cabinetry, vanity top, faucets, electrical, plumbing, tub or shower',
      'Area items = rate × floor area, where rate = This Old House average ÷ 70 ft² (flooring, wall tile, painting, insulation & drywall)',
      'Finish level multiplies every default price: budget × 0.575, high-end × 1.881 (midpoints of This Old House’s 50 ft² finish ranges ÷ its mid-range)',
      'Cosmetic refresh leaves out plumbing, drywall and the tub/shower',
      'Estimate = sum of lines × region factor + permit; range = ±13% (half-width of This Old House’s mid-range band); budget = estimate × (1 + contingency %)',
    ],
    defaults: [
      { label: 'Fixtures and trades (mid-range)', value: 'toilet $467, cabinetry $2,929, countertop $332, faucets $423, electrical $456, plumbing $5,545 — This Old House 2026 averages' },
      { label: 'Surfaces (for a 70 ft² room)', value: 'flooring $1,114, tiling $1,326, painting $1,145, insulation & drywall $2,338' },
      { label: 'Tub and shower', value: 'tub/shower combo $1,258, complete shower remodel $8,044, freestanding tub $1,123' },
      { label: 'Water heater upgrade', value: '$1,478' },
      { label: 'Contingency', value: '20% — This Old House' },
      { label: 'Check', value: 'reproduces This Old House’s size table (40–60 ft² $12,695–$14,845; 100–120 ft² $19,166–$21,295; 130 ft²+ $22,370–$24,715) and finish table at 50 ft²' },
    ],
    sources: [
      {
        label: 'This Old House — Bathroom Remodel Cost in 2026 (updated Jul 2, 2026)',
        url: 'https://www.thisoldhouse.com/bathrooms/bathroom-remodel-cost',
        note: 'line-item averages, cost by size and finish, 20% contingency, ~80% resale value recouped',
      },
    ],
  },
  'metal-roof-cost-calculator': {
    formula: [
      'Roof area = (length + 2 × overhang) × (width + 2 × overhang) × √(1 + (rise ÷ 12)²) per section (same geometry as the Shingle Roof Calculator); squares = area ÷ 100',
      'Metal total = area × installed price + area × tear-off price (if replacing) + permit',
      'Shingle total = area × tear-off-and-replace price (minus the tear-off price if not replacing) + permit',
      'Cost per year = total ÷ mid-point life; shingle roofs over one metal roof = metal life ÷ shingle life, rounded up',
      'Panels per slope = eave length ÷ coverage width, rounded up; panel length = eave-to-ridge distance × pitch factor (gable and shed); hips: total length = area ÷ coverage width',
      'Underlayment rolls = area ÷ 1,000 ft² (synthetic), rounded up',
    ],
    defaults: [
      { label: 'Metal, installed', value: 'standing seam $12.50 ($9–$16), corrugated $8.50 ($5–$12), metal shingles $10 ($6–$14) per ft² — HomeGuide 2026 midpoints' },
      { label: 'Asphalt, tear-off and replace', value: 'architectural $5 ($4–$6), 3-tab $4 ($3–$5) per ft² — HomeGuide 2026' },
      { label: 'Tear-off', value: '$2 per ft² ($1–$3, HomeGuide 2026)' },
      { label: 'Life', value: 'metal 55 years (40–70, This Old House Mar 2026); architectural 27.5 (25–30) and 3-tab 17.5 (15–20) years — Fixr 2026' },
      { label: 'Panel width', value: 'standing seam 16 in, corrugated 36 in coverage (typical; editable)' },
    ],
    sources: [
      {
        label: 'HomeGuide — How Much Does a Metal Roof Cost? (2026)',
        url: 'https://homeguide.com/costs/metal-roof-cost',
        note: 'installed price per ft² for corrugated, standing seam and metal shingles',
      },
      {
        label: 'HomeGuide — Average Cost to Tear Off and Replace a Roof (2026)',
        url: 'https://homeguide.com/costs/average-cost-to-tear-off-and-replace-roof',
        note: 'asphalt tear-off and replace per ft²; tear-off alone $1–$3 per ft²',
      },
      {
        label: 'This Old House — Metal vs. Asphalt Roofing (updated Mar 30, 2026)',
        url: 'https://www.thisoldhouse.com/roofing/metal-vs-asphalt-roof',
        note: 'metal 40–70 years, asphalt 15–30 years',
      },
      {
        label: 'Fixr — How Much Does an Asphalt Shingle Roof Cost? (2026)',
        url: 'https://www.fixr.com/costs/asphalt-roof-shingles-installation',
        note: '3-tab 15–20 years, architectural 25–30 years',
      },
    ],
  },
  'roof-replacement-cost-calculator': {
    formula: [
      'Roof area = footprint × pitch multiplier √(1 + (rise ÷ 12)²) + overhang allowance; Squares = roof area ÷ 100',
      'Total cost = (materials + labor + tear-off + dumpster + decking + accessories + permit) × (1 + contingency %)',
      'Tear-off cost = squares × layers × unit rate ($125/sq/layer); 2 layers double labor and legally restrict overlay under IRC R908.3.1.1',
      'Labor cost = squares × base labor per square × story multiplier × complexity multiplier × steep-slope multiplier (≥ 8/12 pitch)',
      'Decking replacement sheets = ceil((squares × 100 × decking replace %) ÷ 32 ft² per 4×8 sheet)',
    ],
    defaults: [
      { label: 'Architectural shingles, installed', value: '$500/sq installed = $195 material + $305 labour ($400–$600/square; Fixr 2026 lists $4–$8/sq ft)' },
      { label: 'Architectural labour (inside the installed price)', value: '$305/sq ($250–$360/square), before stories, complexity and steep-pitch multipliers' },
      { label: 'Tear-off per layer', value: '$200/sq per layer ($100–$300/square; same rate as the Metal Roof Cost Calculator)' },
      { label: 'Dumpster rental & haul-away', value: '$475 per 20-yard container (about 35 squares of one-layer tear-off each)' },
      { label: 'Decking replacement (4×8 OSB/plywood)', value: '$80 per 4×8 sheet installed (editable)' },
      { label: 'Synthetic underlayment & accessories', value: 'Synthetic $90/roll (1,000 ft²), Ice & water $110/roll (200 ft²)' },
    ],
    sources: [
      {
        label: 'HomeGuide — Average Cost to Tear Off and Replace a Roof (2026)',
        url: 'https://homeguide.com/costs/average-cost-to-tear-off-and-replace-roof',
        note: 'national average costs per square and tear-off rates',
      },
      {
        label: 'Fixr — How Much Does an Asphalt Shingle Roof Cost? (2026)',
        url: 'https://www.fixr.com/costs/asphalt-roof-shingles-installation',
        note: 'material costs and architectural shingle pricing',
      },
      {
        label: 'This Old House — How Much Does a New Roof Cost? (2026)',
        url: 'https://www.thisoldhouse.com/roofing/how-much-does-a-new-roof-cost',
        note: 'installed costs across 10 roofing materials and lifespan ranges',
      },
      {
        label: 'US Bureau of Labor Statistics — Occupational Employment and Wages: Roofers (SOC 47-2181)',
        url: 'https://www.bls.gov/oes/current/oes472181.htm',
        note: 'trade roofer wage benchmarks and labor multipliers',
      },
      {
        label: 'International Residential Code (IRC) Section R908.3.1.1 — Replacement / Reroofing Limitations',
        url: 'https://codes.iccsafe.org/',
        note: 'prohibits reroofing/overlaying over two or more existing layers of roof covering',
      },
    ],
  },
  'carpet-cost-calculator': {
    formula: [
      'Room roll layout: across = width (or length), drops = ceil(across ÷ rollWidth), cutLength = along + 0.5 ft trim allowance; bought area = drops × rollWidth × cutLength; waste % = ((bought - net) ÷ net) × 100',
      'Stair runner area = (steps × stairWidth × (tread + riser + nosingWrap) ÷ 144) + landingArea; gross stair carpet = stair area × 1.10 (10% fitting waste)',
      'Total carpet purchased = Σ room bought sq ft + gross stair carpet + pattern match %',
      'Pad area = net room area × 1.05 (5% fitting allowance); 1 sq yd = 9 sq ft; 1 m² = 10.764 sq ft',
      'Estimated total = (materials + labour + prep & removal + extras) × regionMultiplier + salesTax',
    ],
    defaults: [
      { label: 'Mid-grade carpet material', value: '$4.00/sq ft ($2.50–$5.50/sq ft, or $36.00/sq yd; HomeAdvisor & Fixr 2026)' },
      { label: 'High-density rebond cushion (8 lb, 7/16")', value: '$1.00/sq ft ($0.75–$1.35/sq ft; meets Shaw/Mohawk warranty specifications)' },
      { label: 'Standard installation labour', value: '$1.50/sq ft ($0.75–$2.50/sq ft; BLS SOC 47-2041 Carpet Installer wage benchmarks)' },
      { label: 'Stairs installation', value: 'Waterfall $8.00/step ($5–$12); Box / Cap & Band $15.00/step ($10–$25)' },
      { label: 'Old carpet & pad tear-out', value: '$0.40/sq ft ($0.25–$0.60/sq ft)' },
      { label: 'Debris haul-away & landfill disposal', value: '$0.25/sq ft ($0.15–$0.40/sq ft)' },
      { label: 'Perimeter tack strips', value: '$0.90/linear ft ($0.50–$1.50/lin ft)' },
      { label: 'Doorway transition threshold strips', value: '$25.00 each ($15–$35 each)' },
    ],
    sources: [
      {
        label: 'HomeAdvisor / Angi — How Much Does Carpet Installation Cost? (updated Jun 2026)',
        url: 'https://www.homeadvisor.com/cost/flooring/install-carpeting/',
        note: 'material grades, padding costs, labor rates per square foot, and removal averages',
      },
      {
        label: 'Fixr — Carpet Installation Cost (2026 Guide)',
        url: 'https://www.fixr.com/costs/carpet-installation',
        note: 'material costs by fibre type (nylon, polyester, wool) and stair installation breakdown',
      },
      {
        label: 'HomeGuide — How Much Does It Cost To Carpet A Room? (2026)',
        url: 'https://homeguide.com/costs/carpet-cost',
        note: 'square foot and square yard cost benchmarks, roll widths, and room size charts',
      },
      {
        label: 'US Bureau of Labor Statistics — Occupational Employment and Wages: Carpet Installers (SOC 47-2041)',
        url: 'https://www.bls.gov/oes/current/oes472041.htm',
        note: 'trade wage benchmarks for residential floor covering installers',
      },
      {
        label: 'Carpet and Rug Institute (CRI) — Residential Carpet Installation Standard (CRI 105)',
        url: 'https://carpet-rug.org/',
        note: 'standards for power stretching, seam sealing with hot-melt tape, and cushion density guidelines',
      },
    ],
  },
  'deck-cost-calculator': {
    formula: [
      'Total deck area = Σ (length × width) in sq ft; exposed perimeter = total perimeter − house ledger attachment length',
      'Decking board rows = ceil(deck width ÷ ((board width + gap) ÷ 12)); boards per row = ceil(deck length ÷ stock board length); total boards = rows × boardsPerRow × (1 + pattern waste %)',
      'Substructure framing joists = ceil(deck length in inches ÷ joist spacing in inches) + 1 + 2 rim joists',
      'Beam rows = attached ? 1 : 2; posts per beam = ceil(beam length ÷ post spacing) + 1; footings = total posts',
      'Concrete footing volume = footings × π × (dia/2)² × depth; cubic yards = total ft³ ÷ 27; 80 lb QUIKRETE bags = total ft³ ÷ 0.60 ft³',
      'Railing linear feet = max(0, exposed perimeter − stair openings); stair risers = ceil(elevation height in inches ÷ 7.5 in)',
      'Grand total = (decking + framing lumber + concrete + hardware + railing + stairs + site prep + demo + permit + labor) × regionMultiplier + contingency %',
    ],
    defaults: [
      { label: 'Pressure-treated pine decking', value: '$5.50/sq ft ($3.00–$8.00/sq ft materials; Fixr 2026)' },
      { label: 'Western red cedar decking', value: '$6.50/sq ft ($4.00–$9.00/sq ft materials; Fixr 2026)' },
      { label: 'Basic composite decking', value: '$13.00/sq ft ($8.50–$17.50/sq ft; Trex Cost Guide & HomeAdvisor 2026)' },
      { label: 'Capped 4-sided composite', value: '$20.00/sq ft ($14.00–$26.00/sq ft; TimberTech Cost Overview 2026)' },
      { label: 'Cellular PVC decking (AZEK-style)', value: '$24.00/sq ft ($16.00–$32.00/sq ft; TimberTech 2026)' },
      { label: 'Professional carpenter labor', value: '$15.00/sq ft base ($10.00–$20.00/sq ft; US BLS OEWS SOC 47-2031 carpenter wage benchmarks)' },
      { label: 'Elevation labor multiplier', value: 'Ground level 1.0×, Low 1.1×, Mid (4–8 ft) 1.25×, Elevated (8+ ft) 1.45×' },
      { label: 'Pressure-treated framing joists (2×8×12)', value: '$22.00 per piece; beams (double 2×10) $42.00; 6×6 posts $45.00' },
      { label: 'Concrete footing bags', value: '$6.75 per 80 lb bag (0.60 ft³ yield; QUIKRETE No. 1101 data sheet)' },
      { label: 'Pressure-treated wood railing', value: '$40.00/linear ft installed ($30–$50/LF; Fixr 2026)' },
      { label: 'Composite railing system', value: '$120.00/linear ft installed ($80–$165/LF; Fixr 2026)' },
      { label: 'Demolition & haul-away', value: 'Full tear-out $6.00/sq ft ($4–$10); board removal only $2.75/sq ft' },
    ],
    sources: [
      {
        label: 'HomeGuide — How Much Does It Cost To Build A Deck? (2026 Guide)',
        url: 'https://homeguide.com/costs/deck-cost',
        note: 'national average costs per square foot for pressure-treated wood, composite, and PVC decks',
      },
      {
        label: 'Fixr — Cost to Build a Deck (2026 Cost Report)',
        url: 'https://www.fixr.com/costs/build-deck',
        note: 'material costs by wood and composite species, railing costs per linear foot, and stair estimates',
      },
      {
        label: 'This Old House — How Much Does It Cost to Build a Deck? (updated 2026)',
        url: 'https://www.thisoldhouse.com/decks/cost-to-build-a-deck',
        note: 'framing substructure shares, labor hour averages, and maintenance comparisons',
      },
      {
        label: 'US Bureau of Labor Statistics — Occupational Employment and Wages: Carpenters (SOC 47-2031)',
        url: 'https://www.bls.gov/oes/current/oes472031.htm',
        note: 'trade wage benchmarks for residential framing and finish carpenters',
      },
      {
        label: 'International Residential Code (IRC) — Sections R312 (Guards) & R507 (Exterior Decks)',
        url: 'https://codes.iccsafe.org/',
        note: 'code mandates for 36" guardrails on decks >30" above grade, 4" sphere baluster spacing, and footing frost depths',
      },
      {
        label: 'QUIKRETE Technical Data Sheet — Concrete Mix (No. 1101)',
        url: 'https://www.quikrete.com/',
        note: '0.60 ft³ yield per 80 lb bag for round pier hole and footing volumes',
      },
    ],
  },
  'cubic-feet-to-square-feet': {
    formula: [
      'Square feet = cubic feet ÷ depth (ft); depth (ft) = inches ÷ 12, cm ÷ 30.48, mm ÷ 304.8, m ÷ 0.3048',
      'Cubic feet = square feet × depth (ft); cubic yards = cubic feet ÷ 27',
      'Metric: m² = m³ ÷ depth (m); m³ = m² × depth (m)',
      'Bags = volume ÷ bag size, rounded up; 1 ft³ = 28.3168 L',
    ],
    defaults: [
      { label: 'Concrete slab', value: '4 in (patios, walkways and shed bases)' },
      { label: 'Mulch', value: '3 in — Illinois Extension: 2–3 in settled; Minnesota Extension: 2–4 in; Maryland Extension: 3 in or less' },
      { label: 'Topsoil for a lawn', value: '4 in — Penn State Extension: at least 4–6 in settled' },
      { label: 'Paver base / bedding sand', value: '4 in / 1 in (same as the Paver Base and Paver Sand calculators)' },
      { label: 'Stone mulch', value: '1 in — Maryland Extension' },
    ],
    sources: [
      NIST,
      {
        label: 'University of Illinois Extension — Edging and mulching landscape beds',
        url: 'https://extension.illinois.edu/blogs/down-garden-path/2018-05-23-edging-and-mulching-landscape-beds',
        note: '2–3 in of settled mulch in shrub and evergreen beds',
      },
      {
        label: 'University of Minnesota Extension — Mulching for soil and garden health',
        url: 'https://extension.umn.edu/managing-soil-and-nutrients/mulching-soil-and-garden-health',
        note: '2–4 in of mulch',
      },
      {
        label: 'University of Maryland Extension — Mulching Trees and Shrubs',
        url: 'https://extension.umd.edu/resource/mulching-trees-and-shrubs',
        note: 'mulch 3 in or less; gravel or stone about 1 in',
      },
      {
        label: 'Penn State Extension — Lawn Establishment',
        url: 'https://extension.psu.edu/lawn-establishment',
        note: 'at least 4–6 in of good topsoil',
      },
      {
        label: 'Purdue Extension — Establishing Turfgrass Areas (AY-3-W)',
        url: 'https://www.extension.purdue.edu/extmedia/ay/ay-3-w.pdf',
        note: 'about 19 yd³ of topsoil for 6 in over 1,000 ft²',
      },
    ],
  },
  'fence-cost-calculator': {
    formula: [
      'For each side: fence length = side length − gate widths; gates split the side into pieces',
      'Sections per piece = piece length ÷ post spacing, rounded up; posts = sections + 1 per piece; connected sides share a corner post (a closed loop shares one more)',
      'Materials: pickets = fence length × 12 ÷ (picket width + gap), rails = sections × rails per section (wood); panels = sections (vinyl, aluminium); fabric = fence length, top rail = fence length ÷ 10.5 ft (chain link)',
      'Concrete per post = (π × hole radius² − post area) × depth; bags = posts × concrete ÷ bag yield (80 lb = 0.60 ft³), rounded up',
      'Cost = fence length × price per ft × (1 + slope %) + gates + removal × total length + permit; DIY = materials share × (fence + gates) + permit',
      'Range = fence length × the published low / high price per ft + gates, removal and permit',
    ],
    defaults: [
      { label: 'Price per foot (installed)', value: 'midpoints: chain link $20 ($13–$27), wood privacy $37.50 ($25–$50), wood picket $25 ($15–$35), vinyl privacy $50 ($40–$60), vinyl picket $27.50 ($15–$40) — This Old House, Jun 2026; aluminium $50 ($25–$75) — HomeGuide 2026' },
      { label: 'Materials share', value: '50% — This Old House: professional installation is about half the cost' },
      { label: 'Gates (installed)', value: 'chain link walk $262.50 ($110–$415), double $480 ($185–$775) — Angi 2026; wood / vinyl / metal walk $450 ($300–$600), drive $750 ($300–$1,200) — HomeGuide 2026' },
      { label: 'Removal', value: '$4 per linear foot ($3–$5, Angi 2026)' },
      { label: 'Post spacing', value: 'chain link 10 ft, wood and vinyl 8 ft, aluminium 6 ft (typical; editable)' },
      { label: 'Post holes', value: 'diameter 3 × post width; depth ⅓ of the fence height, at least 24 in (QUIKRETE guidance); 80 lb bag $6.65' },
    ],
    sources: [
      {
        label: 'This Old House — A Comprehensive Guide to Fencing Options (updated Jun 8, 2026)',
        url: 'https://www.thisoldhouse.com/lawns/fencing-options',
        note: 'installed cost per linear foot by material; privacy fence ranges; labour about half',
      },
      {
        label: 'HomeGuide — How Much Does Fence Installation Cost? (2026)',
        url: 'https://homeguide.com/costs/fence-installation-cost',
        note: 'aluminium and privacy fence ranges; garden and driveway gate prices',
      },
      {
        label: 'Angi — How Much Does Fence Installation Cost? (2026 data)',
        url: 'https://www.angi.com/articles/how-much-does-fence-installation-cost.htm',
        note: 'removing an existing fence $3–$5 per linear foot',
      },
      {
        label: 'Angi — How Much Does a Black Chain-Link Fence Cost? (2026 data)',
        url: 'https://www.angi.com/articles/black-chain-link-fence-cost.htm',
        note: 'single and double walk-through chain link gates',
      },
      {
        label: 'QUIKRETE — How to Set a Fence Post',
        url: 'https://www.quikrete.com/athome/video-setting-fence-post.asp',
        note: 'hole about 3 × the post width and ⅓ of the height above ground deep',
      },
      QUIKRETE,
      {
        label: '811 — Call Before You Dig',
        url: 'https://call811.com/',
        note: 'free utility-line marking before any digging',
      },
    ],
  },
  'cubic-inch-calculator': {
    formula: [
      'Box = length × width × height (inches)',
      'Cylinder = π/4 × diameter² × length; tube wall = π/4 × (OD² − ID²) × length, inside = π/4 × ID² × length; sphere = π/6 × diameter³',
      'Engine displacement (ci) = π/4 × bore² × stroke × cylinders (bore and stroke in inches; millimetres ÷ 25.4)',
      'Stroke for a target = displacement ÷ (π/4 × bore² × cylinders); bore = √(displacement ÷ (π/4 × stroke × cylinders))',
      'Conversions: 1 in³ = 16.387064 cm³ (exact, 2.54³); 1 ft³ = 1,728 in³; 1 yd³ = 46,656 in³; 1 US gal = 231 in³; 1 imperial gal = 4.54609 L',
    ],
    defaults: [
      { label: 'π', value: 'full precision (π/4 ≈ 0.7854 is shown in the working only)' },
      { label: 'Engine presets', value: 'bore and stroke exactly as published by Chevrolet (350 ZZ6, LS3, 502), Stellantis/Dodge Garage (392 HEMI), Ford Performance (Coyote Gen 4 crate) and Honda (Civic Type R)' },
      { label: 'Square engine', value: 'bore ÷ stroke within ±1% of 1' },
    ],
    sources: [
      { label: 'NIST — SI Units: Length (inch defined as exactly 2.54 cm)', url: 'https://www.nist.gov/pml/owm/si-units-length', note: 'basis of 16.387064 cm³ per in³' },
      { label: 'Chevrolet Performance — LS3 crate engine specifications', url: 'https://www.chevrolet.com/performance-parts/crate-engines/ls-lsx-engines/ls3-engine', note: '4.065 × 3.622 in' },
      { label: 'Chevrolet Performance — ZZ6 350 crate engine', url: 'https://www.chevrolet.com/performance-parts/crate-engines/small-block-zz6-efi-deluxe', note: '4.00 × 3.48 in' },
      { label: 'Chevrolet Performance — 502 big-block crate engine', url: 'https://www.chevrolet.com/performance-parts/crate-engines/big-block/zz-502-base', note: '4.470 × 4.000 in' },
      { label: 'Dodge Garage — Gen III HEMI quick reference guide', url: 'https://www.dodgegarage.com/news/article/how-to/2020/10/gen-iii-hemi-engine-quick-reference-guide-part-iv.html', note: '392: 4.09 × 3.72 in' },
      { label: 'Ford Performance — 5.0L Gen 4 crate engine (M-6007-M50D)', url: 'https://www.ford.com/product/50l-gen-4-mustang-crate-engine-w-flywheel-p2959841009', note: '93 × 92.7 mm' },
      { label: 'Honda — 2021 Civic Type R specifications', url: 'https://hondanews.com/en-US/honda-automobiles/releases/2021-civic-type-r-specifications-features', note: '86.0 × 85.9 mm, 1,996 cc' },
    ],
  },
  'wire-gauge-calculator': {
    formula: [
      'Current from power: DC I = W ÷ V; single-phase I = W ÷ (V × power factor); three-phase I = W ÷ (√3 × V × power factor)',
      'Voltage drop: DC and single-phase VD = 2 × I × R × L; three-phase VD = √3 × I × R × L (L = one-way length, R = resistance per length of one conductor)',
      'Resistance (AWG/kcmil) = resistivity at 75 °C ÷ conductor area × 1.02 for stranding; area from the AWG formula d = 0.005 in × 92^((36 − n) ÷ 39)',
      'Resistance (mm²) = IEC 60228 class 2 maximum at 20 °C × (1 + α × (70 − 20))',
      'Allowable current = NEC Table 310.16 (insulation column) × ambient factor × bundling factor, but not more than the terminal-temperature column; continuous loads × 125%',
      'Wire = the larger of the voltage-drop size and the current-rating size; breaker = the smallest standard rating ≥ the required current and ≤ the wire’s limit (240.4(D) for 14–10 AWG)',
    ],
    defaults: [
      { label: 'Resistivity at 20 °C', value: 'copper 1.7241 µΩ·cm (100% IACS), α 0.00393/°C; aluminium 2.8264 µΩ·cm (61% IACS), α 0.00403/°C' },
      { label: 'Voltage-drop limit', value: '3% (NEC informational note for branch circuits; not a code requirement in most cases)' },
      { label: 'Temperature basis', value: 'AWG resistance at 75 °C (NEC Chapter 9 Table 8 basis); metric at 70 °C (PVC); ampacity table at 30 °C ambient' },
      { label: 'Terminals', value: '60 °C by default (most equipment ≤ 100 A and NM-B cable), change to 75 °C for equipment marked 75 °C' },
      { label: 'Table conflicts', value: 'where published reproductions of Table 310.16 differed (Cu 3 AWG 90 °C, Al 300 kcmil), the lower value is used' },
    ],
    sources: [
      { label: 'NFPA 70, National Electrical Code — Table 310.16, Tables 310.15(B)(1) and (C)(1), 240.4(D), 240.6(A), 110.14(C), Chapter 9 Table 8', note: 'values checked against published reproductions; verify against the edition your area adopts' },
      {
        label: 'Ambient and bundling adjustment factors (Tables 310.15(B)(1) and (C)(1)) — study guide reproduction',
        url: 'https://open-exam-prep.com/study-guides/ct-electrician/conductors-ampacity-cables/ampacity-derating',
      },
      {
        label: 'IEC 60228 class 2 conductor resistance — Bayka technical information',
        url: 'https://www.bayka.de/en/service/technical-information/conductor-resistance',
      },
      { label: 'IEC 60028 / IACS', note: 'standard annealed copper resistivity 1/58 Ω·mm²/m at 20 °C' },
      NIST,
    ],
  },
  'pipe-volume-calculator': {
    formula: [
      'Capacity (round) = π × (inside diameter ÷ 2)² × length; inside diameter = outside diameter − 2 × wall',
      'Tube wall volume = π ÷ 4 × (OD² − ID²) × length',
      'Rectangular tube: capacity = (W − 2t) × (H − 2t) × length; wall = (W × H − inner area) × length',
      'US gallons = cubic inches ÷ 231; litres = cubic inches × 0.016387064; imperial gallons = litres ÷ 4.54609',
      'Liquid weight = litres × density (kg/L); tube weight = wall volume × material density; fill time = litres ÷ flow rate',
    ],
    defaults: [
      { label: 'Steel & PVC Schedule 40/80', value: 'outside diameter and wall from ASME B36.10M (PVC to ASTM D1785 uses the same OD and walls for these sizes)' },
      { label: 'Copper Types K, L, M', value: 'ASTM B88: OD = nominal size + ⅛ in, wall per type' },
      { label: 'PEX', value: 'copper tube size OD, SDR 9 (wall = OD ÷ 9, at least 0.070 in) — ASTM F876' },
      { label: 'Metric PE', value: 'SDR 11 (e.g. 32 mm × 2.9 mm) — EN 12201 / ISO 4427' },
      { label: 'Liquid', value: 'water 1.0 kg/L, seawater 1.025 kg/L, or your own density' },
      { label: 'Material densities', value: 'steel 7,850 · stainless 8,000 · copper 8,940 · aluminium 2,700 · brass 8,500 · PVC 1,400 · HDPE 950 kg/m³ (typical)' },
    ],
    sources: [
      {
        label: 'Engineers Edge — Schedule 40 steel pipe dimensions (ASME B36.10M)',
        url: 'https://engineersedge.com/fluid_flow/steel-pipe-schedule-40.htm',
      },
      {
        label: 'Engineers Edge — Schedule 80 steel pipe dimensions (ASME B36.10M)',
        url: 'https://engineersedge.com/fluid_flow/steel-pipe-schedule-80.htm',
      },
      {
        label: 'The Engineering ToolBox — ASTM B88 seamless copper water tube dimensions',
        url: 'https://engineeringtoolbox.com/astm-copper-tubes-d_779.html',
      },
      { label: 'Material densities', note: 'typical handbook values; check the grade you are using' },
      NIST,
    ],
  },
  'board-and-batten-calculator': {
    formula: [
      'Battens at both edges: gap = (wall width − battens × batten width) ÷ (battens − 1)',
      'Gaps at both edges: gap = (wall width − battens × batten width) ÷ (battens + 1); inset: use wall width − 2 × margin with the both-edges formula',
      'From a target gap: battens = round((wall width − batten width) ÷ (batten width + target gap)) + 1, then every gap is made equal',
      'Mark for batten k (k = 0, 1, 2…) = start + k × (batten width + gap); on center = gap + batten width',
      'Batten length = wall height − top rail − baseboard; grid rail rows split that height into equal gaps',
      'Boards = cut list packed into the stock length (longer pieces joined), plus waste; siding boards = (wall + gap) ÷ (board + gap), rounded up; battens = boards − 1',
    ],
    defaults: [
      { label: 'Lumber widths', value: 'nominal 1×2 = 1½ in, 1×3 = 2½ in, 1×4 = 3½ in, 1×6 = 5½ in, 1×8 = 7¼ in, ¾ in thick (dry dressed sizes)' },
      { label: 'Target gap', value: '16 in to start — spacing is a style choice; compare counts in the tool' },
      { label: 'Stock length / waste', value: '8 ft boards, 10% waste' },
      { label: 'Adhesive and caulk', value: 'about 30 ft of ¼ in bead and 120 ft of ⅛ in bead per 10 oz tube (bead volume ÷ tube volume)' },
      { label: 'Paint', value: '350 sq ft per gallon, 2 coats, wall plus board edges' },
      { label: 'Nails', value: '2 brad nails every 16 in along each piece (working assumption)' },
    ],
    sources: [
      {
        label: 'American Softwood Lumber Standard, NIST Voluntary Product Standard PS 20',
        url: 'https://www.nist.gov/document/doc-ps-20-20-american-softwood-lumber-standard',
        note: 'nominal vs dry dressed lumber sizes',
      },
      {
        label: 'Southern Pine Inspection Bureau — Nominal vs actual lumber sizes',
        url: 'https://blog.spib.org/nominal-vs-actual-lumber-sizes/',
        note: 'a nominal 1×6 is ¾ in thick and 5½ in wide',
      },
      { label: 'Paint coverage', note: 'printed on the can; most interior paints list about 350–400 sq ft per gallon' },
      NIST,
    ],
  },
  'shingle-calculator': {
    formula: [
      'Slope factor = √(1 + (rise ÷ 12)²); roof area = (length + 2 × overhang) × (width + 2 × overhang) × slope factor',
      'Squares = roof area ÷ 100; bundles = squares × (1 + waste %) × bundles per square, rounded up',
      'Gable edges: eaves = 2 × length, rakes = 4 × half-width × slope factor, ridge = length. Hip: eaves all round, ridge = long − short side, hip = √(2 × run² + (run × rise ÷ 12)²)',
      'Starter bundles = (eaves + rakes) ÷ feet per bundle; ridge cap bundles = (ridge + hips) ÷ feet per bundle; drip edge pieces = (eaves + rakes) ÷ piece length — all rounded up',
      'Ice & water area = eaves × rows × 3 ft + valleys × 3 ft; underlayment rolls = (roof area − ice & water area) ÷ coverage per roll',
      'Nails = squares with waste × shingles per square × nails per shingle',
    ],
    defaults: [
      { label: 'Architectural shingles', value: '3 bundles and 64 pieces per square, 5⅝ in exposure (GAF Timberline HDZ data sheet)' },
      { label: '3-tab shingles', value: '12 × 36 in, 5 in exposure: 3 bundles and 80 shingles per square (Owens Corning Supreme)' },
      { label: 'Starter strip / ridge cap', value: '105 ft per starter bundle (OC Starter Strip Plus); 33 ft per hip & ridge bundle (OC ProEdge, 6 in exposure)' },
      { label: 'Underlayment', value: 'synthetic ≈ 1,000 sq ft, #15 felt ≈ 400 sq ft, #30 felt ≈ 200 sq ft per roll after laps; ice & water barrier 200 sq ft (36 in × 66.7 ft) per roll' },
      { label: 'Waste', value: '10% simple gable, 15% hip, 20% complex roofs — typical trade allowances, not a standard; change them to suit your roof' },
      { label: 'Nails', value: '4 per shingle (6 in high-wind areas when the wrapper calls for it)' },
    ],
    sources: [
      {
        label: 'GAF Timberline HDZ shingles specification sheet',
        url: 'https://www.gaf.com/en-us/document-library/documents/specifications/timberline-hdz-shingles-spec-sheet-resgn467hdz.pdf',
        note: 'exposure 5⅝ in, 3 bundles and 64 pieces per square',
      },
      {
        label: 'Owens Corning Supreme shingles product page',
        url: 'https://owenscorning.com/roofing/shingles/supreme',
        note: '12 × 36 in at 5 in exposure: 80 shingles and 3 bundles per 100 sq ft square',
      },
      {
        label: 'Owens Corning Starter Strip Plus product page',
        url: 'https://owenscorning.com/roofing/products/starter-strip-plus',
        note: 'about 105 lineal feet per bundle',
      },
      {
        label: 'Owens Corning ProEdge Hip & Ridge data sheet',
        url: 'https://www.owenscorning.com/en/documents/uploads/proedge-hip-and-ridge-shingle-data-sheet',
        note: '33 ft of coverage per bundle at 6 in exposure',
      },
      { label: 'Underlayment roll coverage', note: 'typical net coverage printed on roll labels; check your product' },
      NIST,
    ],
  },
  'lawn-mowing-cost-calculator': {
    formula: [
      'Acres per hour = mower width (ft) × speed (mph) × 5,280 × efficiency ÷ 43,560',
      'Mowing minutes = acres ÷ acres per hour × 60 × grass × slope × obstacle × frequency factors',
      'Minutes per visit = mowing + extras (trim, edge, blow, bagging) + setup + drive time',
      'Price per visit = the larger of the minimum charge and minutes ÷ 60 × hourly rate',
      'Visits = season weeks × 7 ÷ days between cuts (rounded); season = price per visit × visits; month = season ÷ (weeks ÷ 4.33)',
    ],
    defaults: [
      { label: 'Hourly rate', value: '$50 (presets $32 / $50 / $68), inside the $30–$68 per hour range published by Jobber and Housecall Pro in 2026' },
      { label: 'Minimum charge', value: '$35, near the low end of published per-visit prices for the smallest lawns; set your own' },
      { label: 'Drive + setup time', value: '12 + 8 minutes per visit (working assumption)' },
      { label: 'Mowers', value: '21 in push 3 mph · 36 in walk-behind 4 mph · 48 in / 60 in zero-turn 6 / 7 mph; 75–80% efficiency (working assumptions)' },
      { label: 'Condition factors', value: 'long grass ×1.25, overgrown ×1.5; some slope ×1.15, steep ×1.35; some obstacles ×1.1, many ×1.25; every 10 days ×1.1, every 2 weeks ×1.2, monthly ×1.4 (working assumptions)' },
      { label: 'Season', value: '30 weeks (about April–October)' },
    ],
    sources: [
      {
        label: 'Jobber Academy — How much to charge for lawn mowing (updated March 2026)',
        url: 'https://getjobber.com/academy/lawn-care/how-to-price-out-lawn-care-services/',
        note: '“between $30 and $65 per hour for lawn care”',
      },
      {
        label: 'Housecall Pro — How much to charge for lawn mowing (updated October 2026)',
        url: 'https://www.housecallpro.com/resources/how-much-charge-lawn-mowing/',
        note: '“$32–$68 per hour for lawn mowing”; per-visit ranges by lawn size used to check the model',
      },
      {
        label: 'Mower productivity and condition factors',
        note: 'no single published standard; the physics (width × speed) is exact, the efficiency and factors are working assumptions — change them to match your crew',
      },
      NIST,
    ],
  },
  'deck-stain-calculator': {
    formula: [
      'Floor = Σ length × width; board edges (optional) = floor × 2 × board thickness ÷ (board width + gap)',
      'Railing (detailed) = posts × 4 × post width × height + rails × (2 × width + 2 × thickness) × length + balusters × 4 × width (or π × diameter) × (height − rail thicknesses); balusters = length ÷ (width + gap); posts = length ÷ spacing + 1',
      'Railing (quick) = length × height × 2 faces',
      'Stairs = steps × width × (tread + riser) + visible stringers × 2 faces × stringer length × depth',
      'Coat 1 (gal) = area ÷ (label coverage × wood factor); coat 2 = area ÷ (coat-1 coverage × second-coat factor)',
      'To buy = (coat 1 + coat 2) × (1 + extra %), split into 5-gallon pails and 1-gallon cans (or 5 L, 2.5 L and 1 L tins)',
      'DIY = stain + cleaner; pro = stain + labour × area + prep × area',
    ],
    defaults: [
      { label: 'Coverage, 1st coat', value: 'transparent 300, semi-transparent 250, solid 250 ft²/gal — low end of the BEHR PREMIUM ranges (300–350, 250–300, 200–400)' },
      { label: 'Second coat', value: '1.5× the first-coat coverage — between TWP (about 1.3–1.5×) and BEHR (about 2×)' },
      { label: 'Wood condition', value: 'smooth × 1.0; weathered × 0.8 (working assumption); rough-sawn × 0.62 (Duckback SuperDeck rough 175–225 vs smooth 275–375)' },
      { label: 'Extra allowance', value: '10% brush, roller or pad; 15% sprayer (working assumptions — editable)' },
      { label: 'Railing', value: '36 in high (IRC minimum guard height for most decks), 4×4 posts every 6 ft, two 2×4 rails, 2×2 balusters with gaps under 4 in (IRC R312)' },
      { label: 'Stain price', value: '$45 per gallon (Fixr: $25–$90 by type and brand)' },
      { label: 'Deck cleaner', value: '250 ft²/gal ready to use (Olympic: 250–350); $17/gal (Fixr brightener $16–$18)' },
      { label: 'Pro rates', value: 'labour $1.50/ft² (Angi 2026: $1–$2.50); washing $0.35, stripping $2, sanding $2.50 per ft² (Fixr)' },
    ],
    sources: [
      {
        label: 'BEHR PREMIUM Semi-Transparent Waterproofing Stain & Sealer (No. 5077) — product page and technical data sheet',
        url: 'https://www.behr.com/products/wood-stains/behr-premium-semi-transparent-waterproofing-stain-and-sealer',
        note: '1st coat 250–300 ft²/gal, thinner 2nd coat 500–600 ft²/gal; two thin coats',
      },
      {
        label: 'BEHR PREMIUM Solid Color Waterproofing Stain & Sealer (No. 5011) — technical data sheet',
        url: 'https://images.thdstatic.com/catalog/pdfImages/d5/d5da37ed-6793-4b75-8cb3-dcde8c8d6849.pdf',
        note: '200–400 ft²/gal depending on application method and porosity; product page: 2nd coat 400–800',
      },
      {
        label: 'BEHR PREMIUM Transparent Waterproofing Wood Finish (No. 500)',
        url: 'https://www.behr.com/pro/products/exterior-products/exterior-wood-stains-and-finishes/wood-stains-and-finishes/behr-premium-transparent-waterproofing-wood-finish',
        note: '1st coat 300–350 ft²/gal, 2nd coat 600–700 ft²/gal',
      },
      {
        label: 'Duckback SuperDeck semi-transparent stain — retailer product data (True Value)',
        url: 'https://www.truevalue.com/product/780642/duckback-superdeck-semi-transparent-exterior-stain-redwood-1-gal-780642/',
        note: 'smooth 275–375 ft²/gal, rough 175–225 ft²/gal',
      },
      {
        label: 'Olympic Exterior Deck Cleaner — product page',
        url: 'https://olympic.com/products/specialty/premium-deck-cleaner',
        note: 'about 250–350 ft² per gallon',
      },
      {
        label: 'Angi — How Much Does It Cost to Stain a Deck? (2026 data)',
        url: 'https://www.angi.com/articles/how-much-does-it-cost-stain-deck.htm',
        note: 'labour about $1–$2.50 per ft²',
      },
      {
        label: 'Fixr — Cost to Stain a Deck (updated Jan 31, 2025)',
        url: 'https://www.fixr.com/costs/stain-deck',
        note: 'stain $25–$90 per gallon; washing, stripping, sanding and brightener costs',
      },
      {
        label: 'International Residential Code (IRC) R312 — Guards',
        url: 'https://codes.iccsafe.org/content/IRC2021P1/chapter-3-building-planning',
        note: '36 in minimum guard height for most residential decks; openings must not pass a 4 in sphere',
      },
    ],
  },
  'fence-stain-calculator': {
    formula: [
      'Area = fence length × height × sides × style multiplier (board-on-board, shadowbox, etc.)',
      'Coat 1 gallons = area ÷ coverage for your wood; coat 2 uses 1.3 × that coverage',
      'Add 10% for brush / roller or 15% for a sprayer; split into 5-gallon pails and 1-gallon cans',
    ],
    defaults: [
      { label: 'Coverage per gallon (coat 1)', value: 'rough-sawn 175 · weathered 150 · smooth-planed 225 ft²' },
      { label: 'Second coat', value: 'covers about 30% more area per gallon' },
    ],
    sources: [{ label: 'Coverage printed on stain can labels', note: 'rough and weathered wood absorbs more; use your product’s range' }],
  },
  'percentage-change-calculator': {
    formula: [
      'Percentage change = ((new value − old value) ÷ |old value|) × 100 (undefined if old value = 0)',
      'Percentage difference (symmetric) = (|a − b| ÷ ((|a| + |b|) ÷ 2)) × 100',
      'Increase/decrease by %: result = original × (1 ± percentage ÷ 100)',
      'Reverse percentage (find original): original = final ÷ (1 ± percentage ÷ 100)',
      'Percentage points (pp) = rate B − rate A; relative change = ((rate B − rate A) ÷ |rate A|) × 100',
      'Excel formula for cell % change: =(B2-A2)/ABS(A2) formatted with Percentage style',
    ],
    defaults: [
      { label: 'Baseline Old / New example', value: '80 → 100 (+25.00% increase); 100 → 80 (−20.00% decrease)' },
      { label: 'Symmetric Difference example', value: 'Between 80 and 100 = 22.22% difference' },
      { label: 'Percentage Points example', value: 'From 4% to 5% = +1.00 pp change, but +25.00% relative surge' },
    ],
    sources: [
      {
        label: 'National Institute of Standards and Technology (NIST) Reference on Relative Difference',
        url: 'https://www.nist.gov/',
        note: 'Standard mathematical definitions for relative error, percent change, and symmetric percent difference',
      },
      {
        label: 'Microsoft Excel Formula Documentation — Format numbers as percentages',
        url: 'https://support.microsoft.com/en-us/office/format-numbers-as-percentages-6240f280-fd42-4f5b-90c5-4654562a0123',
        note: 'Explains that Excel percentage format automatically multiplies cell values by 100',
      },
    ],
  },
  'markup-calculator': {
    formula: [
      'Selling Price = Cost × (1 + (Markup % ÷ 100))',
      'Markup % = ((Selling Price − Cost) ÷ Cost) × 100',
      'Gross Margin % = ((Selling Price − Cost) ÷ Selling Price) × 100',
      'Multiplier = Selling Price ÷ Cost (Keystone = 2.0× multiplier = 100% markup = 50% margin)',
      'Fee-Adjusted Price = (Landed Cost × (1 + Markup % ÷ 100)) ÷ (1 − Platform Fee % ÷ 100)',
      'Tax-Inclusive Price = Price (ex-tax) × (1 + Tax Rate % ÷ 100)',
    ],
    defaults: [
      { label: 'Default Benchmark Scenario', value: '$40.00 cost with 50.00% markup = $60.00 selling price ($20.00 profit, 33.33% margin)' },
      { label: 'Keystone Pricing Benchmark', value: '$100.00 cost with 100.00% markup = $200.00 selling price (2.0× multiplier, 50.00% margin)' },
      { label: 'Supply Chain Multiplier', value: 'Factory $10.00 → Wholesaler $20.00 (100% markup) → Retailer $40.00 (100% markup) = 4.0× consumer multiplier' },
    ],
    sources: [
      {
        label: 'HM Revenue & Customs (HMRC) — VAT Rates & Guidance',
        url: 'https://www.gov.uk/vat-rates',
        note: 'Official UK guidance establishing that VAT (20%) is appended to the net ex-tax taxable supply',
      },
      {
        label: 'Australian Taxation Office (ATO) — Goods and Services Tax (GST)',
        url: 'https://www.ato.gov.au/business/gst/',
        note: 'Official guidance on applying 10% GST to taxable sales',
      },
      {
        label: 'New Zealand Inland Revenue (Te Tari Taake) — GST for Businesses',
        url: 'https://www.ird.govt.nz/gst',
        note: 'Official New Zealand reference for standard 15% GST on taxable retail sales',
      },
      {
        label: 'National Institute of Standards and Technology (NIST) — Commercial Metric & Pricing Standards',
        url: 'https://www.nist.gov/',
        note: 'Standards on rounding, commercial measurements, and price unit labeling',
      },
    ],
  },
  'profit-margin-calculator': {
    formula: [
      'Gross Margin % = ((Revenue − COGS) ÷ Revenue) × 100',
      'Operating Margin (EBIT) % = ((Gross Profit − OPEX) ÷ Revenue) × 100',
      'EBITDA Margin % = ((Operating Profit + D&A) ÷ Revenue) × 100',
      'Net Profit Margin % = (Net Income ÷ Total Revenue) × 100',
      'Price for Target Margin = Cost ÷ (1 − (Target Margin % ÷ 100))',
      'Blended Margin % = (Total Portfolio Profit ÷ Total Portfolio Revenue) × 100 (never arithmetic average)',
    ],
    defaults: [
      { label: 'Standard Retail Benchmark', value: '$100.00 revenue with $60.00 COGS = $40.00 gross profit (40.00% gross margin, 66.67% markup)' },
      { label: 'Full P&L Cascade Benchmark', value: '$100,000 revenue → $60,000 COGS (40% gross) → $20,000 OPEX (20% operating) → $13,500 net income (13.50% net margin)' },
      { label: 'Target Margin Price Example', value: '$60.00 cost with 40.00% target margin requires $100.00 selling price' },
    ],
    sources: [
      {
        label: 'NYU Stern School of Business — Margins by Sector (US) Dataset (Prof. Aswath Damodaran)',
        url: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html',
        note: 'Authoritative annual corporate finance dataset benchmarking gross, operating, and net profit margins across US industries',
      },
      {
        label: 'Financial Accounting Standards Board (FASB) — Conceptual Framework for Financial Reporting',
        url: 'https://www.fasb.org/',
        note: 'Standard definitions for revenue recognition, cost of goods sold, operating expenses, and net income',
      },
      {
        label: 'HM Revenue & Customs (HMRC) — Business Profits, Turnover & Allowances',
        url: 'https://www.gov.uk/',
        note: 'Official guidance on computing UK commercial gross profit (GP) and net taxable profit',
      },
    ],
  },
  'construction-estimate-template': {
    formula: [
      'Line total = quantity × unit price',
      'Subtotal = sum of line totals; markup = subtotal × markup %',
      'Tax = taxable amount × tax %; grand total = subtotal + markup + tax',
    ],
    defaults: [{ label: 'Markup and tax', value: 'you enter your own rates; nothing is preset for your area' }],
    sources: [{ label: 'Plain arithmetic', note: 'no outside data; check tax rules for your state or country' }],
  },
};
