/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const typographyPlugin = require('@tailwindcss/typography');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const breakPoints = require('./src/shared/styles/breakPoints.json');

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    colors,
    container: {
      center: true,
    },
    extend: {
      screens: breakPoints,
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        line: 'var(--color-line)',
        glass: 'var(--color-glass)',
        accent: {
          violet: 'rgb(var(--color-accent-violet) / <alpha-value>)',
          cyan: 'rgb(var(--color-accent-cyan) / <alpha-value>)',
        },
      },
      borderColor: {
        DEFAULT: 'var(--color-line)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
      transitionDuration: {
        150: 'var(--duration-fast)',
        200: 'var(--duration-base)',
        300: 'var(--duration-slow)',
      },
      transitionProperty: {
        backgroundColor: 'background-color',
        color: 'color',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--color-prose-body))',
            '--tw-prose-headings': 'rgb(var(--color-foreground))',
            '--tw-prose-lead': 'rgb(var(--color-muted))',
            '--tw-prose-links': 'rgb(var(--color-accent-cyan))',
            '--tw-prose-bold': 'rgb(var(--color-foreground))',
            '--tw-prose-counters': 'rgb(var(--color-muted))',
            '--tw-prose-bullets': 'rgb(var(--color-muted))',
            '--tw-prose-hr': 'var(--color-line)',
            '--tw-prose-quotes': 'rgb(var(--color-prose-body))',
            '--tw-prose-quote-borders': 'rgb(var(--color-accent-violet) / 0.6)',
            '--tw-prose-captions': 'rgb(var(--color-muted))',
            '--tw-prose-code': 'rgb(var(--color-accent-violet))',
            '--tw-prose-th-borders': 'var(--color-line)',
            '--tw-prose-td-borders': 'var(--color-line)',
            fontSize: '1.0625rem',
            lineHeight: '1.9',
            wordBreak: 'keep-all',
            a: {
              fontWeight: 500,
              textDecorationLine: 'underline',
              textDecorationColor: 'rgb(var(--color-accent-cyan) / 0.45)',
              textUnderlineOffset: '3px',
              transition:
                'text-decoration-color var(--duration-slow) var(--ease-out)',
              '&:hover': {
                textDecorationColor: 'currentColor',
              },
            },
            code: {
              padding: '0.15em 0.4em',
              fontSize: '0.88em',
              fontWeight: 500,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: '0 0.1em',
              borderRadius: '6px',
              background: 'rgb(var(--color-accent-violet) / 0.14)',
              '&:before': {
                display: 'none',
              },
              '&:after': {
                display: 'none',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              fontWeight: 700,
              lineHeight: '1.4',
              letterSpacing: '-0.03em',
              scrollMarginTop: '6rem',
              a: {
                color: 'inherit',
                fontWeight: 'inherit',
                textDecorationLine: 'none',
              },
              code: {
                background: 'inherit !important',
                color: 'inherit',
                fontSize: 'inherit',
                padding: 'inherit',
              },
            },
            h2: {
              fontSize: '1.65em',
            },
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            blockquote: {
              fontWeight: 400,
              fontStyle: 'normal',
              borderInlineStartWidth: '2px',
              quotes: 'none',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            'thead th': {
              fontWeight: 600,
            },
          },
        },
      }),
      animation: {
        'fade-in': 'fade-in var(--duration-base) var(--ease-out)',
        'fade-out': 'fade-out var(--duration-base) var(--ease-out)',
      },
    },
  },
  plugins: [typographyPlugin],
};
