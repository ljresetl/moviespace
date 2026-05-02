// lib/movieLinks.ts

const BASE_URL = process.env.NEXT_PUBLIC_PLAYER_BASE_URL || "https://tv-1-kinoserial.net/embed";
const TOKEN = process.env.NEXT_PUBLIC_PLAYER_TOKEN || "33a811c627033af901fb8aa5d449483c";

interface MovieOverride {
  iframe: string;
  customOverview?: string;
}

/**
 * Для автоматичних фільмів ми використовуємо префікс "tmdb"
 * Для ручних (де ви знаєте точний ID у базі балансера) можна передавати просто число.
 */
const createPlayer = (videoId: string | number): string => {
  // Якщо videoId це чистий TMDB ID (наприклад, 502356), додаємо префікс tmdb
  const finalId = typeof videoId === "number" || !videoId.startsWith("tmdb") 
    ? `tmdb${videoId}` 
    : videoId;

  return `<iframe src="${BASE_URL}/${finalId}/?token=${TOKEN}" width="100%" height="400" frameborder="0" allowfullscreen allow="autoplay *; fullscreen *"></iframe>`;
};

export const movieEmbedLinks: Record<number, MovieOverride> = {
  // Супер Маріо
  502356: {
    iframe: createPlayer(502356), 
    customOverview: `Маріо та Луїджі — звичайні водопровідники... (ваш текст)`
  },
  // Пристойне товариство
  977223: {
    iframe: createPlayer(977223),
    customOverview: "«Пристойне товариство» — це вибухова суміш..."
  },
  // Ті хто бажає мені смерті
  578701: {
    iframe: createPlayer(578701),
    customOverview: "«Ті, хто бажають мені смерті» — це напружений..."
  },
  // Вибух із минулого
  11622: {
    iframe: createPlayer(11622),
    customOverview: "«Вибух із минулого» — це неймовірно тепла..."
  },
  // Невозмутимый
  21338: {
    iframe: createPlayer(21338),
    customOverview: "«Невозмутимый» — це еталонний бойовик..."
  },
  // Суд над чиказькою сімкою
  556984: {
    iframe: createPlayer(556984),
    customOverview: "«Суд над чиказькою сімкою» — це потужна історична драма..."
  },
  // Піноккіо
  10895: {
    iframe: createPlayer(10895),
    customOverview: "Мультфільм «Піноккіо» (1940) — це шедевр анімації..."
  },
  // Бембі
  3170: {
    iframe: createPlayer(3170),
    customOverview: `Бембі (1942) — Зворушлива історія про життя...`
  },
  // Гра в кальмара: Бесіда
  1504735: {
    iframe: createPlayer(1504735),
    customOverview: "«Гра в кальмара: Бесіда...»"
  },
  // Гра в кальмара: Перезавантаження
  1285639: {
    iframe: createPlayer(1285639),
    customOverview: "«Гра в кальмара: Перезавантаження»..."
  },
  // Джон Уік 4
  603692: {
    iframe: createPlayer(603692),
    customOverview: "«Джон Уік 4» — це кульмінація епічної саги..."
  },
};