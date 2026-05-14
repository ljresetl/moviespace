"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Filters.module.css';

interface FiltersProps {
  onFilterChange: () => void;
}

const categories = [
  { id: 'all',   name: 'Всі' },
  { id: '28',    name: 'Бойовики' },
  { id: '12',    name: 'Пригоди' },
  { id: '16',    name: 'Мультфільми' },
  { id: '35',    name: 'Комедії' },
  { id: '80',    name: 'Кримінал' },
  { id: '99',    name: 'Документальні' },
  { id: '18',    name: 'Драми' },
  { id: '10751', name: 'Сімейні' },
  { id: '14',    name: 'Фентезі' },
  { id: '36',    name: 'Історичні' },
  { id: '27',    name: 'Жахи' },
  { id: '10402', name: 'Музичні' },
  { id: '9648',  name: 'Детективи' },
  { id: '10749', name: 'Мелодрами' },
  { id: '878',   name: 'Фантастика' },
  { id: '53',    name: 'Трилери' },
  { id: '10752', name: 'Воєнні' },
  { id: '37',    name: 'Вестерни' },
];

const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

const countries = [
  { code: '',   name: 'Всі країни' },
  { code: 'US', name: 'США' },
  { code: 'UA', name: 'Україна' },
  { code: 'GB', name: 'Велика Британія' },
  { code: 'FR', name: 'Франція' },
  { code: 'DE', name: 'Німеччина' },
  { code: 'IT', name: 'Італія' },
  { code: 'ES', name: 'Іспанія' },
  { code: 'JP', name: 'Японія' },
  { code: 'KR', name: 'Корея' },
  { code: 'IN', name: 'Індія' },
  { code: 'TR', name: 'Туреччина' },
  { code: 'PL', name: 'Польща' },
  { code: 'CA', name: 'Канада' },
  { code: 'AU', name: 'Австралія' },
];

export default function Filters({ onFilterChange }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get('genre') || 'all';
  const currentSort = searchParams.get('sort') || 'popularity.desc';
  const currentYear = searchParams.get('year') || '';
  const currentCountry = searchParams.get('country') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');
    onFilterChange();
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={styles.filterSection}>
      <div className="container">
        <div className={styles.filtersBar}>
          <div className={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${
                  currentGenre === cat.id ? styles.active : ''
                }`}
                onClick={() => updateFilters('genre', cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className={styles.selectGroup}>
            <div className={styles.sortWrapper}>
              <select
                className={styles.sortSelect}
                aria-label="Фільтр за роком"
                value={currentYear}
                onChange={(e) => updateFilters('year', e.target.value)}
              >
                <option value="">Всі роки</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <span className={styles.selectArrow}>▼</span>
            </div>

            <div className={styles.sortWrapper}>
              <select
                className={styles.sortSelect}
                aria-label="Фільтр за країною"
                value={currentCountry}
                onChange={(e) => updateFilters('country', e.target.value)}
              >
                {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
              <span className={styles.selectArrow}>▼</span>
            </div>

            <div className={styles.sortWrapper}>
              <select
                className={styles.sortSelect}
                aria-label="Сортування фільмів"
                value={currentSort}
                onChange={(e) => updateFilters('sort', e.target.value)}
              >
                <option value="popularity.desc">За популярністю</option>
                <option value="release_date.desc">Спочатку нові</option>
                <option value="vote_average.desc">Високий рейтинг</option>
              </select>
              <span className={styles.selectArrow}>▼</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}