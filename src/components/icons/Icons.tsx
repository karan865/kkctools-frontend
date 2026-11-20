import React from 'react';

export type IconName =
  | 'slab'
  | 'slabCost'
  | 'cube'
  | 'cubeToArea'
  | 'blockWall'
  | 'brickWall'
  | 'stonePile'
  | 'sandDunes'
  | 'layeredBase'
  | 'paverGrid'
  | 'road'
  | 'shovel'
  | 'leaf'
  | 'mower'
  | 'shingles'
  | 'metalRoof'
  | 'battenWall'
  | 'pipe'
  | 'bolt'
  | 'piston'
  | 'scale'
  | 'roofTruss'
  | 'studWall'
  | 'ruler'
  | 'squareArea'
  | 'tileGrid'
  | 'bath'
  | 'floorPlanks'
  | 'floorSander'
  | 'carpetRoll'
  | 'paintRoller'
  | 'fence'
  | 'fenceCost'
  | 'deck'
  | 'deckStain'
  | 'drywall'
  | 'rebar'
  | 'clipboard'
  | 'guitar'
  | 'percent'
  | 'tag'
  | 'discount'
  | 'margin'
  | 'unitPrice'
  | 'wage'
  | 'capRate'
  | 'rentalProperty'
  | 'laborCost'
  | 'commercialLease'
  | 'airbnbHost'
  | 'freelanceRate'
  | 'contributionMargin'
  | 'commercialMortgage'
  | 'equipmentLoan'
  | 'businessValuation'
  | 'presentValue'
  | 'compoundInterest'
  | 'processingFee'
  | 'creditCardPayoff'
  | 'netWorth'
  | 'heloc'
  | 'investmentReturn'
  | 'drawdown'
  | 'sbaLoan'
  | 'seTax'
  | 'invoice'
  | 'roofCost'
  | 'gridSearch'
  | 'plus'
  | 'search'
  | 'check'
  | 'shield'
  | 'zap'
  | 'bookOpen'
  | 'arrowRight'
  | 'chevronDown'
  | 'close';

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export default function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.8,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': ariaHidden,
  };

  switch (name) {
    case 'slab':
      return (
        <svg {...common}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case 'slabCost':
      return (
        <svg {...common}>
          <polygon points="10 4 2 8 10 12 18 8 10 4" />
          <polyline points="2 12 10 16 18 12" />
          <circle cx="18" cy="17" r="4.5" />
          <path d="M19.4 15.4h-2a.9.9 0 0 0 0 1.8h1.2a.9.9 0 0 1 0 1.8h-2.1M18 14.4v1M18 19v1" />
        </svg>
      );
    case 'deck':
      return (
        <svg {...common}>
          <path d="M2 14h20" />
          <path d="M3 14v6M21 14v6M12 14v6" />
          <path d="M4 14V7M20 14V7M8 14V9M12 14V9M16 14V9" />
          <path d="M4 7h16" />
        </svg>
      );
    case 'deckStain':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="6" rx="1.5" />
          <path d="M7 9v4c0 2.8 2.2 5 5 5s5-2.2 5-5V9" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="9" y1="21" x2="15" y2="21" />
          <circle cx="12" cy="13" r="1.5" />
        </svg>
      );
    case 'fenceCost':
      return (
        <svg {...common}>
          <path d="M3 8v12M8 8v12M13 8v5" />
          <path d="M1.5 11h13M1.5 16h7" />
          <polygon points="3 5 4.5 8 1.5 8 3 5" />
          <polygon points="8 5 9.5 8 6.5 8 8 5" />
          <polygon points="13 5 14.5 8 11.5 8 13 5" />
          <circle cx="17.5" cy="17.5" r="4.5" />
          <path d="M18.9 15.9h-2a.9.9 0 0 0 0 1.8h1.2a.9.9 0 0 1 0 1.8h-2.1M17.5 14.9v1M17.5 19.5v1" />
        </svg>
      );
    case 'cubeToArea':
      return (
        <svg {...common}>
          <polygon points="6 3 10 5 6 7 2 5 6 3" />
          <polyline points="2 5 2 10 6 12 10 10 10 5" />
          <line x1="6" y1="7" x2="6" y2="12" />
          <path d="M12 8h4m-1.5-1.5L16 8l-1.5 1.5" />
          <polygon points="14 15 22 15 20 19 12 19 14 15" />
          <line x1="12" y1="19" x2="12" y2="20.5" />
          <line x1="20" y1="19" x2="20" y2="20.5" />
        </svg>
      );
    case 'metalRoof':
      return (
        <svg {...common}>
          <path d="M2 12 12 4l10 8" />
          <path d="M4 10.5V20h16v-9.5" />
          <path d="M7 8.2V20M10 6V20M14 6V20M17 8.2V20" />
        </svg>
      );
    case 'bath':
      return (
        <svg {...common}>
          <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3z" />
          <path d="M6 12V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2" />
          <path d="M7 20l-1 2M17 20l1 2" />
        </svg>
      );
    case 'cube':
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'blockWall':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="9" />
          <line x1="15" y1="3" x2="15" y2="9" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="6" y1="15" x2="6" y2="21" />
          <line x1="18" y1="15" x2="18" y2="21" />
        </svg>
      );
    case 'brickWall':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="1.5" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="4" x2="12" y2="12" />
          <line x1="7" y1="12" x2="7" y2="20" />
          <line x1="17" y1="12" x2="17" y2="20" />
        </svg>
      );
    case 'stonePile':
      return (
        <svg {...common}>
          <path d="M4 19a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1z" />
          <path d="M7 16a3.5 3.5 0 0 1 3.5-3.5h3A3.5 3.5 0 0 1 17 16" />
          <path d="M9 12.5a3 3 0 0 1 3-2.5 3 3 0 0 1 3 2.5" />
          <circle cx="12" cy="6" r="2.5" />
        </svg>
      );
    case 'sandDunes':
      return (
        <svg {...common}>
          <path d="M2 19c3-4 6-6 10-6s7 2 10 6" />
          <path d="M6 13c3-3 6-5 9-5s5 1 7 4" />
          <circle cx="17" cy="5" r="2" />
          <line x1="2" y1="21" x2="22" y2="21" />
        </svg>
      );
    case 'layeredBase':
      return (
        <svg {...common}>
          <path d="M2 5l10-3 10 3-10 3-10-3z" />
          <path d="M2 12l10 3 10-3" />
          <path d="M2 17l10 3 10-3" />
          <line x1="2" y1="21" x2="22" y2="21" />
        </svg>
      );
    case 'paverGrid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
        </svg>
      );
    case 'road':
      return (
        <svg {...common}>
          <polygon points="4 21 8 3 16 3 20 21 4 21" />
          <line x1="12" y1="6" x2="12" y2="8" />
          <line x1="12" y1="12" x2="12" y2="14" />
          <line x1="12" y1="18" x2="12" y2="20" />
        </svg>
      );
    case 'shovel':
      return (
        <svg {...common}>
          <path d="M2 22l8-8" />
          <path d="M9 13l2 2" />
          <path d="M12 10l6-6 4 4-6 6z" />
          <path d="M16 4l4 4" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case 'piston':
      return (
        <svg {...common}>
          <path d="M7 3h10v4H7z" />
          <path d="M6 7h12v6H6z" />
          <path d="M9 10h6" />
          <path d="M12 13l-2 5" />
          <circle cx="10" cy="19.5" r="2" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case 'pipe':
      return (
        <svg {...common}>
          <path d="M3 9h12a4 4 0 0 1 4 4v8" />
          <path d="M3 15h9a1 1 0 0 1 1 1v5" />
          <path d="M3 7v10M17 21h4" />
        </svg>
      );
    case 'battenWall':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 6h18M7.5 6v15M12 6v15M16.5 6v15" />
        </svg>
      );
    case 'shingles':
      return (
        <svg {...common}>
          <path d="M3 11 12 4l9 7" />
          <path d="M5 10v9h14v-9" />
          <path d="M5 13h14M5 16h14M9 13v3M14 16v3M12 10v3" />
        </svg>
      );
    case 'mower':
      return (
        <svg {...common}>
          <path d="M3 15h13l3-5h2" />
          <path d="M5 15V11h9l2 4" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="16" cy="18" r="2" />
          <path d="M2 21h2M10 21h2M19 21h3" />
        </svg>
      );
    case 'scale':
      return (
        <svg {...common}>
          <line x1="12" y1="3" x2="12" y2="21" />
          <polyline points="4 7 12 5 20 7" />
          <polygon points="1 13 4 7 7 13 1 13" />
          <polygon points="17 13 20 7 23 13 17 13" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      );
    case 'roofTruss':
      return (
        <svg {...common}>
          <polygon points="12 3 2 19 22 19 12 3" />
          <line x1="12" y1="3" x2="12" y2="19" />
          <line x1="7" y1="11" x2="12" y2="19" />
          <line x1="17" y1="11" x2="12" y2="19" />
        </svg>
      );
    case 'roofCost':
      return (
        <svg {...common}>
          <path d="M2 13L12 4l10 9" />
          <path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
          <line x1="8" y1="14" x2="16" y2="14" />
          <line x1="6" y1="17.5" x2="18" y2="17.5" />
          <path d="M12 9v2.5" />
        </svg>
      );
    case 'studWall':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <line x1="8" y1="3" x2="8" y2="21" />
          <line x1="13" y1="3" x2="13" y2="21" />
          <line x1="18" y1="3" x2="18" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" />
        </svg>
      );
    case 'ruler':
      return (
        <svg {...common}>
          <path d="M21.3 15.3l-6.6 6.6a2 2 0 0 1-2.8 0L2.7 12.7a2 2 0 0 1 0-2.8l6.6-6.6a2 2 0 0 1 2.8 0l9.2 9.2a2 2 0 0 1 0 2.8z" />
          <line x1="7.5" y1="7.5" x2="10.5" y2="10.5" />
          <line x1="10.5" y1="4.5" x2="12" y2="6" />
          <line x1="13.5" y1="7.5" x2="15" y2="9" />
          <line x1="16.5" y1="10.5" x2="18" y2="12" />
        </svg>
      );
    case 'squareArea':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="9" y2="3" />
          <line x1="3" y1="15" x2="15" y2="3" />
          <line x1="3" y1="21" x2="21" y2="3" />
          <line x1="9" y1="21" x2="21" y2="9" />
          <line x1="15" y1="21" x2="21" y2="15" />
        </svg>
      );
    case 'tileGrid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
          <circle cx="7.5" cy="16.5" r="1" fill="currentColor" />
          <circle cx="16.5" cy="16.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'floorSander':
      return (
        <svg {...common}>
          <path d="M2 21h20" />
          <path d="M2 17h9M15 17h7" />
          <rect x="8" y="11" width="9" height="5" rx="1.5" />
          <circle cx="12.5" cy="16" r="1.2" />
          <path d="M14 11 19 3M18 3h3" />
        </svg>
      );
    case 'carpetRoll':
      return (
        <svg {...common}>
          <ellipse cx="6" cy="12" rx="3.5" ry="6" />
          <path d="M6 6h12a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H6" />
          <line x1="6" y1="18" x2="22" y2="18" />
          <path d="M9.5 9h9" strokeDasharray="2 2" />
          <path d="M9.5 12h9" strokeDasharray="2 2" />
          <path d="M9.5 15h9" strokeDasharray="2 2" />
        </svg>
      );
    case 'floorPlanks':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="10" y1="3" x2="10" y2="9" />
          <line x1="15" y1="9" x2="15" y2="15" />
          <line x1="8" y1="15" x2="8" y2="21" />
        </svg>
      );
    case 'paintRoller':
      return (
        <svg {...common}>
          <rect x="4" y="2" width="16" height="6" rx="2" />
          <path d="M20 5h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-10v5" />
          <rect x="10" y="16" width="4" height="6" rx="1" />
        </svg>
      );
    case 'rebar':
      return (
        <svg {...common}>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
          <line x1="7" y1="3" x2="7" y2="21" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="17" y1="3" x2="17" y2="21" />
        </svg>
      );
    case 'drywall':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2.5 2" />
          <circle cx="7" cy="7" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="17" cy="17" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'fence':
      return (
        <svg {...common}>
          <path d="M4 6v14" />
          <path d="M9 6v14" />
          <path d="M14 6v14" />
          <path d="M19 6v14" />
          <line x1="2" y1="9" x2="22" y2="9" />
          <line x1="2" y1="15" x2="22" y2="15" />
          <polygon points="4 3 6 6 2 6 4 3" />
          <polygon points="9 3 11 6 7 6 9 3" />
          <polygon points="14 3 16 6 12 6 14 3" />
          <polygon points="19 3 21 6 17 6 19 3" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <line x1="8" y1="11" x2="16" y2="11" />
          <line x1="8" y1="16" x2="13" y2="16" />
        </svg>
      );
    case 'guitar':
      return (
        <svg {...common}>
          <path d="m19 5-3 3" />
          <path d="m2 22 5.5-5.5" />
          <path d="m11 15.5 3-3a4 4 0 0 0-5.5-5.5l-3 3a4 4 0 0 0 5.5 5.5z" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <path d="M17 3l4 4" />
        </svg>
      );
    case 'percent':
      return (
        <svg {...common}>
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      );
    case 'tag':
    case 'discount':
      return (
        <svg {...common}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case 'margin':
      return (
        <svg {...common}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case 'unitPrice':
      return (
        <svg {...common}>
          <rect x="2" y="6" width="8" height="14" rx="2" />
          <rect x="13" y="2" width="9" height="18" rx="2" />
          <line x1="6" y1="11" x2="6" y2="15" />
          <line x1="17.5" y1="7" x2="17.5" y2="13" />
        </svg>
      );
    case 'wage':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <circle cx="12" cy="15" r="2" />
        </svg>
      );
    case 'capRate':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l8-4v18M13 21V9l6 3v9" />
          <path d="M9 10h1M9 14h1M9 18h1M16 14h1M16 18h1" />
        </svg>
      );
    case 'rentalProperty':
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
          <path d="M10 10h4" />
          <path d="M12 8v4" />
        </svg>
      );
    case 'laborCost':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      );
    case 'commercialLease':
      return (
        <svg {...common}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2" />
        </svg>
      );
    case 'airbnbHost':
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
          <path d="M12 9a2.5 2.5 0 0 0-2.5 2.5c0 1.5 2.5 4 2.5 4s2.5-2.5 2.5-4A2.5 2.5 0 0 0 12 9z" />
        </svg>
      );
    case 'freelanceRate':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 6 12 12 16 14" />
          <path d="M19 12h3M2 12h3" />
        </svg>
      );
    case 'contributionMargin':
      return (
        <svg {...common}>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
          <path d="M4 14l8-6 8-4" />
        </svg>
      );
    case 'commercialMortgage':
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h2M13 10h2M9 14h2M13 14h2M9 18h2M13 18h2" />
        </svg>
      );
    case 'equipmentLoan':
      return (
        <svg {...common}>
          <path d="M4 17h16M7 17v-4h6v4M5 21h14a2 2 0 0 0 2-2v-2H3v2a2 2 0 0 0 2 2zM13 13l4-7h4M10 6h4" />
        </svg>
      );
    case 'businessValuation':
      return (
        <svg {...common}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <path d="M4 11l4-4 4 4 6-6" />
          <polyline points="15 5 18 5 18 8" />
        </svg>
      );
    case 'presentValue':
      return (
        <svg {...common}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          <polyline points="7 3 2 8 7 13" />
        </svg>
      );
    case 'compoundInterest':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M7 17c4-1 6-5 9-13" />
          <polyline points="12 4 16 4 16 8" />
          <circle cx="16" cy="14" r="2" />
        </svg>
      );
    case 'processingFee':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="6" y1="15" x2="10" y2="15" />
          <circle cx="17" cy="15" r="1.5" />
        </svg>
      );
    case 'creditCardPayoff':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="6" y1="15" x2="10" y2="15" />
          <polyline points="15 13 17 15 20 12" />
        </svg>
      );
    case 'netWorth':
      return (
        <svg {...common}>
          <line x1="12" y1="3" x2="12" y2="21" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'heloc':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
          <path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
          <line x1="12" y1="9" x2="12" y2="12" />
          <polyline points="10 11 12 9 14 11" />
        </svg>
      );
    case 'investmentReturn':
      return (
        <svg {...common}>
          <line x1="3" y1="20" x2="21" y2="20" />
          <polyline points="4 14 10 9 15 13 21 5" />
          <polyline points="16 5 21 5 21 10" />
        </svg>
      );
    case 'drawdown':
      return (
        <svg {...common}>
          <path d="M5 22h14M5 2h14" />
          <path d="M17 2v5l-4 4 4 4v7M7 2v5l4 4-4 4v7" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <polyline points="10 15 12 17 14 15" />
        </svg>
      );
    case 'sbaLoan':
      return (
        <svg {...common}>
          <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z" />
          <circle cx="12" cy="14" r="1.5" />
        </svg>
      );
    case 'seTax':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="9" y1="12" x2="11" y2="12" />
        </svg>
      );
    case 'invoice':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'gridSearch':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <circle cx="16.5" cy="16.5" r="2.5" />
          <line x1="18.5" y1="18.5" x2="21" y2="21" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...common}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'bookOpen':
      return (
        <svg {...common}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case 'arrowRight':
      return (
        <svg {...common}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );
    case 'chevronDown':
      return (
        <svg {...common}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    default:
      return null;
  }
}

