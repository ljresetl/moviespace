import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Providers } from "@/components/Providers"; // Імпортуємо наш новий провайдер

export const metadata: Metadata = {
  title: "KinoShrot - Твій онлайн кінотеатр",
  description: "Найкращі фільми онлайн українською мовою. Відкрий для себе світ кіно з KinoShrot!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <Providers> {/* Обгортка для авторизації NextAuth */}
          <Header />
          <main>
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}