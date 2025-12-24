
import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useThrottle = <F extends (...args: any[]) => any>(
  callback: F,
  throttleTimeMs: number,
) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    },
    [],
  );

  return useCallback(
    (...args: Parameters<F>) => {
      if (timeoutIdRef.current) {
        return;
      }

      timeoutIdRef.current = setTimeout(() => {
        callback(...args);
        timeoutIdRef.current = null;
      }, throttleTimeMs);
    },
    [callback, throttleTimeMs],
  );
};

export default useThrottle;
