'use client';

import { useEffect, useRef } from 'react';

// Tracks how far the reader is through the <article> (not the whole page, so
// the footer/navigation below it don't stretch the bar). One passive,
// rAF-throttled scroll listener that only writes a transform (no React state).
// A ResizeObserver keeps it accurate when images/code blocks change the height.
const ReadingProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.querySelector('article');
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const bar = barRef.current;
      if (!bar) return;

      let progress = 0;

      if (article) {
        const { top, height } = article.getBoundingClientRect();
        const scrollable = height - window.innerHeight;
        progress = scrollable > 0 ? -top / scrollable : top < 0 ? 1 : 0;
      }

      bar.style.setProperty(
        'transform',
        `scaleX(${Math.min(1, Math.max(0, progress))})`,
      );
    };

    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(schedule);
    if (article) resizeObserver.observe(article);

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return <div ref={barRef} aria-hidden="true" className="reading-progress" />;
};

export default ReadingProgress;
