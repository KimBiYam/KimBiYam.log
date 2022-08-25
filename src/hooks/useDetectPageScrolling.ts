import { useCallback, useEffect, useRef, useState } from 'react';

import useThrottle from './useThrottle';

const PAGE_SCROLL_DETECT_TIMEOUT_TIME_MS = 50;
const THROTTLE_TIME_MS = 10;

const useDetectPageScrolling = () => {
  const [pageScrolling, setPageScrolling] = useState(false);
  const scrollingTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const detectPageScrolling = useCallback(
    useThrottle(() => {
      setPageScrolling(true);
      if (scrollingTimeoutIdRef.current) {
        clearTimeout(scrollingTimeoutIdRef.current);
      }

      scrollingTimeoutIdRef.current = setTimeout(() => {
        setPageScrolling(false);
      }, PAGE_SCROLL_DETECT_TIMEOUT_TIME_MS);
    }, THROTTLE_TIME_MS),
    [setPageScrolling, scrollingTimeoutIdRef.current],
  );

  useEffect(() => {
    document.addEventListener('scroll', detectPageScrolling);

    return () => {
      document.removeEventListener('scroll', detectPageScrolling);
      if (scrollingTimeoutIdRef.current) {
        clearTimeout(scrollingTimeoutIdRef.current);
      }
    };
  }, []);

  return pageScrolling;
};

export default useDetectPageScrolling;
