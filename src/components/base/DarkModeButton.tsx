import { motion } from 'framer-motion';
import { memo } from 'react';
import MoonIcon from '../../assets/svgs/moon.svg';
import SunIcon from '../../assets/svgs/sun.svg';
import { Theme } from '../../constants';
import useTheme from '../../hooks/useTheme';
import { createRotateScaleMotion } from '../../lib/styles/motions';

const DarkModeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="p-2 rounded-full cursor-pointer primary-button-hover"
      onClick={toggleTheme}
      title="dark-mode-button"
    >
      <div className="relative w-6 h-6">
        <motion.div
          className="absolute w-full"
          {...createRotateScaleMotion(theme === Theme.dark)}
        >
          <MoonIcon />
        </motion.div>
        <motion.div
          className="absolute w-full"
          {...createRotateScaleMotion(theme === Theme.light)}
        >
          <SunIcon />
        </motion.div>
      </div>
    </button>
  );
};

export default memo(DarkModeButton);
