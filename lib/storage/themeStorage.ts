import { isTheme, Theme } from "../../constants";

const THEME = "theme";

const themeStorage = {
  getTheme() {
    const theme = localStorage.getItem(THEME);

    if (!isTheme(theme)) {
      return null;
    }

    return theme;
  },

  setTheme(theme: Theme) {
    localStorage.setItem(THEME, theme);
  },
};

export default themeStorage;
