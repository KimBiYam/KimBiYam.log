import { atom } from 'jotai';
import { ScrollDirection } from '../constants';

export interface ScrollAtom {
  direction: ScrollDirection;
  pageY: number;
  isRouting: boolean;
}

const initialState: ScrollAtom = {
  direction: ScrollDirection.up,
  pageY: 0,
  isRouting: false,
};

const scrollAtom = atom<ScrollAtom>(initialState);

export default scrollAtom;
