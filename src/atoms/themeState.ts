import { atom } from 'recoil';
import { Theme } from '../constants';

const themeState = atom<Theme>({
  key: 'theme',
  default: Theme.light,
});

export default themeState;
