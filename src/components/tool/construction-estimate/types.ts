export type Currency = 'USD' | 'GBP' | 'CAD' | 'AUD' | 'EUR';

export type Category =
  | 'materials'
  | 'labor'
  | 'equipment'
  | 'subcontractor'
  | 'permits'
  | 'overhead'
  | 'other';

export type Unit =
  | 'each'
  | 'sq_ft'
  | 'linear_ft'
  | 'cubic_yd'
  | 'hour'
  | 'day'
  | 'week'
  | 'lump_sum'
  | 'ton'
  | 'gallon'
  | 'bag'
  | 'bundle'
  | 'roll'
  | 'box'
  | 'pallet';

export interface LineItem {
  id: string;
  description: string;
  category: Category;
  quantity: number;
  unit: Unit;
  unitPrice: number;
  total: number; // computed: quantity * unitPrice
}

export interface ProjectInfo {
  projectName: string;
  clientName: string;
  projectAddress: string;
  date: string; // ISO date string or YYYY-MM-DD
  estimateNumber: string;
  validDays: number; // default 30
}

export interface CompanyInfo {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
}

export interface EstimateData {
  id: string;
  projectInfo: ProjectInfo;
  companyInfo: CompanyInfo;
  lineItems: LineItem[];
  taxRate: number; // percentage (e.g. 8.25 for 8.25%)
  markupRate: number; // percentage (e.g. 15 for 15%)
  currency: Currency;
  notes: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface EstimateTotals {
  subtotal: number;
  categorySubtotals: Record<Category, number>;
  taxAmount: number;
  markupAmount: number;
  grandTotal: number;
}

