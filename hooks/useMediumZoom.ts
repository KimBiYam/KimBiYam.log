import mediumZoom, { Zoom } from 'medium-zoom';
import { useEffect, useState } from 'react';
import { Theme } from '../constants';
import colors from '../lib/styles/colors';
import useThemeStorage from './useThemeStorage';

const useMediumZoom = (ref: React.RefObject<HTMLElement>) => {
  const { theme } = useThemeStorage();
  const [zoom, setZoom] = useState<Zoom | null>(null);

  useEffect(() => {
    const images = ref.current?.querySelectorAll('img');
    setZoom(mediumZoom(images));
  }, []);

  useEffect(() => {
    zoom?.update({
      background: theme === Theme.dark ? colors.trueGray800 : colors.white,
    });
  }, [theme]);
};

export default useMediumZoom;
