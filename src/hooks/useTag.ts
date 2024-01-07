import { useCallback, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';

import postPageAtom from '@src/atoms/postPageAtom';
import tagAtom from '@src/atoms/tagAtom';
import { Tag } from '@src/constants/enums';

export const useSetTag = () => {
  const setPostPage = useSetAtom(postPageAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSelectedTag = useSetAtom(tagAtom);

  const tagSearchParam = searchParams?.get('tag') ?? Tag.all;

  useEffect(() => {
    setSelectedTag(tagSearchParam);
  }, [setSelectedTag, tagSearchParam]);

  const handleTagClick = useCallback(
    (tag: string) => {
      const path = tag === Tag.all ? '/' : `/?tag=${tag}`;
      router.push(path, { scroll: true });
      setPostPage(1);
    },
    [router, setPostPage],
  );

  return handleTagClick;
};

export const useSelectedTag = () => {
  return useAtomValue(tagAtom);
};
