export const Theme = {
  dark: 'dark',
  light: 'light',
} as const;
export type Theme = typeof Theme[keyof typeof Theme];

export const Tag = {
  all: 'all',
} as const;
export type Tag = typeof Tag[keyof typeof Tag];
