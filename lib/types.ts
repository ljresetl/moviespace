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