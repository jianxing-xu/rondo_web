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
      'sidebar': '#2e3238'
    })
  },
  darkMode: "class", // media
  plugins: [formsPlugin],
};
