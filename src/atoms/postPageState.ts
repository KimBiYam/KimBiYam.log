import { atom } from 'recoil';

const postPageState = atom<number>({
  key: 'postPage',
  default: 1,
});

export default postPageState;
