import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
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
  }, []);

  const handleScroll = useCallback(
    useThrottle(() => {
      const { scrollY } = window;

      const deltaY = scrollY - pageY;
      const isScrollUp = scrollY === 0 || deltaY < 0;
      const direction = isScrollUp ? ScrollDirection.up : ScrollDirection.down;

      setScroll({ direction, pageY: scrollY, isRouting: false });
    }, THROTTLE_TIME_MS),
    [pageY, setScroll],
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [pageY]);
};

export default useDetectScroll;
