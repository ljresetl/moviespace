const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovies = async (endpoint: string) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    },
    next: { revalidate: 3600 } 
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?language=uk-UA`, options);
    
    if (!res.ok) {
      // Замість паніки просто виводимо помилку в консоль білду
      console.error(`TMDB Fetch Error: ${res.status} ${res.statusText}`);
      return []; 
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    // Якщо пропав інтернет або API лежить, повертаємо порожній список, щоб сайт зібрався
    console.error("Failed to fetch movies:", error);
    return [];
  }
};

export const getImageUrl = (path: string, size: string = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/no-poster.png';
};