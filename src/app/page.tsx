"use client";

import React, { useState } from 'react';

import Hero from '@/components/Hero/Hero';
import NewReleases from '@/components/NewReleases/NewReleases';
import Filters from '@/components/Filters/Filters';
import MovieAll from '@/components/MovieAll/MovieAll';
import Pagination from '@/components/Pagination/Pagination';
import TextBlock from '@/components/TextBlock/TextBlock';
   

export default function HomePage() {
  // Додаємо стан для пагінації тут, щоб передавати його в компоненти
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Оскільки ми тягнемо 100 фільмів (5 сторінок по 20)

  return (
    <>
      
      <main>
        <Hero />
        <NewReleases />
        <Filters />

        {/* Передаємо поточну сторінку в MovieAll, щоб він знав, яку частину з 100 фільмів показати */}
        <MovieAll currentPage={currentPage} />

        {/* Тепер пагінація не видасть помилку, бо має всі дані */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page)} 
        />
        <TextBlock />
      </main>

    </>
  );
}