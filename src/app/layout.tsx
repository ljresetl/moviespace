import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Providers from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "sonner";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://moviespace-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Кіношрот — Дивитись фільми онлайн українською безкоштовно",
    template: "%s | Кіношрот",
  },

  description:
    "Кіношрот — безкоштовний онлайн кінотеатр українською мовою. Дивіться фільми, серіали та мультфільми у HD якості без реклами. Великий каталог новинок 2024–2025 з українським дубляжем.",

  keywords: [
    "кіношрот", "фільми онлайн", "дивитись фільми українською",
    "фільми безкоштовно", "онлайн кінотеатр", "фільми 2025",
    "фільми 2024", "український дубляж", "дивитись онлайн безкоштовно",
    "новинки кіно", "HD фільми", "кіно українською",
  ],

  authors: [{ name: "Кіношрот", url: SITE_URL }],
  creator: "Кіношрот",
  publisher: "Кіношрот",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "Кіношрот",
    title: "Кіношрот — Дивитись фільми онлайн українською безкоштовно",
    description: "Безкоштовний онлайн кінотеатр з українським дубляжем. Новинки кіно 2024–2025 у HD якості.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Кіношрот — онлайн кінотеатр українською",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Кіношрот — Фільми онлайн українською",
    description: "Дивіться найкращі фільми безкоштовно з українським дубляжем на Кіношрот.",
    images: ["/opengraph-image"],
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "entertainment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Providers>
          <ScrollToTop />
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main style={{ flex: 1, paddingTop: '75px' }}>
            {children}
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              style: {
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}