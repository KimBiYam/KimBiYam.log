'use client';

import { Variants } from 'motion/react';
import * as m from 'motion/react-m';

import MoonIcon from '@src/shared/assets/svgs/moon.svg';
import SunIcon from '@src/shared/assets/svgs/sun.svg';
import useMounted from '@src/shared/hooks/useMounted';
import { Theme } from '@src/shared/constants';
import useTheme from '@src/shared/hooks/useTheme';
import { DURATION, EASE_OUT } from '@src/shared/styles/motions';

const variants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.6,
    opacity: 0,
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

const buttonClassName =
  'flex items-center justify-center shrink-0 w-11 h-11 border rounded-xl border-line bg-glass';

const DarkModeButton = () => {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();

    toggleTheme({ x: left + width / 2, y: top + height / 2 });
  };

  // Keep the same footprint until mounted and the theme is resolved so the
  // header does not shift and no wrong icon is drawn.
  if (!mounted || !theme) {
    return <span aria-hidden="true" className={buttonClassName} />;
  }

  return (
    <button
      type="button"
      className={`${buttonClassName} cursor-pointer primary-button-hover focus-ring`}
      onClick={handleClick}
      aria-label={
        theme === Theme.dark ? '라이트 모드로 전환' : '다크 모드로 전환'
      }
    >
      <span className="relative w-[18px] h-[18px]">
        {themeButtons.map(({ icon, buttonTheme }) => (
          <m.span
            key={buttonTheme}
            initial={false}
            className="absolute inset-0 [&>svg]:size-full"
            animate={theme === buttonTheme ? 'initial' : 'exit'}
            variants={variants}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            {icon}
          </m.span>
        ))}
      </span>
    </button>
  );
};

export default DarkModeButton;
