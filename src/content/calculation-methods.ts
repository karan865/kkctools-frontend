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
        note: 'January 2026 update (checked 2026-11-18): aggregate gross, operating and net margins for US-listed companies by industry; used for the "good profit margin" table',
      },
    ],
  },
  'unit-price-calculator': {
    formula: [
      'Unit Price = Effective Price ÷ Total Standard Quantity',
      'Total Standard Quantity = Pack Count × Size per Item × Conversion Factor',
      'NIST Exact Equivalents: 1 lb = 16 oz = 453.59237 g; 1 US gal = 128 fl oz = 3785.411784 ml',
      'Relative Price Difference % = ((Unit Price − Lowest Unit Price) ÷ Lowest Unit Price) × 100',
      'Shrinkflation Hidden Price Hike % = ((New Unit Price ÷ Old Unit Price) − 1) × 100',
      'Seller Cost per Unit = Batch Total Production Cost ÷ Units Produced',
      'Shelf-Tag Standard Unit Price = Cost per Unit ÷ (Package Size in Grams ÷ 1000) [for per kg]',
    ],
    defaults: [
      { label: 'Coffee Bag Benchmark', value: '12 oz bag at $8.99 ($0.7492/oz) vs 32 oz bag at $18.49 ($0.5778/oz) vs 2-pack 16 oz at $17.99 ($0.5622/oz — 24.96% cheaper than 12 oz bag)' },
      { label: 'Shrinkflation Benchmark', value: '16 oz pack downsized to 14.2 oz at unchanged $4.99 price = 11.25% size drop, causing a 12.68% hidden price hike per oz' },
      { label: 'Seller Shelf-Tag Benchmark', value: '$240.00 batch cost producing 80 units of 250 g net each = $3.00/unit cost ($12.00/kg shelf tag, $1.20/100g)' },
    ],
    sources: [
      {
        label: 'National Institute of Standards and Technology (NIST) Handbook 130 — Uniform Unit Pricing Regulation',
        url: 'https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-130',
        note: 'US standard for uniform retail price display per standard unit (ounce, pound, gallon, liter)',
      },
      {
        label: 'The Price Marking Order 2004 (UK Statutory Instruments 2004 No. 102)',
        url: 'https://www.legislation.gov.uk/uksi/2004/102/contents/made',
        note: 'UK law governing mandatory unit pricing per kilogram, litre, and 100g/ml for retail traders',
      },
      {
        label: 'Directive 98/6/EC of the European Parliament and of the Council on Consumer Protection in Price Indication',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:31998L0006',
        note: 'European Union legal framework for unit price indication on goods sold to consumers',
      },
    ],
  },
  'hourly-to-salary-calculator': {
    formula: [
      'Annual Regular Gross = Hourly Rate × Paid Hours per Year',
      'Paid Hours per Year = (Hours/Week × Weeks/Year) − (Unpaid Days × Hours/Day)',
      'Annual Overtime Gross = OT Hours/Week × Hourly Rate × Overtime Multiplier × Weeks/Year',
      'Total Annual Gross = Annual Regular Gross + Annual Overtime Gross',
      'Derived Periods: Monthly = Annual ÷ 12; Biweekly = Annual ÷ 26; Semi-Monthly = Annual ÷ 24; Weekly = Annual ÷ Weeks/Year',
      'Effective Hourly Worked = Total Annual Gross ÷ Actual Worked Hours (excluding paid leave)',
    ],
    defaults: [
      { label: 'Standard US Work Year', value: '$25.00/hr × 40 hrs/wk × 52 wks = $52,000.00 annual gross (2,080 working hours, $4,333.33/mo, $2,000.00 biweekly)' },
      { label: 'Overtime Workweek Benchmark', value: '$20.00/hr with 5 OT hrs/wk at 1.5× = $41,600 regular + $7,800 OT = $49,400.00 total annual gross' },
      { label: 'Biweekly vs Semi-Monthly', value: '$52,000 annual salary yields $2,000.00 biweekly (26 paychecks) vs $2,166.67 semi-monthly (24 paychecks)' },
    ],
    sources: [
      {
        label: 'US Department of Labor (DOL) — Fair Labor Standards Act (FLSA) Overtime Pay Requirements',
        url: 'https://www.dol.gov/agencies/whd/overtime',
        note: 'Official US federal regulation mandating 1.5x overtime pay for hours worked over 40 per workweek',
      },
      {
        label: 'US Office of Personnel Management (OPM) — Computing Hourly Rates of Pay (2,087-Hour Factor)',
        url: 'https://www.opm.gov/policy-data-oversight/pay-leave/pay-administration/fact-sheets/computing-hourly-rates-of-pay-using-the-2087-hour-divisor/',
        note: 'Statutory basis for converting annual federal employee salaries to hourly pay',
      },
      {
        label: 'UK Government Legislation — The Working Time Regulations 1998 (SI 1998/1833)',
        url: 'https://www.legislation.gov.uk/uksi/1998/1833/contents/made',
        note: 'Statutory framework for maximum working hours, rest breaks, and annual paid holiday entitlement in the UK',
      },
    ],
  },
  'discount-calculator': {
    formula: [
      'Sale Price = Original Price × (1 − Discount% ÷ 100)',
      'Dollar Savings = Original Price − Sale Price = Original Price × (Discount% ÷ 100)',
      'Stacked Discounts: Effective% = [1 − (1 − d₁) × (1 − d₂)] × 100',
      'Reverse Mode: Original Price = Sale Price ÷ (1 − Discount% ÷ 100)',
      'Discount Rate from Two Prices: Discount% = ((Original − Sale) ÷ Original) × 100',
      'BOGO Free Effective Rate = 50.00%; Buy X Get Y Free Effective Rate = (Y ÷ (X + Y)) × 100%',
    ],
    defaults: [
      { label: 'Standard Retail Markdown', value: '$100.00 at 20% off = $80.00 final sale price ($20.00 saved)' },
      { label: 'Stacked Clearance Promo', value: '20% off followed by an extra 10% coupon = $72.00 sale price (effective 28.00% discount, not 30%)' },
      { label: 'BOGO Buy One Get One Free', value: 'Two $40.00 items for $40.00 total = $20.00/unit (exact 50.00% discount)' },
    ],
    sources: [
      {
        label: 'Federal Trade Commission (FTC) — Guides Against Deceptive Pricing (16 CFR Part 233)',
        url: 'https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/guides-against-deceptive-pricing',
        note: 'US federal statutory guidelines for former price comparisons, promotional discounting, and bargain retail offers',
      },
      {
        label: 'UK Price Marking Order 2004 (SI 2004/102) & Chartered Trading Standards Institute (CTSI)',
        url: 'https://www.legislation.gov.uk/uksi/2004/102/contents/made',
        note: 'Statutory requirements governing promotional price reductions, comparison prices, and genuine discount transparency',
      },
    ],
  },
  'cap-rate-calculator': {
    formula: [
      'Cap Rate % = (Net Operating Income (NOI) ÷ Purchase Price) × 100',
      'Commercial Property Value = Net Operating Income (NOI) ÷ (Market Cap Rate % ÷ 100)',
      'Required Net Operating Income = Purchase Price × (Target Cap Rate % ÷ 100)',
      'Net Operating Income (NOI) = (Gross Potential Rent + Other Income − Vacancy Loss) − Operating Expenses',
      'Gross Rent Multiplier (GRM) = Purchase Price ÷ Annual Gross Rent',
      'Price to NOI Multiple = Purchase Price ÷ NOI = 1 ÷ (Cap Rate % ÷ 100)',
    ],
    defaults: [
      { label: 'Baseline Multi-Family Example', value: '10 units at $1,500/mo ($180k gross) with $3k other income, 5% vacancy ($9k), and $46,440 expenses = $127,560 NOI' },
      { label: 'Cap Rate Yield', value: '$127,560 NOI on a $2,400,000 acquisition = 5.32% capitalization rate' },
      { label: 'Valuation at 7% Cap', value: '$127,560 NOI capitalized at 7.00% = $1,822,286 estimated property value' },
    ],
    sources: [
      {
        label: 'Appraisal Institute — The Appraisal of Real Estate (15th Edition)',
        url: 'https://www.appraisalinstitute.org/',
        note: 'Income Capitalization Approach standards, direct capitalization formulas, and NOI normalization guidelines',
      },
      {
        label: 'CCIM Institute — Foundations for Success in Commercial Real Estate',
        url: 'https://www.ccim.com/',
        note: 'Standard commercial underwriting methodologies for capitalization rate, debt yield, and debt service coverage ratios',
      },
    ],
  },
  'rental-property-calculator': {
    formula: [
      'Cash-on-Cash Return % = (Annual Net Cash Flow ÷ Total Cash Invested) × 100',
      'Annual Net Cash Flow = Net Operating Income (NOI) − Annual Debt Service (Mortgage P&I)',
      'Net Operating Income (NOI) = Effective Gross Income (Gross Rent − Vacancy Loss + Other Income) − Total Operating Expenses',
      'Total Operating Expenses = Property Tax + Hazard Insurance + HOA + Utilities + Maintenance + CapEx Reserves + Property Management Fee',
      'Total Cash Invested = Down Payment + Closing Costs + Upfront Repairs + Loan Points',
      'Capitalization Rate (Cap Rate) % = (Net Operating Income (NOI) ÷ Purchase Price) × 100',
      'Debt Service Coverage Ratio (DSCR) = Net Operating Income (NOI) ÷ Annual Debt Service',
      'Gross Rental Yield % = (Annual Gross Rent ÷ Purchase Price) × 100',
      'Break-Even Occupancy % = (Fixed Expenses + Debt Service + Variable Gross % × Gross Rent) ÷ [(1 − Management %) × Gross Rent]',
    ],
    defaults: [
      { label: 'Baseline Single/Multi-Family Example', value: '$250,000 purchase price, 25% down ($62,500), 7.0% 30-year fixed loan ($1,247.44/mo payment)' },
      { label: 'Rental Income & Vacancy', value: '$2,400/mo gross rent ($28,800/yr), 5% vacancy allowance ($1,440/yr), Effective Gross Income $27,360/yr' },
      { label: 'Operating Expenses', value: '$3,000 tax + $1,400 ins + $1,440 maint (5%) + $1,440 capex (5%) + $2,188.80 mgmt (8% of EGI) = $9,468.80/yr' },
      { label: 'NOI & Cash Flow Yields', value: 'NOI $17,891.20/yr, Debt Service $14,969.31/yr, Net Cash Flow $2,921.89/yr ($243.49/mo) on $75,000 invested = 3.90% Cash-on-Cash return, 7.16% Cap Rate, 1.20× DSCR' },
    ],
    sources: [
      {
        label: 'Internal Revenue Service (IRS) — Publication 527: Residential Rental Property',
        url: 'https://www.irs.gov/publications/p527',
        note: 'Federal tax guidelines defining rental income recognition, deductible operating expenses, repairs vs capital improvements, and mortgage interest deductions',
      },
      {
        label: 'National Association of Residential Property Managers (NARPM) — Standards of Professionalism',
        url: 'https://www.narpm.org/',
        note: 'Residential property management fee standards, maintenance budgeting benchmarks, and tenant vacancy allowances',
      },
    ],
  },
  'labor-cost-calculator': {
    formula: [
      'Total Annual Cost = Gross Wages + Social Security + Medicare + FUTA + SUTA + Workers Comp + Liability Ins + Benefits',
      'Social Security (OASDI) = min(Gross Wages, $184,500) × 6.2% [2026 IRS / SSA limit]',
      'Medicare (Hospital Insurance) = Gross Wages × 1.45% [no wage limit]',
      'FUTA (Federal Unemployment) = min(Gross Wages, $7,000) × 0.6% effective rate',
      'SUTA (State Unemployment) = min(Gross Wages, State Wage Base) × State Experience Rate',
      'Workers Compensation = (Gross Wages ÷ 100) × Trade Rate per $100',
      'Labor Burden % = [(Total Annual Cost − Gross Wages) ÷ Gross Wages] × 100',
      'Productive Working Hours = Paid Hours − (Paid Holidays + Vacation/PTO + Sick Leave + Training)',
      'Burdened Rate per Productive Hour = Total Annual Cost ÷ Productive Working Hours',
      'Client Job Quote (Markup) = Direct Costs × (1 + Overhead %) × (1 + Profit %)',
      'Client Job Quote (Margin) = (Direct Costs × (1 + Overhead %)) ÷ (1 − Profit %)',
      'Labor Cost % of Revenue = (Total Annual Labor Cost ÷ Gross Annual Revenue) × 100',
    ],
    defaults: [
      { label: 'Standard Full-Time Employee', value: '$30.00/hr wage, 2,080 paid hours ($62,400 gross wages)' },
      { label: 'Time Off Deductions', value: '80 hrs holidays (10 days) + 80 hrs PTO (10 days) = 160 hrs off (1,920 productive hours)' },
      { label: 'Payroll Taxes (2026)', value: '6.2% SS ($3,868.80) + 1.45% Medicare ($904.80) + 0.6% FUTA ($42.00) + 2.0% SUTA ($200.00) = $5,015.60/yr' },
      { label: 'Insurance & Benefits', value: 'Workers comp $3,120.00 ($5/$100) + Benefits $6,000.00 = $9,120.00/yr' },
      { label: 'Burdened Labor Rates', value: 'Total Cost $76,535.60/yr (+22.65% burden) = $36.80 per paid hour, $39.86 per productive billable hour' },
    ],
    sources: [
      {
        label: 'Internal Revenue Service (IRS) — Publication 15 (Circular E), Employer Tax Guide',
        url: 'https://www.irs.gov/publications/p15',
        note: 'Official federal tax rates for employer Social Security matching, Medicare matching, and Federal Unemployment Tax Act (FUTA) rules',
      },
      {
        label: 'Social Security Administration (SSA) — Contribution and Benefit Base Updates',
        url: 'https://www.ssa.gov/oact/cola/cbb.html',
        note: 'Annual statutory maximum wage base subject to Social Security tax ($184,500 for 2026)',
      },
      {
        label: 'U.S. Department of Labor (DOL) — Fair Labor Standards Act (FLSA)',
        url: 'https://www.dol.gov/agencies/whd/overtime',
        note: 'Federal requirements for 1.5× overtime pay for non-exempt employees working beyond 40 hours per workweek',
      },
    ],
  },
  'commercial-lease-calculator': {
    formula: [
      'Rentable Area (RSF) = Usable Area (USF) × (1 + Load Factor % ÷ 100)',
      'Annual Base Rent (Year 1) = Rentable Area × Base Rate ($/SF/year)',
      'Monthly Base Rent = Annual Base Rent ÷ 12',
      'Annual NNN Pass-Throughs = Rentable Area × (Tax Rate + Insurance Rate + CAM Rate + Utilities Rate)',
      'Monthly Total Occupancy Cost = Monthly Base Rent + Monthly NNN Pass-Throughs',
      'Escalation (Fixed %): Year(n) Base Rent = Year(n-1) Base Rent × (1 + Escalation % ÷ 100)',
      'Escalation (Fixed Step): Year(n) Base Rate = Year(n-1) Base Rate + Step Amount $/SF',
      'Free Rent Concession = Number of Free Months × (Monthly Base Rent + [Monthly NNN if applicable])',
      'TI Allowance Value = Rentable Area × TI Allowance $/SF',
      'Net Total Lease Cost = Sum of All Scheduled Rent − Free Rent Value − TI Allowance',
      'Net Effective Rent ($/SF/yr) = (Sum of Base Rent − Free Rent − TI Allowance) ÷ (Rentable Area × Lease Years)',
      'Tenant CAM Share % = (Tenant Rentable Area ÷ Building Total Rentable Area) × 100',
      'Tenant CAM Annual Amount = Building CAM Total × (Tenant CAM Share % ÷ 100)',
      'Percentage Rent Overage = max(0, Gross Annual Sales − Natural Breakpoint) × Percentage Rent %',
      'Natural Breakpoint = Annual Base Rent ÷ (Percentage Rent % ÷ 100)',
    ],
    defaults: [
      { label: 'Suite Dimensions', value: '2,000 Usable Sq Ft (USF) with 15% building core load factor = 2,300 Rentable Sq Ft (RSF)' },
      { label: 'Lease Terms', value: '5-year lease term, Triple Net (NNN) lease structure' },
      { label: 'Rental Rates', value: '$24.00/SF/yr base rent ($4,600/mo) + $8.00/SF/yr NNN pass-throughs ($1,533.33/mo) = $6,133.33/mo total' },
      { label: 'NNN Breakdown', value: 'Property Tax $3.00/SF/yr, Building Insurance $1.00/SF/yr, CAM $4.00/SF/yr' },
      { label: 'Escalations & Concessions', value: '3.0% annual base rent escalation, 2 months free base rent (-$9,200), $10.00/SF TI allowance ($23,000)' },
      { label: '5-Year Benchmark Results', value: 'Total net lease cost: $375,864.30 ($6,264.40/mo average); Net effective rent: $22.68/SF/year' },
    ],
    sources: [
      {
        label: 'Building Owners and Managers Association (BOMA) International — Standard Methods of Floor Measurement (ANSI/BOMA Z65.1)',
        url: 'https://www.boma.org/',
        note: 'Industry standard methodologies for measuring usable area (USF), common area allocation, and building load factors',
      },
      {
        label: 'CCIM Institute (Certified Commercial Investment Member) — Commercial Real Estate Lease Analysis Standards',
        url: 'https://www.ccim.com/',
        note: 'Financial modeling formulas for net effective rent, lease concessions, expense pass-through reconciliations, and escalation schedules',
      },
      {
        label: 'International Council of Shopping Centers (ICSC) — Retail Lease Benchmark Guidelines',
        url: 'https://www.icsc.com/',
        note: 'Retail lease standards for natural breakpoints, percentage rent calculations, and CAM pro-rata allocations',
      },
    ],
  },
  'airbnb-calculator': {
    formula: [
      'Booked Nights = Nights Available × (Occupancy % ÷ 100)',
      'Stays Count = Booked Nights ÷ Average Stay Duration (Nights)',
      'Gross Operating Revenue = (Booked Nights × Nightly ADR) + (Stays Count × Cleaning Fee Charged) + Other Income',
      'Platform Host Fees = Gross Revenue × (Host Fee % + Payment Processing %)',
      'Turnover Variable Expenses = (Stays Count × Cleaning Cost) + (Stays Count × Supplies) + Management Fees + Maintenance Reserve',
      'Fixed Operating Expenses = 12 × (Utilities + Internet + STR Insurance + Software + HOA) + Permits + Property Taxes',
      'Net Operating Income (NOI) = Gross Revenue − Platform Fees − Variable Costs − Fixed Costs − Remitted Lodging Taxes',
      'Net Cash Flow = NOI − Annual Debt Service (or Master Lease Arbitrage Rent)',
      'RevPAR (Revenue Per Available Night) = Nightly Rate (ADR) × (Occupancy % ÷ 100)',
      'Cash-on-Cash Return (%) = (Annual Cash Flow ÷ Total Capital Invested) × 100',
      'Break-Even Occupancy (%) = [Total Fixed Burden ÷ (Nights Available × Contribution Margin Per Night)] × 100',
      'Contribution Margin Per Night = (ADR + Cleaning Fee ÷ Avg Stay) × (1 − Total % Deductions) − (Cleaning Cost + Supplies) ÷ Avg Stay',
      'Furniture Payback Period (Months) = Setup & Furnishing Capital ÷ Monthly Net Cash Flow',
    ],
    defaults: [
      { label: 'Booking Assumptions', value: '365 nights available, 65.0% annual occupancy (237.25 booked nights), 3-night average stay (79.08 stays)' },
      { label: 'Pricing & Revenue', value: '$180.00/night ADR, $90.00 cleaning fee charged to guest ($49,822.50 gross annual revenue)' },
      { label: 'Platform & Operating Fees', value: '3.0% platform host fee ($1,494.68), $80.00 cleaner fee ($6,326.67), $10.00 supplies ($790.83), 5% maintenance ($2,491.13)' },
      { label: 'Fixed Monthly Overhead', value: '$250/mo utilities ($3,000/yr), $60/mo internet ($720/yr), $150/mo commercial STR insurance ($1,800/yr) = $5,520/yr' },
      { label: 'Financing & Bottom Line', value: '$1,800/mo mortgage ($21,600/yr); NOI: $33,199.20/yr; Net cash flow: $11,599.20/yr ($966.60/month)' },
      { label: 'Return Metrics', value: '15.47% cash-on-cash return on $75,000 total capital ($60k down/closing + $15k furniture); 45.53% break-even occupancy hurdle' },
    ],
    sources: [
      {
        label: 'AirDNA — Short-Term Rental Industry Metrics & Terminology',
        url: 'https://www.airdna.co/blog/str-terminology-cheat-sheet',
        note: 'Hospitality underwriting definitions for ADR, RevPAR, seasonality, and occupancy calculations',
      },
      {
        label: 'American Hotel & Lodging Association (AHLA) — Lodging Operations Standards',
        url: 'https://www.ahla.com/',
        note: 'Hospitality benchmarks for room turnover costs, guest amenities replenishment, and transient lodging taxes',
      },
      {
        label: 'National Association of Realtors (NAR) — Vacation & Short-Term Rental Investment Guide',
        url: 'https://www.nar.realtor/',
        note: 'Investment guidelines for debt service coverage, commercial STR insurance, and comparison with traditional 12-month tenant leases',
      },
    ],
  },
  'freelance-rate-calculator': {
    formula: [
      'Weeks Worked = 52 − (Vacation Weeks + Holidays Weeks + Sick Weeks + Professional Development Weeks)',
      'Total Annual Hours = Weeks Worked × Days per Week × Hours per Day',
      'Billable Hours = Total Annual Hours × (Billable % ÷ 100)',
      'Total Target Revenue = Desired Net Income + Annual Business Overhead + Benefits (Health/Retirement) + Self-Employment & Income Taxes',
      'Break-Even Hourly Rate = Total Target Revenue ÷ Billable Hours',
      'Recommended Hourly Rate = Break-Even Rate × (1 + Profit Buffer % ÷ 100)',
      'Day Rate = Recommended Hourly Rate × Hours per Day',
      'Weekly Retainer = Recommended Hourly Rate × Hours per Day × Days per Week × (Billable % ÷ 100)',
      'Project Quote = (Estimated Project Hours × Hourly Rate) + Direct Expenses + (Subtotal × Scope Creep Buffer %)',
      'US SE Tax Helper = Net Earnings × 92.35% × 15.3% (with SS wage cap applied)',
    ],
    defaults: [
      { label: 'Income Target', value: '$70,000 desired annual net take-home pay' },
      { label: 'Working Calendar', value: '52 weeks: 3 wks vacation, 10 holidays (2 wks), 1 wk sick, 1 wk training = 45 worked weeks (1,800 total hrs at 40 hrs/wk)' },
      { label: 'Billability Benchmark', value: '70% billable ratio = 1,260 billable client hours per year (28 billable hours per active week)' },
      { label: 'Overhead & Benefits', value: '$8,400 annual business expenses ($700/mo) + $6,000 health/retirement benefits ($500/mo)' },
      { label: 'Tax Burden Assumption', value: '25% blended effective tax set-aside ($24,466.67 on gross needed)' },
      { label: 'Calculated Rates', value: '$86.38/hr break-even rate, $99.33/hr recommended rate (with 15% buffer), $794.66/day rate, $2,781.30/week retainer' },
    ],
    sources: [
      {
        label: 'IRS Schedule SE (Form 1040) — Self-Employment Tax Instructions',
        url: 'https://www.irs.gov/forms-pubs/about-schedule-se-form-1040',
        note: '92.35% statutory net earnings multiplier, 12.4% Social Security, 2.9% Medicare, and 50% above-the-line deduction',
      },
      {
        label: 'U.S. Bureau of Labor Statistics (BLS) — Working Time & Leave Benchmarks',
        url: 'https://www.bls.gov/',
        note: 'Annual hours benchmarks (2,080 standard hours) and paid time off distributions for professional services',
      },
      {
        label: 'Freelancers Union — Freelance Pricing & Billable Utilization Guidelines',
        url: 'https://www.freelancersunion.org/',
        note: 'Industry utilization benchmarks (60%–75% realistic billable ratio accounting for marketing, invoicing, and admin)',
      },
    ],
  },
  'contribution-margin-calculator': {
    formula: [
      'Contribution Margin per Unit = Selling Price per Unit − Variable Cost per Unit',
      'Contribution Margin Ratio = Contribution Margin per Unit ÷ Selling Price per Unit',
      'Total Contribution Margin = Total Sales Revenue − Total Variable Costs',
      'Break-Even Units = Total Fixed Costs ÷ Contribution Margin per Unit',
      'Break-Even Sales ($) = Total Fixed Costs ÷ Contribution Margin Ratio',
      'Target Units = (Total Fixed Costs + Target Pre-Tax Operating Profit) ÷ Contribution Margin per Unit',
      'Pre-Tax Target Profit = Target After-Tax Profit ÷ (1 − Effective Tax Rate)',
      'Margin of Safety (Units) = Actual Units Sold − Break-Even Units',
      'Margin of Safety Ratio (%) = (Actual Sales − Break-Even Sales) ÷ Actual Sales × 100',
      'Degree of Operating Leverage (DOL) = Total Contribution Margin ÷ Net Operating Income',
      'Multi-Product Weighted CM = Σ (Product Mix % × Product Unit CM)',
      'Multi-Product Total Break-Even Units = Total Fixed Costs ÷ Weighted CM',
    ],
    defaults: [
      { label: 'Unit Economics', value: '$50.00 selling price, $30.00 variable cost per unit ($20.00 CM per unit, 40.0% CM ratio)' },
      { label: 'Fixed Overhead', value: '$20,000 fixed operating costs for the period' },
      { label: 'Production Volume', value: '1,500 units sold ($75,000 gross revenue, $45,000 variable costs, $30,000 total CM, $10,000 net operating income)' },
      { label: 'Break-Even Thresholds', value: '1,000 break-even units ($50,000 break-even revenue)' },
      { label: 'Risk & Leverage Metrics', value: '500 units margin of safety (33.33% cushion, $25,000 sales); DOL of 3.00 (+10% sales volume → +30% profit)' },
      { label: 'Target Profit Goal', value: '1,750 units needed for $15,000 pre-tax operating income ($87,500 gross sales)' },
    ],
    sources: [
      {
        label: 'Institute of Management Accountants (IMA) — Statement on Management Accounting: Cost-Volume-Profit Analysis',
        url: 'https://www.imanet.org/',
        note: 'Foundational accounting standards for behavioral cost classification, contribution margin ratios, and operational risk metrics',
      },
      {
        label: 'American Institute of CPAs (AICPA) — CVP and Break-Even Analysis Guidelines',
        url: 'https://www.aicpa-cima.com/',
        note: 'Methodologies for fixed cost absorption, margin of safety calculations, and multi-product weighted sales mix models',
      },
      {
        label: 'Harvard Business Review — How to Use Break-Even Analysis',
        url: 'https://hbr.org/',
        note: 'Strategic decision-making frameworks applying degrees of operating leverage and target after-tax profit gross-ups',
      },
    ],
  },
  'commercial-mortgage-calculator': {
    formula: [
      'Monthly Amortizing Payment (PMT) = P × [r(1+r)^n] ÷ [(1+r)^n − 1]',
      'Monthly Interest-Only Payment (IO) = P × (APR ÷ 12)',
      'Balloon Payment = Remaining principal balance after term months elapsed',
      'Loan-to-Value (LTV %) = (Loan Amount ÷ Property Appraised Value) × 100',
      'Debt Service Coverage Ratio (DSCR) = Annual Net Operating Income ÷ Annual Debt Service',
      'Debt Yield (%) = (Annual Net Operating Income ÷ Total Loan Principal) × 100',
      'Max Loan Capacity = min(Max Loan by LTV, Max Loan by DSCR, Max Loan by Debt Yield)',
      'Effective APR with Fees = Rate solving PV(payments + balloon) = (Principal − Points & Closing Fees)',
    ],
    defaults: [
      { label: 'Property & Loan', value: '$2,000,000 property value, $1,500,000 loan amount (75.0% LTV), 7.00% APR' },
      { label: 'Term & Amortization', value: '10-year term (120 months) on a 25-year amortization (300 months), 0 interest-only months' },
      { label: 'Payment & Balloon', value: '$10,601.69/mo payment ($127,220.26/yr debt service); $1,179,500.95 balloon balance at maturity' },
      { label: 'Principal & Interest', value: '$320,499.05 principal paid in term, $951,703.50 interest paid in term ($1,272,202.55 total)' },
      { label: 'Underwriting Criteria', value: '$160,000 annual NOI yields 1.26× DSCR and 10.67% Debt Yield; 1% points ($15,000) yields 7.15% effective APR' },
      { label: 'Sizing Limits', value: '75% Max LTV binds at $1,500,000 (DSCR allows $1,509,194, Debt Yield allows $1,777,778); requires $500,000 cash equity' },
    ],
    sources: [
      {
        label: 'Mortgage Bankers Association (MBA) — Commercial / Multifamily Underwriting Standards',
        url: 'https://www.mba.org/',
        note: 'Industry underwriting benchmarks for commercial debt service coverage, debt yield floors, and balloon risk management',
      },
      {
        label: 'CCIM Institute — Commercial Real Estate Debt Financing & Investment Analysis',
        url: 'https://www.ccim.com/',
        note: 'Mathematical methodologies for commercial amortization schedules, balloon calculations, and effective borrowing costs with origination points',
      },
      {
        label: 'Office of the Comptroller of the Currency (OCC) — Commercial Real Estate Lending Handbook',
        url: 'https://www.occ.gov/',
        note: 'Federal regulatory loan-to-value limits, supervisory LTV guidelines, and non-recourse debt compliance standards',
      },
    ],
  },
  'equipment-loan-calculator': {
    formula: [
      'Amount Financed = Purchase Price × (1 + Sales Tax %) + Lender Fees − Cash Down − Trade-In',
      'Periodic Amortizing Payment = [ P − B × (1+r)^(-n) ] × [ r ÷ (1 − (1+r)^(-n)) ]',
      'Total Interest = Periodic Payment × Total Periods + Balloon Amount − Amount Financed',
      'Lease Lifecycle Cost = Upfront Outlays + (Monthly Lease Payment × Lease Term) + Fees + Buyout',
      'Net Cost After Resale = Gross Lifecycle Cost − Estimated Equipment Resale Value',
      'Equipment Payback Period (Months) = Upfront Capital Outlay ÷ Net Monthly Operating Cash Flow After Loan',
      'MCA Total Payback = Funding Advance × Factor Rate',
      'MCA Periodic Remittance = Total Payback ÷ Number of Repayment Remittances (Daily or Weekly)',
    ],
    defaults: [
      { label: 'Equipment Purchase', value: '$80,000 machinery price, 6.0% sales tax ($4,800), $500 doc fees, $10,000 down payment, $0 trade-in ($75,300 financed)' },
      { label: 'Financing Terms', value: '8.50% annual interest rate, 60-month term (5 years), monthly frequency, $0 balloon' },
      { label: 'Payment & Cost', value: '$1,544.89/mo payment ($92,693.40 total payments); $17,393.40 total financing interest' },
      { label: 'Lease vs Buy Comparison', value: 'Cash purchase $84,800 vs $1 Buyout Lease $89,901 ($1,450/mo + $2,900 upfront) vs Loan $102,693; Cash is cheapest over term' },
      { label: 'MCA Advance Baseline', value: '$50,000 advance with 1.35 factor repaid over 180 days = $67,500 payback ($375/day ACH), ≈127.9% nominal APR (daily IRR × 365), ≈258% effective annual rate' },
    ],
    sources: [
      {
        label: 'Equipment Leasing and Finance Association (ELFA) — Knowledge Center & Financial Standards',
        url: 'https://www.elfaonline.org/',
        note: 'Industry benchmark guidelines for equipment lease structuring, finance vs operating leases, and salvage values',
      },
      {
        label: 'Internal Revenue Service (IRS) — Section 179 Property Deductions',
        url: 'https://www.irs.gov/newsroom/heres-what-businesses-need-to-know-about-the-section-179-deduction',
        note: 'Official federal tax guidance for immediate full expensing and bonus depreciation of qualifying commercial machinery and vehicles',
      },
      {
        label: 'Farm Credit System (FCS) — Agricultural Equipment Financing Standards',
        url: 'https://www.farmcredit.com/',
        note: 'Underwriting conventions for farm machinery installment loans, seasonal and annual repayment frequencies',
      },
    ],
  },
  'business-valuation-calculator': {
    formula: [
      'Seller\'s Discretionary Earnings (SDE) = Net Profit (Pre-Tax) + Owner Salary + Discretionary Perks + One-Off Expenses + Depreciation & Amortization + Net Interest',
      'Adjusted EBITDA = Net Profit + Interest + Taxes + Depreciation + Amortization + Normalized Adjustments − Fair Market Replacement Manager Salary',
      'Enterprise Value Range = Base Earnings (SDE or EBITDA) × Valuation Multiple Range',
      'Net Equity Value (Walk-Away Proceeds) = Enterprise Value − Outstanding Debt + Cash on Hand',
      'Net Asset Value (Liquidation Floor) = Real Estate + Equipment Resale + Inventory Cost + Accounts Receivable Liquidation − Total Business Liabilities',
      'Seller Financing Debt Service = Seller Note Principal × [r(1+r)^n] ÷ [(1+r)^n − 1]',
    ],
    defaults: [
      { label: 'SDE Baseline', value: '$120,000 net profit + $80,000 owner salary + $10,000 benefits + $5,000 personal + $8,000 one-off + $12,000 D&A + $6,000 interest = $241,000 SDE' },
      { label: 'Multiple & Valuation', value: '2.0× to 3.0× multiple range yields $482,000 to $723,000 enterprise value range ($602,500 midpoint)' },
      { label: 'EBITDA Baseline', value: 'Same financial data with $75,000 replacement manager compensation yields $166,000 adjusted EBITDA ($664k–$996k EV at 4.0×–6.0×)' },
      { label: 'Asset Liquidation Floor', value: '$150,000 equipment + $45,000 inventory + $25,000 AR − $50,000 liabilities = $170,000 NAV floor' },
      { label: 'Deal Structure', value: '60% cash at close ($361,500), 30% seller note ($180,750 at 8% over 5 years = $3,665/mo), 10% earnout ($60,250)' },
    ],
    sources: [
      {
        label: 'International Business Brokers Association (IBBA) — Market Pulse Reports & Small Business Valuation Standards',
        url: 'https://www.ibba.org/',
        note: 'Authoritative benchmarking data for small business valuation multiples, SDE add-back conventions, and deal structures',
      },
      {
        label: 'American Institute of CPAs (AICPA) — Statement on Standards for Valuation Services (SSVS No. 1)',
        url: 'https://www.aicpa-cima.com/',
        note: 'Professional accounting guidelines for market, income, and asset-based approaches to private company business appraisal',
      },
      {
        label: 'National Association of Certified Valuators and Analysts (NACVA) — Business Valuation Body of Knowledge',
        url: 'https://www.nacva.com/',
        note: 'Credentialing standards for normalizing owner compensation, recasting financial statements, and determining capitalization rates',
      },
    ],
  },
  'present-value-calculator': {
    formula: [
      'Single Sum PV = FV ÷ (1 + r/m)^(m × t)',
      'Ordinary Annuity PV = PMT × [(1 − (1 + r)⁻ⁿ) ÷ r]',
      'Annuity Due PV = Ordinary Annuity PV × (1 + r)',
      'Growing Annuity PV = [PMT ÷ (r − g)] × [1 − ((1 + g) ÷ (1 + r))ⁿ]',
      'Perpetuity PV = PMT ÷ r (or PMT ÷ (r − g) for growing perpetuity)',
      'Net Present Value (NPV) = ∑ [CFₜ ÷ (1 + r)ᵗ] − Initial Outlay',
      'Internal Rate of Return (IRR) = Discount rate where NPV = 0',
      'Profitability Index (PI) = PV of Cash Inflows ÷ Initial Outlay',
    ],
    defaults: [
      { label: 'Lump Sum Benchmark', value: '$10,000 received in 10 years at 6% annual discount rate = $5,583.95 present value' },
      { label: 'Annuity Benchmark', value: '$1,000/yr ordinary annuity for 10 years at 6% = $7,360.09 ($7,801.70 for annuity due)' },
      { label: 'Capital Project Benchmark', value: '-$10,000 initial outlay + 5 × $3,000 annual inflows at 8% hurdle = $1,978.13 NPV, 15.24% IRR, 1.20 PI' },
      { label: 'Table Matrix', value: '4-decimal discount factors [1 ÷ (1+r)ⁿ] across rates 1%–15% and periods 1–20' },
    ],
    sources: [
      {
        label: 'Financial Accounting Standards Board (FASB) — Statement of Financial Accounting Concepts No. 7',
        url: 'https://www.fasb.org/',
        note: 'Authoritative guidance on using cash flow information and present value in accounting valuations',
      },
      {
        label: 'CFA Institute — Quantitative Methods: Time Value of Money Curriculum',
        url: 'https://www.cfainstitute.org/',
        note: 'International finance standards for discounting formulas, effective interest rates, and capital budgeting decision rules',
      },
      {
        label: 'Principles of Corporate Finance (Brealey, Myers, & Allen)',
        url: 'https://www.mheducation.com/',
        note: 'Standard academic methodology for Net Present Value, Internal Rate of Return, and capital budgeting',
      },
    ],
  },
  'compound-interest-calculator': {
    formula: [
      'Compound Interest (Lump Sum) = P × (1 + r/n)^(n × t)',
      'Continuous Compounding = P × e^(r × t)',
      'Effective Periodic Rate for Mixed Frequency = i = (1 + r/n)^(n/m) − 1',
      'Future Value of Contributions = PMT × [((1 + i)^(m × t) − 1) ÷ i] × (1 + i)^timing',
      'Total Future Value = Lump Sum FV + Contributions FV',
      'Total Compound Interest = Total Future Value − Total Principal Deposits',
      'Annual Percentage Yield (APY) = (1 + r/n)^n − 1 (Continuous: e^r − 1)',
      'Exact Doubling Time = ln(2) ÷ ln(1 + APY)',
      'Inflation-Adjusted Real Value = Nominal Balance ÷ (1 + Inflation)^t',
    ],
    defaults: [
      { label: 'Standard Benchmark', value: '$10,000 principal + $200/mo at 5% APR compounded monthly for 10 years = $47,526.55 future value ($34,000 deposits, $13,526.55 interest)' },
      { label: 'Compounding Intervals', value: 'Annual (n=1), Semi-Annual (n=2), Quarterly (n=4), Monthly (n=12), Daily 365 (n=365), Daily 360 (n=360), Continuous (e^(rt))' },
      { label: 'Effective APY at 5% APR', value: 'Monthly = 5.116%, Daily = 5.127%, Continuous = 5.127%' },
      { label: 'Doubling Time at 5% Monthly', value: 'Exact = 13.89 years (Rule of 72 approximation = 14.4 years)' },
    ],
    sources: [
      {
        label: 'U.S. Securities and Exchange Commission (SEC) — Investor.gov Compound Interest Calculator & Guidance',
        url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
        note: 'Federal benchmark methodology for compound interest accumulation and periodic contribution modeling',
      },
      {
        label: 'Consumer Financial Protection Bureau (CFPB) — Truth in Savings Act (Regulation DD)',
        url: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/',
        note: 'Federal statutory requirements governing APR to APY conversion formulas and compounding disclosures',
      },
      {
        label: 'CFA Institute — Time Value of Money & Compounding Mechanics',
        url: 'https://www.cfainstitute.org/',
        note: 'Global institutional standards for continuous compounding, effective interest rates, and mixed-frequency cash flows',
      },
    ],
  },
  'processing-fee-calculator': {
    formula: [
      'Transaction Processing Fee = (Sale Amount × Percentage Rate) + Fixed Fee per Transaction',
      'Net Merchant Deposit = Sale Amount − Processing Fee',
      'Effective Processing Rate (%) = (Total Fee ÷ Sale Amount) × 100',
      'Gross-Up (Amount to Charge) = (Target Net + Fixed Fee) ÷ (1 − Percentage Rate as a Decimal)',
      'Total Monthly Fees = (Transaction Fee × Monthly Transactions) + Monthly Plan Subscription Fee',
      'Plan Break-Even Transactions = Plan Monthly Fee ÷ (Standard Fee per Tx − Plan Fee per Tx)',
      'Surcharge to cover the fee = Fee ÷ Sale Amount (whether you may surcharge depends on card-network rules, processor terms and local law)',
    ],
    defaults: [
      { label: 'Custom Benchmark', value: '$100 sale at 2.9% + $0.30 = $3.20 fee, $96.80 net (3.20% effective rate)' },
      { label: 'Gross-Up Benchmark', value: 'To receive $100 net at 2.9% + $0.30: charge ($100 + $0.30) ÷ (1 − 0.029) = $103.30' },
      { label: 'Square rates (US, checked 2026-11-21)', value: 'Square Free in-person: 2.6% + $0.15 · Online: 3.3% + $0.30 · Manual entry / card on file: 3.5% + $0.15 · Square Plus ($49/mo) in-person: 2.5% + $0.15' },
      { label: 'Other processors', value: 'Not preset: PayPal and Stripe US pricing pages could not be read for this review. Enter their current rates in Custom mode.' },
    ],
    sources: [
      {
        label: 'Square Official Pricing Schedule (Block, Inc.)',
        url: 'https://squareup.com/us/en/pricing',
        note: 'Square Free and Square Plus in-person and online rates (checked 2026-11-21)',
      },
      {
        label: 'Square Support: Learn about Square fees (US)',
        url: 'https://squareup.com/help/us/en/article/5068',
        note: 'Manual entry / card-on-file rate 3.5% + 15¢ (checked 2026-11-21)',
      },
    ],
  },
  'net-worth-calculator': {
    formula: [
      'Total Assets = Sum of all cash, taxable investments, retirement accounts, home value, vehicles, business equity, and personal property',
      'Total Liabilities = Sum of all mortgages, HELOCs, auto loans, student loans, credit card balances, and personal debts',
      'Net Worth = Total Assets − Total Liabilities',
      'Liquid Net Worth = (Cash & Savings + Taxable Brokerage) − Non-Mortgage Consumer Debt',
      'Investable Net Worth = Liquid Assets + Retirement Accounts − Non-Mortgage Consumer Debt',
      'Debt-to-Asset Ratio (%) = (Total Liabilities ÷ Total Assets) × 100',
      'Home Equity = Primary Residence Fair Market Value − Primary Mortgage & HELOC Debt',
    ],
    defaults: [
      { label: 'Benchmark Profile', value: '$550,000 assets ($25k cash/savings, $40k taxable, $120k retirement, $350k home, $15k car) − $294,000 debt ($260k mortgage, $34k consumer debt) = $256,000 net worth' },
      { label: 'Liquid Net Worth', value: '$65,000 liquid assets − $34,000 non-mortgage debt = $31,000 liquid net worth' },
      { label: 'Debt-to-Asset Ratio', value: '$294,000 ÷ $550,000 = 53.45%' },
    ],
    sources: [
      {
        label: 'Federal Reserve Board — Survey of Consumer Finances (SCF)',
        url: 'https://www.federalreserve.gov/econres/scfindex.htm',
        note: 'Triennial survey of United States family balance sheets, asset distribution, pensions, and debt levels',
      },
      {
        label: 'Federal Reserve Statistical Release Z.1 (Financial Accounts of the United States)',
        url: 'https://www.federalreserve.gov/releases/z1/',
        note: 'Quarterly macro balance sheets of American households, non-profit organizations, and corporate sectors',
      },
    ],
  },
  'heloc-calculator': {
    formula: [
      'Maximum Borrowing Limit = (Home Appraised Value × Max CLTV %) − Outstanding Mortgage Liens',
      'Combined Loan-to-Value (CLTV %) = ((First Mortgage + HELOC Line) ÷ Home Appraised Value) × 100',
      'Draw Period Monthly Payment (Interest-Only) = Current Balance × (Annual APR ÷ 12)',
      'Repayment Period Monthly Payment = r × Balance ÷ (1 − (1 + r)^−n), where r = APR ÷ 12 and n = repayment months',
      'Payment Shock Jump ($) = Repayment Monthly Payment − Draw Monthly Payment',
      'Payment Shock Percentage (%) = (Payment Shock Jump ÷ Draw Monthly Payment) × 100',
    ],
    defaults: [
      { label: 'Standard CLTV Benchmark', value: '$400,000 home with $250,000 mortgage at 85% CLTV cap allows up to $90,000 HELOC line' },
      { label: 'Standard Payment Shock Benchmark', value: '$50,000 at 8.0% APR: $333.33/mo interest-only draw payment jumps to $418.22/mo over 20-year repayment (+25.5% / +$84.89/mo)' },
    ],
    sources: [
      {
        label: 'Consumer Financial Protection Bureau (CFPB) — What You Should Know About Home Equity Lines of Credit (HELOC Brochure)',
        url: 'https://www.consumerfinance.gov/consumer-tools/mortgages/',
        note: 'Federal guidance on variable rates, draw periods, repayment transitions, balloon payments, and payment shock risk',
      },
      {
        label: 'Internal Revenue Service (IRS) — Publication 936 (Home Mortgage Interest Deduction)',
        url: 'https://www.irs.gov/publications/p936',
        note: 'Federal tax guidelines clarifying that home equity interest is only tax-deductible when proceeds are used to buy, build, or substantially improve the home securing the loan',
      },
    ],
  },
  'investment-return-calculator': {
    formula: [
      'Future Value of Principal & Contributions = PV × (1 + r/m)^(m×t) + PMT × [((1 + r/m)^(m×t) − 1) ÷ (r/m)]',
      'Net Monthly Nominal Rate (r_net) = (Assumed Annual Return % ÷ 12) − (Expense Ratio % ÷ 12) − (Tax Drag % ÷ 12)',
      'Inflation-Adjusted Real Value = Nominal Ending Balance ÷ (1 + Annual Inflation Rate %)^Years',
      'Money Market Monthly Compounding Rate = (1 + APY %)^(1/12) − 1',
      'Treasury Bill Discount Rate (360-day bank basis) = [(Face Par − Purchase Price) ÷ Face Par] × (360 ÷ Days to Maturity) × 100',
      'Treasury Bill Investment Yield (365-day coupon equivalent) = [(Face Par − Purchase Price) ÷ Purchase Price] × (365 ÷ Days to Maturity) × 100',
    ],
    defaults: [
      { label: 'Long-Term Projection Benchmark', value: '$10,000 lump sum + $300/month for 20 years at an assumed 7.0% nominal return compounds to $196,665.39 from $82,000 contributed' },
      { label: 'Money Market Benchmark', value: '$25,000 at 4.50% APY produces $1,125.00 in annual interest' },
      { label: 'T-Bill Auction Benchmark', value: '$10,000 26-week (182-day) bill bought for $9,750 yields 4.945% discount rate and 5.142% coupon equivalent' },
    ],
    sources: [
      {
        label: 'U.S. Department of the Treasury — TreasuryDirect (Treasury Bills Auction & Yield Mechanics)',
        url: 'https://www.treasurydirect.gov/marketable-securities/treasury-bills/',
        note: 'Official federal standard formulas for Treasury discount rate (360-day) and coupon-equivalent investment yield (365-day)',
      },
      {
        label: 'Federal Reserve Bank of St. Louis — Federal Reserve Economic Data (FRED)',
        url: 'https://fred.stlouisfed.org/',
        note: 'Historical macroeconomic time series for Consumer Price Index (CPI), money market yields, and Treasury debt rates',
      },
    ],
  },
  'credit-card-payoff-calculator': {
    formula: [
      'Daily Periodic Rate (DPR) = APR ÷ 365',
      'Daily Interest Accrual = Day Ending Balance × DPR',
      'Monthly Amortization Payment = r × Balance ÷ (1 − (1 + r)^−n)',
      'Minimum Payment = Max( Floor, (Balance × Min Pct) + Monthly Interest + Fees )',
      'Effective APY = (1 + APR ÷ 365)^365 − 1',
      'Net Balance Transfer Savings = Staying Interest − (Transfer Fee + Post-Promo Interest)',
    ],
    defaults: [
      { label: 'Standard Payoff Benchmark', value: '$5,000 balance at 22.0% APR paying $200/mo clears in 34 months with $1,750 interest' },
      { label: 'Minimum Payment Formula', value: '1.0% of principal balance + monthly interest accrual, subject to a $25 floor' },
      { label: 'Balance Transfer Benchmark', value: '$5,000 transfer at 3.0% fee ($150) for 18 months at 0% saves over $850 net vs staying at 22%' },
    ],
    sources: [
      {
        label: 'Consumer Financial Protection Bureau (CFPB) — Credit Card Resources',
        url: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/',
        note: 'Federal regulatory standards under Truth in Lending Act (TILA) and CARD Act for minimum payment calculations',
      },
      {
        label: 'Federal Reserve Statistical Release G.19 (Consumer Credit)',
        url: 'https://www.federalreserve.gov/releases/g19/current/',
        note: 'Official historical series on commercial bank credit card interest rates and consumer revolving credit accounts',
      },
    ],
  },
  'self-employment-tax-calculator': {
    formula: [
      'Net Self-Employment Earnings = Gross 1099 Income − Ordinary Business Expenses − Standard Mileage Deduction',
      'Taxable Self-Employment Base = Net Earnings × 92.35% (IRC § 1402(a)(12) statutory factor)',
      'Social Security Tax = min(Taxable Base, max(0, $184,500 − W-2 Wages)) × 12.4%',
      'Medicare Tax = Taxable Base × 2.9% + max(0, Combined Earnings − Statutory Threshold) × 0.9%',
      'Half-SE Tax Deduction = (Social Security Tax + Medicare Tax) ÷ 2 (IRC § 164(f) above-the-line deduction)',
      'Quarterly Estimated Payment (Form 1040-ES) = Total Annual Tax Liability ÷ 4',
      'Safe Harbor Target = min(90% × Current Year Tax, 100% × Prior Year Tax)',
    ],
    defaults: [
      { label: 'Gross 1099 Receipts', value: '$70,000' },
      { label: 'Schedule C Deductions', value: '$10,000' },
      { label: 'Net Business Profit', value: '$60,000' },
      { label: 'Standard Mileage Rate (2026)', value: '72.5¢/mi (Jan–Jun) and 76.0¢/mi (Jul–Dec) — IRS Notice 2026' },
      { label: 'Social Security Wage Base (2026)', value: '$184,500 maximum taxable earnings — SSA COLA' },
      { label: 'Filing Status Thresholds', value: '$200,000 (Single), $250,000 (Married Jointly), $125,000 (Married Separately)' },
    ],
    sources: [
      {
        label: 'Internal Revenue Service (IRS) — Self-Employment Tax (Social Security and Medicare Taxes)',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes',
        note: 'Official IRS statutory guide for 15.3% SE tax, 92.35% net earnings multiplier, and Form 1040 Schedule SE',
      },
      {
        label: 'Social Security Administration (SSA) — Contribution and Benefit Base',
        url: 'https://www.ssa.gov/oact/cola/cbb.html',
        note: 'Official statutory maximum wage base limits subject to Old-Age, Survivors, and Disability Insurance (OASDI)',
      },
      {
        label: 'Internal Revenue Service (IRS) — Standard Mileage Rates',
        url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates',
        note: 'Official IRS standard mileage deduction rates per mile for business use of a vehicle',
      },
      {
        label: 'Internal Revenue Service (IRS) — Estimated Taxes (Form 1040-ES)',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes',
        note: 'Statutory requirements for quarterly estimated tax vouchers and penalty safe harbor criteria',
      },
    ],
  },
  'sba-loan-calculator': {
    formula: [
      'SBA 504 Bank Loan = Project Cost × Bank %; CDC Loan = Project Cost × CDC % × (1 + CDC Fee % if financed); Borrower Equity = Project Cost × (100% − Bank % − CDC %)',
      'SBA 504 Amortizing Payments: PMT_bank = Bank Loan × [r_bank(1+r_bank)^n_bank] ÷ [(1+r_bank)^n_bank − 1]; PMT_cdc = CDC Loan × [r_cdc(1+r_cdc)^n_cdc] ÷ [(1+r_cdc)^n_cdc − 1]',
      'Total 504 Monthly Payment = PMT_bank + PMT_cdc; Blended Rate = (Bank Loan × r_bank + CDC Loan × r_cdc) ÷ (Bank Loan + CDC Loan)',
      'SBA 7(a) Payment: Financed = Loan Amount + (Guarantee Fee + Other Fees if financed); PMT = Financed × [r(1+r)^n] ÷ [(1+r)^n − 1]',
      'Debt Service Coverage Ratio (DSCR) = Annual Operating Cash Flow (NOI / EBITDA) ÷ (12 × Combined Monthly Debt Service)',
      'Business Acquisition Debt Stack: Total Purchase Price = Buyer Equity + Seller Note + SBA 7(a) Senior Loan',
    ],
    defaults: [
      { label: '504 Project Size', value: '$2,000,000 commercial project' },
      { label: '504 Capital Split', value: '50% Bank ($1M @ 7.0%, 25 yr), 40% CDC ($800k @ 6.5%, 25 yr), 10% Equity ($200k)' },
      { label: 'SBA 7(a) Benchmark', value: '$1,800,000 loan @ 9.0%, 25 yr term' },
      { label: 'CDC Debenture Fee', value: '~3.0% of CDC debt (SBA allowed to be financed into note)' },
      { label: 'Acquisition Split', value: '10% Buyer Equity, 15% Seller Note (8%, 5 yr), 75% SBA 7(a) (10.5%, 10 yr)' },
    ],
    sources: [
      {
        label: 'U.S. Small Business Administration (SBA) — 504 Loans',
        url: 'https://www.sba.gov/funding-programs/loans/504-loans',
        note: 'Official SBA statutory rules for 10-, 20-, and 25-year maturity terms, Treasury-pegged rates, and ~3% fee structure',
      },
      {
        label: 'U.S. Small Business Administration (SBA) — 7(a) Loans',
        url: 'https://www.sba.gov/funding-programs/loans/7a-loans',
        note: 'Official federal guidelines for $5,000,000 maximum gross loan amount, permitted uses, and guarantee provisions',
      },
      {
        label: 'Electronic Code of Federal Regulations (eCFR) — 13 CFR Part 120 (Business Loan Programs)',
        url: 'https://www.ecfr.gov/current/title-13/chapter-I/part-120',
        note: 'Federal regulatory code governing Certified Development Company debentures, borrower equity minimums, and lender spreads',
      },
    ],
  },
  'how-long-will-my-money-last': {
    formula: [
      'Closed-form years without inflation: N = −ln(1 − (r × Balance) ÷ Withdrawal) ÷ ln(1 + r); if Withdrawal ≤ r × Balance, money lasts indefinitely',
      'Step-by-step annual drawdown simulation: Balance(t) = Balance(t-1) × (1 + r) − (Withdrawal(t) − OtherIncome(t))',
      'Inflation adjustment: Withdrawal(t) = Withdrawal(t-1) × (1 + i)',
      'Real rate of return: r_real = (1 + r) ÷ (1 + i) − 1',
      'Maximum sustainable spending to target age: AnnualSpend = Balance ÷ AnnuityFactor(r_real, YearsToTarget)',
      'Bengen 4% Rule baseline: Year 1 Withdrawal = Starting Balance × 4.0%; subsequent years indexed to inflation',
    ],
    defaults: [
      { label: 'Starting Savings', value: '$500,000' },
      { label: 'Annual Spending Needed', value: '$40,000 / year' },
      { label: 'Assumed Investment Return', value: '5.0% nominal return' },
      { label: 'Assumed Inflation Rate', value: '3.0% annual inflation' },
      { label: 'Current Age / Target Age', value: 'Age 65 / Target Age 95' },
    ],
    sources: [
      {
        label: 'William P. Bengen — Determining Withdrawal Rates Using Historical Data (Journal of Financial Planning, 1994)',
        url: 'https://www.financialplanningassociation.org/',
        note: 'The foundational research paper establishing the 4% safe withdrawal rate across 30-year retirement horizons',
      },
      {
        label: 'Trinity Study (Cooley, Hubbard, and Walz) — Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable (1998)',
        url: 'https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable',
        note: 'Empirical analysis of portfolio success rates across varying asset allocations and payout periods',
      },
      {
        label: 'Social Security Administration (SSA) — Actuarial Life Tables',
        url: 'https://www.ssa.gov/oact/STATS/table4c6.html',
        note: 'Official period life tables showing cohort life expectancy benchmarks for retirement planning',
      },
    ],
  },
  'invoice-generator': {
    formula: [
      'Line Total = Hours × Hourly Rate (or Quantity × Unit Price)',
      'Decimal Hours = Whole Hours + (Minutes ÷ 60); rounded by selected billing increment (6, 15, or 30 min)',
      'Subtotal = Sum of all line items (hours, fixed deliverables, reimbursable expenses)',
      'Discount Amount = (Subtotal × Discount %) or Fixed Discount $',
      'Tax Amount = (Subtotal − Discount) × Tax Rate % (or Subtotal × Tax Rate % if pre-discount)',
      'Total Invoice Amount = Subtotal − Discount + Tax Amount + Shipping / Pass-Through Fees',
      'Balance Due = Total Invoice Amount − Advance Deposit / Amount Paid',
    ],
    defaults: [
      { label: 'Standard Hourly Baseline', value: '3 tasks (2:30, 1:45, 3:10) with 15-minute round-up = 2.50 + 1.75 + 3.25 = 7.50h @ $75/hr = $562.50' },
      { label: 'Payment Terms', value: 'Net 30 default maturity (with Due on Receipt, Net 7, Net 14, Net 60 options)' },
      { label: 'Rounding Increments', value: '15-minute quarter-hour (general/freelance), 6-minute tenth-of-an-hour (legal/accounting), exact minutes' },
    ],
    sources: [
      {
        label: 'Internal Revenue Service (IRS) — Independent Contractor (Self-Employed) or Employee?',
        url: 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee',
        note: 'Federal tax guidelines for independent contractor billing, Form 1099 reporting, and invoice record-keeping standards',
      },
      {
        label: 'HM Revenue & Customs (HMRC) — VAT Invoices: What They Must Include',
        url: 'https://www.gov.uk/vat-record-keeping/vat-invoices',
        note: 'Official UK government statutory requirements for valid VAT invoices, tax dates, and business registration disclosures',
      },
      {
        label: 'Australian Taxation Office (ATO) — How to Issue a Valid Tax Invoice',
        url: 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/tax-invoices',
        note: 'Commonwealth regulatory rules for Australian Business Number (ABN) display, GST itemization, and electronic invoicing',
      },
      {
        label: 'Canada Revenue Agency (CRA) — Records You Need to Support Your GST/HST Input Tax Credits',
        url: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/complete-file-instructions/input-tax-credits.html',
        note: 'Canadian federal invoicing criteria for business numbers, provincial sales tax (PST/HST), and commercial invoice verification',
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
