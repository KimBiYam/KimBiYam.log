import { useEffect } from 'react';

import { useAtom } from 'jotai';

import themeAtom from '../atoms/themeAtom';
import { Theme } from '../constants';
import * as googleAnalytics from '../lib/googleAnalytics';
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
      googleAnalytics.darkModeOn();
    } else {
      document.documentElement.classList.remove(Theme.dark);
      googleAnalytics.darkModeOff();
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
