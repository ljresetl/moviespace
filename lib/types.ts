// ══════════════════════════════════════════════════════════════
//  SHARED TYPES — єдине джерело типів для всього проєкту
// ══════════════════════════════════════════════════════════════

// ── API Responses ────────────────────────────────────────────
export interface RegisterResponse {
  email: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}

// ── User & Profile ──────────────────────────────────────────
export interface UserInfo {
  id: number;
  email: string;
  is_active: boolean;
}

export interface UserProfile {
  id: number;
  user: UserInfo;
  first_name: string;
  last_name: string;
  birthday: string | null;
  phone: string | null;
}

export interface ProfileUpdateData {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  birthday?: string | null;
}

// ── Pagination ──────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Session (NextAuth extended) ─────────────────────────────
export interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

// ── API Error ───────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string
  ) {
    super(message ?? `API Error ${status}`);
    this.name = "ApiError";
  }
}

// ── TMDB Movie ──────────────────────────────────────────────
export interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface MovieVideo {
  key: string;
  type: string;
  site: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  videos?: { results: MovieVideo[] };
  credits?: { cast: Actor[] };
  external_ids?: {
    kp_id?: string | number;
    imdb_id?: string;
  };
}

// ── TMDB Actor Details ──────────────────────────────────────
export interface ActorDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  also_known_as: string[];
}

export interface ActorMovieCredit {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}