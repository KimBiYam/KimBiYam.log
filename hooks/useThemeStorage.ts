import { useEffect, useState } from "react";
import themeStorage from "../lib/storage/themeStorage";
import { Theme } from "../lib/styles/theme";

const useThemeStorage = () => {
  const [theme, setTheme] = useState<Theme>(Theme.light);

  useEffect(() => {
    const theme = themeStorage.getTheme() ?? Theme.light;

    setTheme(theme);
  }, []);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;

    themeStorage.setTheme(changedTheme);
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useThemeStorage;
