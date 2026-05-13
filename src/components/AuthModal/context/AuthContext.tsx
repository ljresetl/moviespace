"use client";

import React, { createContext, useContext, useCallback, type ReactNode } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";

// Визначаємо розширений тип сесії прямо тут
// (не залежимо від module augmentation)
interface ExtendedSession {
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

interface AuthContextValue {
  session: ExtendedSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isAuthenticated: boolean;
  accessToken: string | null;
  userEmail: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthContextInner({ children }: { children: ReactNode }) {
  const { data, status } = useSession();

  // Кастимо до нашого розширеного типу
  const session = data as ExtendedSession | null;

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        status,
        isAuthenticated: status === "authenticated",
        accessToken: session?.accessToken ?? null,
        userEmail: session?.user?.email ?? null,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 60}>
      <AuthContextInner>{children}</AuthContextInner>
    </SessionProvider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() має бути всередині <AuthProvider>");
  return ctx;
}