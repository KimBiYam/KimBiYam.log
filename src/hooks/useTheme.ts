import { useTheme as useNextTheme } from 'next-themes';

import { isTheme, Theme } from '@src/constants';

const useTheme = () => {
  const { theme: nextTheme, setTheme } = useNextTheme();

  const theme = isTheme(nextTheme) ? nextTheme : Theme.light;

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
