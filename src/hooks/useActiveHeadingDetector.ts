import { useEffect, useRef, useState } from 'react';
import throttle from '../lib/utils/throttle';

const THROTTLE_TIME_MS = 100;

const useActiveHeadingDetector = () => {
  const [activeId, setActiveId] = useState('');
  const headingsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const findClosestScrollId = (pageYOffset: number) => {
      const closest = Object.entries(headingsRef.current).reduce((prev, cur) =>
        Math.abs(cur[1] - pageYOffset) < Math.abs(prev[1] - pageYOffset)
          ? cur
          : prev,
      );

      return closest[0];
    };

    const getHeadingsScrollPosition = () => {
      const headingElements = document.querySelectorAll<HTMLElement>('h2, h3');

      return Array.from(headingElements).reduce<Record<string, number>>(
        (total, el) => ({ ...total, [el.id]: el.offsetTop }),
        {},
      );
    };

    const handleScroll = throttle(() => {
      const { pageYOffset } = window;

      setActiveId(findClosestScrollId(pageYOffset));
    }, THROTTLE_TIME_MS);

    headingsRef.current = getHeadingsScrollPosition();
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeId;
};

export default useActiveHeadingDetector;
