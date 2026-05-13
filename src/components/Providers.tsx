 "use client"; //Цей файл щоб працювала авторизація по всьому сайту, обгортає все в SessionProvider з next-auth/react, щоб можна було отримувати сесію користувача в будь-якому компоненті.

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}