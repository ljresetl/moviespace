// lib/tmdb.ts
import { 
  Movie, 
  DiscoverFilters, 
  TMDBResponse, 
  MovieDetails, 
  CreditsResponse, 
  MovieVideosResponse, 
  Video 
} from "@/types/movie";

const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Утиліта для отримання заголовків авторизації
 */
const getAuthOptions = () => ({
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
  }
});

// 1. Отримання загальних списків (Trending, Популярні тощо)
export const getMovies = async (endpoint: string): Promise<Movie[]> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?language=uk-UA`, {
      ...getAuthOptions(),
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);

    const data: TMDBResponse = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];
  }
};

// 2. Каталог з фільтрацією та пагінацією
export const discoverMovies = async (
  filters: DiscoverFilters, 
  page: number
): Promise<TMDBResponse> => {
  const { genre, year, country } = filters;
  const filterYear = year === "Усі роки" ? "" : year;

  const params = new URLSearchParams({
    language: 'uk-UA',
    page: page.toString(),
    with_genres: genre || "",
    primary_release_year: filterYear || "",
    with_origin_country: country || "",
    sort_by: 'popularity.desc'
  });

  try {
    const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
      ...getAuthOptions(),
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error(`TMDB Discover Error: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("Failed to discover movies:", error);
    return { results: [], total_pages: 1, page: 1, total_results: 0 };
  }
};

// 3. Детальна інформація про конкретний фільм
export const getMovieDetails = async (id: number): Promise<MovieDetails | null> => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?language=uk-UA`, {
      ...getAuthOptions(),
      next: { revalidate: 86400 }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    return null;
  }
};

// 4. Отримання акторського складу та знімальної групи
export const getMovieCredits = async (id: number): Promise<CreditsResponse | null> => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}/credits?language=uk-UA`, {
      ...getAuthOptions(),
      next: { revalidate: 86400 }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch credits:", error);
    return null;
  }
};

// 5. Отримання ключа трейлера (YouTube)
export const getMovieVideos = async (id: number): Promise<string | null> => {
  const options = {
    ...getAuthOptions(),
    next: { revalidate: 86400 }
  };

  try {
    // Спочатку шукаємо українською
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?language=uk-UA`, options);
    const data: MovieVideosResponse = await res.json();
    
    let trailer = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
    
    // Якщо українською немає, шукаємо оригінал (англійською)
    if (!trailer) {
      const resEn = await fetch(`${BASE_URL}/movie/${id}/videos`, options);
      const dataEn: MovieVideosResponse = await resEn.json();
      trailer = dataEn.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
    }
    
    return trailer?.key || data.results?.[0]?.key || null;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return null;
  }
};

// 6. Утиліта для формування URL зображень
export const getImageUrl = (path: string, size: string = 'w500'): string => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/no-poster.png';
};

// 7. Пошук фільмів (для використання в Клієнтських компонентах)
export const searchMoviesClient = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  
  try {
    // Ми робимо запит до НАШОГО сервера, а не до TMDB напряму
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    
    if (!res.ok) throw new Error("Search failed");
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};