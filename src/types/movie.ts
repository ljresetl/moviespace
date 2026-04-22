// types/movie.ts

// --- Базові сутності ---

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

// --- Фільми ---

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number; // В хвилинах
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  original_language: string; 
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

// --- Відповіді API (TMDB) ---

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// --- Відео та Трейлери ---

export interface Video {
  id?: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  key: string;       // ID відео на YouTube
  name?: string;
  site: string;      // "YouTube"
  size?: number;
  type: string;      // "Trailer", "Teaser" тощо
  official?: boolean;
  published_at?: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

// --- Актори та Команда ---

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

// --- Коментарі та Відгуки ---

export interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

// --- Пропси для компонентів (Next.js 15) ---

export interface DiscoverFilters {
  genre?: string;
  year?: string;
  country?: string;
}

export interface HomePageFilters extends DiscoverFilters {
  page?: string;
}

export interface HomePageProps {
  searchParams: Promise<HomePageFilters>;
}

export interface MovieCardAllProps {
  movies: Movie[];
  totalPages: number;
  currentPage: number;
  hasFilters: boolean;
}

export interface MovieDetailsProps {
  movie: MovieDetails;
  trailerKey: string | null;
  cast: Cast[];
  director: string;
}