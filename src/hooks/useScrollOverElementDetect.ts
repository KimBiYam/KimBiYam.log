import { useEffect, useState } from 'react';

import useThrottle from './useThrottle';

const THROTTLE_TIME_MS = 100;

export default function useScrollOverElementDetect(
  ref: React.RefObject<HTMLElement | null>,
) {
  const [isOverElement, setIsOverElement] = useState(false);

  const handleScroll = useThrottle(() => {
    if (!ref.current) return;
    const { bottom } = ref.current.getBoundingClientRect();
    setIsOverElement(bottom < 0);
  }, THROTTLE_TIME_MS);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return isOverElement;
}
