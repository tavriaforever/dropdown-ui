// Вставляем css для страницы
require('../styles/page.styl');

var events = require('../modules/events'),
    polyfills = require('../modules/polyfills');

// Код начнет выполняться после загрузки DOM
events.ready(function () {
    var Dropdown = require('../modules/dropdown.js');

    var dropdown = new Dropdown({
        id: 'first',
        userAvatar: true,
        //multiSelect: true,
        items: [
            { id: 1, title: 'Андрей Рогозов', info: 'rogozov' },
            { id: 2, title: 'Николай Ильченко', info: 'tavriaforever' },
            { id: 3, title: 'Татьяна Неземная', info: 'nezemnaya' },
            { id: 4, title: 'Сергей Жиленков', info: 'zila' },
            { id: 5, title: 'Борис Сапак', info: 'baklan' }
        ]
    });
});
