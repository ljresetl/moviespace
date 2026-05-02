import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Вмикаємо стиснення тексту (gzip/brotli), щоб файли передавалися швидше
  compress: true,

  images: {
    // 2. Дозволяємо сучасні формати, які важать на 30-50% менше за PNG/JPG
    formats: ['image/avif', 'image/webp'],
    
    // 3. Налаштовуємо кешування для картинок з TMDB на довгий термін (1 рік)
    minimumCacheTTL: 31536000,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },

  // 4. Додаткові налаштування для стабільності та швидкості
  experimental: {
    // Оптимізація пакетів для швидшої збірки та роботи
    optimizePackageImports: ['lucide-react', 'react-icons'], 
  },
  
  // Прибираємо заголовок X-Powered-By для безпеки та економії байтів
  poweredByHeader: false,
};

export default nextConfig;