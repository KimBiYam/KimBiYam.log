import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import scrollUpState from '../atoms/scrollUpState';
import throttle from '../lib/utils/throttle';

const THROTTLE_TIME_MS = 100;

const useDetectScrollUp = () => {
  const setIsScrollUp = useSetRecoilState(scrollUpState);
  const [pageY, setPageY] = useState(0);

  const handleScroll = useCallback(
    throttle(() => {
      const { pageYOffset } = window;
      const deltaY = pageYOffset - pageY;
      const isScrollUp = pageYOffset === 0 || deltaY < 0;

      setIsScrollUp(isScrollUp);
      setPageY(pageYOffset);
    }, THROTTLE_TIME_MS),
    [pageY, setIsScrollUp, setPageY],
  );

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [pageY]);
};

export default useDetectScrollUp;
