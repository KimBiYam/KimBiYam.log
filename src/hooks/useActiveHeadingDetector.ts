import { useCallback, useEffect, useRef, useState } from 'react';

import { POST_HEADING_TARGET_TAGS } from '@src/constants/posts';
import { findElementsByTags } from '@src/utils/elementUtils';

import useThrottle from './useThrottle';

interface HeadingScrollPosition {
  id: string;
  top: number;
}

const THROTTLE_TIME_MS = 100;
const CHECK_SCROLL_HEIGHT_INTERVAL_MS = 250;
const SCROLL_MARGIN_PX = 10;

const getHeadingsScrollPosition = (targetElement: HTMLElement) => {
  const headingElements = findElementsByTags(
    targetElement,
    POST_HEADING_TARGET_TAGS,
  );

  return Array.from(headingElements).map((el) => ({
    id: el.id,
    top: el.offsetTop,
  }));
};

const findClosestScrollId = (
  headings: HeadingScrollPosition[],
  scrollY: number,
) => {
  const filtered = headings.filter(
    (el) => el.top <= scrollY + SCROLL_MARGIN_PX,
  );

  if (filtered.length === 0) return null;

  const closest = filtered.reduce<HeadingScrollPosition>(
    (prev, cur) => (prev.top > cur.top ? prev : cur),
    {} as HeadingScrollPosition,
  );

  return closest.id;
};

const useActiveHeadingDetector = (targetElement: HTMLElement | null) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingsScrollRef = useRef<HeadingScrollPosition[]>([]);

  const handleScroll = useThrottle(
    useCallback(() => {
      const { scrollY } = window;

      setActiveId(findClosestScrollId(headingsScrollRef.current, scrollY));
    }, []),
    THROTTLE_TIME_MS,
  );

  useEffect(() => {
    if (!targetElement) return;

    headingsScrollRef.current = getHeadingsScrollPosition(targetElement);

    let prevScrollHeight = document.body.scrollHeight;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkScrollHeight = () => {
      const { scrollHeight } = document.body;

      if (prevScrollHeight !== scrollHeight) {
        headingsScrollRef.current = getHeadingsScrollPosition(targetElement);
      }

      prevScrollHeight = scrollHeight;
      timeoutId = setTimeout(
        checkScrollHeight,
        CHECK_SCROLL_HEIGHT_INTERVAL_MS,
      );
    };

    timeoutId = setTimeout(checkScrollHeight, CHECK_SCROLL_HEIGHT_INTERVAL_MS);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [targetElement]);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return activeId;
};

export default useActiveHeadingDetector;
