import { AnimatePresence, m } from 'framer-motion';

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

  return (
    <button
      type="button"
      className="p-2 rounded-full cursor-pointer primary-button-hover"
      onClick={handleClick}
      title="dark-mode-button"
    >
      <div className="relative w-6 h-6">
        {mounted && (
          <AnimatePresence initial={false}>
            {theme === Theme.dark && (
              <m.div
                key="dark-mode-dark"
                className="absolute w-full"
                {...createRotateScaleMotion()}
              >
                <MoonIcon />
              </m.div>
            )}
            {theme === Theme.light && (
              <m.div
                key="dark-mode-light"
                className="absolute w-full"
                {...createRotateScaleMotion()}
              >
                <SunIcon />
              </m.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </button>
  );
};

export default DarkModeButton;
