import { COLORS } from './colors';

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && Object.values(Theme).includes(value as Theme);

// Mirrors --color-background in src/shared/styles/global.css.
export const THEME_COLOR = {
  light: COLORS.light.background,
  dark: COLORS.dark.background,
} as const;
