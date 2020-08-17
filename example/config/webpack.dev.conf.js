const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')

module.exports = merge(baseWebpackConfig, {
  entry: path.resolve(__dirname, '../src/entry.js'),
  output: {
    // 热加载不能使用chunkhash
    filename: 'dist/bundle.js',
    chunkFilename: 'dist/[name]_[hash:8].js',
    // path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    namedModules: true,
    namedChunks: true
  },
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  plugins: [
    new HotModuleReplacementPlugin(),

    // 生成自动引用文件的html模板
    new HtmlWebpackPlugin({
      template: require.resolve('../index.html'),
      inject: true,
    }),

    // 配置开发环境的全局变量
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]
})