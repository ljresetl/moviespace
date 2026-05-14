import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Кіношрот — онлайн кінотеатр українською';
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
          background: 'linear-gradient(135deg, #0a0e17 0%, #1a1f2e 50%, #0a0e17 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Декоративні елементи */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #ff5c00, transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #ff5c00, transparent)',
          }}
        />

        {/* Логотип */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: 64 }}>🎬</span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff5c00, #ff8c40)',
              backgroundClip: 'text',
              color: '#ff5c00',
              letterSpacing: '-2px',
            }}
          >
            КІНОШРОТ
          </span>
        </div>

        {/* Підзаголовок */}
        <div
          style={{
            fontSize: 36,
            color: '#e0e0e0',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          Дивитись фільми онлайн українською
        </div>

        {/* Теги */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            fontSize: 22,
            color: '#888',
          }}
        >
          <span>✦ Безкоштовно</span>
          <span>✦ HD якість</span>
          <span>✦ Без реклами</span>
          <span>✦ Український дубляж</span>
        </div>
      </div>
    ),
    { ...size }
  );
}