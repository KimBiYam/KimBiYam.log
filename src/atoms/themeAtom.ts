import { atom } from 'jotai';
import { Theme } from '../constants';

const themeAtom = atom<Theme>(Theme.light);

export default themeAtom;
