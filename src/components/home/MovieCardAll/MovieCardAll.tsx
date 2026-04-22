// components/home/MovieCardAll/MovieCardAll.tsx
import { discoverMovies } from "@/lib/tmdb";
import MovieCardAllClient from "./MovieCardAllClient";
import { DiscoverFilters } from "@/types/movie";

interface MovieCardAllProps {
  filters: DiscoverFilters;
  page: number;
}

export default async function MovieCardAll({ filters, page }: MovieCardAllProps) {
  // Завантажуємо дані на сервері
  const data = await discoverMovies(filters, page);

  const hasFilters = Object.values(filters).some(v => v && v !== "");

  return (
    <MovieCardAllClient 
      movies={data.results} 
      totalPages={data.total_pages} 
      currentPage={page}
      hasFilters={hasFilters}
    />
  );
}