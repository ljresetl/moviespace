"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Отримуємо поточну сторінку з URL
  const currentPage = Number(searchParams?.get("page")) || 1;

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", page.toString());
    
    // Використовуємо scroll: false, бо скрол ми робимо через useEffect у MovieCardAll
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <nav className={styles.pagination}>
      <button 
        className={styles.arrowBtn}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ← Назад
      </button>

      <div className={styles.pagesList}>
        <span className={`${styles.pageBtn} ${styles.active}`}>{currentPage}</span>
        <span className={styles.divider}>з</span>
        <span className={styles.pageBtn}>{totalPages}</span>
      </div>

      <button 
        className={styles.arrowBtn}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Вперед →
      </button>
    </nav>
  );
}