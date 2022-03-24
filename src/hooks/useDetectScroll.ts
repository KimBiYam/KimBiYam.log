import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import scrollState from '../atoms/scrollState';
import { ScrollDirection } from '../constants';
import throttle from '../lib/utils/throttle';

const THROTTLE_TIME_MS = 100;

const useDetectScroll = () => {
  const [{ pageY }, setScrollState] = useRecoilState(scrollState);

  const handleScroll = useCallback(
    throttle(() => {
      const { pageYOffset } = window;
      const deltaY = pageYOffset - pageY;
      const direction =
        pageYOffset === 0 || deltaY < 0
          ? ScrollDirection.up
          : ScrollDirection.down;

      setScrollState({ direction, pageY: pageYOffset });
    }, THROTTLE_TIME_MS),
    [pageY, setScrollState],
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [pageY]);
};

export default useDetectScroll;
