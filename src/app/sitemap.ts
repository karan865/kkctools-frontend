import type { MetadataRoute } from 'next';
import { INDEXABLE_ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Only loc + lastmod: Google ignores priority and changefreq.
  return INDEXABLE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(route.updated),
  }));
}

