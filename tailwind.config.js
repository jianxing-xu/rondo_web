const defaultConfig = require("tailwindcss/defaultConfig");
const formsPlugin = require("@tailwindcss/forms");

module.exports = {
  mode: "jit",
  purge: ["index.html", "src/**/*.tsx"],
  theme: {
    fontFamily: {
      sans: ["Inter", defaultConfig.theme.fontFamily.sans],
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      sidebar: "var(--bg-sidebar)",
      main: "var(--bg)",
      chat: "var(--bg-chat)",
      input: "var(--bg-input)",
      primary: "var(--primary)",
      select: "var(--bg-select)",
      float: "var(--bg-float)",
    }),
    borderColor: (theme) => ({
      ...theme("colors"),
      DEFAULT: theme("colors.gray.300", "currentColor"),
      primary: "var(--primary)",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      primary: "var(--primary)",
      light2: "var(--font-light2)",
      light: "var(--font-light)",
      normal: "var(--font-normal)",
      input: "var(--font-input)",
      icon: "var(--normal-icon)",
      sidebar: "var(--text-sidebar)",
    }),
    fontSize: {
      xxs: "0.5rem",
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    variants: {
      extend: {
        textColor: ["active"],
      },
    },
  },
  darkMode: "class", // media
  plugins: [formsPlugin],
};
