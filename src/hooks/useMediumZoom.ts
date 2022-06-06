import mediumZoom, { Zoom } from 'medium-zoom';
import { useEffect, useMemo, useRef } from 'react';
import { Theme } from '../constants';
import useTheme from './useTheme';
import { theme as tailwindTheme } from '../../tailwind.config';

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
    zoomRef.current = mediumZoom(images, { background, margin: 24 });

    return () => {
      if (zoomRef.current) zoomRef.current.detach();
    };
  }, []);

  useEffect(() => {
    zoomRef.current?.update({ background });
  }, [background]);
};

export default useMediumZoom;
