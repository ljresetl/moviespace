// Жанри (ID відповідають стандартам TMDB API)
export const GENRES = [
  { id: "", name: "Усі жанри" },
  { id: "14", name: "Фентезі" },
  { id: "10751", name: "Сімейні" },
  { id: "12", name: "Пригоди" },
  { id: "35", name: "Комедії" },
  { id: "16", name: "Мультфільми" },
  { id: "28", name: "Бойовики" },
  { id: "18", name: "Драми" },
  { id: "53", name: "Трилери" },
  { id: "27", name: "Жахи" },
  { id: "878", name: "Фантастика" },
  { id: "biography", name: "Біографія" }, // Іноді передається як keyword
  { id: "36", name: "Історія" },
  { id: "9648", name: "Детектив" },
  { id: "10749", name: "Мелодрами" },
  { id: "80", name: "Кримінал" },
  { id: "10752", name: "Воєнні" },
  { id: "37", name: "Вестерни" },
  { id: "anime", name: "Аніме" },
  { id: "sport", name: "Спорт" },
  { id: "dorama", name: "Дорами" },
  { id: "99", name: "Документальні" },
  { id: "10402", name: "Музика" },
];

// Країни (Коди ISO 3166-1)
export const COUNTRIES = [
  { id: "", name: "Усі країни" },
  { id: "UA", name: "Україна" },
  { id: "US", name: "США" },
  { id: "FR", name: "Франція" },
  { id: "GB", name: "Велика Британія" },
  { id: "DE", name: "Німеччина" },
  { id: "IT", name: "Італія" },
  { id: "ES", name: "Іспанія" },
  { id: "CA", name: "Канада" },
  { id: "PL", name: "Польща" },
  { id: "KR", name: "Південна Корея" },
  { id: "JP", name: "Японія" },
  { id: "CN", name: "Китай" },
  { id: "IN", name: "Індія" },
  { id: "AU", name: "Австралія" },
  { id: "BR", name: "Бразилія" },
  { id: "TR", name: "Туреччина" },
  { id: "SE", name: "Швеція" },
];

// Генеруємо роки від поточного до 1950 (ширший діапазон для класики)
const currentYear = new Date().getFullYear();
export const YEARS = [
  "Усі роки",
  ...Array.from({ length: currentYear - 1950 + 1 }, (_, i) =>
    (currentYear - i).toString()
  ),
];