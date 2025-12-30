import { useSyncExternalStore } from 'react';

import { Theme } from '../constants';

class ThemeStore {
  _theme: Theme;
  _listeners: Set<() => void>;

  constructor() {
    this._listeners = new Set();
    this._theme = Theme.light; // Default value

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (
        stored === Theme.dark ||
        (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this._theme = Theme.dark;
      }
    }
  }

  subscribe = (callback: () => void) => {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  };

  getSnapshot = () => {
    return this._theme;
  };

  getServerSnapshot = () => {
    return Theme.light;
  };

  toggleTheme = () => {
    const newTheme = this._theme === Theme.light ? Theme.dark : Theme.light;
    this._theme = newTheme;

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      if (newTheme === Theme.dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    this.emit();
  };

  emit() {
    this._listeners.forEach((l) => l());
  }
}

const themeStore = new ThemeStore();

const useTheme = () => {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  return { theme, toggleTheme: themeStore.toggleTheme };
};

export default useTheme;
