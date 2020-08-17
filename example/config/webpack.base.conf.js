const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  resolve: {
    alias: {
      assets: path.resolve(__dirname, '../src/assets'),
      components: path.resolve(__dirname, '../src/components'),
      pages: path.resolve(__dirname, '../src/pages'),
      utils: path.resolve(__dirname, '../src/utils')
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            use: [{
              loader: 'babel-loader',
              options: {
                cacheDirectory: './webpack_cache/',// 将 babel 编译过的模块缓存在 webpack_cache 目录下，下次优先复用
              },
            }],
            include: path.resolve(__dirname, '../src')
          },
          {
            test: /\.(c|le)ss$/,
            use: ['style-loader', 'css-loader',
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9',
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              }, 'less-loader']
          },
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './dist/[name].[hash:8].[ext]',
            },
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/, /\.less$/],
            loader: 'file-loader',
            options: {
              name: './dist/[name].[hash:8].[ext]',
            }
          }
        ]
      }
    ]
  }
}
