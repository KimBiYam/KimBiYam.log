import { useAtom } from 'jotai';
import { useEffect } from 'react';
import themeAtom from '../atoms/themeState';
import { Theme } from '../constants';
import themeStorage from '../lib/storage/themeStorage';

const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    const storageTheme = themeStorage.getTheme() ?? Theme.light;

    setTheme(storageTheme);
  }, []);

  useEffect(() => {
    if (theme === Theme.dark) {
      document.documentElement.classList.add(Theme.dark);
    } else {
      document.documentElement.classList.remove(Theme.dark);
    }
  }, [theme]);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;

    themeStorage.setTheme(changedTheme);
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
