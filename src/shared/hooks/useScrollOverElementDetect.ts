'use client';

import { useEffect, useState } from 'react';

import useEventCallback from './useEventCallback';
import useThrottle from './useThrottle';

const THROTTLE_TIME_MS = 100;

interface UseScrollOverElementDetectProps {
  onOverElementChanged?: (isOverElement: boolean) => void;
}
export default function useScrollOverElementDetect({
  onOverElementChanged,
}: UseScrollOverElementDetectProps = {}) {
  const [isOverElement, setIsOverElement] = useState(false);
  const [el, setEl] = useState<HTMLElement | null>(null);

  const checkIsOverElement = useEventCallback(() => {
    if (!el) return;
    const { bottom } = el.getBoundingClientRect();

    const currentIsOverElement = bottom < 0;
    setIsOverElement(currentIsOverElement);

    if (isOverElement !== currentIsOverElement) {
      onOverElementChanged?.(currentIsOverElement);
    }
  });

  const handleScroll = useThrottle(checkIsOverElement, THROTTLE_TIME_MS);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [el, handleScroll]);

  useEffect(() => {
    if (el) {
      checkIsOverElement();
    }
  }, [el, checkIsOverElement]);

  return { isOverElement, setEl };
}
