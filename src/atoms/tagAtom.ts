import { atom } from 'jotai';

import { Tag } from '@src/constants/enums';

const tagAtom = atom<string>(Tag.all);

export default tagAtom;
