"use client";

import React, { useState } from 'react';
import styles from './Filters.module.css';

const categories = [
  { id: 'all', name: 'Всі' },
  { id: 'action', name: 'Бойовики' },
  { id: 'comedy', name: 'Комедії' },
  { id: 'drama', name: 'Драми' },
  { id: 'horror', name: 'Жахи' },
  { id: 'sci-fi', name: 'Фантастика' },
  { id: 'animation', name: 'Мультфільми' },
];

export default function Filters() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <section className={styles.filterSection}>
      <div className="container">
        <div className={styles.filtersBar}>
          {/* Скрол-зона для категорій на мобільних */}
          <div className={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${
                  activeCategory === cat.id ? styles.active : ''
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className={styles.sortWrapper}>
            <select className={styles.sortSelect}>
              <option value="popularity.desc">За популярністю</option>
              <option value="release_date.desc">Спочатку нові</option>
              <option value="vote_average.desc">Високий рейтинг</option>
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>
      </div>
    </section>
  );
}