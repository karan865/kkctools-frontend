// Site configuration: single source of truth for site-wide branding, domain, and contacts.

export const SITE_NAME = 'KKC Tools';

// Base URL without trailing slash
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kkctools.com'
).replace(/\/+$/, '');

export const SITE_TAGLINE = 'Free Construction Calculators & Online Tools';

export const SITE_DESCRIPTION =
  'Free construction and landscaping calculators (concrete, drywall, rebar, gravel, brick, paint and more) plus naming generators. Everything runs in your browser; nothing you type is sent anywhere.';

// Stable schema.org node ids, shared by every page so the JSON-LD forms one connected graph.
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SITE_LOGO_URL = `${SITE_URL}/logo.png`;
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/opengraph-image.png`;

export const OWNER_EMAIL = 'kkchub1@gmail.com';

export const OWNER_NAME = 'KKC Tools Team';

// The real person who runs the site (supplied by the owner, 2026-11-15). Used on /about/ and in the
// Organization `founder` schema. Do not add a background or credentials that the owner has not given.
export const FOUNDER = {
  name: 'Karan Kumar',
  role: 'Founder & developer',
  qualification: 'Senior software engineer',
  email: OWNER_EMAIL,
  instagram: 'https://www.instagram.com/karankryadav3/',
} as const;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

