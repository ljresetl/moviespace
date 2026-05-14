import { NextRequest, NextResponse } from 'next/server';

const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!TMDB_TOKEN) {
    return NextResponse.json({ error: 'TMDB token not configured' }, { status: 500 });
  }

  const tmdbPath = path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${TMDB_BASE}/${tmdbPath}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'TMDB request failed' }, { status: 502 });
  }
}