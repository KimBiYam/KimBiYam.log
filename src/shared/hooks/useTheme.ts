import { useEffect, useState } from 'react';

import { Theme } from '../constants';

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(Theme.light);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (
      stored === Theme.dark ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setTheme(Theme.dark);
      document.documentElement.classList.add('dark');
    } else {
      setTheme(Theme.light);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;
    setTheme(changedTheme);
    localStorage.setItem('theme', changedTheme);
    if (changedTheme === Theme.dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { theme, toggleTheme };
};

export default useTheme;
