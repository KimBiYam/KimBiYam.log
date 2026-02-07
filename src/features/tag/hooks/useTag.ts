'use client';

import { useCallback, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';

import { tagAtom } from '../atoms';
import { Tag } from '../constants';

export const useSetTag = (onTagClick?: (tag: string) => void) => {
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
      onTagClick?.(tag);
    },
    [router, onTagClick],
  );

  return handleTagClick;
};

export const useSelectedTag = () => {
  return useAtomValue(tagAtom);
};
