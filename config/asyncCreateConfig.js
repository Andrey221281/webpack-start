const paths = require('./paths')
const devServer = require('./devServer')
const webpack = require('webpack')
const getClientEnv = require('./env').getClientEnv
const AssetsPlugin = require('assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')

const postcssOptions = {
  ident: 'postcss',
  plugins: [
    require('tailwindcss'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 0
    }),
    require('postcss-flexbugs-fixes')
    // require('cssnano')({
    //   preset: 'default'
    // })
  ]
}
module.exports = (
  env = 'dev',
  clearConsole = true,
  host = 'localhost',
  port = 3000
) => {
  return new Promise((resolve) => {
    const IS_PROD = env === 'prod'
    const IS_DEV = env === 'dev'
    process.env.NODE_ENV = IS_PROD ? 'production' : 'development'

    const dotenv = getClientEnv('web', { clearConsole, host, port })

    const config = {
      stats: 'none',
      cache: {
        type: 'filesystem',
        cacheDirectory: paths.appCache
      },
      infrastructureLogging: {
        // Only warnings and errors
        // level: 'none' disable logging
        // Please read https://webpack.js.org/configuration/other-options/#infrastructurelogginglevel
        level: 'warn'
      },
      mode: IS_DEV ? 'development' : 'production',
      devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
      entry: paths.appSrc,
      output: {
        path: paths.appBuild,
        publicPath: '/',
        filename: IS_DEV ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
        pathinfo: true,
        chunkFilename: IS_DEV
          ? 'js/[name].chunk.js'
          : 'js/[name].[contenthash:8].chunk.js'
      },
      resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.json', 'html'],
        alias: {
          '@': paths.appSrc
        }
      },
      resolveLoader: {
        modules: [paths.appNodeModules]
      },
      module: {
        strictExportPresence: true,

        rules: [
          {
            test: /\.js$/,
            exclude: paths.appNodeModules,
            use: { loader: require.resolve('babel-loader') }
          },
          {
            test: /\.html$/i,
            loader: require.resolve('html-loader'),
            options: {
              attributes: {
                list: [
                  {
                    tag: 'img',
                    attribute: 'data-src',
                    type: 'src'
                  },
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src'
                  },
                  {
                    tag: 'img',
                    attribute: 'data-srcset',
                    type: 'srcset'
                  }
                ]
              }
            }
          },
          {
            test: /\.svg$/,
            use: { loader: require.resolve('@svgr/webpack') }
          },
          {
            test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'images/[name].[contenthash:8][ext][query]'
            }
          },
          {
            test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
            type: 'asset/resource',
            generator: {
              filename: 'fonts/[name][ext][query]'
            }
          },
          {
            test: /\.css$/i,
            use: IS_DEV
              ? [
                  require.resolve('style-loader'),
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      sourceMap: true,
                      importLoaders: 1,
                      modules: {
                        auto: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                      }
                    }
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      sourceMap: true,
                      postcssOptions: postcssOptions
                    }
                  }
                ]
              : [
                  MiniCssExtractPlugin.loader,
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      importLoaders: 1,
                      modules: {
                        auto: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                      }
                    }
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      postcssOptions: postcssOptions
                    }
                  }
                ]
          }
        ]
      },

      plugins: [
        // new CopyPlugin({
        //   patterns: [{ from: paths.appImagesSrc, to: paths.appImagesBuild }]
        // }),

        new AssetsPlugin({
          path: paths.appBuild,
          filename: 'assets.json'
        }),
        //   new webpack.ProgressPlugin(),
        new webpack.DefinePlugin(dotenv.stringified),
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: true,
              template: paths.appPublicHtmlFile,
              scriptLoading: 'defer'
            },
            IS_PROD
              ? {
                  minify: false
                  // {
                  //   removeComments: true,
                  //   collapseWhitespace: true,
                  //   removeRedundantAttributes: true,
                  //   useShortDoctype: true,
                  //   removeEmptyAttributes: true,
                  //   removeStyleLinkTypeAttributes: true,
                  //   keepClosingSlash: true,
                  //   minifyJS: true,
                  //   minifyCSS: true,
                  //   minifyURLs: true
                  // }
                }
              : {}
          )
        ),
        new HtmlWebpackHarddiskPlugin()
        // new FaviconsWebpackPlugin({
        //   logo: paths.appFavicon,
        //   prefix: 'images/assets',
        //   favicons: {
        //     appName: process.env.APP_NAME || 'my-app',
        //     appDescription: process.env.APP_DESCRIPTION || 'My awesome App'
        //   }
        // })
      ]
    }

    if (IS_DEV) {
      config.devServer = devServer
      config.plugins = [
        ...config.plugins,
        new ErrorOverlayPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
      ]
    }

    if (IS_PROD) {
      config.plugins = [
        ...config.plugins,
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css'
        })
      ]
    }

    resolve(config)
  })
}
