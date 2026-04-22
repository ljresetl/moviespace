"use client";

import React, { Suspense, useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { GENRES, YEARS, COUNTRIES } from "@/components/home/GenreFilters/filters";
import styles from "./GenreFilters.module.css";

function FilterContent() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Налаштування для всіх фільтрів: shallow: false змушує Next.js робити серверний запит
  const options = { 
    shallow: false, 
    startTransition 
  };

  const [genre, setGenre] = useQueryState("genre", parseAsString.withDefault("").withOptions(options));
  const [year, setYear] = useQueryState("year", parseAsString.withDefault("Усі роки").withOptions(options));
  const [country, setCountry] = useQueryState("country", parseAsString.withDefault("").withOptions(options));
  
  // Додаємо керування сторінкою, щоб скидати її при зміні фільтрів
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1).withOptions(options));

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Скидаємо відкриті списки при кліку поза ними
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Функція оновлення, яка автоматично скидає сторінку на першу
  const handleUpdate = async (key: string, value: string) => {
    // 1. Спочатку готуємо скидання сторінки
    await setPage(null); 

    // 2. Оновлюємо відповідний фільтр
    if (key === "genre") setGenre(value === "" ? null : value);
    if (key === "year") setYear(value === "Усі роки" ? null : value);
    if (key === "country") setCountry(value === "" ? null : value);
    
    setOpenDropdown(null);
  };

  const isHomeActive = !genre && (year === "Усі роки" || !year) && !country;

  return (
    <div className={`${styles.flexWrapper} ${isPending ? styles.loading : ""}`}>
      <button
        className={`${styles.filterBtn} ${isHomeActive ? styles.active : ""}`}
        onClick={() => {
          setGenre(null);
          setYear(null);
          setCountry(null);
          setPage(null);
          router.push("/", { scroll: false });
        }}
      >
        🔥 Новинки
      </button>

      {/* Жанри */}
      <div className={styles.dropdown}>
        <button 
          onClick={(e) => toggleDropdown(e, "genre")} 
          className={`${styles.filterBtn} ${genre ? styles.active : ""}`}
        >
          🎭 {GENRES.find((g) => g.id === genre)?.name || "Усі жанри"}
        </button>
        {openDropdown === "genre" && (
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleUpdate("genre", g.id)}
                className={`${styles.menuItem} ${genre === g.id ? styles.activeItem : ""}`}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Роки */}
      <div className={styles.dropdown}>
        <button 
          onClick={(e) => toggleDropdown(e, "year")} 
          className={`${styles.filterBtn} ${year && year !== "Усі роки" ? styles.active : ""}`}
        >
          📅 {!year || year === "Усі роки" ? "Рік" : year}
        </button>
        {openDropdown === "year" && (
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => handleUpdate("year", y)}
                className={`${styles.menuItem} ${(year === y || (!year && y === "Усі роки")) ? styles.activeItem : ""}`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Країни */}
      <div className={styles.dropdown}>
        <button 
          onClick={(e) => toggleDropdown(e, "country")} 
          className={`${styles.filterBtn} ${country ? styles.active : ""}`}
        >
          🌍 {COUNTRIES.find((c) => c.id === country)?.name || "Усі країни"}
        </button>
        {openDropdown === "country" && (
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            {COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleUpdate("country", c.id)}
                className={`${styles.menuItem} ${country === c.id ? styles.activeItem : ""}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GenreFilters() {
  return (
    <Suspense fallback={null}>
      <FilterContent />
    </Suspense>
  );
}