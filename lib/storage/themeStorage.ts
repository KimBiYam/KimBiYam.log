import { Theme } from "../styles/theme";

const THEME = "theme-mode";

const themeStorage = {
  getTheme() {
    const theme = localStorage.getItem(THEME);

    return theme;
  },

  setThemeMode(theme: Theme) {
    localStorage.setItem(THEME, theme);
  },
};

export default themeStorage;
