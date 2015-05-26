var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    webpackConfig = require('../webpack.config.js'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    serveFavicon = require('serve-favicon'),
    express = require('express'),
    app = express();

var compiler = webpack(webpackConfig);

app.use(serveStatic(path.join(process.cwd(), 'example')));
app.use(serveFavicon(__dirname + '/favicon.ico'));
app.use(webpackDevMiddleware(compiler, {
    publicPath: 'http://localhost:3000/bundle/',
    stats: {
        colors: true
    }
}));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.send(fs.readFileSync('./example/index.html'));
});

app.post('/api/users', function (req, res) {
    console.log('req.body', req.body);
    return res.json({ result: 'hello from server'}).end();
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start app
app.listen('3001', function () {
    console.log('Dropdown example running, visit http://localhost:3001');
});
