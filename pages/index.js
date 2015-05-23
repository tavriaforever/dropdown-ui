// Вставляем css для корневого блока page
require('../styles/page.styl');

// Код начнет выполняться после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    var Dropdown = require('../modules/dropdown.js');

    var dropdown = new Dropdown({
        id: '1',
        userAvatar: true,
        multiSelect: true
    });
});
