#! /usr/bin/env node
process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const fs = require('fs-extra')
const paths = require('../config/paths')
const openBrowser = require('react-dev-utils/openBrowser')
const createConfig = require('../config/asyncCreateConfig')
const DevServer = require('webpack-dev-server')
const printErrors = require('razzle-dev-utils/printErrors')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 9090

process.noDeprecation = true

const start = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    fs.removeSync(paths.appAssetsManifest)
    fs.removeSync(paths.appCache)

    resolve(
      await createConfig('dev').then((config) => {
        console.log('Compiling... \n\n')
        const clientCompiler = compile(config)

        const server = new DevServer(
          clientCompiler,
          Object.assign(config.devServer, {
            static: [paths.appPublic, paths.appImagesSrc],
            transportMode: 'ws',
            host: host,
            port: port,
            client: { progress: true },
            overlay: false,
            firewall: false,
            headers: { 'Access-Control-Allow-Origin': '*' },
            historyApiFallback: {
              disableDotRule: true
            },
            compress: true,
            liveReload: true,
            injectClient: true,
            injectHot: true
          })
        )
        server.listen(port, host, (err) => {
          if (err) {
            printErrors('Failed server:', [err])
          }
        })
      })
    )
  })

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
}

start()
  .then(() => openBrowser(`http://${host}:${port}`))
  .catch((err) => console.error(err))
