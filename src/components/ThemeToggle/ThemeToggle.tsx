"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  Sun, Moon, Monitor, Droplets, Drama, Gem, Flame, Crown,
  Cannabis, Factory, Bird, Flag, Beer
} from 'lucide-react';
import styles from './ThemeToggle.module.css';

type Theme = 'auto' | 'dark' | 'light' | 'midnight' | 'crimson' | 'emerald' | 'amber' | 'gold' | 'kush' | 'factory' | 'freedom' | 'ukraine' | 'beer';

const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'auto',     label: 'Авто',     icon: <Monitor size={16} /> },
  { id: 'dark',     label: 'Темна',    icon: <Moon size={16} /> },
  { id: 'light',    label: 'Світла',   icon: <Sun size={16} /> },
  { id: 'midnight', label: 'Ніч',      icon: <Droplets size={16} /> },
  { id: 'crimson',  label: 'Кіно',     icon: <Drama size={16} /> },
  { id: 'emerald',  label: 'Смарагд',  icon: <Gem size={16} /> },
  { id: 'amber',    label: 'Бурштин',  icon: <Flame size={16} /> },
  { id: 'gold',     label: 'Золото',   icon: <Crown size={16} /> },
  { id: 'kush',     label: '420',      icon: <Cannabis size={16} /> },
  { id: 'factory',  label: 'Завод',    icon: <Factory size={16} /> },
  { id: 'freedom',  label: 'Воля',     icon: <Bird size={16} /> },
  { id: 'ukraine',  label: 'Україна',  icon: <Flag size={16} /> },
  { id: 'beer',     label: 'Пиво',     icon: <Beer size={16} /> },
];

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'auto';
}

function getServerSnapshot(): Theme {
  return 'auto';
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
    if (!isOpen) return;
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const selectTheme = (t: Theme) => {
    localStorage.setItem('theme', t);
    window.dispatchEvent(new Event('storage'));
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