import type { MetadataRoute } from 'next';

const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinoshrot.com';

function transliterate(text: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '',
    ю: 'yu', я: 'ya', ъ: '', э: 'e', ы: 'y',
    А: 'A', Б: 'B', В: 'V', Г: 'H', Ґ: 'G', Д: 'D', Е: 'E', Є: 'Ye',
    Ж: 'Zh', З: 'Z', И: 'Y', І: 'I', Ї: 'Yi', Й: 'Y', К: 'K', Л: 'L',
    М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U',
    Ф: 'F', Х: 'Kh', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Shch', Ь: '',
    Ю: 'Yu', Я: 'Ya', Ъ: '', Э: 'E', Ы: 'Y',
  };
  return text.split('').map(ch => map[ch] ?? ch).join('');
}

function toSlug(title: string, id: number): string {
  const slug = transliterate(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${id}-${slug}`;
}

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
}

async function fetchPopularMovies(): Promise<TMDBMovie[]> {
  if (!TMDB_TOKEN) return [];

  const movies: TMDBMovie[] = [];

  // 3 сторінки по 20 = 60 фільмів, беремо 50
  for (let page = 1; page <= 3; page++) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=${page}`,
        {
          headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
          next: { revalidate: 86400 }, // кеш 24 години
        }
      );

      if (!res.ok) break;

      const data = await res.json();
      movies.push(...(data.results || []));
    } catch {
      break;
    }
  }

  return movies.slice(0, 50);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await fetchPopularMovies();

  // Статичні сторінки
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Сторінки фільмів
  const moviePages: MetadataRoute.Sitemap = movies.map(movie => ({
    url: `${SITE_URL}/movie/${toSlug(movie.title, movie.id)}`,
    lastModified: movie.release_date ? new Date(movie.release_date) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...moviePages];
}