"use client";

import React, { useState, useRef } from 'react'; // Додали useRef

import Hero from '@/components/Hero/Hero';
import NewReleases from '@/components/NewReleases/NewReleases';
import Filters from '@/components/Filters/Filters';
import MovieAll from '@/components/MovieAll/MovieAll';
import Pagination from '@/components/Pagination/Pagination';
import TextBlock from '@/components/TextBlock/TextBlock';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Реф для секції з фільмами
  const moviesSectionRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    
    // Скролимо до початку списку фільмів, а не в самий верх сторінки
    if (moviesSectionRef.current) {
      moviesSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <>
      <main>
        <Hero />
        <NewReleases />
        <Filters onFilterChange={() => setCurrentPage(1)} />

        {/* Обгортка з рефом, щоб знати куди скролити */}
        <div ref={moviesSectionRef} style={{ scrollMarginTop: '20px' }}>
          <MovieAll 
            currentPage={currentPage} 
            onMoviesLoaded={(count: number) => setTotalItems(count)} 
          />
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
        
        <TextBlock />
      </main>
    </>
  );
}