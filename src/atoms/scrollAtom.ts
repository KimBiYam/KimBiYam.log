import { atom } from 'recoil';
import { ScrollDirection } from '../constants';

interface ScrollAtom {
  direction: ScrollDirection;
  pageY: number;
}

const initialState: ScrollAtom = {
  direction: ScrollDirection.up,
  pageY: 0,
};

const scrollAtom = atom<ScrollAtom>({
  key: 'scroll',
  default: initialState,
});

export default scrollAtom;
