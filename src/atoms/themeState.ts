import { atom } from 'recoil';
import { Theme } from '../constants';

const themeAtom = atom<Theme>({
  key: 'theme',
  default: Theme.light,
});

export default themeAtom;
