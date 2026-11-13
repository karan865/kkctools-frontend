import { ImageResponse } from 'next/og';

// 512×512 PNG logo for the Organization schema (Google needs a raster logo ≥ 112 px).
// Same mark as apple-icon.tsx, scaled up.
export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0E0C14',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '17px' }}>
          <div style={{ width: '23px', height: '114px', backgroundColor: '#A78BFA', borderRadius: '11px' }} />
          <div style={{ width: '23px', height: '182px', backgroundColor: '#A78BFA', borderRadius: '11px' }} />
          <div style={{ width: '23px', height: '137px', backgroundColor: '#A78BFA', borderRadius: '11px' }} />
          <div style={{ width: '23px', height: '68px', backgroundColor: '#FBBF24', borderRadius: '11px' }} />
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
