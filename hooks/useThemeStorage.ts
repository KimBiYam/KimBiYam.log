import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import themeState from '../atoms/themeState';
import { Theme } from '../constants';
import themeStorage from '../lib/storage/themeStorage';

const DARK_MODE = 'dark';
const OS_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

const useThemeStorage = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    let theme = themeStorage.getTheme();

    if (theme === null) {
      theme = Theme.light;
    }

    if (theme === null && window.matchMedia(OS_DARK_MODE_QUERY).matches) {
      theme = Theme.dark;
    }

    themeStorage.setTheme(theme);
    setTheme(theme);
  }, []);

  useEffect(() => {
    if (theme === Theme.dark) {
      document.documentElement.classList.add(DARK_MODE);
    } else {
      document.documentElement.classList.remove(DARK_MODE);
    }
  }, [theme]);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;

    themeStorage.setTheme(changedTheme);
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useThemeStorage;
