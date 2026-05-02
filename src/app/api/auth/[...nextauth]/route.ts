// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import fs from "fs";
import path from "path";

// Визначаємо інтерфейс прямо тут, щоб уникнути помилок Type Error під час збірки
interface RegisteredUser {
  email: string | null | undefined;
  name?: string | null;
  image?: string | null;
  createdAt: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: User }): Promise<boolean> {
      if (user.email) {
        try {
          // Використовуємо шлях до src/data, як у нашому проекті на сервері
          const dataDir = path.join(process.cwd(), "src/data");
          const filePath = path.join(dataDir, "users.json");

          // Створюємо папку, якщо її не існує
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }

          // Перевіряємо існування файлу
          if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
          }

          const fileData = fs.readFileSync(filePath, "utf8");
          const users: RegisteredUser[] = JSON.parse(fileData);

          const userExists = users.some((u) => u.email === user.email);

          if (!userExists) {
            const newUser: RegisteredUser = {
              email: user.email,
              name: user.name,
              image: user.image,
              createdAt: new Date().toISOString(),
            };

            users.push(newUser);
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
            console.log(`Користувач ${user.email} збережений.`);
          }
        } catch (error) {
          console.error("Помилка бази даних (file system):", error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };