/**
 * ТИПИ ДЛЯ ФІЛЬМІВ ТА API (Next.js + TMDB + Videoseed + Vibix)
 */

// --- 1. Базові сутності ---
export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// --- 2. Фільми (TMDB) ---
export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  overview?: string;
  popularity?: number;
  adult?: boolean;
  video?: boolean;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  budget: number;
  revenue: number;
  status?: string;
  tagline: string | null;
  original_language?: string;
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
}

// --- 3. Локальні дані (movies.json / Videoseed) ---
export interface MovieEntry {
  id_tmdb: string | number;
  id_kp: string | number;
  iframe: string; // Основне посилання з Videoseed
  name?: string;
}

export interface MoviesJsonData {
  data: MovieEntry[];
}

// --- 4. Коментарі та Credits ---
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

// --- 5. Пропси для Компонентів ---
export interface ExtendedMovieDetailsProps {
  movie: MovieDetails;
  trailerKey: string | null;
  cast: CastMember[];
  director: string;
}

// --- 6. Відповіді API ---
export interface CheckMovieResponse {
  found: boolean;
  player1Url?: string; // Videoseed (з файлу)
  player2Url?: string; // Vibix (з API)
  kp_id?: string | number | null;
  error?: string;
}

export interface VibixVideoResponse {
  id: number;
  iframe_url: string;
  kp_id: number;
}