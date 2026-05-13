import type { DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    error?: "RefreshAccessTokenError";
    user: { id: string; email: string } & DefaultSession["user"];
  }
  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    userId: string;
    userEmail: string;
    error?: "RefreshAccessTokenError";
  }
}