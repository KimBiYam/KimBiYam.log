import { atom } from 'jotai';

import { Tag } from '../constants';

const tagAtom = atom<string>(Tag.all);

export default tagAtom;
