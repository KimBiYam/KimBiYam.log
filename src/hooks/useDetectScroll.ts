import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAtom } from 'jotai';

import scrollAtom from '../atoms/scrollAtom';
import { ScrollDirection } from '../constants';
import useThrottle from './useThrottle';

const THROTTLE_TIME_MS = 100;

const useDetectScroll = () => {
  const [scroll, setScroll] = useAtom(scrollAtom);
  const { pageY } = scroll;

  const router = useRouter();

  useEffect(() => {
    const setIsRouting = () => {
      setScroll((prev) => ({ ...prev, isRouting: true }));
    };

    router.events.on('beforeHistoryChange', setIsRouting);

    return () => {
      router.events.off('beforeHistoryChange', setIsRouting);
    };
  }, [router.events, setScroll]);

  const handleScroll = useThrottle(() => {
    const { scrollY } = window;

    const deltaY = scrollY - pageY;
    const isScrollUp = scrollY === 0 || deltaY < 0;
    const direction = isScrollUp ? ScrollDirection.up : ScrollDirection.down;

    setScroll({ direction, pageY: scrollY, isRouting: false });
  }, THROTTLE_TIME_MS);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [handleScroll, pageY]);
};

export default useDetectScroll;
