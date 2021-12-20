import { Theme } from "../../constants";

const THEME = "theme";

export const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && Object.values(Theme).includes(value as Theme);

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
