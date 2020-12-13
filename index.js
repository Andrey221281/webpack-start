const splitChunksConfigs = {
  prodGranular: {
    chunks: 'all',
    cacheGroups: {
      default: false,
      vendors: false,
      // In webpack 5 vendors was renamed to defaultVendors
      defaultVendors: false,
      framework: {
        chunks: 'all',
        name: 'framework',
        // This regex ignores nested copies of framework libraries so they're
        // bundled with their issuer.
        // https://github.com/vercel/next.js/pull/9012
        test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
        priority: 40,
        // Don't let webpack eliminate this chunk (prevents this chunk from
        // becoming a part of the commons chunk)
        enforce: true
      }
    },
    maxInitialRequests: 25,
    minSize: 20000
  }
}
