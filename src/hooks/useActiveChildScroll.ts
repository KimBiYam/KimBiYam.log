import React, { useCallback, useEffect, useRef, useState } from 'react';

import useThrottle from './useThrottle';

interface UseActiveItemScrollProps<P> {
  activeId: string | null;
  parentRef: React.Ref<P>;
}

const PAGE_SCROLL_DETECT_TIMEOUT_TIME_MS = 100;
const THROTTLE_TIME_MS = 50;

const isRefObject = <T>(ref: React.Ref<T>): ref is React.RefObject<T> =>
  ref !== null && typeof ref !== 'function';

const useActiveChildScroll = <P extends HTMLElement, C extends HTMLElement>({
  activeId,
  parentRef,
}: UseActiveItemScrollProps<P>) => {
  const [pageScrolling, setPageScrolling] = useState(false);
  const itemRefs = useRef<Record<string, C | null>>({});
  const scrollingTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const activeChildNode = activeId ? itemRefs.current[activeId] : null;
  const parentNodeExists = isRefObject(parentRef) && parentRef.current;

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

  useEffect(() => {
    if (!parentNodeExists || !activeChildNode || pageScrolling) {
      return;
    }

    const getScrollPosition = () => {
      const { offsetTop, offsetLeft, offsetHeight, offsetWidth, offsetParent } =
        activeChildNode;

      if (!offsetParent) return null;

      const remainingHeight = offsetParent.clientHeight - offsetHeight;
      const remainingWidth = offsetParent.clientWidth - offsetWidth;
      const topForCenterScroll = offsetTop - remainingHeight / 2;
      const leftForCenterScroll = offsetLeft - remainingWidth / 2;

      return {
        top: topForCenterScroll,
        left: leftForCenterScroll,
      };
    };

    const scrollPosition = getScrollPosition();
    if (!scrollPosition) return;

    const { top, left } = scrollPosition;
    parentRef.current.scroll({ top, left, behavior: 'smooth' });
  }, [activeId, pageScrolling]);

  const registerChildRef = useCallback(
    (instance: C | null, id: string) => {
      itemRefs.current[id] = instance;
    },
    [itemRefs],
  );

  return registerChildRef;
};

export default useActiveChildScroll;
