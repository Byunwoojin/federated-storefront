module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-prefix-selector": {
      prefix: ".order-remote-scope",
      skipGlobalSelectors: true,
    },
    autoprefixer: {},
  },
};
