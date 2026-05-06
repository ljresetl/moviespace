import type { Metadata } from "next";
import Header from "@/components/Header/Header"; // Перевір, щоб шлях співпадав з твоєю структурою
import Footer from "@/components/Footer/Footer"; // Перевір, щоб шлях співпадав з твоєю структурою
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
          display: "flex",       // Додаємо flex, щоб футер завжди був знизу
          flexDirection: "column"
        }}
      >
        <Header />
        
        {/* main з flex: 1 розтягується, штовхаючи футер вниз, якщо контенту мало */}
        <main style={{ flex: 1 }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}