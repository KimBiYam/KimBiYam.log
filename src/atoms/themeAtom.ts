import { atom } from 'jotai';

import { isTheme, Theme } from '../constants';
import StorageUtil, { StorageKeys } from '../lib/storage/storage.util';

const themeAtom = atom<Theme, Theme>(Theme.light, (_, set, update) => {
  set(themeAtom, update);

  if (update === Theme.dark) {
    document.documentElement.classList.add(Theme.dark);
  } else {
    document.documentElement.classList.remove(Theme.dark);
  }
});

export const getThemeFromStorage = () => {
  const theme = StorageUtil.getItem(StorageKeys.theme);

  if (!isTheme(theme)) {
    return Theme.light;
  }

  return theme;
};

themeAtom.onMount = (set) => {
  set(getThemeFromStorage());
};

export default themeAtom;
