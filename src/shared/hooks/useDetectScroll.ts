'use client';

import { useEffect, useRef } from 'react';

import { useSetAtom } from 'jotai';

import scrollAtom from '../atoms/scrollAtom';
import { ScrollDirection } from '../constants';
import useThrottle from './useThrottle';

const THROTTLE_TIME_MS = 100;

const useDetectScroll = () => {
  const setScroll = useSetAtom(scrollAtom);
  const pageYRef = useRef(0);

  const handleScroll = useThrottle(() => {
    const { scrollY } = window;

    const deltaY = scrollY - pageYRef.current;
    const isScrollUp = scrollY === 0 || deltaY < 0;
    const direction = isScrollUp ? ScrollDirection.up : ScrollDirection.down;

    pageYRef.current = scrollY;
    setScroll({ direction, pageY: scrollY, isRouting: false });
  }, THROTTLE_TIME_MS);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};

export default useDetectScroll;
