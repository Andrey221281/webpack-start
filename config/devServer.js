const paths = require('../config/paths')
const port = process.env.PORT || 9090
const host = process.env.HOST || 'localhost'

module.exports = {
  host: host,
  port: port,
  hot: true,
  logLevel: 'silent',
  overlay: false,
  quiet: true,
  //   stats: 'errors-only',
  //   noInfo: true,

  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: {
    disableDotRule: true
  },
  disableHostCheck: true,
  watchOptions: { ignored: /node_modules/ },
  contentBase: paths.appBuild,
  compress: true,
  publicPath: '/',
  watchContentBase: true
}
