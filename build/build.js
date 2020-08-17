const devConfig = require('./config.dev');
const proConfig = require('./config.pro');
const webpack = require('webpack');
let config
const env = process.argv[2].slice(4)
if (env == 'dev') {
    console.log('dev')
    config = devConfig;
} else {
    console.log('pro')
    config = proConfig;
}

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log(stats.hasErrors())
        console.log(stats.toString({
            colors: 'red',
            chunks: false,
            children: false,
            modules: false
        }))
    } else {
        console.log(stats.toString({
            colors: 'green',
            chunks: false,
            children: false,
            modules: false
        }))
    }
});