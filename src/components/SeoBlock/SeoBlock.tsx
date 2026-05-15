import Link from 'next/link';
import styles from './SeoBlock.module.css';

interface Movie {
  id: number;
  title: string;
  release_date: string;
}

interface Props {
  movieId?: string;
}

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
    ю: 'yu', я: 'ya', ъ: '', э: 'e', ы: 'y',
  };
  return text.split('').map(ch => map[ch] ?? ch).join('');
}

function getSlug(movie: Movie): string {
  const slug = transliterate(movie.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${movie.id}-${slug}`;
}

const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

async function fetchMovies(movieId?: string): Promise<Movie[]> {
  try {
    const headers = { Authorization: `Bearer ${TMDB_TOKEN}` };

    if (movieId) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?language=uk-UA&page=1`,
        { headers, next: { revalidate: 86400 } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || [])
        .filter((m: Movie) => m.id.toString() !== movieId)
        .slice(0, 30);
    }

    const [trendingRes, nowPlayingRes] = await Promise.all([
      fetch('https://api.themoviedb.org/3/trending/movie/week?language=uk-UA', {
        headers, next: { revalidate: 86400 },
      }),
      fetch('https://api.themoviedb.org/3/movie/now_playing?language=uk-UA&page=1', {
        headers, next: { revalidate: 86400 },
      }),
    ]);

    const trending = trendingRes.ok ? await trendingRes.json() : { results: [] };
    const nowPlaying = nowPlayingRes.ok ? await nowPlayingRes.json() : { results: [] };

    const all: Movie[] = [...(trending.results || []), ...(nowPlaying.results || [])];
    const unique: Movie[] = Array.from(
      new Map<number, Movie>(all.map((m) => [m.id, m])).values()
    ).slice(0, 50);

    return unique;
  } catch {
    return [];
  }
}

export default async function SeoBlock({ movieId }: Props) {
  const movies = await fetchMovies(movieId);

  if (movies.length === 0) return null;

  const title = movieId
    ? 'Схожі фільми — дивитися онлайн'
    : 'Обговорення фільмів на Кіношрот';

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.links}>
            {movies.map((movie, i) => {
              const year = movie.release_date?.split('-')[0];
              return (
                <span key={movie.id}>
                  <Link href={`/movie/${getSlug(movie)}`} className={styles.link}>
                    {movie.title} ({year}) {movieId ? 'онлайн' : 'Обговорення'}
                  </Link>
                  {i < movies.length - 1 && <span className={styles.divider}> | </span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}