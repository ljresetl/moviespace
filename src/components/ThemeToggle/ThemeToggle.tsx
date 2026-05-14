"use client";

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Monitor, Droplets, Drama, Gem, Flame } from 'lucide-react';
import styles from './ThemeToggle.module.css';

type Theme = 'auto' | 'dark' | 'light' | 'midnight' | 'crimson' | 'emerald' | 'amber';

const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'auto',     label: 'Авто',    icon: <Monitor size={16} /> },
  { id: 'dark',     label: 'Темна',   icon: <Moon size={16} /> },
  { id: 'light',    label: 'Світла',  icon: <Sun size={16} /> },
  { id: 'midnight', label: 'Ніч',     icon: <Droplets size={16} /> },
  { id: 'crimson',  label: 'Кіно',    icon: <Drama size={16} /> },
  { id: 'emerald',  label: 'Смарагд', icon: <Gem size={16} /> },
  { id: 'amber',    label: 'Бурштин', icon: <Flame size={16} /> },
];

function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'auto';
  return (localStorage.getItem('theme') as Theme) || 'auto';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [isOpen, setIsOpen] = useState(false);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    if (t === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', t);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const selectTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    setIsOpen(false);
  };

  const current = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <div className={styles.wrap}>
      <button
        className={styles.btn}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        aria-label="Змінити тему"
      >
        {current.icon}
        <span className={styles.label}>{current.label}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`${styles.option} ${theme === t.id ? styles.active : ''}`}
              onClick={() => selectTheme(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
              {theme === t.id && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}