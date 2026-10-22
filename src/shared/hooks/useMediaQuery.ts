'use client';

import { useCallback, useSyncExternalStore } from 'react';

const getServerSnapshot = () => false;

const useMediaQuery = (query: string) => {
  // Stable subscription identity avoids detaching on every store update.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useMediaQuery;
