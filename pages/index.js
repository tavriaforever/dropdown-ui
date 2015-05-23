// Вставляем css для корневого блока page
require('../css/page.css');

// Код начнет выполняться после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementsByClassName('dropdown-ui__input')[0].addEventListener('focus', function() {
        console.log('focus');
    });
});
