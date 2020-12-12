const webpack = require('webpack')
const fs = require('fs-extra')
const chalk = require('chalk')
const paths = require('../config/paths')
const FileSizeReporter = require('razzle-dev-utils/FileSizeReporter')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const config = require('../config/createConfig')
const printErrors = require('razzle-dev-utils/printErrors')
// const clearConsole = require( 'react-dev-utils/clearConsole'

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

process.env.NODE_ENV = 'production'
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err
})

async function main() {
  measureFileSizesBeforeBuild(paths.appBuild)
    .then((previousFileSizes) => {
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      fs.emptyDirSync(paths.appBuild)

      // Start the webpack build
      return build(previousFileSizes)
    })
    .then(
      ({ stats, previousFileSizes, warnings }) => {
        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'))
          console.log(warnings.join('\n\n'))
          console.log(
            '\nSearch for the ' +
              chalk.underline(chalk.yellow('keywords')) +
              ' to learn more about each warning.'
          )
          console.log(
            'To ignore, add ' +
              chalk.cyan('// eslint-disable-next-line') +
              ' to the line before.\n'
          )
        } else {
          console.log(chalk.green('Compiled successfully.\n'))
        }
        console.log('File sizes after gzip:\n')
        printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild)
        console.log()
      },
      (err) => {
        console.log(chalk.red('Failed to compile.\n'))
        console.log((err.message || err) + '\n')
        process.exit(1)
      }
    )
}

function build(previousFileSizes) {
  return new Promise((resolve, reject) => {
    const clientConfig = config('prod')

    // clearConsole()

    console.log('Creating an optimized production build...\n')
    console.log('Compiling...\n\n')

    compile(clientConfig, (err, clientStats) => {
      if (err) {
        reject(err)
      }
      const clientMessages = formatWebpackMessages(clientStats.toJson({}, true))
      if (clientMessages.errors.length) {
        return reject(new Error(clientMessages.errors.join('\n\n')))
      }
      if (
        !process.env.WARNINGS_ERRORS_DISABLE &&
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        clientMessages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        )

        return reject(new Error(clientMessages.warnings.join('\n\n')))
      }

      // clearConsole()
      return resolve({
        stats: clientStats,
        previousFileSizes,
        warnings: clientMessages.warnings
      })
    })
  })
}

function compile(config, cb) {
  let compiler
  try {
    compiler = webpack(config)
  } catch (e) {
    printErrors('Failed to compile.', [e])
    process.exit(1)
  }
  compiler.run((err, stats) => {
    cb(err, stats)
  })
}

main()
