import { atom } from 'jotai';

import { Theme } from '../constants';
import themeStorage from '../lib/storage/themeStorage';

const themeAtom = atom<Theme, Theme>(Theme.light, (_, set, update) => {
  set(themeAtom, update);

  if (update === Theme.dark) {
    document.documentElement.classList.add(Theme.dark);
  } else {
    document.documentElement.classList.remove(Theme.dark);
  }
});

themeAtom.onMount = (set) => {
  set(themeStorage.getTheme());
};

export default themeAtom;
