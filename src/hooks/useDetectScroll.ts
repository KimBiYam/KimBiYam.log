import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import scrollAtom from '../atoms/scrollAtom';
import { ScrollDirection } from '../constants';
import useThrottle from './useThrottle';

const THROTTLE_TIME_MS = 100;

const useDetectScroll = () => {
  const [{ pageY }, setScroll] = useAtom(scrollAtom);

  const handleScroll = useCallback(
    useThrottle(() => {
      const { scrollY } = window;

      const deltaY = scrollY - pageY;
      const isScrollUp = scrollY === 0 || deltaY < 0;
      const direction = isScrollUp ? ScrollDirection.up : ScrollDirection.down;

      setScroll({ direction, pageY: scrollY });
    }, THROTTLE_TIME_MS),
    [pageY, setScroll],
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [pageY]);
};

export default useDetectScroll;
