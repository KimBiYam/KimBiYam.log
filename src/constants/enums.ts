export const Theme = {
  dark: 'dark',
  light: 'light',
} as const;
export type Theme = typeof Theme[keyof typeof Theme];

export const Tag = {
  all: 'all',
} as const;
export type Tag = typeof Tag[keyof typeof Tag];

export const ScrollDirection = {
  up: 'UP',
  down: 'DOWN',
} as const;
export type ScrollDirection =
  typeof ScrollDirection[keyof typeof ScrollDirection];

export const GoogleAnalyticsEvents = {
  darkModeOn: 'dark_mode_on',
  darkModeOff: 'dark_mode_off',
} as const;
export type GoogleAnalyticsEvents =
  typeof GoogleAnalyticsEvents[keyof typeof GoogleAnalyticsEvents];
