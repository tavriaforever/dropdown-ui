var webpack = require('webpack');

module.exports = {
    entry: {
        index: './pages/index.js'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    }
};
