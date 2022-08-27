import { memo } from 'react';

import { m } from 'framer-motion';

import MoonIcon from '../../assets/svgs/moon.svg';
import SunIcon from '../../assets/svgs/sun.svg';
import { Theme } from '../../constants';
import useMounted from '../../hooks/useMounted';
import useTheme from '../../hooks/useTheme';
import * as googleAnalytics from '../../lib/googleAnalytics';
import { createRotateScaleMotion } from '../../lib/styles/motions';

const DarkModeButton = () => {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  const handleClick = () => {
    if (theme === Theme.dark) googleAnalytics.darkModeOff();
    if (theme === Theme.light) googleAnalytics.darkModeOn();
    toggleTheme();
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      className="p-2 rounded-full cursor-pointer primary-button-hover"
      onClick={handleClick}
      title="dark-mode-button"
    >
      <div className="relative w-6 h-6">
        <m.div
          className="absolute w-full"
          {...createRotateScaleMotion(theme === Theme.dark)}
        >
          <MoonIcon />
        </m.div>
        <m.div
          className="absolute w-full"
          {...createRotateScaleMotion(theme === Theme.light)}
        >
          <SunIcon />
        </m.div>
      </div>
    </button>
  );
};

export default memo(DarkModeButton);
