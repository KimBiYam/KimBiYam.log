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
  pageYOffset: number,
) => {
  const filtered = headings.filter(
    (el) => el.top <= pageYOffset + SCROLL_MARGIN_PX,
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
    const { pageYOffset } = window;

    setActiveId(findClosestScrollId(headingsScrollRef.current, pageYOffset));
  }, THROTTLE_TIME_MS);

  useEffect(() => {
    headingsScrollRef.current = getHeadingsScrollPosition();
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeId;
};

export default useActiveHeadingDetector;
