var helpers = require('./helpers'),
    events = require('./events'),
    classList = require('./classList');

function Dropdown (options) {
    var $ = helpers.$,
        selector = '[data-dropdown-id=' + options.id + ']',
        cls = {
            root: 'dropdown-ui',
            open: 'dropdown-ui_open'
        },
        $dropdown = $(selector)[0],
        $input = $(selector + ' .dropdown-ui__input')[0],
        $control = $(selector + ' .dropdown-ui__control')[0],
        $openArrow = $(selector + ' .dropdown-ui__open')[0],
        $popup = $(selector + ' .dropdown-ui__popup')[0];


    // Закрываем dropdown по клику вне блока
    events.addEvent(document, 'click', function (e) {
        var target = e.target || e.srcElement;

        if (classList.has($dropdown, cls.open)) {
            if (classList.has(target, cls.root) || !$dropdown.contains(target)) {
                classList.remove($dropdown, cls.open);
            }
        }
    });

    // Клик по стрелке – тоглим дропдаун
    events.addEvent($openArrow, 'click', toggle);

    // Focus в инпуте – открываем дропдаун
    events.addEvent($input, 'focus', open);

    /**
     * Обработчик открытия дропдауна
     * @param e {Object}
     */
    function open (e) {
        classList.add($dropdown, cls.open);

        // Вызываем callback при открытии
        options.onOpen && options.onOpen();

        // Подписываем на ввод данных в инпут
        events.addEvent($input, 'keyup', onKeyUp);
    }

    /**
     * Обработчик закрытия дропдауна
     * @param e {Object}
     */
    function close (e) {
        classList.remove($dropdown, cls.open);

        // Вызываем callback при закрытии
        options.onClose && options.onClose();

        // Отписываемся от ввода данных в инпут
        events.removeEvent($input, 'keyup', onKeyUp);
    }

    /**
     * Обработчик 'тоглера' открытия/закрытия дропдаура
     * @param e {Object}
     */
    function toggle (e) {
        classList.has($dropdown, cls.open) ? close(e) : open(e);
    }

    /**
     * Обработчик ввода данных в инпут
     * @param e
     */
    function onKeyUp (e) {
        var target = e.target || e.srcElement,
            value = target.value;
    }
}

module.exports = Dropdown;



