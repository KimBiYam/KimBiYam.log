
import {
  domAnimation,
  LazyMotion,
  type Transition,
  type Variants,
} from 'motion/react';
import * as m from 'motion/react-m';

import MoonIcon from '@src/assets/svgs/moon.svg?react';
import SunIcon from '@src/assets/svgs/sun.svg?react';
import useMounted from '@src/shared/hooks/useMounted';

import { Theme } from '../constants';
import useTheme from '../hooks/useTheme';

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
    Icon: MoonIcon,
  },
  {
    buttonTheme: Theme.light,
    Icon: SunIcon,
  },
];

const DarkModeButton = () => {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  const handleClick = () => {
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
          {themeButtons.map(({ Icon, buttonTheme }) => (
            <m.div
              key={buttonTheme}
              initial={false}
              className="absolute w-full"
              animate={theme === buttonTheme ? 'initial' : 'exit'}
              variants={variants}
            >
              <Icon className="w-full h-full fill-current" />
            </m.div>
          ))}
        </LazyMotion>
      </div>
    </button>
  );
};

export default DarkModeButton;
