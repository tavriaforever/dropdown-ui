var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        index: ['webpack/hot/dev-server', './pages/index.js']
    },
    output: {
        path: './bundle',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].style.css')
    ],
    module: {
        loaders: [
            { test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader!autoprefixer-loader') },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    devServer: {
        host: 'localhost',
        post: 8080,
        contentBase: './',
        colors: true
    }
};
