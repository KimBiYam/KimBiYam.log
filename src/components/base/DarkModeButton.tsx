'use client';

import { motion, Transition, Variants } from 'framer-motion';

import MoonIcon from '@src/assets/svgs/moon.svg';
import SunIcon from '@src/assets/svgs/sun.svg';
import { Theme } from '@src/constants';
import useMounted from '@src/hooks/useMounted';
import useTheme from '@src/hooks/useTheme';
import * as googleAnalytics from '@src/lib/googleAnalytics';

const rotateScaleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
};

const variants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
    rotate: 0,
  },
  exit: {
    scale: 0,
    opacity: 0,
    rotate: 360,
    transition: rotateScaleSpring,
  },
};

const themeButtons = [
  {
    buttonTheme: Theme.dark,
    icon: <MoonIcon />,
  },
  {
    buttonTheme: Theme.light,
    icon: <SunIcon />,
  },
];

const DarkModeButton = () => {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  const handleClick = () => {
    if (theme === Theme.dark) googleAnalytics.darkModeOff();
    if (theme === Theme.light) googleAnalytics.darkModeOn();
    toggleTheme();
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      className="p-2 rounded-full cursor-pointer primary-button-hover"
      onClick={handleClick}
      title="dark-mode-button"
    >
      <div className="relative w-6 h-6">
        {themeButtons.map(({ icon, buttonTheme }) => (
          <motion.div
            key={buttonTheme}
            initial={false}
            className="absolute w-full"
            animate={theme === buttonTheme ? 'initial' : 'exit'}
            variants={variants}
          >
            {icon}
          </motion.div>
        ))}
      </div>
    </button>
  );
};

export default DarkModeButton;
