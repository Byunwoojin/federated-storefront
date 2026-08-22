module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-prefix-selector": {
      prefix: ".cart-remote-scope",
      skipGlobalSelectors: true,
    },
    autoprefixer: {},
  },
};
