import { MetadataRoute } from 'next';
import { TMDBResponse, Movie } from '@/types/movie';

const BASE_URL = 'https://moviespace-qd6p.vercel.app/'; 

// Копія функції транслітерації для однаковості посилань
const transliterate = (text: string): string => {
  const map: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
    'ю': 'yu', 'я': 'ya'
  };
  
  return text
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Статичні сторінки
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // 2. Динамічні сторінки фільмів
  const movieRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const pagesToFetch = [1, 2, 3]; // 60 фільмів
    
    for (const pageNumber of pagesToFetch) {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=uk-UA&page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            accept: 'application/json'
          },
          next: { revalidate: 86400 }
        }
      );
      
      const data: TMDBResponse = await res.json();
      
      if (data.results) {
        data.results.forEach((movie: Movie) => {
          movieRoutes.push({
            url: `${BASE_URL}/movie/${movie.id}-${transliterate(movie.title)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticRoutes, ...movieRoutes];
}