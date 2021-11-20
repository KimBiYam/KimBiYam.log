import { useEffect, useState } from "react";
import themeStorage from "../lib/storage/themeStorage";
import { Theme } from "../lib/styles/theme";

const DARK_MIDE = "dark";

const useThemeStorage = () => {
  const [theme, setTheme] = useState<Theme>(Theme.light);

  useEffect(() => {
    const theme = themeStorage.getTheme() ?? Theme.light;

    setTheme(theme);
  }, []);

  useEffect(() => {
    if (theme === Theme.dark) {
      document.documentElement.classList.add(DARK_MIDE);
    } else {
      document.documentElement.classList.remove(DARK_MIDE);
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
