// Вставляем css для страницы
require('./example.styl');
require('../src/modules/polyfills');

// Модуля для кроссбраузерной работы событий
var events = require('../src/modules/events'),
    Ajax = require('../src/modules/ajax'),
    sendAjaxRequest = new Ajax(),
    data = [
        { id: 1, title: 'Андрей Рогозов', addition: 'rogozov', image: 'images/rogozov.jpg' },
        { id: 2, title: 'Николай Ильченко', addition: 'tavriaforever', image: 'images/tavriaforever.jpg' },
        { id: 3, title: 'Татьяна Неземная', addition: 'ЕУФИМБ (КФ) \'14', image: 'images/nezemnaya.jpg' },
        { id: 4, title: 'Сергей Жиленков', addition: 'zila', image: 'images/zila.jpg' },
        { id: 5, title: 'Борис Сапак', addition: 'ЮФ НУБиП Украины "КАТУ" (бывш. ЮФ НАУ)', image: 'images/baklan.jpg' },
        { id: 6, title: 'Дарья Обер', addition: 'dasha', image: 'images/dasha.jpg' },
        { id: 7, title: 'Антон Кибало', addition: 'kibalych', image: 'images/kibalych.jpg' },
        { id: 8, title: 'Анастасия Жиленкова', addition: 'malaya', image: 'images/malaya.jpg' },
        { id: 9, title: 'Ольга Зайцева', addition: 'olya', image: 'images/olya.jpg' },
        { id: 10, title: 'Вячеслав Сапак', addition: 'slavon', image: 'images/slavon.jpg' },
        { id: 11, title: 'Яна Набиулина', addition: 'yana', image: 'images/yana.jpg' },
        { id: 12, title: 'Константин Зибен', addition: 'НУК им. Макарова (бывш. УГМТУ) (ХФ) \'16', image: 'images/zib.jpg' }
    ];

// Код начнет выполняться после загрузки DOM
events.domReady(function () {
    var Dropdown = require('../src/modules/dropdown.js');

    var dropdown = new Dropdown({
        id: 'first',
        showImage: true,
        multiSelect: false,
        onOpen: function () {
            // обработчик на открытие дропдауна
        },
        onClose: function () {
            // обработчик на закрытие дропдауна
        },
        onSelect: function (item) {
            // обработчик на выбор элемента
        },
        items: data
    });

    var dropdown2 = new Dropdown({
        id: 'second',
        showImage: true,
        multiSelect: true,
        inputName: 'user-value-name',
        inputId: 'user-value-id',
        onOpen: function () {
            // обработчик на открытие дропдауна
        },
        onClose: function () {
            // обработчик на закрытие дропдауна
        },
        onSelect: function (item) {
            // обработчик на выбор элемента
        },
        items: data
    });

    var dropdown3 = new Dropdown({
        id: 'third',
        multiSelect: true,
        inputName: 'user-value-name',
        inputId: 'user-value-id',
        onOpen: function () {
            // обработчик на открытие дропдауна
        },
        onClose: function () {
            // обработчик на закрытие дропдауна
        },
        onSelect: function (item) {
            // обработчик на выбор элемента
        },
        items: data
    });

    sendAjaxRequest({
        method: 'POST',
        url: '/api/users',
        type: 'json',
        data: { text: 'Mega text' }
    }, function (err, result) {
        if (err) {
            return console.log('err', err);
        }

        console.log('result', result);
    });
});
