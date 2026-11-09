// Site configuration: single source of truth for site-wide branding, domain, and contacts.

export const SITE_NAME = 'KKC Tools';

// Base URL without trailing slash
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kkctools.com'
).replace(/\/+$/, '');

export const SITE_TAGLINE = 'Free Online Generators & Creative Tools';

export const OWNER_EMAIL = 'contact@kkctools.com';

export const OWNER_NAME = 'KKC Tools Team';

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

