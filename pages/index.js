// Вставляем css для корневого блока page
require('../styles/page.styl');

var events = require('../modules/events'),
    polyfills = require('../modules/polyfills');

// Код начнет выполняться после загрузки DOM
events.ready(function () {
    var Dropdown = require('../modules/dropdown.js');

    var dropdown = new Dropdown({
        id: 'first',
        userAvatar: true,
        multiSelect: true,
        items: [
            { name: 'Андрей Рогозов', domain: 'rogozov' },
            { name: 'Николай Ильченко', domain: 'tavriaforever' },
            { name: 'Татьяна Неземная', domain: 'nezemnaya' },
            { name: 'Сергей Жиленков', domain: 'zila' },
            { name: 'Борис Сапак', domain: 'baklan' }
        ]
    });
});
