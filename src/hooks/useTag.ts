import { useCallback } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useSetAtom } from 'jotai';

import postPageAtom from '@src/atoms/postPageAtom';
import { Tag } from '@src/constants/enums';

export const useTag = () => {
  const setPostPage = useSetAtom(postPageAtom);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTag = searchParams?.get('tag') ?? Tag.all;

  const handleTagClick = useCallback(
    (tag: string) => {
      const path = tag === Tag.all ? '/' : `/?tag=${tag}`;
      router.push(path, { scroll: true });
      setPostPage(1);
    },
    [router, setPostPage],
  );

  return { handleTagClick, selectedTag };
};
