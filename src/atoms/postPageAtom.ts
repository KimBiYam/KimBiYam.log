import { atom } from 'recoil';

const postPageAtom = atom<number>({
  key: 'postPage',
  default: 1,
});

export default postPageAtom;
