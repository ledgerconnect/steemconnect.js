module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': 'error',
  },
};
