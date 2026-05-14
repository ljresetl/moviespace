import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Кіношрот — Дивитись фільми онлайн українською",
  description: "Найкраща добірка з 50 топових фільмів у високій якості. Тільки якісний український дубляж на Кіношрот.",
  keywords: ["кіношрот", "фільми українською", "дивитись онлайн", "топ 50 фільмів"],
  
  openGraph: {
    title: "Кіношрот — Найкращі фільми українською",
    description: "Збірка з 50 топових фільмів у високій якості. Дивись онлайн на Кіношрот.",
    url: "https://kinoshrot.com",
    siteName: "Кіношрот",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Кіношрот — онлайн кінотеатр",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Кіношрот — Дивитись фільми онлайн українською",
    description: "50 відібраних фільмів у високій якості.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body 
        style={{ 
          fontFamily: "var(--font-body)", 
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          
          <main style={{ flex: 1 }}>
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}