/**
 * Platform text length limits.
 * Sources verified per 00_BATCH6_BUILD_RULES.md §3.
 * Quarterly re-check: owner to verify official pages each quarter.
 */

export type LimitUnit = 'x-weighted' | 'chars' | 'graphemes' | 'bytes';

export interface TextLimitPreset {
  id: string;
  platform: string;
  field: string;
  limit: number;
  unit: LimitUnit;
  sourceUrl?: string;
  checkedOn: string;
  verified: boolean;
  notes?: string;
}

export const TEXT_LIMIT_PRESETS: TextLimitPreset[] = [
  {
    id: 'x-post',
    platform: 'X (Twitter)',
    field: 'Post (Tweet)',
    limit: 280,
    unit: 'x-weighted',
    sourceUrl: 'https://docs.x.com/fundamentals/counting-characters',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'x-bio',
    platform: 'X (Twitter)',
    field: 'Profile Bio',
    limit: 160,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'x-dm',
    platform: 'X (Twitter)',
    field: 'Direct Message',
    limit: 10000,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'ig-caption',
    platform: 'Instagram',
    field: 'Caption',
    limit: 2200,
    unit: 'chars',
    sourceUrl: 'https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'ig-bio',
    platform: 'Instagram',
    field: 'Bio',
    limit: 150,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'threads-post',
    platform: 'Threads',
    field: 'Post',
    limit: 500,
    unit: 'chars',
    sourceUrl: 'https://developers.facebook.com/docs/threads/posts',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'linkedin-post',
    platform: 'LinkedIn',
    field: 'Post update',
    limit: 3000,
    unit: 'chars',
    sourceUrl: 'https://www.linkedin.com/help/linkedin/answer/a528176',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'mastodon-post',
    platform: 'Mastodon',
    field: 'Default Instance Post',
    limit: 500,
    unit: 'chars',
    sourceUrl: 'https://docs.joinmastodon.org/user/posting/',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'youtube-title',
    platform: 'YouTube',
    field: 'Video Title',
    limit: 100,
    unit: 'chars',
    sourceUrl: 'https://support.google.com/youtube/answer/57404',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'youtube-desc',
    platform: 'YouTube',
    field: 'Video Description',
    limit: 5000,
    unit: 'chars',
    sourceUrl: 'https://support.google.com/youtube/answer/57404',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'discord-standard',
    platform: 'Discord',
    field: 'Standard Message',
    limit: 2000,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'discord-nitro',
    platform: 'Discord',
    field: 'Nitro Message',
    limit: 4000,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'bluesky-post',
    platform: 'Bluesky',
    field: 'Post',
    limit: 300,
    unit: 'graphemes',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'tiktok-bio',
    platform: 'TikTok',
    field: 'Bio',
    limit: 80,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: false,
    notes: "Unverified: check platform's help page",
  },
  {
    id: 'sms-gsm',
    platform: 'SMS Text',
    field: 'Single Segment (GSM-7)',
    limit: 160,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: true,
  },
  {
    id: 'sms-unicode',
    platform: 'SMS Text',
    field: 'Single Segment (UCS-2 / Unicode)',
    limit: 70,
    unit: 'chars',
    checkedOn: '2026-11-22',
    verified: true,
  },
];
