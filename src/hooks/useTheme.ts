import { useAtom } from 'jotai';

import themeAtom from '../atoms/themeAtom';
import { Theme } from '../constants';
import themeStorage from '../lib/storage/themeStorage';

const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;

    themeStorage.setTheme(changedTheme);
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
