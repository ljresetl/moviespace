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
  popularity: number;
  adult: boolean;
  video: boolean;
  genre_ids?: number[]; // Опціонально, бо в деталях приходять об'єкти genres
}

export interface MovieDetails extends Movie {
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

// --- Актори та Команда ---
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
}

export interface CreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// --- Відео та Трейлери ---
export interface Video {
  key: string;       // ID відео на YouTube
  site: string;      // "YouTube"
  type: string;      // "Trailer", "Teaser"
  official: boolean;
}

// --- Коментарі та Користувачі ---
export interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

export interface RegisteredUser {
  email: string;
  name?: string | null;
  image?: string | null;
  createdAt: string;
}

// --- Фільтри та Пропси (Next.js 15) ---
export interface DiscoverFilters {
  genre?: string;
  year?: string;
  country?: string;
}

export interface HomePageFilters extends DiscoverFilters {
  page?: string;
}

export interface MovieDetailsProps {
  movie: MovieDetails;
  trailerKey: string | null;
  director: string;
  cast: CastMember[];
}

// Розширений інтерфейс для клієнтського компонента
export interface ExtendedMovieDetailsProps extends MovieDetailsProps {
  playerToken: string;
}

// Відповіді API
export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}