"use client";

import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {

  // TMDB максимум 500 сторінок
  const maxPages = Math.min(totalPages, 500);

  if (totalItems <= 20 || maxPages <= 1) {
    return null;
  }

  // Генеруємо діапазон сторінок навколо поточної
  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (maxPages <= 7) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
      return pages;
    }

    // Завжди перша
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Сторінки навколо поточної
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(maxPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < maxPages - 2) {
      pages.push('...');
    }

    // Завжди остання
    pages.push(maxPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.navBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo;
      </button>

      <div className={styles.pagesList}>
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className={styles.dots}>...</span>
          ) : (
            <button
              key={page}
              className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={styles.navBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
      >
        &rsaquo;
      </button>
    </div>
  );
}