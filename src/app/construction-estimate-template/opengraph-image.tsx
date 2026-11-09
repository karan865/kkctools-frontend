import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/config/site';

export const dynamic = 'force-static';
export const alt = `Free Construction Estimate Template - ${SITE_NAME}`;
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
            marginBottom: '28px',
          }}
        >
          <div style={{ width: '12px', height: '40px', backgroundColor: '#A78BFA', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '64px', backgroundColor: '#A78BFA', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '48px', backgroundColor: '#A78BFA', borderRadius: '6px' }} />
          <div style={{ width: '12px', height: '28px', backgroundColor: '#FBBF24', borderRadius: '6px' }} />
          <span
            style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#F4F1FA',
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
          Construction Estimate Template
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#C4BFD3',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Free Online Builder · Print-to-PDF · CSV Export · Tax &amp; Markup Calculator
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}

