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
    app = express(),
    smartFilter = require('../src/modules/smartFilter'),

    data = [
        { domain: 'rogozov', id: 1, title: 'Андрей Рогозов', addition: 'rogozov', image: 'images/rogozov.jpg' },
        { domain: 'tavriaforever', id: 2, title: 'Николай Ильченко', addition: 'tavriaforever', image: 'images/tavriaforever.jpg' },
        { domain: 'nezemnaya', id: 3, title: 'Татьяна Неземная', addition: 'ЕУФИМБ (КФ) \'14', image: 'images/nezemnaya.jpg' },
        { domain: 'zila', id: 4, title: 'Сергей Жиленков', addition: 'zila', image: 'images/zila.jpg' },
        { domain: 'baklan', id: 5, title: 'Борис Сапак', addition: 'ЮФ НУБиП Украины "КАТУ" (бывш. ЮФ НАУ)', image: 'images/baklan.jpg' },
        { domain: 'dasha', id: 6, title: 'Дарья Обер', addition: 'dasha', image: 'images/dasha.jpg' },
        { domain: 'kibalych', id: 7, title: 'Антон Кибало', addition: 'kibalych', image: 'images/kibalych.jpg' },
        { domain: 'malaya', id: 8, title: 'Анастасия Жиленкова', addition: 'malaya', image: 'images/malaya.jpg' },
        { domain: 'ollala', id: 9, title: 'Ольга Зайцева', addition: 'ollala', image: 'images/olya.jpg' },
        { domain: 'slavutich', id: 10, title: 'Вячеслав Сапак', addition: 'slavutich', image: 'images/slavon.jpg' },
        { domain: 'monkey', id: 11, title: 'Яна Набиулина', addition: 'monkey', image: 'images/yana.jpg' },
        { domain: 'zibchik', id: 12, title: 'Константин Зибен', addition: 'НУК им. Макарова (бывш. УГМТУ) (ХФ) \'16', image: 'images/zib.jpg' }
    ];

var compiler = webpack(webpackConfig);

app.set('port', (process.env.PORT || 3001));
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
    var body = req.body,
        field = body.field,
        value = body.value,
        items = smartFilter.get(data, value, field);

    return res.json({ items: items });
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start app
app.listen(app.get('port'), function () {
    console.log('Dropdown example running, visit http://localhost:' + app.get('port'));
});
