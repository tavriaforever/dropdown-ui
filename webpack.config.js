var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        example: ['webpack/hot/dev-server', './example/example.js']
    },
    output: {
        path: './example/bundle',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].bundle.css')
    ],
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader!autoprefixer-loader')
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src']
    },
    devServer: {
        host: 'localhost',
        post: 8080,
        contentBase: './',
        colors: true
    }
};
