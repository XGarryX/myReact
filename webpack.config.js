const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/index.js'),
    module: {
        rules: [{
            test: /.jsx?$/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ],
    devServer: {
        hot: true,
        overlay: true,
        port: 8080
    }
}