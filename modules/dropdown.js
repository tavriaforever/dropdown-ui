var helpers = require('./helpers'),
    $ = helpers.$,
    setText = helpers.setText,
    events = require('./events'),
    classList = require('./classList'),
    text = require('./text');

function Dropdown (options) {
    var self = this;

    this.options = options || {};

    if (!this.options.id) {
        throw new Error('dropdown-ui: В опциях не указан id');
    }

    this.cls = {
        root: 'dropdown-ui',
        open: 'dropdown-ui_open',
        arrow: 'dropdown-ui__arrow',
        input: 'dropdown-ui__input',
        control: 'dropdown-ui__control',
        controlItem: 'dropdown-ui__control-item',
        tokens: 'dropdown-ui__tokens',
        token: 'dropdown-ui__token',
        tokenAdd: 'dropdown-ui__token-add',
        popup: 'dropdown-ui__popup',
        list: 'dropdown-ui__list',
        item: 'dropdown-ui__item',
        itemName: 'dropdown-ui__item-name',
        itemDomain: 'dropdown-ui__item-domain'
    };

    // 1. Получаем html элемент дропдауна
    getDropdownElem();

    // 2. Строим шаблон
    buildTemplate();

    // 3. Слушаем события
    listenEvents();

    function getDropdownElem () {
        var id = self.options.id;

        self.selector = '[data-dropdown-id=' + self.options.id + ']';
        self.$dropdown = $(self.selector);

        if (!self.$dropdown.length) {
            throw new Error('dropdown-ui: Добавьте html разметку c id: ' + id);
        } else {
            self.$dropdown = self.$dropdown[0];
        }
    }

    function buildTemplate () {
        var fragment = document.createDocumentFragment(),
            options = self.options,
            cls = self.cls;

        self.$control = createElem('div', [cls.control, 'clearfix']);
        self.$arrow = createElem('i', cls.arrow);
        self.$input = createElem('input', [cls.input, cls.controlItem]);
        self.$tokens = createElem('div', [cls.tokens, cls.controlItem]);
        self.$popup = createElem('div', cls.popup);
        self.$list = createElem('div', cls.list);

        // Настраиваем input
        self.$input.setAttribute('type', 'text');
        self.$input.setAttribute('placeholder', 'Введите имя друга или email');

        // Если выбрана опции 'мультивыбора' генерируем кнопку добавления
        if (options.multiSelect) {
            self.$tokenAdd = createElem('div', [cls.tokenAdd, 'token', 'token_theme_light']);
            self.$tokenAdd.textContent = 'Добавить';
            self.$tokens.appendChild(self.$tokenAdd);
        }

        // Заполняем __control
        self.$control.appendChild(self.$tokens);
        self.$control.appendChild(self.$arrow);
        self.$control.appendChild(self.$input);

        // Заполняем __popup
        self.$popup.appendChild(self.$list);

        // Заполняем список
        fillList();

        fragment.appendChild(self.$control);
        fragment.appendChild(self.$popup);

        // Вставляем содержимое dropdown
        self.$dropdown.appendChild(fragment);
    }

    function fillList (items) {
        var cls = self.cls,
            fragment = document.createDocumentFragment();

        items = items || self.options.items;

        // Генерируем список
        items.forEach(function (item) {
            var $item = createElem('div', cls.item),
                $name = createElem('div', cls.itemName),
                $domain = createElem('div', cls.itemDomain);

            // Вставляем текст для составных частей
            setText($name, item.name);
            setText($domain, item.domain);

            // Вставляем составные части в элемент
            $item.appendChild($name);
            $item.appendChild($domain);

            fragment.appendChild($item);
        });

        // Очищаем список и Вставляем элементы
        self.$list.innerHTML = '';
        self.$list.appendChild(fragment);
    }

    function createElem (tag, cls) {
        var elem = document.createElement(tag);

        if (Array.isArray(cls)) {
            cls.forEach(function (classItem) {
                classList.add(elem, classItem)
            });
        } else {
            classList.add(elem, cls);
        }

        return elem;
    }

    function listenEvents () {
        // Focus в инпуте – открываем дропдаун
        events.addEvent(self.$input, 'focus', open);

        // Закрываем dropdown по клику вне блока
        events.addEvent(document, 'click', function (e) {
            var target = e.target || e.srcElement,
                $dropdown = self.$dropdown,
                cls = self.cls;

            if (classList.has($dropdown, cls.open)) {
                if (classList.has(target, cls.root) || !$dropdown.contains(target)) {
                    classList.remove($dropdown, cls.open);
                }
            }
        });

        // Клик по стрелке – тоглим дропдаун
        events.addEvent(self.$arrow, 'click', toggle);
    }

    /**
     * Обработчик открытия дропдауна
     * @param e {Object}
     */
    function open (e) {
        classList.add(self.$dropdown, self.cls.open);

        // Вызываем callback при открытии
        options.onOpen && options.onOpen();

        // Подписываем на ввод данных в инпут
        events.addEvent(self.$input, 'keyup', onKeyUp);
    }

    /**
     * Обработчик закрытия дропдауна
     * @param e {Object}
     */
    function close (e) {
        classList.remove(self.$dropdown, self.cls.open);

        // Вызываем callback при закрытии
        options.onClose && options.onClose();

        // Отписываемся от ввода данных в инпут
        events.removeEvent(self.$input, 'keyup', onKeyUp);
    }

    /**
     * Обработчик 'тоглера' открытия/закрытия дропдаура
     * @param e {Object}
     */
    function toggle (e) {
        classList.has(self.$dropdown, self.cls.open) ? close(e) : open(e);
    }

    /**
     * Обработчик ввода данных в инпут
     * @param e
     */
    function onKeyUp (e) {
        var target = e.target || e.srcElement,
            value = target.value,
            items = self.options.items,
            newItems = [];

        // 1. Фильтруем в обычном порядке,
        // предпологая, что пользователь ввел текст правильно рого
        newItems = filter(items, value);

        // 2. Если не нашли – фильтруем на случай ввода транслита rogo
        if (!newItems.length) {
            newItems = filter(items, text.translit('en', 'ru', value));
        }

        // 3. Фильтруем на случай ввода hjuj (рого)
        if (!newItems.length) {
            newItems = filter(items, text.replace('en', 'ru', value));
        }

        // 4. Фильтруем на случай ввода кщпщ (rogo)
        if (!newItems.length) {
            // кщпщ -> rogo
            var newValue = text.replace('ru', 'en', value);
            // rogo -> рого
            newValue = text.translit('en', 'ru', newValue);
            newItems = filter(items, newValue);
        }

        function filter (items, searchValue) {
            return items.filter(function (item) {
                var name = item.name;

                name = name.toLowerCase();
                searchValue = searchValue.toLowerCase();

                return name.indexOf(searchValue) !== -1;
            })
        }

        fillList(newItems);
    }
}

module.exports = Dropdown;

