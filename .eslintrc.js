module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
      },
    ],
  },
};
