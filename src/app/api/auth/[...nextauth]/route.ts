// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import fs from "fs";
import path from "path";
import { RegisteredUser } from "@/types/movie";

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
          const filePath = path.join(process.cwd(), "users.json");
          
          // Перевіряємо існування файлу, щоб уникнути помилки при першому читанні
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
    // Додаємо типізацію для сесії, щоб email був доступний на фронтенді
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
        secure: process.env.NODE_ENV === "production", // Автоматично true на Vercel
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };