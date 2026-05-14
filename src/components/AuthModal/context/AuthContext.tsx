"use client";

import React, { createContext, useContext, useCallback, useState, type ReactNode } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";

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
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthContextInner({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  const session = data as ExtendedSession | null;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        session,
        status,
        isAuthenticated: status === "authenticated",
        accessToken: session?.accessToken ?? null,
        userEmail: session?.user?.email ?? null,
        logout,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={3 * 60}>
      <AuthContextInner>{children}</AuthContextInner>
    </SessionProvider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() має бути всередині <AuthProvider>");
  return ctx;
}