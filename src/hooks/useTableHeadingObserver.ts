import { useEffect, useState } from 'react';

const useTableHeadingObserver = () => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries.find((entry) => entry.isIntersecting)?.target;
        if (target) setActiveId(target?.id);
      },
      {
        rootMargin: '0px 0px -30% 0px',
      },
    );

    const headingElements = Array.from(document.querySelectorAll('h2, h3'));
    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return activeId;
};

export default useTableHeadingObserver;
