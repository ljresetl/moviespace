"use client";

import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Генеруємо масив сторінок (наприклад, 1, 2, 3, 4, 5)
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

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
        {totalPages > 5 && <span className={styles.dots}>...</span>}
        {totalPages > 5 && (
          <button 
            className={styles.pageBtn} 
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
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