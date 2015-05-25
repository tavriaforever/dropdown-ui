var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
    {
        entry: {
            example: ['webpack/hot/dev-server', './example/example.js']
        },
        output: {
            path: path.join(__dirname, 'example'),
            filename: 'example.bundle.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify('example')
            }),
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
    },
    {
        entry: {
            dist: './dist/webpack.js'
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'dropdown.bundle.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify('dist')
            }),
            new ExtractTextPlugin('dropdown.bundle.css')
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
    }
];
