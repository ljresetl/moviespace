import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Імпортуємо сучасний шрифт
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Providers } from "@/components/Providers";

// Налаштовуємо шрифт: він завантажиться один раз і буде зберігатися локально на сервері
const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  display: "swap", // Запобігає невидимому тексту під час завантаження
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "KinoShrot — Твій онлайн кінотеатр | Дивитись фільми українською",
    template: "%s | KinoShrot"
  },
  description: "Найкращі фільми онлайн українською мовою у високій якості. Величезна бібліотека кіно, новинки прокату та класика на KinoShrot!",
  keywords: ["фільми українською", "кіно онлайн", "дивитись фільми", "KinoShrot", "фільми в хорошій якості"],
  alternates: {
    canonical: "https://kinoshrot.com",
  },
  openGraph: {
    title: "KinoShrot — Твій онлайн кінотеатр",
    description: "Відкрий для себе світ кіно з KinoShrot!",
    url: "https://kinoshrot.com",
    siteName: "KinoShrot",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={inter.variable}>
      {/* Додаємо inter.className до body, щоб застосувати шрифт до всього сайту */}
      <body className={inter.className}>
        <Providers>
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