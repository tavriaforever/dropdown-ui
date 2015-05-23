var webpack = require('webpack');

module.exports = {
    entry: {
        index: ['webpack/hot/dev-server', './pages/index.js']
    },
    output: {
        path: './bundle',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader!autoprefixer-loader' },
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
