import { useEffect, useRef, useState } from 'react';
import useThrottle from './useThrottle';

interface HeadingScrollPosition {
  id: string;
  top: number;
}

const THROTTLE_TIME_MS = 100;
const SCROLL_MARGIN_PX = 10;

const getHeadingsScrollPosition = () => {
  const headingElements = document.querySelectorAll<HTMLElement>('h2, h3');

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

const useActiveHeadingDetector = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingsScrollRef = useRef<HeadingScrollPosition[]>([]);

  const handleScroll = useThrottle(() => {
    const { scrollY } = window;

    setActiveId(findClosestScrollId(headingsScrollRef.current, scrollY));
  }, THROTTLE_TIME_MS);

  useEffect(() => {
    headingsScrollRef.current = getHeadingsScrollPosition();

    let prevScrollHeight = document.body.scrollHeight;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkScrollHeight = () => {
      const { scrollHeight } = document.body;

      if (prevScrollHeight !== scrollHeight) {
        headingsScrollRef.current = getHeadingsScrollPosition();
      }

      prevScrollHeight = scrollHeight;
      timeoutId = setTimeout(checkScrollHeight, 250);
    };

    timeoutId = setTimeout(checkScrollHeight, 250);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeId;
};

export default useActiveHeadingDetector;
