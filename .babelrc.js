module.exports = (api) => {
  const env = api.env()

  api.cache.using(() => env === 'development')

  return {
    presets: [
      ['@babel/env', { modules: false, loose: true }],
      '@babel/preset-react'
    ],
    plugins: ['@babel/plugin-proposal-class-properties']
  }
}
