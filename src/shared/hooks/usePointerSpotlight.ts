'use client';

import { useEffect, useRef } from 'react';

const SPOTLIGHT_SELECTOR = '.pointer-spotlight';

/**
 * Tracks the pointer over `.pointer-spotlight` elements inside the returned
 * container and exposes its position as the `--mx` / `--my` CSS variables
 * (in px, relative to the hovered element) for radial-gradient spotlights.
 *
 * One delegated listener serves every card in the container. Nothing is
 * registered for touch / non-hover devices or when the user prefers reduced
 * motion (checked once on mount).
 */
const usePointerSpotlight = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(function trackPointerSpotlight() {
    const container = ref.current;

    if (!container) return;

    const isSpotlightEnabled =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isSpotlightEnabled) return;

    let frameId = 0;
    let target: HTMLElement | null = null;
    let clientX = 0;
    let clientY = 0;

    const updatePosition = () => {
      frameId = 0;

      if (!target) return;

      const { left, top } = target.getBoundingClientRect();

      target.style.setProperty('--mx', `${clientX - left}px`);
      target.style.setProperty('--my', `${clientY - top}px`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const spotlight =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(SPOTLIGHT_SELECTOR)
          : null;

      if (!spotlight) return;

      target = spotlight;
      clientX = event.clientX;
      clientY = event.clientY;

      if (!frameId) frameId = requestAnimationFrame(updatePosition);
    };

    container.addEventListener('pointermove', handlePointerMove);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return ref;
};

export default usePointerSpotlight;
