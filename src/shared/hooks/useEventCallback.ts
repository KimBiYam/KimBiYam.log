'use client';

import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useEventCallback = <T extends (...args: any[]) => any>(callback: T) => {
  const fnRef = useRef(callback);

  useEffect(() => {
    fnRef.current = callback;
  }, [callback]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => fnRef.current(...args), []) as T;
};

export default useEventCallback;
