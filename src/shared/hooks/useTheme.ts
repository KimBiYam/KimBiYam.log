'use client';

import { useTheme as useNextTheme } from 'next-themes';

import { isTheme, Theme } from '../constants';
import { runCircularTransition, TransitionOrigin } from '../utils/themeTransition';

const useTheme = () => {
  // resolvedTheme maps the "system" default to the actual light/dark value.
  const { resolvedTheme, setTheme } = useNextTheme();

  const theme = isTheme(resolvedTheme) ? resolvedTheme : Theme.light;

  // With an origin, the change is revealed as a circle spreading from it.
  const toggleTheme = (origin?: TransitionOrigin) => {
    const changedTheme = theme === Theme.light ? Theme.dark : Theme.light;
    const applyTheme = () => setTheme(changedTheme);

    if (origin) runCircularTransition(origin, applyTheme);
    else applyTheme();
  };

  return { theme, toggleTheme };
};

export default useTheme;
