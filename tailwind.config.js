/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const typographyPlugin = require('@tailwindcss/typography');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

const breakPoints = require('./src/lib/styles/breakPoints.json');

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

const hoverPlugin = plugin(({ addVariant, e, postcss }) => {
  addVariant('media-hover', ({ container, separator }) => {
    const hoverRule = postcss.atRule({
      name: 'media',
      params: '(hover: hover)',
    });
    hoverRule.append(container.nodes);
    container.append(hoverRule);
    hoverRule.walkRules((rule) => {
      // eslint-disable-next-line no-param-reassign
      rule.selector = `.${e(
        `hover${separator}${rule.selector.slice(1)}`,
      )}:hover`;
    });
  });
});

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors,
    container: {
      center: true,
    },
    extend: {
      screens: breakPoints,
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
        textShadow: 'text-shadow',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              fontWeight: 700,
            },
            code: {
              padding: '0.2em 0.4em',
              fontWeight: 500,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              margin: '0 0.1em',
              borderRadius: '4px',
              background: theme('colors.neutral.200'),
              '&:before': {
                display: 'none',
              },
              '&:after': {
                display: 'none',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              code: {
                background: 'inherit !important',
                color: 'inherit',
                fontSize: 'inherit',
                padding: 'inherit',
              },
            },
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            'ol > li::marker': {
              color: theme('colors.neutral.500'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.neutral.100'),
            code: {
              background: theme('colors.neutral.700'),
              color: theme('colors.neutral.100'),
            },
            pre: {
              code: {
                background: 'inherit',
                color: 'inherit',
              },
            },
            h1: {
              color: theme('colors.neutral.100'),
            },
            h2: {
              color: theme('colors.neutral.100'),
            },
            h3: {
              color: theme('colors.neutral.100'),
            },
            a: {
              color: theme('colors.neutral.100'),
            },
            strong: {
              color: theme('colors.neutral.100'),
            },
            blockquote: {
              color: theme('colors.neutral.100'),
            },
            'ol > li::marker': {
              color: theme('colors.neutral.400'),
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
  plugins: [typographyPlugin, hoverPlugin],
};
