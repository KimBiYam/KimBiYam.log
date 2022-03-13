import { atom } from 'recoil';

const headerVisibleState = atom({
  key: 'headerVisible',
  default: true,
});

export default headerVisibleState;
