import { useEffect, useMemo, useRef } from 'react';

import mediumZoom, { Zoom } from 'medium-zoom';

import { theme as tailwindTheme } from '../../tailwind.config';
import { Theme } from '../constants';
import useTheme from './useTheme';

const useMediumZoom = (ref: React.RefObject<HTMLElement>) => {
  const { theme } = useTheme();
  const zoomRef = useRef<Zoom | null>(null);

  const background = useMemo(
    () =>
      theme === Theme.dark
        ? tailwindTheme.colors.neutral[900]
        : tailwindTheme.colors.white,
    [theme],
  );

  useEffect(() => {
    const images = ref.current?.querySelectorAll('img');

    if (!images) return;

    const filtered = Array.from(images).filter(
      (el) => el.parentElement?.tagName === 'P',
    );

    zoomRef.current = mediumZoom(filtered, { background, margin: 24 });

    return () => {
      if (zoomRef.current) zoomRef.current.detach();
    };
  }, [background, ref]);

  useEffect(() => {
    zoomRef.current?.update({ background });
  }, [background]);
};

export default useMediumZoom;
