import type {
  RegisterResponse,
  LoginResponse,
  TokenRefreshResponse,
  UserProfile,
  ProfileUpdateData,
  PaginatedResponse,
} from './types';
import { ApiError } from './types';

// Реекспорт для зворотньої сумісності
export { ApiError };
export type {
  RegisterResponse,
  LoginResponse,
  TokenRefreshResponse,
  UserProfile,
  ProfileUpdateData,
  PaginatedResponse,
};

const DJANGO_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const REQUEST_TIMEOUT_MS = 10_000;

const isServer = typeof window === "undefined";
const BASE_URL = isServer ? DJANGO_URL : "/api/proxy";

// ── Базова функція ───────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit & { accessToken?: string } = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const { accessToken, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(fetchOptions.headers ?? {}),
  };

  const fullUrl = `${BASE_URL}${endpoint}`;

  console.log(`📤 [API] ${fetchOptions.method ?? "GET"} ${fullUrl}`);
  if (fetchOptions.body) {
    try {
      console.log("📦 Body:", JSON.parse(fetchOptions.body as string));
    } catch {
      console.log("📦 Body:", fetchOptions.body);
    }
  }
  if (accessToken) {
    console.log("🔑 Token:", accessToken.slice(0, 20) + "...");
  }

  try {
    const res = await fetch(fullUrl, {
      ...fetchOptions, headers, signal: controller.signal,
    });

    let body: unknown;
    try { body = await res.json(); } catch { body = await res.text(); }

    if (res.ok) {
      console.log(`✅ [API] ${res.status} ${endpoint}`, body);
    } else {
      console.error(`❌ [API] ${res.status} ${endpoint}`, body);
    }

    if (!res.ok) {
      throw new ApiError(res.status, body, extractErrorMessage(body));
    }
    return body as T;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.error(`⏱️ [API] Timeout ${endpoint}`);
      throw new ApiError(408, null, "Час очікування вичерпано");
    }
    if (error instanceof ApiError) throw error;
    console.error(`🔴 [API] Network error ${endpoint}`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Переклад помилок бекенду ─────────────────────────────────────
const ERROR_TRANSLATIONS: Record<string, string> = {
  // Паролі
  "Invalid password": "Невірний поточний пароль",
  "Invalid password.": "Невірний поточний пароль",
  "This password is too common.": "Цей пароль занадто простий",
  "This password is too short. It must contain at least 8 characters.": "Пароль занадто короткий. Мінімум 8 символів",
  "This password is entirely numeric.": "Пароль не може складатися лише з цифр",
  "This password must contain at least one special character (!@#$%^&*...).": "Пароль повинен містити хоча б один спецсимвол (!@#$%^&*...)",
  "This password must contain at least one digit.": "Пароль повинен містити хоча б одну цифру",
  "This password must contain at least one uppercase letter.": "Пароль повинен містити хоча б одну велику літеру",
  "This password must contain at least one lowercase letter.": "Пароль повинен містити хоча б одну малу літеру",
  "This password must contain at least one uppercase letter (A-Z).": "Пароль повинен містити хоча б одну велику літеру (A-Z)",
  "This password must contain at least one lowercase letter (a-z).": "Пароль повинен містити хоча б одну малу літеру (a-z)",
  "Password must contain only Latin letters, numbers, and standard symbols.": "Пароль може містити тільки латинські літери, цифри та стандартні символи",
  "The two password fields didn't match.": "Паролі не збігаються",
  "The password is too similar to the email.": "Пароль занадто схожий на email",
  "The password is too similar to the username.": "Пароль занадто схожий на ім'я користувача",
  // Авторизація
  "No active account found with the given credentials": "Акаунт з такими даними не знайдено",
  "No active account found with the given credentials.": "Акаунт з такими даними не знайдено",
  "Unable to log in with provided credentials.": "Невірний email або пароль",
  "User account is disabled.": "Акаунт деактивовано",
  "Authentication credentials were not provided.": "Необхідна авторизація",
  // Токени
  "Token is invalid or expired": "Посилання недійсне або прострочене",
  "Token is invalid or expired.": "Посилання недійсне або прострочене",
  "Invalid token.": "Недійсне посилання",
  "Given token not valid for any token type": "Токен недійсний. Увійдіть знову",
  "Token is blacklisted": "Сесія закінчилась. Увійдіть знову",
  // Поля
  "This field may not be blank.": "Це поле не може бути порожнім",
  "This field is required.": "Це поле обов'язкове",
  "Enter a valid email address.": "Введіть коректний email",
  "A user with that email already exists.": "Користувач з таким email вже існує",
  "user with this email already exists.": "Користувач з таким email вже існує",
  "Ensure this field has no more than 30 characters.": "Максимум 30 символів",
  "Ensure this field has no more than 15 characters.": "Максимум 15 символів",
  "Date has wrong format. Use one of these formats instead: DD/MM/YYYY.": "Невірний формат дати. Використовуйте ДД/ММ/РРРР",
  // Загальні
  "Not found.": "Не знайдено",
  "Account already activated": "Акаунт вже активовано",
};

const FIELD_NAMES: Record<string, string> = {
  email: "Email",
  password: "Пароль",
  confirm_password: "Підтвердження пароля",
  old_password: "Поточний пароль",
  new_password: "Новий пароль",
  first_name: "Ім'я",
  last_name: "Прізвище",
  phone: "Телефон",
  birthday: "Дата народження",
  detail: "Помилка",
  non_field_errors: "Помилка",
};

function translateError(msg: string): string {
  return ERROR_TRANSLATIONS[msg] ?? ERROR_TRANSLATIONS[msg.replace(/\.$/, '')] ?? msg;
}

function extractErrorMessage(body: unknown): string {
  if (typeof body === "string") return translateError(body);
  if (typeof body !== "object" || body === null) return "Невідома помилка";
  const b = body as Record<string, unknown>;
  if (typeof b.detail === "string") return translateError(b.detail);
  if (Array.isArray(b.non_field_errors)) return (b.non_field_errors as string[]).map(translateError).join(" ");
  const fieldErrors = Object.entries(b)
    .filter(([, v]) => Array.isArray(v))
    .map(([k, v]) => {
      const name = FIELD_NAMES[k] ?? k;
      const msgs = (v as string[]).map(translateError).join(", ");
      return `${name}: ${msgs}`;
    })
    .join("; ");
  return fieldErrors || JSON.stringify(body);
}

// ── AUTH ──────────────────────────────────────────────────────────

export async function registerUser(email: string, password: string, confirm_password: string) {
  console.log("🚀 [registerUser]", email);
  return request<RegisterResponse>("/users/register/", {
    method: "POST", body: JSON.stringify({ email, password, confirm_password }),
  });
}

export async function loginUser(email: string, password: string) {
  console.log("🚀 [loginUser]", email);
  return request<LoginResponse>("/login/", {
    method: "POST", body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(refresh: string) {
  console.log("🔄 [refreshToken]");
  return request<TokenRefreshResponse>("/token/refresh/", {
    method: "POST", body: JSON.stringify({ refresh }),
  });
}

// ── USERS ────────────────────────────────────────────────────────

export async function getCurrentUser(accessToken: string) {
  console.log("👤 [getCurrentUser]");
  return request<UserProfile>("/users/current-user/", { method: "GET", accessToken });
}

export async function changePassword(oldPassword: string, newPassword: string, confirmPassword: string, accessToken: string) {
  console.log("🔑 [changePassword]");
  return request<void>("/users/password-change/", {
    method: "POST",
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword }),
    accessToken,
  });
}

export async function resetPassword(email: string) {
  console.log("📧 [resetPassword]", email);
  return request<void>("/users/password-reset/", {
    method: "POST", body: JSON.stringify({ email }),
  });
}

export async function resetPasswordConfirm(uidb64: string, token: string, newPassword: string, confirmPassword: string) {
  console.log("🔓 [resetPasswordConfirm]", uidb64);
  return request<void>(`/users/password-reset-confirm/${uidb64}/${token}/`, {
    method: "POST",
    body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
  });
}

// ── PROFILES ─────────────────────────────────────────────────────

export async function getProfiles(accessToken: string, limit = 15, offset = 0) {
  console.log("📋 [getProfiles]");
  return request<PaginatedResponse<UserProfile>>(`/profiles/?limit=${limit}&offset=${offset}`, {
    method: "GET", accessToken,
  });
}

export async function getProfile(profileId: number, accessToken: string) {
  console.log("👤 [getProfile]", profileId);
  return request<UserProfile>(`/profiles/${profileId}/`, { method: "GET", accessToken });
}

export async function updateProfile(profileId: number, data: ProfileUpdateData, accessToken: string) {
  console.log("✏️ [updateProfile]", profileId, data);
  return request<UserProfile>(`/profiles/${profileId}/`, {
    method: "PUT", body: JSON.stringify(data), accessToken,
  });
}

export async function patchProfile(profileId: number, data: ProfileUpdateData, accessToken: string) {
  console.log("✏️ [patchProfile]", profileId, data);
  return request<UserProfile>(`/profiles/${profileId}/`, {
    method: "PATCH", body: JSON.stringify(data), accessToken,
  });
}