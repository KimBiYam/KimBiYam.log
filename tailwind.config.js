const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: {
    enable: true,
    preserveHtmlElements: false,
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: ["dark"],
    },
  },
  darkMode: "class",
  theme: {
    colors,
    container: {
      center: true,
    },
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "fade-out": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out",
        "fade-out": "fade-out 0.2s ease-in-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
