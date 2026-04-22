"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get("page")) || 1;

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    // 1. Беремо всі існуючі параметри (жанр, рік, країну)
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    // 2. Оновлюємо тільки номер сторінки
    params.set("page", page.toString());
    
    // 3. Відправляємо на повне нове посилання
    // scroll: false дозволяє нам контролювати скрол через useEffect у MovieCardAll
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
        <span className={styles.pageBtn + " " + styles.active}>{currentPage}</span>
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