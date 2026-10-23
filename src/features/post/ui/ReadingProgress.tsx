'use client';

import { useEffect, useRef } from 'react';

import { useMounted } from '@src/shared/hooks';

const SCROLL_TIMELINE_SUPPORT_QUERY = 'animation-timeline: scroll()';

// Fallback for browsers without CSS scroll-driven animations: one passive,
// rAF-throttled scroll listener that only writes a transform (no React state).
const ScriptReadingProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      frameId = 0;
      const { scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      barRef.current?.style.setProperty(
        'transform',
        `scaleX(${Math.min(1, Math.max(0, progress))})`,
      );
    };

    const handleScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return <div ref={barRef} aria-hidden="true" className="reading-progress" />;
};

const ReadingProgress = () => {
  const mounted = useMounted();

  if (mounted && !CSS.supports(SCROLL_TIMELINE_SUPPORT_QUERY)) {
    return <ScriptReadingProgress />;
  }

  return <div aria-hidden="true" className="reading-progress" />;
};

export default ReadingProgress;
