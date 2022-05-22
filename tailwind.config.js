/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const colors = require('tailwindcss/colors');
const typographyPlugin = require('@tailwindcss/typography');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    colors,
    container: {
      center: true,
    },
    extend: {
      screens: {
        xs: { min: '0px', max: '479px' },
        sm: { min: '480px', max: '767px' },
        md: '768px',
        lg: '1024px',
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
      transitionProperty: {
        backgroundColor: 'background-color',
        color: 'color',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              fontWeight: 700,
            },
            code: {
              padding: '4px',
              margin: '0 0.1em',
              borderRadius: '4px',
              background: theme('colors.gray.300'),
              '&:before': {
                display: 'none',
              },
              '&:after': {
                display: 'none',
              },
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            h1: {
              color: theme('colors.gray.300'),
            },
            h2: {
              color: theme('colors.gray.300'),
            },
            h3: {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.gray.300'),
            },
            strong: {
              color: theme('colors.gray.300'),
            },
            blockquote: {
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
      animation: {
        'fade-in': 'fade-in 0.2s ease-in-out',
        'fade-out': 'fade-out 0.2s ease-in-out',
      },
    },
  },
  plugins: [typographyPlugin],
};
