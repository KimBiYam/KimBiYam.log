'use client';

import { useTheme as useNextTheme } from 'next-themes';

import { isTheme, Theme } from '../constants';
import {
  runCircularTransition,
  TransitionOrigin,
} from '../utils/themeTransition';

const useTheme = () => {
  // resolvedTheme maps the "system" default to the actual light/dark value. It
  // is undefined on the first client render (next-themes reads the system
  // preference in an effect), so theme stays undefined until it is known
  // instead of guessing light.
  const { resolvedTheme, setTheme } = useNextTheme();

  const theme = isTheme(resolvedTheme) ? resolvedTheme : undefined;

  // With an origin, the change is revealed as a circle spreading from it.
  const toggleTheme = (origin?: TransitionOrigin) => {
    const changedTheme = theme === Theme.dark ? Theme.light : Theme.dark;
    const applyTheme = () => setTheme(changedTheme);

    if (origin) runCircularTransition(origin, applyTheme);
    else applyTheme();
  };

  return { theme, toggleTheme };
};

export default useTheme;
