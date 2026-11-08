// Site configuration: single source of truth for site-wide branding, domain, and contacts.

// TODO(owner): Replace "YourSiteName" with your actual site brand name before production launch.
export const SITE_NAME = 'YourSiteName';

// Base URL without trailing slash
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
).replace(/\/+$/, '');

export const SITE_TAGLINE = 'Free Online Generators & Creative Tools';

// TODO(owner): Replace with your real contact email address
export const OWNER_EMAIL = 'contact@example.com';

// TODO(owner): Replace with real owner/company name or brand statement
export const OWNER_NAME = 'YourSiteName Team';

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

