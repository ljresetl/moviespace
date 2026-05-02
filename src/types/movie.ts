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

/** Базовий об'єкт фільму для списків та пошуку */
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
  // Додаткові поля, що можуть з'являтися після обробки на бекенді
  posterUrl?: string; 
  rating?: number | string;
  year?: string | number;
}

/** Розширені деталі фільму (отримані за ID) */
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

// --- 3. Локальні дані (movies.json / Videoseed / Vibix) ---

/** Структура одного запису у вашому локальному JSON-файлі */
export interface MovieEntry {
  id_tmdb: string | number;
  id_kp: string | number;
  iframe: string; // Основне посилання з Videoseed
  name?: string;
  original_name?: string;
  year?: string;
  poster?: string;
}

/** Кореневий об'єкт файлу movies.json */
export interface MoviesJsonData {
  last_update?: string;
  data: MovieEntry[];
}

// --- 4. Актори, Команда та Коментарі ---

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  userId?: string; // Для зв'язку з профілем
}

// --- 5. Користувачі та Сесії (для Next-Auth) ---

export interface RegisteredUser {
  id?: string;
  email: string | null | undefined;
  name?: string | null;
  image?: string | null;
  role?: 'user' | 'admin' | 'premium';
  createdAt?: string;
}

// --- 6. Пропси для Компонентів ---

/** Пропси для сторінкиMovieDetailsContent.tsx */
export interface ExtendedMovieDetailsProps {
  movie: MovieDetails;
  trailerKey: string | null;
  cast: CastMember[]; // Масив об'єктів для рендеру карток акторів
  director: string;
  playerToken?: string; // Токен для Vibix/Videoseed
}

/** Параметри фільтрації (для сторінок категорій) */
export interface DiscoverFilters {
genre?: string | string[];   // Додано | string[]
  year?: string | string[];    // Додано | string[]
  country?: string | string[]; // Додано | string[]
  page?: string | string[];    // Додано | string[]
  sort_by?: string | string[]; // Додано | string[]
}

// --- 7. Відповіді API ---

/** Стандартна відповідь від API перевірки доступності фільму */
export interface CheckMovieResponse {
  found: boolean;
  player1Url?: string; // Videoseed (з файлу)
  player2Url?: string; // Vibix (з API)
  kp_id?: string | number | null;
  error?: string;
}

/** Спрощена структура відповіді від Vibix API */
export interface VibixVideoResponse {
  id: number;
  iframe_url: string;
  kp_id: number;
  name?: string;
  quality?: string;
}

/** Типова відповідь від TMDB API для пагінації */
export interface TMDBPaginationResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Додайте це до src/types/movie.ts

export interface HomePageProps {
params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}