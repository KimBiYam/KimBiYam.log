import { useEffect, useRef } from 'react';

const useThrottle = (callback: () => void, throttleTimeMs: number) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    },
    [],
  );

  return () => {
    if (timeoutIdRef.current) {
      return;
    }

    timeoutIdRef.current = setTimeout(() => {
      callback();
      timeoutIdRef.current = null;
    }, throttleTimeMs);
  };
};

export default useThrottle;
