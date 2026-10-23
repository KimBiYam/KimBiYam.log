export enum Theme {
  dark = 'dark',
  light = 'light',
}

export const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && Object.values(Theme).includes(value as Theme);

// Mirrors --color-background in src/shared/styles/global.css.
export const THEME_COLOR = {
  light: '#f7f7fb',
  dark: '#070711',
} as const;
