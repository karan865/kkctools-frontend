// Served as a real .png file so og:image / apple-touch-icon URLs resolve with an image content type.
import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/config/site';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0E0C14',
          color: '#F4F1FA',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div style={{ width: '12px', height: '40px', backgroundColor: '#A78BFA', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '64px', backgroundColor: '#A78BFA', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '48px', backgroundColor: '#A78BFA', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '28px', backgroundColor: '#FBBF24', borderRadius: '6px' }} />
          <span
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#F4F1FA',
              marginLeft: '12px',
              letterSpacing: '-0.02em',
            }}
          >
            {SITE_NAME}
          </span>
        </div>
        <p
          style={{
            fontSize: '32px',
            color: '#C4BFD3',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
          }}
        >
          {SITE_TAGLINE}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
