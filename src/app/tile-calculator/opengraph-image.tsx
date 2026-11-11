import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/config/site';

export const dynamic = 'force-static';
export const alt = `Tile Calculator – Tiles, Boxes & Grout Estimator - ${SITE_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div style={{ width: '12px', height: '40px', backgroundColor: '#38BDF8', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '64px', backgroundColor: '#0284C7', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '48px', backgroundColor: '#38BDF8', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '28px', backgroundColor: '#FBBF24', borderRadius: '6px' }} />
          <span
            style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#F8FAFC',
              marginLeft: '12px',
              letterSpacing: '-0.02em',
            }}
          >
            {SITE_NAME}
          </span>
        </div>
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '18px',
            letterSpacing: '-0.02em',
          }}
        >
          Tile Calculator
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Free Tile Sq Ft &amp; Box Estimator · Floors, Showers &amp; Backsplashes · Grout &amp; Mortar Included
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}

