"use client";

import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number; // Додаємо кількість знайдених елементів
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange 
}: PaginationProps) {
  
  // Якщо фільмів 20 або менше, або всього 1 сторінка — не рендеримо нічого
  if (totalItems <= 20 || totalPages <= 1) {
    return null;
  }

  // Обчислюємо масив сторінок (максимум 5)
  const maxVisiblePages = 5;
  const pages = Array.from(
    { length: Math.min(maxVisiblePages, totalPages) }, 
    (_, i) => i + 1
  );

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
        {pages.map((page) => (
          <button
            key={page}
            className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {totalPages > maxVisiblePages && (
          <>
            {totalPages > maxVisiblePages + 1 && <span className={styles.dots}>...</span>}
            <button 
              className={`${styles.pageBtn} ${currentPage === totalPages ? styles.active : ''}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button 
        className={styles.navBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &rsaquo;
      </button>
    </div>
  );
}