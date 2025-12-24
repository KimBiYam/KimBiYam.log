
import { useCallback, useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { postPageAtom } from '@src/features/post/atoms';

import { tagAtom } from '../atoms';
import { Tag } from '../constants';

export const useSetTag = () => {
  const setPostPage = useSetAtom(postPageAtom);
  const setSelectedTag = useSetAtom(tagAtom);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag') ?? Tag.all;
    setSelectedTag(tag);

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tag = params.get('tag') ?? Tag.all;
      setSelectedTag(tag);
      setPostPage(1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setSelectedTag, setPostPage]);

  const handleTagClick = useCallback(
    (tag: string) => {
      const path = tag === Tag.all ? '/' : `/?tag=${tag}`;
      window.history.pushState({}, '', path);
      setSelectedTag(tag);
      setPostPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPostPage, setSelectedTag],
  );

  return handleTagClick;
};

export const useSelectedTag = () => {
  return useAtomValue(tagAtom);
};
