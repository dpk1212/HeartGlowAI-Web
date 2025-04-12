module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["error", {code: 120}],
    "object-curly-spacing": ["error", "never"],
    "indent": ["error", 2],
    "valid-jsdoc": "off",
    "require-jsdoc": "off",
    "camelcase": "off",
    "one-var": "off",
    "block-spacing": "off",
    "brace-style": "off",
    "no-var": "off",
    "spaced-comment": "off",
    "comma-dangle": "off",
    "eol-last": "off",
    "new-cap": "off",
    "space-before-function-paren": "off",
    "no-invalid-this": "off"
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
