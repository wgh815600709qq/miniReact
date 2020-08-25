const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, '../example/src/entry.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'test.js'
    },
    module: {
        rules: [
            {
                test: /\.js|.jsx$/,
                loader: "babel-loader",
            }
        ]
    },
    devtool: 'cheap-module-source-map',
    mode: 'development'
}