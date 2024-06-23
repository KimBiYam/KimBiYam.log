export enum Theme {
  dark = 'dark',
  light = 'light',
}

export const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && Object.values(Theme).includes(value as Theme);

export enum Tag {
  all = 'all',
}

export enum ScrollDirection {
  up = 'UP',
  down = 'DOWN',
}
