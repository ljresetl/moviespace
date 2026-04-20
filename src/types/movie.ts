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

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

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

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3116_1: string;
  key: string;      // Це головне — ID відео на YouTube
  name: string;
  site: string;     // Зазвичай "YouTube"
  size: number;
  type: string;     // "Trailer", "Teaser", "Featurette" тощо
  official: boolean;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}