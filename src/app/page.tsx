import { Suspense } from 'react';
import HomePage from '@/components/HomePage';

export const dynamic = 'force-dynamic';

async function getTrendingMovie() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(
      'https://api.themoviedb.org/3/trending/movie/week?language=uk-UA',
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const heroMovie = await getTrendingMovie();

  return (
    <Suspense fallback={null}>
      <HomePage heroMovie={heroMovie} />
    </Suspense>
  );
}