const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
