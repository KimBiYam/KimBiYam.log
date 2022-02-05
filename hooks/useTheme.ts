import { setCookie } from 'nookies';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import themeState from '../atoms/themeState';
import { Theme } from '../constants';
import {
  DARK_MODE_CLASS,
  OS_DARK_MODE_QUERY,
  THEME_COOKIE_KEY,
} from '../constants/theme';
import themeCookie from '../lib/cookies/themeCookie';

const useTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    const cookieTheme = getCookieTheme();

    setCookie(null, THEME_COOKIE_KEY, cookieTheme);
    setTheme(cookieTheme);

    function getCookieTheme() {
      const theme = themeCookie.getTheme();

      if (theme === null && window.matchMedia(OS_DARK_MODE_QUERY).matches) {
        return Theme.dark;
      }

      if (theme === null) {
        return Theme.light;
      }

      return theme;
    }
  }, []);

  useEffect(() => {
    if (theme === Theme.dark) {
      document.documentElement.classList.add(DARK_MODE_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_MODE_CLASS);
    }
  }, [theme]);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;

    themeCookie.setTheme(changedTheme);
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
