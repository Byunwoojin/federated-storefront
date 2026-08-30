const js = require("@eslint/js");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");
const tailwindcss = require("eslint-plugin-tailwindcss");
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
  //Tailwind 클래스명 오타 검증 (remote별 스코프 클래스는 화이트리스트 처리)
  {
    files: ["apps/*/src/**/*.{ts,tsx}"],
    plugins: { tailwindcss },
    settings: {
      tailwindcss: { cssConfigPath: "src/styles.css" },
    },
    rules: {
      "tailwindcss/no-custom-classname": [
        "warn",
        { whitelist: ["^\\S+-remote-scope$"] },
      ],
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
