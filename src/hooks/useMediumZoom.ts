import { useEffect, useMemo, useRef } from 'react';

import mediumZoom, { Zoom } from 'medium-zoom';

import { theme as tailwindTheme } from '../../tailwind.config';
import { Theme } from '../constants';
import useTheme from './useTheme';

const useMediumZoom = () => {
  const { theme } = useTheme();
  const background = useMemo(
    () =>
      theme === Theme.dark
        ? tailwindTheme.colors.neutral[900]
        : tailwindTheme.colors.white,
    [theme],
  );

  const zoomRef = useRef<Zoom | null>(null);

  useEffect(() => {
    zoomRef.current = mediumZoom({ background, margin: 24 });
  }, [background]);

  return { ...zoomRef.current };
};

export default useMediumZoom;
