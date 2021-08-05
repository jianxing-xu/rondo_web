const defaultConfig = require("tailwindcss/defaultConfig");
const formsPlugin = require("@tailwindcss/forms");

module.exports = {
  mode: "jit",
  purge: ["index.html", "src/**/*.tsx"],
  theme: {
    fontFamily: {
      sans: ["Inter", defaultConfig.theme.fontFamily.sans],
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      'sidebar': '#2e3238',
      'bgc': 'var(--bg)',
      'primary': 'var(--primary)',
      'bg-light': 'var(--bg-light)'
    }),
    textColor: theme => ({
      ...theme('colors'),
      'primary': 'var(--primary)',
      'icon-normal': 'var(--normal-icon)',
      'light': 'var(--font-light)',
      'normal': 'var(--font-normal)'
    }),
    fontSize: {
      'xxs': '0.5rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    variants: {
      extend: {
        textColor: ['active'],
      }
    }
  },
  darkMode: "class", // media
  plugins: [formsPlugin],
};
