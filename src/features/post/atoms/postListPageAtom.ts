import { atom } from 'jotai';

// Loaded page count of the post list, keyed by selected tag. Kept outside the
// component so it survives the remount caused by navigating to a post and back.
const postListPageAtom = atom<Record<string, number>>({});

export default postListPageAtom;
