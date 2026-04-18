"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Логіка генерації масиву сторінок (наприклад: [1, 2, 3, '...', 500])
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const range = 2; // Скільки сторінок показувати навколо поточної

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Перша сторінка
        i === totalPages || // Остання сторінка
        (i >= currentPage - range && i <= currentPage + range) // Сторінки навколо поточної
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <nav className={styles.pagination}>
      {/* Стрілка назад */}
      <button 
        className={styles.arrowBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>

      <div className={styles.pagesList}>
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""} ${page === "..." ? styles.dots : ""}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Стрілка вперед */}
      <button 
        className={styles.arrowBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </nav>
  );
}