import { atom } from 'jotai';

interface HeaderTitleState {
  isShowTitle: boolean;
  title: string | null;
}

const headerTitleAtom = atom<HeaderTitleState>({
  isShowTitle: false,
  title: null,
});

export default headerTitleAtom;
