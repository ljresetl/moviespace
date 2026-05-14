import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginUser, refreshToken as apiRefreshToken } from "../../../../../lib/api";
import type { JWT } from "next-auth/jwt";

const ACCESS_TOKEN_LIFETIME_MS = 5 * 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("🔄 [JWT] Refreshing access token...");
    const refreshed = await apiRefreshToken(token.refreshToken);
    console.log("✅ [JWT] Token refreshed successfully");
    return {
      ...token,
      accessToken: refreshed.access,
      refreshToken: refreshed.refresh ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME_MS,
      error: undefined,
    };
  } catch (error) {
    console.error("❌ [JWT] Token refresh failed:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Вкажіть email та пароль");
        }
        try {
          const tokens = await loginUser(credentials.email, credentials.password);
          return {
            id: credentials.email,
            email: credentials.email,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME_MS,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Помилка входу");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/", error: "/" },
  callbacks: {
    async jwt({ token, user, account }) {
      // Перший вхід через credentials
      if (user && account?.provider === "credentials") {
        return {
          ...token,
          accessToken: user.accessToken!,
          refreshToken: user.refreshToken!,
          accessTokenExpires: user.accessTokenExpires!,
          userId: user.id,
          userEmail: user.email!,
        };
      }
      // Перший вхід через Google
      if (account?.provider === "google") {
        return {
          ...token,
          accessToken: account.access_token ?? "",
          refreshToken: account.refresh_token ?? "",
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600000,
          userId: user?.id ?? "",
          userEmail: user?.email ?? "",
        };
      }
      // Токен ще дійсний (з запасом 60 секунд)
      if (Date.now() < ((token.accessTokenExpires ?? 0) - 60_000)) {
        return token;
      }
      // Оновлюємо токен
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      session.user = { ...session.user, id: token.userId, email: token.userEmail };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };