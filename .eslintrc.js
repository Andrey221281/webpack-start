module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:react/recommended', 'standard'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ]
  }
}
