module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-prefix-selector": {
      prefix: ".catalog-remote-scope",
      skipGlobalSelectors: true,
    },
    autoprefixer: {},
  },
};
