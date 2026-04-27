// src/lib/player.ts

export function getPlayerUrl(tmdbId: number): string {
  const token = process.env.PLAYER_API_TOKEN || "33a811c627033af901fb8aa5d449483c";
  
  // Використовуємо шаблон зі скріншота. 
  // Зазвичай додавання параметрів допомагає вибрати озвучку за замовчуванням
  return `https://tv-1-kinoserial.net/embed/${tmdbId}/?token=${token}`;
}