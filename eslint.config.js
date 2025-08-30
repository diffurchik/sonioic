import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import { SemicolonPreference } from 'typescript';

export default [
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: prettier,
    },
    rules: {
      quotes: ["error", "single"],
      "@typescript-eslint/no-unused-vars": "error",
      // "prettier/prettier": [
      //   "warn",
      //   {
      //     semi: false,
      //     singleQuote: true,
      //     trailingComma: "es5",
      //     printWidth: 120,
      //     tabWidth: 2,
      //   },
      // ],
    },
  },
];
