import { Category, Currency, EstimateData, Unit } from './types';

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'materials', label: 'Materials' },
  { value: 'labor', label: 'Labor' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'subcontractor', label: 'Subcontractor' },
  { value: 'permits', label: 'Permits & Fees' },
  { value: 'overhead', label: 'Overhead' },
  { value: 'other', label: 'Other' },
];

export const UNITS: { value: Unit; label: string }[] = [
  { value: 'each', label: 'each' },
  { value: 'sq_ft', label: 'sq ft' },
  { value: 'linear_ft', label: 'linear ft' },
  { value: 'cubic_yd', label: 'cubic yd' },
  { value: 'hour', label: 'hour' },
  { value: 'day', label: 'day' },
  { value: 'week', label: 'week' },
  { value: 'lump_sum', label: 'lump sum' },
  { value: 'ton', label: 'ton' },
  { value: 'gallon', label: 'gallon' },
  { value: 'bag', label: 'bag' },
  { value: 'bundle', label: 'bundle' },
  { value: 'roll', label: 'roll' },
  { value: 'box', label: 'box' },
  { value: 'pallet', label: 'pallet' },
];

export const CURRENCIES: {
  value: Currency;
  label: string;
  symbol: string;
  locale: string;
}[] = [
  { value: 'USD', label: 'USD ($)', symbol: '$', locale: 'en-US' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£', locale: 'en-GB' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$', locale: 'en-CA' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$', locale: 'en-AU' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€', locale: 'de-DE' },
];

export const STARTER_ESTIMATE: EstimateData = {
  id: 'starter-residential-kitchen-renovation',
  projectInfo: {
    projectName: 'Kitchen Renovation',
    clientName: 'Sarah & David Miller',
    projectAddress: '742 Evergreen Terrace, Springfield, OR',
    date: '2026-11-09',
    estimateNumber: 'EST-2026-001',
    validDays: 30,
  },
  companyInfo: {
    companyName: 'Apex Craft Construction & Remodeling',
    address: '100 Industrial Parkway, Suite 400',
    phone: '(555) 234-5678',
    email: 'estimates@apexconstruction.example',
    licenseNumber: 'CCB #248910',
  },
  lineItems: [
    {
      id: 'item-1',
      description: 'Cabinet Demolition & Removal',
      category: 'labor',
      quantity: 16,
      unit: 'hour',
      unitPrice: 45,
      total: 720,
    },
    {
      id: 'item-2',
      description: 'Cabinets — Shaker Style (10 units)',
      category: 'materials',
      quantity: 10,
      unit: 'each',
      unitPrice: 350,
      total: 3500,
    },
    {
      id: 'item-3',
      description: 'Granite Countertop (35 sq ft)',
      category: 'materials',
      quantity: 35,
      unit: 'sq_ft',
      unitPrice: 75,
      total: 2625,
    },
    {
      id: 'item-4',
      description: 'Countertop Installation',
      category: 'labor',
      quantity: 8,
      unit: 'hour',
      unitPrice: 55,
      total: 440,
    },
    {
      id: 'item-5',
      description: 'Plumbing — Sink & Dishwasher',
      category: 'subcontractor',
      quantity: 1,
      unit: 'lump_sum',
      unitPrice: 850,
      total: 850,
    },
    {
      id: 'item-6',
      description: 'Electrical — Outlets & Under-cabinet Lighting',
      category: 'subcontractor',
      quantity: 1,
      unit: 'lump_sum',
      unitPrice: 1200,
      total: 1200,
    },
    {
      id: 'item-7',
      description: 'Tile Backsplash (40 sq ft)',
      category: 'materials',
      quantity: 40,
      unit: 'sq_ft',
      unitPrice: 12,
      total: 480,
    },
    {
      id: 'item-8',
      description: 'Backsplash Installation',
      category: 'labor',
      quantity: 12,
      unit: 'hour',
      unitPrice: 50,
      total: 600,
    },
    {
      id: 'item-9',
      description: 'Painting — Walls, Ceiling & Trim',
      category: 'labor',
      quantity: 10,
      unit: 'hour',
      unitPrice: 40,
      total: 400,
    },
    {
      id: 'item-10',
      description: 'Municipal Building & Mechanical Permit',
      category: 'permits',
      quantity: 1,
      unit: 'each',
      unitPrice: 350,
      total: 350,
    },
    {
      id: 'item-11',
      description: 'Dumpster Rental & Waste Disposal (1 week)',
      category: 'equipment',
      quantity: 1,
      unit: 'week',
      unitPrice: 450,
      total: 450,
    },
  ],
  taxRate: 8.25,
  markupRate: 15,
  currency: 'USD',
  notes:
    'Payment Milestones: 30% initial deposit upon signing, 40% upon rough-in inspection approval, 30% upon final punch-list handover. Estimate valid for 30 calendar days. Excludes hazardous asbestos abatement or concealed structural rot remediation.',
  createdAt: '2026-11-09T08:00:00.000Z',
  updatedAt: '2026-11-09T08:00:00.000Z',
};

