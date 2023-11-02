import { useEffect, useMemo, useRef } from 'react';

import mediumZoom, { Zoom } from 'medium-zoom';

import { Theme } from '@src/constants/enums';

import { theme as tailwindTheme } from '../../tailwind.config';
import useTheme from './useTheme';

const useMediumZoom = () => {
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
    zoomRef.current = mediumZoom({ margin: 24 });

    return () => {
      zoomRef.current?.close();
      zoomRef.current?.detach();
    };
  }, []);

  useEffect(() => {
    zoomRef.current?.update({ background });
  }, [background]);

  return { ...zoomRef.current };
};

export default useMediumZoom;
