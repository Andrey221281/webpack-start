#! /usr/bin/env node
process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const fs = require('fs-extra')
// const setPorts = require('../config/setPorts')
const paths = require('../config/paths')
const openBrowser = require('react-dev-utils/openBrowser')
const createConfig = require('../config/createConfig')
const DevServer = require('webpack-dev-server')
const printErrors = require('razzle-dev-utils/printErrors')
const setPorts = require('razzle-dev-utils/setPorts')
// const clearConsole = require('react-dev-utils/clearConsole')
const chokidar = require('chokidar')
const chalk = require('chalk')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 9090

process.noDeprecation = true

function start() {
  fs.removeSync(paths.appAssetsManifest)
  //   clearConsole()
  console.log('Compiling... \n\n')

  const clientConfig = createConfig('dev')

  const clientCompiler = compile(clientConfig)

  const server = new DevServer(
    clientCompiler,
    Object.assign(clientConfig.devServer, {
      after(app, server, compiler) {
        app.use(
          require('webpack-hot-middleware')(clientCompiler, {
            log: false
          })
        )
        const watcher = chokidar.watch(paths.appPublicHtmlFile)
        watcher.on('change', (filepath) => {
          console.log('file changed:', chalk.cyan(filepath))
          server.sockWrite(server.sockets, 'content-changed')
        })
      },
      before(app, server, compiler) {}
    })
  )

  server.listen(port, host, (err) => {
    if (err) {
      printErrors('Failed to compile.', [err])
    }

    openBrowser(`http://${host}:${port}`)
    //   clearConsole()
    //   console.log(
    //     chalk.cyan(`\n ...Dev server start on http://${host}:${port}...`)
    //   )
    //   console.log()
  })
}

function compile(config) {
  let compiler
  try {
    compiler = webpack(config)
  } catch (e) {
    printErrors('Failed to compile.', [e])
    process.exit(1)
  }
  return compiler
}
setPorts().then(start).catch(console.error)
// start()
