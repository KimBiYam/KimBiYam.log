// Hex mirror of the color tokens in src/shared/styles/global.css, for places
// that cannot read CSS variables (OG images, the global error page, the code
// highlighter, <meta name="theme-color">). Keep in sync with the CSS variables:
//   background -> --color-background    foreground  -> --color-foreground
//   proseBody  -> --color-prose-body    muted       -> --color-muted
//   surface    -> --color-surface       accentViolet -> --color-accent-violet
//   accentCyan -> --color-accent-cyan
export const COLORS = {
  light: {
    background: '#f7f7fb',
    foreground: '#11111c',
    proseBody: '#2a2a40',
    muted: '#545670',
    surface: '#ffffff',
    accentViolet: '#6d28d9',
    accentCyan: '#0f766e',
  },
  dark: {
    background: '#070711',
    foreground: '#f1f1f8',
    proseBody: '#dcdcea',
    muted: '#a5a6bc',
    surface: '#0d0d1a',
    accentViolet: '#a78bfa',
    accentCyan: '#5eead4',
  },
} as const;

// RGB channels of the decorative glow colors (--glow-* in global.css).
export const GLOW_CHANNELS = {
  violet: '139, 92, 246',
  cyan: '34, 211, 238',
} as const;
