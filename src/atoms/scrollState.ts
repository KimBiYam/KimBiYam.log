import { atom } from 'recoil';
import { ScrollDirection } from '../constants';

interface ScrollState {
  direction: ScrollDirection;
  pageY: number;
}

const initialState: ScrollState = {
  direction: ScrollDirection.up,
  pageY: 0,
};

const scrollState = atom<ScrollState>({
  key: 'scroll',
  default: initialState,
});

export default scrollState;
