/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useCallback, useEffect, useRef } from 'react';

const useEventCallback = <T extends (...args: any[]) => any>(
  fn: T,
  deps: DependencyList,
) => {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, ...deps]);

  return useCallback((...args: any[]) => fnRef.current(...args), [fnRef]) as T;
};

export default useEventCallback;
