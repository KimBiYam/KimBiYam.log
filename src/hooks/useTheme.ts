import { useAtom } from 'jotai';

import themeAtom from '../atoms/themeAtom';
import { Theme } from '../constants';
import StorageUtil, { StorageKeys } from '../lib/storage/storage.util';

const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;

    StorageUtil.setItem(StorageKeys.theme, changedTheme);
    setTheme(changedTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
