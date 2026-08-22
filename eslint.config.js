const js = require("@eslint/js");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.turbo/**",
      "**/.vercel/**",
      "**/.mf/**",
      "**/@mf-types/**",
      "**/node_modules/**",
      "**/*.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { import: importPlugin },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  // 브라우저에서 실행되는 앱 소스 (React 컴포넌트, bootstrap 등)
  {
    files: ["apps/*/src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Node에서 실행되는 빌드 설정/스크립트 (webpack.config.js, *.meta.js 등)
  {
    files: [
      "**/*.config.js",
      "**/*.meta.js",
      "**/jest.setup.js",
      "eslint.config.js",
      "turbo/generators/**/*.{js,ts}",
      "packages/webpack-utils/**/*.js",
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
