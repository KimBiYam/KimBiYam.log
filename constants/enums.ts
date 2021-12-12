export const Theme = {
  dark: "dark",
  light: "light",
} as const;
export type Theme = typeof Theme[keyof typeof Theme];

export const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && Object.values(Theme).includes(value as Theme);

export const Tag = {
  all: "all",
} as const;
export type Tag = typeof Tag[keyof typeof Tag];
