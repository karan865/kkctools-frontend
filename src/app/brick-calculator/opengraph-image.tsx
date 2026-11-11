import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/config/site';

export const dynamic = 'force-static';
export const alt = `Brick Calculator: Estimate Bricks, Mortar & Costs - ${SITE_NAME}`;
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
            margin: '0 0 20px 0',
            lineHeight: 1.15,
            maxWidth: '1000px',
          }}
        >
          Free Brick Calculator
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#94A3B8',
            textAlign: 'center',
            margin: 0,
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Accurately Estimate Bricks, Mortar Bags, Pallets &amp; Wall Costs
        </p>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #334155',
              fontSize: '20px',
              color: '#38BDF8',
              fontWeight: 600,
            }}
          >
            Modular &amp; Standard Sizes
          </div>
          <div
            style={{
              backgroundColor: '#1E293B',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #334155',
              fontSize: '20px',
              color: '#38BDF8',
              fontWeight: 600,
            }}
          >
            Pre-Blended &amp; Site Mortar
          </div>
          <div
            style={{
              backgroundColor: '#1E293B',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #334155',
              fontSize: '20px',
              color: '#38BDF8',
              fontWeight: 600,
            }}
          >
            Door &amp; Window Deductions
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

