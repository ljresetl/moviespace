"use client";

import React, { useState, useRef } from 'react';

import Hero from '@/components/Hero/Hero';
import NewReleases from '@/components/NewReleases/NewReleases';
import Filters from '@/components/Filters/Filters';
import MovieAll from '@/components/MovieAll/MovieAll';
import Pagination from '@/components/Pagination/Pagination';
import TextBlock from '@/components/TextBlock/TextBlock';


interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
}

interface Props {
  heroMovie?: Movie | null;
}

export default function HomePage({ heroMovie = null }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const moviesSectionRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    if (moviesSectionRef.current) {
      moviesSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <Hero initialMovie={heroMovie} />
      <NewReleases />
      <Filters onFilterChange={() => setCurrentPage(1)} />
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
      
    
    </>
  );
}