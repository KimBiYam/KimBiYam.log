'use client';

import { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { headerTitleAtom } from '@src/features/post/client';

const useSyncPostHeader = (title: string) => {
  const setHeaderTitleAtom = useSetAtom(headerTitleAtom);

  useEffect(
    function setHeaderTitle() {
      setHeaderTitleAtom((prev) => ({ ...prev, title }));

      return function cleanupHeaderTitle() {
        setHeaderTitleAtom({ isShowTitle: false, title: null });
      };
    },
    [setHeaderTitleAtom, title],
  );
};

export default useSyncPostHeader;
