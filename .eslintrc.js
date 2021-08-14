"use strict";

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],

  plugins: ["import", "unicorn"],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },

  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },

  rules: {
    "eslint-comments/no-unused-disable": "error",

    "import/newline-after-import": "error",
    "import/no-default-export": "error",
    "import/no-unresolved": "error",
    "import/order": "error",

    "unicorn/no-abusive-eslint-disable": "error",
    "unicorn/prefer-dom-node-dataset": "error",

    "arrow-body-style": ["error", "as-needed"],
    curly: ["error", "multi-line"],
    eqeqeq: ["error", "smart"],
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
    "grouped-accessor-pairs": ["error", "getBeforeSet"],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "no-else-return": ["error", { allowElseIf: false }],
    "no-return-await": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-useless-return": "error",
    "object-shorthand": ["error", "always"],
    "one-var": ["error", "never"],
    "prefer-arrow-callback": "error",
    "prefer-const": ["error", { destructuring: "all" }],
    "prefer-object-spread": "error",
    "require-await": "error",

    "@typescript-eslint/array-type": ["error", { default: "array" }],
    "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "never",
      },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "objectLiteralProperty",
        format: null,
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE", "PascalCase"],
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_$",
      },
    ],
    "@typescript-eslint/no-useless-constructor": ["error"],
    "@typescript-eslint/prefer-optional-chain": ["error"],
    "@typescript-eslint/prefer-ts-expect-error": ["error"],
  },

  overrides: [
    {
      files: ["**/__mocks__/**/*", "*.d.ts"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
