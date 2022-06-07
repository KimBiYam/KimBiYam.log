import { useEffect, useRef, useState } from 'react';
import throttle from '../lib/utils/throttle';

interface HeadingScrollPosition {
  id: string;
  top: number;
}

const THROTTLE_TIME_MS = 100;
const SCROLL_MARGIN_PX = 10;

const useActiveHeadingDetector = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingsScrollRef = useRef<HeadingScrollPosition[]>([]);

  useEffect(() => {
    const findClosestScrollId = (pageYOffset: number) => {
      const filtered = headingsScrollRef.current.filter(
        (el) => el.top <= pageYOffset + SCROLL_MARGIN_PX,
      );

      if (filtered.length === 0) return null;

      const closest = filtered.reduce<HeadingScrollPosition>(
        (prev, cur) => (prev.top > cur.top ? prev : cur),
        {} as HeadingScrollPosition,
      );

      return closest.id;
    };

    const getHeadingsScrollPosition = () => {
      const headingElements = document.querySelectorAll<HTMLElement>('h2, h3');

      return Array.from(headingElements).map((el) => ({
        id: el.id,
        top: el.offsetTop,
      }));
    };

    const handleScroll = throttle(() => {
      const { pageYOffset } = window;

      setActiveId(findClosestScrollId(pageYOffset));
    }, THROTTLE_TIME_MS);

    headingsScrollRef.current = getHeadingsScrollPosition();
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeId;
};

export default useActiveHeadingDetector;
