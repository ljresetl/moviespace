// utils/slugify.ts

export const cyrillicToLatin: { [key: string]: string } = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
  'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
  'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
  'ю': 'yu', 'я': 'ya', 'ы': 'y', 'э': 'e', 'ё': 'yo', 'ъ': ''
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .split('')
    .map(char => cyrillicToLatin[char] || char)
    .join('')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};