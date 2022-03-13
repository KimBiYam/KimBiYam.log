import { atom } from 'recoil';

const postPageState = atom({
  key: 'postPage',
  default: 1,
});

export default postPageState;
