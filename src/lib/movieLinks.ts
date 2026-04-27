const BASE_URL = process.env.NEXT_PUBLIC_PLAYER_BASE_URL;
const TOKEN = process.env.NEXT_PUBLIC_PLAYER_TOKEN;

// Функція-конструктор для створення повного коду iframe
const createPlayer = (videoId: string) => {
  return `<iframe src="${BASE_URL}/${videoId}/?token=${TOKEN}" width="100%" height="400" frameborder="0" allowfullscreen allow="autoplay *; fullscreen *"></iframe>`;
};

export const movieEmbedLinks: Record<number, string> = {
  13494: createPlayer("273000"),
  502356: createPlayer("56472"),
  936075: createPlayer("1060172"),
};