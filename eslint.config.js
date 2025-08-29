import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

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
      "prettier/prettier": "error",
      "function-call-argument-newline": "off",
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: true,
          trailingComma: "es5",
          printWidth: 120,
          tabWidth: 2,
        },
      ],
    },
  },
];
