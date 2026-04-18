export const GENRES = [
  { id: "", name: "Усі жанри" },
  { id: "28", name: "Бойовики" },
  { id: "35", name: "Комедії" },
  { id: "18", name: "Драми" },
  { id: "27", name: "Жахи" },
  { id: "53", name: "Трилери" },
  { id: "10749", name: "Мелодрами" },
  { id: "878", name: "Фантастика" },
  { id: "16", name: "Мультфільми" },
  { id: "12", name: "Пригоди" },
  { id: "36", name: "Історія" },
  { id: "10752", name: "Військові" },
  { id: "9648", name: "Детектив" },
];

// Країни (коди стандартні для фільтрів API)
export const COUNTRIES = [
  { id: "", name: "Усі країни" },
  { id: "US", name: "США" },
  { id: "UA", name: "Україна" },
  { id: "FR", name: "Франція" },
  { id: "GB", name: "Велика Британія" },
  { id: "DE", name: "Німеччина" },
  { id: "IT", name: "Італія" },
  { id: "KR", name: "Південна Корея" },
  { id: "JP", name: "Японія" },
];

// Генеруємо роки від поточного (2026) до 1990
const currentYear = 2026;
export const YEARS = [
  "Усі роки", 
  ...Array.from({ length: currentYear - 1990 + 1 }, (_, i) => (currentYear - i).toString())
];