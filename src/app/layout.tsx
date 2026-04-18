import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app"; // 1. Додаємо імпорт адаптера
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "MovieSpace - Твій онлайн кінотеатр",
  description: "Найкращі фільми онлайн українською мовою. Відкрий для себе світ кіно з MovieSpace!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="bg-black text-white antialiased">
        <Header />
        <main className="min-h-screen">
          {/* 2. Обгортаємо children в NuqsAdapter */}
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </main>
        <Footer />
      </body>
    </html>
  );
}