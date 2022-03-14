import { atom } from 'recoil';

const scrollUpState = atom<boolean>({
  key: 'scrollUp',
  default: true,
});

export default scrollUpState;
