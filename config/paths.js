const { resolve } = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = (relativePath) => resolve(appDirectory, relativePath)

module.exports = {
  appBuild: resolveApp('build'),
  appBuildPublic: resolveApp('build/public'),
  appSrc: resolveApp('src'),
  appPublic: resolveApp('public'),
  appAssetsManifest: resolveApp('build/assets.json'),
  appFavicon: resolveApp('public/favicon.svg'),
  appImagesSrc: resolveApp('src/images'),
  appCache: resolveApp('.cache'),
  appAssetsFolder: resolveApp('build/assets/'),
  appImagesBuild: resolveApp('build/images'),
  appPublicHtmlFile: resolveApp('public/index.html'),
  config: resolveApp('config/createConfig.js'),
  appNodeModules: resolveApp('node_modules')
}
