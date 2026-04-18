const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovies = async (endpoint: string) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    },
    next: { revalidate: 3600 } // Кешуємо дані на 1 годину
  };

  const res = await fetch(`${BASE_URL}${endpoint}?language=uk-UA`, options);
  if (!res.ok) throw new Error('Помилка при отриманні даних');
  const data = await res.json();
  return data.results;
};

export const getImageUrl = (path: string, size: string = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/no-poster.png';
};