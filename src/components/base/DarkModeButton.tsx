'use client';

import { domAnimation, LazyMotion, Transition, Variants } from 'motion/react';
import * as m from 'motion/react-m';

import MoonIcon from '@src/assets/svgs/moon.svg';
import SunIcon from '@src/assets/svgs/sun.svg';
import { Theme } from '@src/constants/enums';
import useMounted from '@src/hooks/useMounted';
import useTheme from '@src/hooks/useTheme';
import GA from '@src/lib/googleAnalytics/googleAnalytics';

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
    if (theme === Theme.dark) GA.trackEvent('dark_mode_on');
    if (theme === Theme.light) GA.trackEvent('dark_mode_off');
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
        <LazyMotion features={domAnimation} strict>
          {themeButtons.map(({ icon, buttonTheme }) => (
            <m.div
              key={buttonTheme}
              initial={false}
              className="absolute w-full"
              animate={theme === buttonTheme ? 'initial' : 'exit'}
              variants={variants}
            >
              {icon}
            </m.div>
          ))}
        </LazyMotion>
      </div>
    </button>
  );
};

export default DarkModeButton;
