// Вставляем css для страницы
require('../styles/page.styl');

var events = require('../modules/events'),
    polyfills = require('../modules/polyfills');

// Код начнет выполняться после загрузки DOM
events.ready(function () {
    var Dropdown = require('../modules/dropdown.js');

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
        items: [
            { id: 1, title: 'Андрей Рогозов', addition: 'rogozov', image: 'images/temp/rogozov.jpg' },
            { id: 2, title: 'Николай Ильченко', addition: 'tavriaforever', image: 'images/temp/tavriaforever.jpg' },
            { id: 3, title: 'Татьяна Неземная', addition: 'ЕУФИМБ (КФ) \'14', image: 'images/temp/nezemnaya.jpg' },
            { id: 4, title: 'Сергей Жиленков', addition: 'zila', image: 'images/temp/zila.jpg' },
            { id: 5, title: 'Борис Сапак', addition: 'ЮФ НУБиП Украины "КАТУ" (бывш. ЮФ НАУ)', image: 'images/temp/baklan.jpg' },
            { id: 6, title: 'Дарья Обер', addition: 'dasha', image: 'images/temp/dasha.jpg' },
            { id: 7, title: 'Антон Кибало', addition: 'kibalych', image: 'images/temp/kibalych.jpg' },
            { id: 8, title: 'Анастасия Жиленкова', addition: 'malaya', image: 'images/temp/malaya.jpg' },
            { id: 9, title: 'Ольга Зайцева', addition: 'olya', image: 'images/temp/olya.jpg' },
            { id: 10, title: 'Вячеслав Сапак', addition: 'slavon', image: 'images/temp/slavon.jpg' },
            { id: 11, title: 'Яна Набиулина', addition: 'yana', image: 'images/temp/yana.jpg' },
            { id: 12, title: 'Константин Зибен', addition: 'НУК им. Макарова (бывш. УГМТУ) (ХФ) \'16', image: 'images/temp/zib.jpg' }
        ]
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
        items: [
            { id: 1, title: 'Андрей Рогозов', addition: 'rogozov', image: 'images/temp/rogozov.jpg' },
            { id: 2, title: 'Николай Ильченко', addition: 'tavriaforever', image: 'images/temp/tavriaforever.jpg' },
            { id: 3, title: 'Татьяна Неземная', addition: 'ЕУФИМБ (КФ) \'14', image: 'images/temp/nezemnaya.jpg' },
            { id: 4, title: 'Сергей Жиленков', addition: 'zila', image: 'images/temp/zila.jpg' },
            { id: 5, title: 'Борис Сапак', addition: 'ЮФ НУБиП Украины "КАТУ" (бывш. ЮФ НАУ)', image: 'images/temp/baklan.jpg' },
            { id: 6, title: 'Дарья Обер', addition: 'dasha', image: 'images/temp/dasha.jpg' },
            { id: 7, title: 'Антон Кибало', addition: 'kibalych', image: 'images/temp/kibalych.jpg' },
            { id: 8, title: 'Анастасия Жиленкова', addition: 'malaya', image: 'images/temp/malaya.jpg' },
            { id: 9, title: 'Ольга Зайцева', addition: 'olya', image: 'images/temp/olya.jpg' },
            { id: 10, title: 'Вячеслав Сапак', addition: 'slavon', image: 'images/temp/slavon.jpg' },
            { id: 11, title: 'Яна Набиулина', addition: 'yana', image: 'images/temp/yana.jpg' },
            { id: 12, title: 'Константин Зибен', addition: 'НУК им. Макарова (бывш. УГМТУ) (ХФ) \'16', image: 'images/temp/zib.jpg' }
        ]
    });
});
