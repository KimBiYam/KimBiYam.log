import { parseCookies, setCookie } from 'nookies';
import { Theme } from '../../constants';
import { THEME_COOKIE_KEY } from '../../constants/theme';

export const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && Object.values(Theme).includes(value as Theme);

const themeCookie = {
  getTheme() {
    const cookies = parseCookies();
    const theme = cookies[THEME_COOKIE_KEY];

    if (!isTheme(theme)) {
      return null;
    }

    return theme;
  },

  setTheme(theme: Theme) {
    setCookie(null, THEME_COOKIE_KEY, theme);
  },
};

export default themeCookie;
