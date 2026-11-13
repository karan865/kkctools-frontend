// Served as a real .png file so og:image / apple-touch-icon URLs resolve with an image content type.
import { ImageResponse } from 'next/og';

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
          borderRadius: '36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '40px', backgroundColor: '#A78BFA', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '64px', backgroundColor: '#A78BFA', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '48px', backgroundColor: '#A78BFA', borderRadius: '4px' }} />
          <div style={{ width: '8px', height: '24px', backgroundColor: '#FBBF24', borderRadius: '4px' }} />
        </div>
      </div>
    ),
    {
      width: 180,
      height: 180,
    }
  );
}

