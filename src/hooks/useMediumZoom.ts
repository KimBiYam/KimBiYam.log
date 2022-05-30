import mediumZoom, { Zoom } from 'medium-zoom';
import { useEffect, useMemo, useState } from 'react';
import { Theme } from '../constants';
import useTheme from './useTheme';
import { theme as tailwindTheme } from '../../tailwind.config';

const useMediumZoom = (ref: React.RefObject<HTMLElement>) => {
  const { theme } = useTheme();
  const [zoom, setZoom] = useState<Zoom | null>(null);

  const background = useMemo(
    () =>
      theme === Theme.dark
        ? tailwindTheme.colors.neutral[900]
        : tailwindTheme.colors.white,
    [theme],
  );

  useEffect(() => {
    const images = ref.current?.querySelectorAll('img');
    setZoom(mediumZoom(images, { background, margin: 24 }));
  }, []);

  useEffect(() => {
    zoom?.update({ background });
  }, [theme]);

  useEffect(
    () => () => {
      if (zoom) zoom.close();
    },
    [zoom],
  );
};

export default useMediumZoom;
