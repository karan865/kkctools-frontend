import type { MetadataRoute } from 'next';
import { INDEXABLE_ROUTES } from '@/lib/routes';
import { SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(route.updated),
    changeFrequency:
      route.type === 'home' || route.type === 'tool' || route.type === 'genre'
        ? ('weekly' as const)
        : ('monthly' as const),
    priority:
      route.type === 'home'
        ? 1.0
        : route.type === 'tool'
          ? 0.9
          : route.type === 'genre'
            ? 0.8
            : 0.6,
  }));
}

