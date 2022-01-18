import mediumZoom, { Zoom } from 'medium-zoom';
import { useEffect, useMemo, useState } from 'react';
import { Theme } from '../constants';
import colors from '../lib/styles/colors';
import useThemeStorage from './useThemeStorage';

const useMediumZoom = (ref: React.RefObject<HTMLElement>) => {
  const { theme } = useThemeStorage();
  const [zoom, setZoom] = useState<Zoom | null>(null);

  const background = useMemo(
    () => (theme === Theme.dark ? colors.trueGray800 : colors.white),
    [theme],
  );

  useEffect(() => {
    const images = ref.current?.querySelectorAll('img');
    setZoom(mediumZoom(images, { background }));
  }, []);

  useEffect(() => {
    zoom?.update({ background });
  }, [theme]);
};

export default useMediumZoom;
