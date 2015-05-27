// Вставляем css для страницы примера
require('./example.styl');
// Набор полифилов для старых браузеров
require('../src/modules/polyfills');

var Dropdown = require('../src/modules/dropdown.js'),
    events = require('../src/modules/events'),
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

    // Инициализируем новый дропдаун для выбора только одного пункта и поиск данных на сервере
    var dropdown = new Dropdown({
        id: 'first',
        showImage: true,
        multiSelect: false,
        tabIndex: '1',
        placeholder: 'Введите имя одного друга или его домен',
        server: {
            method: 'POST',
            url: '/api/users',
            type: 'json',
            data: { field: { name: 'domain', lang: 'en' } }
        },
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

    // Инициализируем новый дропдаун для мультивыбора пунктов списка
    var dropdown2 = new Dropdown({
        id: 'second',
        showImage: true,
        multiSelect: true,
        tabIndex: '2',
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

    // Инициализируем новый дропдаун со списком пунктов без изображений
    var dropdown3 = new Dropdown({
        id: 'third',
        multiSelect: true,
        tabIndex: '3',
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
});
