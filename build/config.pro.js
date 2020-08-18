const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, '../index.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'miniReact.min.js'
    },
    devtool: 'eval',
    mode: 'production'
}